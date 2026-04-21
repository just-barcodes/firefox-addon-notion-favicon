/**
 * @jest-environment jsdom
 */

"use strict";

// ─── DOM setup ───────────────────────────────────────────────────────────────
// Replicate the structure of src/options.html so the module can find its nodes.
document.body.innerHTML = `
    <form>
        <label for="faviconUrl">Custom favicon URL</label>
        <input type="url" id="faviconUrl" placeholder="https://notion.so/images/favicon.ico"/>
        <button type="submit">Save</button>
    </form>
    <p id="status"></p>
`;

// ─── browser API mock ────────────────────────────────────────────────────────
const mockStorageData = {};

global.browser = {
    storage: {
        sync: {
            get: jest.fn((defaults) => {
                const merged = Object.assign({}, defaults, mockStorageData);
                return Promise.resolve(merged);
            }),
            set: jest.fn((data) => {
                Object.assign(mockStorageData, data);
                return Promise.resolve();
            }),
        },
    },
};

const { saveOptions, restoreOptions, DEFAULT_FAVICON_URL } = require("../src/options");

// ─── helpers ─────────────────────────────────────────────────────────────────

function faviconInput() {
    return document.querySelector("#faviconUrl");
}

function statusEl() {
    return document.querySelector("#status");
}

function submitEvent() {
    return { preventDefault: jest.fn() };
}

beforeEach(() => {
    jest.clearAllMocks();
    delete mockStorageData.faviconUrl;
    faviconInput().value = "";
    statusEl().textContent = "";
});

// ─── DEFAULT_FAVICON_URL ─────────────────────────────────────────────────────

describe("DEFAULT_FAVICON_URL", () => {
    test("is the canonical Notion favicon URL", () => {
        expect(DEFAULT_FAVICON_URL).toBe("https://notion.so/images/favicon.ico");
    });
});

// ─── restoreOptions ──────────────────────────────────────────────────────────

describe("restoreOptions", () => {
    test("populates the input with the stored favicon URL", async () => {
        mockStorageData.faviconUrl = "https://custom.example.com/favicon.ico";

        await restoreOptions();

        expect(faviconInput().value).toBe("https://custom.example.com/favicon.ico");
    });

    test("populates the input with DEFAULT_FAVICON_URL when nothing is stored", async () => {
        await restoreOptions();

        expect(faviconInput().value).toBe(DEFAULT_FAVICON_URL);
    });

    test("calls browser.storage.sync.get with the correct default", async () => {
        await restoreOptions();

        expect(browser.storage.sync.get).toHaveBeenCalledWith({
            faviconUrl: DEFAULT_FAVICON_URL,
        });
    });
});

// ─── saveOptions ─────────────────────────────────────────────────────────────

describe("saveOptions", () => {
    test("saves a valid URL to browser storage", async () => {
        const url = "https://custom.example.com/favicon.ico";
        faviconInput().value = url;

        await saveOptions(submitEvent());

        expect(browser.storage.sync.set).toHaveBeenCalledWith({ faviconUrl: url });
    });

    test("prevents the default form submission", async () => {
        faviconInput().value = DEFAULT_FAVICON_URL;
        const event = submitEvent();

        await saveOptions(event);

        expect(event.preventDefault).toHaveBeenCalled();
    });

    test("shows 'Options saved.' status message after a successful save", async () => {
        faviconInput().value = DEFAULT_FAVICON_URL;

        await saveOptions(submitEvent());

        expect(statusEl().textContent).toBe("Options saved.");
    });

    test("falls back to DEFAULT_FAVICON_URL when the input is empty", async () => {
        faviconInput().value = "";

        await saveOptions(submitEvent());

        expect(browser.storage.sync.set).toHaveBeenCalledWith({
            faviconUrl: DEFAULT_FAVICON_URL,
        });
    });

    test("shows an error and does NOT save for an invalid URL", async () => {
        faviconInput().value = "not-a-valid-url";

        await saveOptions(submitEvent());

        expect(browser.storage.sync.set).not.toHaveBeenCalled();
        expect(statusEl().textContent).toBe(
            "Invalid URL – please enter a valid https:// address."
        );
    });

    test("normalises a URL before saving (new URL().href)", async () => {
        // new URL() normalises e.g. trailing slashes, scheme casing, etc.
        faviconInput().value = "HTTPS://EXAMPLE.COM/favicon.ico";

        await saveOptions(submitEvent());

        expect(browser.storage.sync.set).toHaveBeenCalledWith({
            faviconUrl: "https://example.com/favicon.ico",
        });
    });
});
