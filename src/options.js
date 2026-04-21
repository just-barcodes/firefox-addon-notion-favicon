const DEFAULT_FAVICON_URL = "https://notion.so/images/favicon.ico";

function saveOptions(e) {
    e.preventDefault();
    const rawUrl = document.querySelector("#faviconUrl").value || DEFAULT_FAVICON_URL;
    let faviconUrl;
    try {
        faviconUrl = new URL(rawUrl).href;
    } catch (_) {
        const status = document.querySelector("#status");
        status.textContent = "Invalid URL – please enter a valid https:// address.";
        setTimeout(() => { status.textContent = ""; }, 3000);
        return;
    }
    browser.storage.sync.set({ faviconUrl }).then(() => {
        const status = document.querySelector("#status");
        status.textContent = "Options saved.";
        setTimeout(() => { status.textContent = ""; }, 2000);
    }).catch((error) => {
        console.error(`Error saving options: ${error}`);
    });
}

function restoreOptions() {
    browser.storage.sync.get({ faviconUrl: DEFAULT_FAVICON_URL }).then((result) => {
        document.querySelector("#faviconUrl").value = result.faviconUrl;
    }).catch((error) => {
        console.error(`Error loading options: ${error}`);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    restoreOptions();
    document.querySelector("form").addEventListener("submit", saveOptions);
});

if (typeof module !== "undefined") {
    module.exports = { saveOptions, restoreOptions, DEFAULT_FAVICON_URL };
}
