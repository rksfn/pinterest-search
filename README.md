# Pinterest Search Shortcut

Press **/** on Pinterest to focus the search bar. The shortcut leaves typing fields and modified shortcuts alone.

## Install in Chrome

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Refresh any Pinterest tabs already open.

Works on `pinterest.com` and its subdomains. No build step, dependencies, or additional permissions.

## Test

Run `node --test`.

If Pinterest changes its search markup, the selectors in `content.js` may need updating.
