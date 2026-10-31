import fs from "fs";
import path from "path";

// jsdom does not apply stylesheets, so verify the colour behind each data-state straight from the CSS.
const readCss = (file: string) => fs.readFileSync(path.join(__dirname, file), "utf8").replace(/\r\n/g, "\n");
const appCss = readCss("App.css");
const indexCss = readCss("index.css");

function declarations(css: string, selector: string): Record<string, string> {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = css.match(new RegExp(`(?:^|\\})\\s*${escaped}\\s*\\{([^}]*)\\}`, "m"));
    if (!match) {
        throw new Error(`No CSS rule for ${selector}`);
    }
    return Object.fromEntries(match[1].split(";")
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => [line.slice(0, line.indexOf(":")).trim(), line.slice(line.indexOf(":") + 1).trim()]));
}

const stateRule = (state: string) => declarations(appCss, `.answer__button[data-state="${state}"]`);

test("unanswered answers use the app's green gradient", () => {
    const shared = declarations(appCss, ".menu-button,\n.nav-button,\n.answer__button");
    expect(shared.background).toBe("var(--green)");
    expect(declarations(indexCss, ":root")["--green"]).toBe("linear-gradient(to right, #94c02b, #71912a)");
    expect(appCss).not.toMatch(/\[data-state="idle"\]/);
});

test("a picked answer is yellow", () => {
    expect(stateRule("picked").background).toBe("linear-gradient(to right, #ffff2b, #ffff2a)");
});

test("a correct answer is dark green with white text", () => {
    expect(stateRule("correct")).toEqual({
        background: "linear-gradient(to right, #085908, #28a628)",
        color: "#fff",
    });
});

test("a wrong answer is dark red with white text", () => {
    expect(stateRule("wrong")).toEqual({
        background: "linear-gradient(to right, #500000, #740000)",
        color: "#fff",
    });
});

test("a neutral (reviewed, not relevant) answer is grey", () => {
    expect(stateRule("neutral").background).toBe("linear-gradient(to right, #6e736e, #a1a6a1)");
});

test("the picked letter in the exam is underlined", () => {
    expect(declarations(appCss, ".answer__letter--marked")["text-decoration"]).toBe("underline");
});
