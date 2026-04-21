# Static Notion Favicon

When you set an icon for a page on [Notion](https://www.notion.so) it will
automatically update the favicon (i.e., the little icon in your browser tab) to
the icon for the page whenever you visit it.

This addon always displays the default Notion favicon instead of switching the
favicon to the icon of the currently activated page. You can also supply a
custom favicon URL via the addon's options page.

This addon is published here:
https://addons.mozilla.org/en-US/firefox/addon/static-notion-favicon/

## Development

The addon is a plain WebExtension with no build step required.

To load it temporarily in Firefox:

1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on…**
3. Select the `manifest.json` file in the repository root

## Testing

Unit tests cover `fix_favicon.js` and `options.js` using [Jest](https://jestjs.io/) with a jsdom environment.

```bash
npm install
npm test
```

## TODOs

- Create an icon for this addon.
