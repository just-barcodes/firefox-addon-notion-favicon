/**
 * @jest-environment jsdom
 */

"use strict";

const { makeFixFavicon, DEFAULT_FAVICON_URL } = require("../src/fix_favicon");

// ─── helpers ────────────────────────────────────────────────────────────────

function createLinkElement(rel, href) {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    document.head.appendChild(link);
    return link;
}

beforeEach(() => {
    // Remove any <link> elements added by a previous test
    document.head.querySelectorAll("link").forEach((el) => el.remove());
});

// ─── DEFAULT_FAVICON_URL ────────────────────────────────────────────────────

describe("DEFAULT_FAVICON_URL", () => {
    test("is the canonical Notion favicon URL", () => {
        expect(DEFAULT_FAVICON_URL).toBe("https://notion.so/images/favicon.ico");
    });
});

// ─── makeFixFavicon ─────────────────────────────────────────────────────────

describe("makeFixFavicon", () => {
    test("sets href when link[rel='shortcut icon'] has a different href", () => {
        const link = createLinkElement("shortcut icon", "https://example.com/other.ico");
        const fixFavicon = makeFixFavicon(DEFAULT_FAVICON_URL);

        fixFavicon();

        expect(link.href).toBe(DEFAULT_FAVICON_URL);
    });

    test("sets href when link[rel='icon'] has a different href", () => {
        const link = createLinkElement("icon", "https://example.com/other.ico");
        const fixFavicon = makeFixFavicon(DEFAULT_FAVICON_URL);

        fixFavicon();

        expect(link.href).toBe(DEFAULT_FAVICON_URL);
    });

    test("does not mutate href when it already matches the target URL", () => {
        const link = createLinkElement("shortcut icon", DEFAULT_FAVICON_URL);
        const setSpy = jest.spyOn(link, "href", "set");
        const fixFavicon = makeFixFavicon(DEFAULT_FAVICON_URL);

        fixFavicon();

        expect(setSpy).not.toHaveBeenCalled();
    });

    test("does nothing (no crash) when no favicon link element exists", () => {
        const fixFavicon = makeFixFavicon(DEFAULT_FAVICON_URL);
        expect(() => fixFavicon()).not.toThrow();
    });

    test("uses a custom favicon URL instead of the default", () => {
        const customUrl = "https://custom.example.com/favicon.ico";
        const link = createLinkElement("shortcut icon", DEFAULT_FAVICON_URL);
        const fixFavicon = makeFixFavicon(customUrl);

        fixFavicon();

        expect(link.href).toBe(customUrl);
    });

    test("returns a new function each call (factory pattern)", () => {
        const a = makeFixFavicon(DEFAULT_FAVICON_URL);
        const b = makeFixFavicon(DEFAULT_FAVICON_URL);
        expect(a).not.toBe(b);
    });
});
