/**
 * @jest-environment node
 */
import {deserialize, serialize} from "v8";

// Jest 27's node environment hides these Node globals, but fake-indexeddb (and db.ts's storage request) need them.
Object.assign(globalThis, {
    navigator: {},
    DOMException: (() => {
        try {
            atob("~");
        } catch (error) {
            return (error as Error).constructor;
        }
    })(),
    structuredClone: (value: unknown) => deserialize(serialize(value)),
});

const {IDBFactory} = require("fake-indexeddb");

// The browser build resolves this import to a hashed URL; under Node, point sql.js at the wasm file on disk.
jest.mock("sql.js/dist/sql-wasm-browser.wasm", () => require.resolve("sql.js/dist/sql-wasm.wasm"));

type Db = typeof import("./db");

// A fresh module instance behaves like a page reload: in-memory SQLite is gone, IndexedDB stays.
const reload = (): Db => {
    let db: Db | undefined;
    jest.isolateModules(() => {
        db = require("./db");
    });
    return db!;
};

beforeEach(() => {
    globalThis.indexedDB = new IDBFactory();
});

test("returns null when nothing was saved", async () => {
    expect(await reload().loadProgress("sankcje_karne", false)).toBeNull();
});

test("saves and loads progress", async () => {
    const db = reload();
    await db.saveProgress("sankcje_karne", false, {questionIds: [3, 1, 2], solvedIds: [3]});
    expect(await db.loadProgress("sankcje_karne", false)).toEqual({questionIds: [3, 1, 2], solvedIds: [3]});
});

test("overwrites progress for the same category and mode", async () => {
    const db = reload();
    await db.saveProgress("sankcje_karne", false, {questionIds: [1, 2], solvedIds: [1]});
    await db.saveProgress("sankcje_karne", false, {questionIds: [1, 2], solvedIds: [1, 2]});
    expect(await db.loadProgress("sankcje_karne", false)).toEqual({questionIds: [1, 2], solvedIds: [1, 2]});
});

test("keeps categories and random/ordered modes separate", async () => {
    const db = reload();
    await db.saveProgress("sankcje_karne", false, {questionIds: [1], solvedIds: [1]});
    await db.saveProgress("sankcje_karne", true, {questionIds: [2], solvedIds: [2]});
    await db.saveProgress("wszystkie", false, {questionIds: [3], solvedIds: []});

    expect(await db.loadProgress("sankcje_karne", false)).toEqual({questionIds: [1], solvedIds: [1]});
    expect(await db.loadProgress("sankcje_karne", true)).toEqual({questionIds: [2], solvedIds: [2]});
    expect(await db.loadProgress("wszystkie", false)).toEqual({questionIds: [3], solvedIds: []});
    expect(await db.loadProgress("wszystkie", true)).toBeNull();
});

test("clearing removes only the given category and mode", async () => {
    const db = reload();
    await db.saveProgress("sankcje_karne", false, {questionIds: [1], solvedIds: [1]});
    await db.saveProgress("sankcje_karne", true, {questionIds: [2], solvedIds: [2]});
    await db.clearProgress("sankcje_karne", false);

    expect(await db.loadProgress("sankcje_karne", false)).toBeNull();
    expect(await db.loadProgress("sankcje_karne", true)).toEqual({questionIds: [2], solvedIds: [2]});
});

test("progress survives a page reload", async () => {
    await reload().saveProgress("sankcje_karne", false, {questionIds: [5, 6, 7], solvedIds: [5, 6]});
    expect(await reload().loadProgress("sankcje_karne", false)).toEqual({questionIds: [5, 6, 7], solvedIds: [5, 6]});
});

test("clearing survives a page reload", async () => {
    await reload().saveProgress("sankcje_karne", false, {questionIds: [1], solvedIds: [1]});
    await reload().clearProgress("sankcje_karne", false);
    expect(await reload().loadProgress("sankcje_karne", false)).toBeNull();
});

test("rapid saves persist the last state", async () => {
    const db = reload();
    await Promise.all([1, 2, 3, 4, 5].map(count =>
        db.saveProgress("sankcje_karne", false, {questionIds: [1, 2, 3, 4, 5], solvedIds: [1, 2, 3, 4, 5].slice(0, count)})
    ));
    expect(await reload().loadProgress("sankcje_karne", false)).toEqual({questionIds: [1, 2, 3, 4, 5], solvedIds: [1, 2, 3, 4, 5]});
});

test("handles category names with quotes safely", async () => {
    const db = reload();
    await db.saveProgress("x'); DROP TABLE learn_progress; --", false, {questionIds: [1], solvedIds: [1]});
    await db.saveProgress("sankcje_karne", false, {questionIds: [2], solvedIds: [2]});
    expect(await db.loadProgress("x'); DROP TABLE learn_progress; --", false)).toEqual({questionIds: [1], solvedIds: [1]});
    expect(await db.loadProgress("sankcje_karne", false)).toEqual({questionIds: [2], solvedIds: [2]});
});
