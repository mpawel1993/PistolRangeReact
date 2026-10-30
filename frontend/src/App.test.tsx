import {fireEvent, render, screen} from "@testing-library/react";
import App from "./App";

beforeEach(() => {
    window.location.hash = "";
});

test("welcome screen leads to the main menu", () => {
    render(<App/>);
    fireEvent.click(screen.getByAltText("Pistol Range"));
    expect(screen.getByText("EGZAMIN")).toBeInTheDocument();
});

test("exam starts with the first of 20 questions", () => {
    render(<App/>);
    fireEvent.click(screen.getByAltText("Pistol Range"));
    fireEvent.click(screen.getByText("EGZAMIN"));
    expect(screen.getByText("1/20")).toBeInTheDocument();
    expect(screen.getByLabelText("Następne pytanie")).toBeDisabled();
});
