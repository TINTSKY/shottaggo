# Security

ShotTagGo DSH is a client plugin. It runs inside the Harness page with the same privileges as the rest of the client UI, and it reads pixels from the page or the Browser-panel webview in order to build a screenshot.

## What it does with data

- Screenshots are created locally and only leave the machine when you press **Insert into input** and later send the message to the model.
- The plugin does not make its own network requests. Fetch calls are limited to reading image resources for the local snapshot, and failures are skipped.
- Images that the browser cannot read (cross-origin without CORS, revoked blob URLs, tainted canvases) are omitted from the screenshot and counted in the caption.
- Nothing is persisted by the plugin itself; drafts live in the Harness composer and attachments follow the Harness attachment policy.

## Reporting a vulnerability

Open a private security advisory on the repository (Security → Advisories → New draft advisory). Please include the Harness version, the preview surface involved, and reproduction steps. Do not attach screenshots containing credentials or personal data.
