import "@testing-library/jest-dom";
import {TextDecoder, TextEncoder} from "util";

// react-router v7 relies on these, but CRA's jsdom environment does not provide them.
Object.assign(global, {TextEncoder, TextDecoder});
