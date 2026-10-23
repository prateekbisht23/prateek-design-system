Prateek's personal system: one narrow column, light type, hairlines instead of boxes, and a single marigold dot that says "this is me, right now". Everything here is meant to feel quiet and quick to scan. A visitor should find the name, what I do now, the work, and how to reach me within one screen.

## Principles

- **Say less, line up more.** Alignment and space do the separating. Use `line` hairlines between list rows; never cards, never shadows in the layout.
- **Thin gets bigger, not bolder.** Large text drops to weight 300 (`display`, `title`, `lede`). Nothing on the site is heavier than 500.
- **One accent, one place.** `marigold` appears once per screen at most: the status dot, or the cover. It is never a button fill, link colour or heading colour.
- **Navigation is plain text.** Three or four nav links, a back link, a list of outbound links. No menus, no hamburgers until the nav cannot fit on one line.
- **Machine facts are mono.** Years, local time, versions and commands use the `mono` family (`meta`, `code`); everything a person says uses `sans`.

## Voice

- First person, singular: "I build", "I'm working on". Never "we" on the personal site.
- Sentence case everywhere, including nav and buttons: "Say hello", "Copy email", "Selected work".
- Short declarative sentences. No exclamation marks, no emoji, no "passionate about".
- Lead with the concrete thing: "Routing email, SMS and push through one queue at Fyscal", not "Working on exciting backend challenges".
- Status lines start with `Now ·` and name one thing with a date when there is one: "Now · Shipping weighted routing, Nov 2026".

## Color

- Set the page on `paper`; body text in `ink`; labels, years and nav at rest in `ink-muted`. Both read at 4.5:1 or better on `paper` and `paper-raised` in both themes.
- Links are `link` (an alias of `ink`) with a 1px `line-strong` underline offset 3px; on hover the underline turns `ink`. Never colour a link marigold.
- `marigold` is a fill only. When a word must carry the accent, use `marigold-ink`. Selection uses `marigold-soft` behind `ink`.
- The solid button is `ink` with `on-ink` text. That is the only filled control.
- Dark mode is a first-class theme, not an inversion: `paper` is a warm near-black, `marigold` brightens, and `marigold-ink` becomes the same bright marigold because it reads at 10:1 there.

## Type

- Families: **Geist** (`sans`) for everything people read, **Geist Mono** (`mono`) for machine facts. Load both from Google Fonts at weights 300, 400 and 500:
  `https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400&display=swap`
- `display` (44/48, 300) for the name, once per page. `title` (24/32, 300) for note and case-study titles. `lede` (17/28, 300) for the one-line intro.
- `body` (15/24, 400) for paragraphs and list titles; `label` (13/20, 400) for section labels, nav and buttons; `small` (12/18) for fine print.
- `meta` (12/16 mono, tabular numerals) for years and times; `code` (13/20 mono) for commands.
- Headings use `text-wrap: balance`. Keep paragraphs inside the `column` width (about 64 characters of `body`).

## Layout and spacing

- One column, max `column` (560px), left-aligned with `page-top` (96px) above the name on desktop, 48px on phones. Side gutter is never less than `space-4`.
- Sections are separated by `space-16`. A section is a `label-col` (112px) label beside its content at 640px and wider, stacked on phones.
- The name block, status and lede sit together with `space-2` between; the intro paragraph follows after `space-8`; actions after `space-6`.
- List rows are 48px apart on desktop (`space-12` pitch): title left, mono year right, a `line` hairline under each.

## Interaction and motion

- Hovering a work row dims its siblings to `ink-muted` over `dur-base`; the hovered row stays `ink` and shows a `↗`. This is the system's one signature hover.
- Link and nav hovers are a colour change over `dur-fast`. Nothing moves, scales or slides.
- The status dot may pulse softly; it stops under `prefers-reduced-motion`, as does every other transition.
- Keyboard focus: `focus-ring` on buttons; a 1.5px `ink` outline offset 3px on links. Never remove focus styles.
- "Copy email" swaps its label to "Copied" for two seconds. It never claims an email was sent.

## Iconography

- No icon set. Use three typographic glyphs from the `sans` family: `↗` for outbound links, `→` for internal next steps, `·` as a separator.
- No emoji, no logos of employers or clients unless they are real files added to the assets.
- No personal logo yet: the name is set in `display` type. If a mark is added later, it goes in `assets/Logos` as a single-ink SVG.

## Components

All components live in `components/bundle.js` as `window.Prateek` and expect React 18 on the page, plus `components/bundle.css` loaded after the tokens. Class names are prefixed `pk-`.

- `Header`, `Status`, `LocalTime` for the top of a page.
- `TextLink`, `Button`, `CopyButton` for actions.
- `Section`, `WorkList`, `LinkList`, `Tag` for content.
- `Portfolio` is a showcase page composing all of them into a home page. Its copy is example content; replace it with your own.
