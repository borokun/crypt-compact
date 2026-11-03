# Crypt Compact

A daily bullet-hell boss fight inside a 90s pocket castle playset. Turn Dracula's bullets against him.

## Layout

- `public/` — the playable game (`index.html`, all art embedded). This is the folder Cloudflare Pages serves.
- `source/` — `src.html` (code with art placeholders), `art/` (WebP sprites and boards), `build.py` + `wrap.py`.
- `tools/` — headless balance tests (Node + Playwright): `sim.js`, `simd.js`, `skill2.js`.

## Rebuild after editing the source

    cd source
    python build.py   # embeds art into crypt-compact.html
    python wrap.py    # writes ../public/index.html

Commit and push; Cloudflare redeploys automatically.

## Cloudflare Pages settings

- Framework preset: None
- Build command: (leave empty)
- Build output directory: `public`
