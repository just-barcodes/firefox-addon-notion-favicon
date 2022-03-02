function fix_favicon() {
    document.querySelector("link[rel='shortcut icon']").href = "https://notion.so/images/favicon.ico";
}

let interval = browser.storage.sync.get("interval");
interval.then(function(result) {
    setInterval(fix_favicon, result.interval || 6000);
});
