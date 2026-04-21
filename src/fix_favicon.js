const DEFAULT_FAVICON_URL = "https://notion.so/images/favicon.ico";

function makeFixFavicon(faviconUrl) {
    return function fixFavicon() {
        const link = document.querySelector("link[rel='shortcut icon'], link[rel='icon']");
        if (link && link.href !== faviconUrl) {
            link.href = faviconUrl;
        }
    };
}

browser.storage.sync.get({ faviconUrl: DEFAULT_FAVICON_URL }).then((result) => {
    const fixFavicon = makeFixFavicon(result.faviconUrl || DEFAULT_FAVICON_URL);

    fixFavicon();

    const observer = new MutationObserver(fixFavicon);
    if (document.head) {
        observer.observe(document.head, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["href"],
        });
    }
});
