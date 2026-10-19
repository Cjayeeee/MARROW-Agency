# MARROW: Brand & Digital Studio (portfolio site)

A Vite project. GSAP, ScrollTrigger and Lenis are installed from npm. The fonts and artwork are self-hosted.

## Run it
```
npm install
npm run dev        # http://localhost:5173 (opens automatically)
npm run build      # production build → dist/
npm run preview    # serve the built dist/ on http://localhost:4173
```
`dist/` is a plain static folder, so you can drop it on Netlify, Vercel, GitHub Pages or any host. `base: './'` means it also works from a sub-folder.

## Structure
```
index.html             markup (Vite entry)
src/main.js            all motion and interaction, with the project data at the top
src/style.css          design tokens at the top (:root)
public/fonts/          Bricolage Grotesque, Literata (body), Story Script (accent), IBM Plex Mono (all OFL)
public/work/*.svg      original placeholder artwork, one file per project
vite.config.js         dev port 5173
```

## Make it yours
- **Email:** change `CONTACT_EMAIL` in `src/main.js` and the two `studio@marrow.example` links in `index.html`.
- **Projects:** edit the `PROJECTS` object in `src/main.js` (case sheets) and the matching cards and archive rows in `index.html`. Keep the `data-project` keys in sync.
- **Imagery:** replace the SVGs in `public/work/` with JPG or WebP files of the same aspect ratio (4:5 for posters, 16:10 for wide images), then update the paths.
- **Colours:** `--ink`, `--bone`, `--signal` in `src/style.css`. The case-study teal is `COLORS.teal` in `src/main.js`.
- **Phone, address, socials:** the menu and the footer in `index.html`.

## Motion map
| Moment | Trigger | Behaviour |
|---|---|---|
| Preloader | page load | Vertebrae stack as real loading progress (fonts and page load) climbs. The spine glides to its hero position, the screen splits along a seam, and the hero type rises. Repeat visits in the same session run about 3× faster. There is a 4.5 s failsafe in JS and a 9 s failsafe in CSS. |
| Hero spine | pointer / scroll | The column follows the cursor like a chain and bulges near it. On scroll the vertebrae decompress. |
| Statement | scroll (scrub) | Words light up as you read. |
| Thesis | pinned, +150% | A bone circle grows over "Most brands whisper." and turns the page light. |
| Selected work | pinned horizontal (≥900px) | The track moves sideways, images drift inside their frames, and a progress bar and counter update. On mobile this becomes a vertical stack with clip reveals. |
| Capabilities | click / hover | Accessible accordion. A poster preview follows the cursor. |
| Case study | scroll | The background shifts to the client's teal, the steps follow the images, and the stats count up. |
| Archive | hover | A signal-coloured row wipe and a cursor-follow preview. Each row opens a case sheet. |
| Contact | submit | The brief builder writes a pre-filled email. |

With `prefers-reduced-motion`, there is no smooth scroll, pinning, scrub or cursor. The intro becomes a short fade and all content stays visible.
