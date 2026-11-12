# Changelog

## 0.1.0

First public shape of **ShotTagGo DSH / 截图批注Go**.

- Full-viewport screenshots with numbered red boxes, one base image per viewport state.
- Comments inserted into the Harness composer as image drafts instead of being sent directly.
- Works on Browser-panel pages (`webview` + `capturePage`), Document Preview (Markdown, code, text, images, PDF, Office-as-PDF, spreadsheets) and the Harness UI.
- Host snapshots embed loaded images and canvases, skip unreadable media, and note skipped images in the caption.
- Floating entry for a fullscreen Browser panel; live Chinese/English UI switching.
- Per-insert numbering, composer focus after insert, and a 20-image guard for one message.
- Tests: unit suite, headless Edge integration harness, annotation capacity benchmark.
