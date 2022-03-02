function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        interval: document.querySelector("#interval").value
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        console.log(result)
        document.querySelector("#interval").value = result.interval || "6000";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let interval = browser.storage.sync.get("interval");
    interval.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
