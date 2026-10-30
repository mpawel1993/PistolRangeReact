import initSqlJs, {Database} from "sql.js";
import sqlWasmUrl from "sql.js/dist/sql-wasm-browser.wasm";

// sql.js keeps the database in memory; the serialized file is persisted in IndexedDB.
const IDB_NAME = "pistol-range";
const IDB_STORE = "sqlite";
const IDB_KEY = "main.db";

const SCHEMA = `
    CREATE TABLE IF NOT EXISTS learn_progress (
        category     TEXT    NOT NULL,
        random       INTEGER NOT NULL,
        question_ids TEXT    NOT NULL,
        solved_ids   TEXT    NOT NULL,
        PRIMARY KEY (category, random)
    );
`;

export interface LearnProgress {
    questionIds: number[];
    solvedIds: number[];
}

function idb<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        const open = indexedDB.open(IDB_NAME, 1);
        open.onupgradeneeded = () => open.result.createObjectStore(IDB_STORE);
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
            const connection = open.result;
            const transaction = connection.transaction(IDB_STORE, mode);
            const request = run(transaction.objectStore(IDB_STORE));
            transaction.oncomplete = () => {
                connection.close();
                resolve(request.result);
            };
            transaction.onerror = () => {
                connection.close();
                reject(transaction.error);
            };
        };
    });
}

let dbPromise: Promise<Database> | undefined;
let writeQueue = Promise.resolve();

function getDb(): Promise<Database> {
    dbPromise ??= (async () => {
        const [SQL, saved] = await Promise.all([
            initSqlJs({locateFile: () => sqlWasmUrl}),
            idb<Uint8Array | undefined>("readonly", store => store.get(IDB_KEY)),
        ]);
        const db = saved ? new SQL.Database(saved) : new SQL.Database();
        db.run(SCHEMA);
        return db;
    })();
    return dbPromise;
}

function persist(db: Database): Promise<void> {
    const data = db.export();
    writeQueue = writeQueue
        .then(() => idb("readwrite", store => store.put(data, IDB_KEY)))
        .then(() => undefined);
    return writeQueue;
}

export async function loadProgress(category: string, random: boolean): Promise<LearnProgress | null> {
    const db = await getDb();
    const result = db.exec(
        "SELECT question_ids, solved_ids FROM learn_progress WHERE category = ? AND random = ?",
        [category, Number(random)]
    );
    const row = result[0]?.values[0];
    if (!row) {
        return null;
    }
    return {questionIds: JSON.parse(row[0] as string), solvedIds: JSON.parse(row[1] as string)};
}

export async function saveProgress(category: string, random: boolean, progress: LearnProgress): Promise<void> {
    const db = await getDb();
    db.run(
        `INSERT INTO learn_progress (category, random, question_ids, solved_ids) VALUES (?, ?, ?, ?)
         ON CONFLICT (category, random) DO UPDATE SET question_ids = excluded.question_ids, solved_ids = excluded.solved_ids`,
        [category, Number(random), JSON.stringify(progress.questionIds), JSON.stringify(progress.solvedIds)]
    );
    await persist(db);
}

export async function clearProgress(category: string, random: boolean): Promise<void> {
    const db = await getDb();
    db.run("DELETE FROM learn_progress WHERE category = ? AND random = ?", [category, Number(random)]);
    await persist(db);
}
