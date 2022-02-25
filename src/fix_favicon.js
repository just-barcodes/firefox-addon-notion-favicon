function fix_favicon(){
    document.querySelector("link[rel='shortcut icon']").href = "https://notion.so/images/favicon.ico";
}

setInterval(fix_favicon, 3000);
