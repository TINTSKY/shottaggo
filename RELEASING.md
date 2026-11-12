# Releasing ShotTagGo DSH

## Before the first release

1. Create the Git repository (suggested name: `shottaggo`) and push this tree.
2. Fill the placeholders in `package.json`:
   - `repository`: `git+https://github.com/TINTSKY/shottaggo.git`
   - `homepage`: `https://github.com/TINTSKY/shottaggo#readme`
   - `bugs`: `https://github.com/TINTSKY/shottaggo/issues`
3. Confirm the npm name `dsh-shottaggo` is still free (`npm view dsh-shottaggo`), and that you are logged in to the right npm account.
4. Complete the clearance items that the initial search could not cover:
   - trademark search in class 9 (software) and class 42 (SaaS) for "ShotTagGo";
   - GitHub namespace / repository name;
   - App Store and Google Play exact-name search;
   - `whois` for `shottaggo.com` / `.dev` / `.io` / `.app`.
5. Note: "ShotTag" alone is used by InfoSight for industrial metal tags. Keep the full product name **ShotTagGo DSH** in listings to stay clear of it.

## Release checklist

```sh
npm ci
npm run check          # build + unit tests + syntax
npm run test:harness   # headless Edge integration test (optional locally)
npm run test:bench     # optional capacity sweep
npm pack --dry-run     # inspect the tarball contents

npm version patch      # or minor / major
npm publish            # prepublishOnly runs npm run check
git push --follow-tags
```

Then create a GitHub release from the tag and paste the matching `CHANGELOG.md` section.

## Verify the published package

In a clean profile:

```sh
dsh plugin --profile desktop add dsh-shottaggo
```

For local development the equivalent is:

```sh
dsh plugin --profile desktop add "link:C:\path\to\shottaggo"
```

After a registry install the profile records `dsh-shottaggo` in `package.json`, and Plugin Manager can update it from npm like any other bundle.

## Versioning

- Patch: bug fixes, copy changes, dependency updates.
- Minor: new capture surfaces, new UI, backward-compatible behavior.
- Major: breaking changes to the plugin id, bundle patch, or public README promises.

The committed `client.js` must always match `src/`; CI rebuilds and fails on a stale bundle.
