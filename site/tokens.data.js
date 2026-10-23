/* generated from tokens/tokens.json by scripts/build.mjs */
window.PK_TOKENS = {
  "name": "Prateek",
  "version": 1,
  "color": {
    "themes": [
      {
        "id": "light",
        "name": "Light"
      },
      {
        "id": "dark",
        "name": "Dark"
      }
    ],
    "tokens": [
      {
        "name": "paper",
        "value": {
          "light": "#fafaf8",
          "dark": "#0f0f0e"
        },
        "usage": "Page background. The whole site sits on this one ground."
      },
      {
        "name": "paper-raised",
        "value": {
          "light": "#ffffff",
          "dark": "#181817"
        },
        "usage": "The rare lifted surface: the copied-email toast, a hovered row's wash. Never a card grid."
      },
      {
        "name": "line",
        "value": {
          "light": "#e7e6e2",
          "dark": "#262624"
        },
        "usage": "Hairlines between list rows and under the header. Decorative only, never a control border."
      },
      {
        "name": "line-strong",
        "value": {
          "light": "#8a8983",
          "dark": "#6c6b66"
        },
        "usage": "Link underlines at rest and the ghost button's border; 3.3:1 on paper (light), 3.6:1 (dark)."
      },
      {
        "name": "ink",
        "value": {
          "light": "#151514",
          "dark": "#ecebe7"
        },
        "usage": "Primary text and the solid button fill, on paper and paper-raised (17:1 light, 16:1 dark)."
      },
      {
        "name": "ink-muted",
        "value": {
          "light": "#65645f",
          "dark": "#9c9b95"
        },
        "usage": "Secondary text: section labels, years, nav at rest, captions. On paper and paper-raised (5.7:1 light, 6.9:1 dark)."
      },
      {
        "name": "on-ink",
        "value": {
          "light": "#fafaf8",
          "dark": "#0f0f0e"
        },
        "usage": "Text on an ink fill (the solid button's label)."
      },
      {
        "name": "marigold",
        "value": {
          "light": "#e09a12",
          "dark": "#f0b23e"
        },
        "usage": "The signature. Fills only: the status dot, the cover. At most one marigold mark per screen. Not a text colour on light paper (2.3:1)."
      },
      {
        "name": "marigold-ink",
        "value": {
          "light": "#8f5600",
          "dark": "#f0b23e"
        },
        "usage": "Marigold as text, when a word must carry the accent (5.7:1 on paper light, 10:1 dark). Use sparingly."
      },
      {
        "name": "marigold-soft",
        "value": {
          "light": "#fbeed2",
          "dark": "#3a2b0a"
        },
        "usage": "Text selection and the occasional highlight behind ink or marigold-ink text."
      },
      {
        "name": "link",
        "value": "{ink}",
        "usage": "Links read as text. An alias of ink; the underline (line-strong) is what marks them."
      }
    ]
  },
  "type": {
    "fonts": [],
    "families": {
      "sans": "\"Geist\", ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif",
      "mono": "\"Geist Mono\", ui-monospace, \"SF Mono\", Menlo, monospace"
    },
    "groups": [
      {
        "name": "Display",
        "family": "sans",
        "note": "Light weights carry the voice. Big text gets thinner, never bolder.",
        "styles": [
          {
            "name": "display",
            "fontSize": "44px",
            "lineHeight": "48px",
            "fontWeight": 300,
            "letterSpacing": "-0.03em",
            "sample": "Prateek",
            "usage": "The name on the home page, or one page title. Once per page."
          },
          {
            "name": "title",
            "fontSize": "24px",
            "lineHeight": "32px",
            "fontWeight": 300,
            "letterSpacing": "-0.015em",
            "sample": "Routing messages without losing any",
            "usage": "Titles of notes and case studies."
          },
          {
            "name": "lede",
            "fontSize": "17px",
            "lineHeight": "28px",
            "fontWeight": 300,
            "letterSpacing": "-0.005em",
            "sample": "Backend engineer in Delhi. I build systems that stay out of the way.",
            "usage": "The one-line intro under the name; pull sentences."
          }
        ]
      },
      {
        "name": "Text",
        "family": "sans",
        "note": "Regular weight for reading; nothing above 500 anywhere.",
        "styles": [
          {
            "name": "body",
            "fontSize": "15px",
            "lineHeight": "24px",
            "fontWeight": 400,
            "sample": "Right now I work on message routing at Fyscal, where email, SMS and push all go through one queue.",
            "usage": "Paragraphs, list titles. Keep lines near 64 characters (the column token)."
          },
          {
            "name": "label",
            "fontSize": "13px",
            "lineHeight": "20px",
            "fontWeight": 400,
            "sample": "Selected work",
            "usage": "Section labels, nav, button text. Sentence case, in ink-muted unless active."
          },
          {
            "name": "small",
            "fontSize": "12px",
            "lineHeight": "18px",
            "fontWeight": 400,
            "sample": "Last updated October 2026",
            "usage": "Footnotes and fine print."
          }
        ]
      },
      {
        "name": "Mono",
        "family": "mono",
        "note": "Mono marks machine facts: dates, times, versions, commands.",
        "styles": [
          {
            "name": "meta",
            "fontSize": "12px",
            "lineHeight": "16px",
            "fontWeight": 400,
            "letterSpacing": "0.02em",
            "sample": "2026 · 14:32 IST",
            "usage": "Years in the work list, local time, tags. Tabular numerals."
          },
          {
            "name": "code",
            "fontSize": "13px",
            "lineHeight": "20px",
            "fontWeight": 400,
            "sample": "terraform apply -target=module.runner",
            "usage": "Inline code and short snippets."
          }
        ]
      }
    ]
  },
  "spacing": {
    "note": "4px base. Space does the work borders would do elsewhere.",
    "tokens": [
      {
        "name": "space-1",
        "value": "4px",
        "usage": "Dot-to-text gap, glyph nudges."
      },
      {
        "name": "space-2",
        "value": "8px",
        "usage": "Between a title and its meta; inside tags."
      },
      {
        "name": "space-3",
        "value": "12px",
        "usage": "Between buttons; row padding top and bottom."
      },
      {
        "name": "space-4",
        "value": "16px",
        "usage": "Minimum page gutter on phones; button padding."
      },
      {
        "name": "space-6",
        "value": "24px",
        "usage": "Between paragraphs and their actions."
      },
      {
        "name": "space-8",
        "value": "32px",
        "usage": "Between the name block and the intro."
      },
      {
        "name": "space-12",
        "value": "48px",
        "usage": "Header height; work row pitch on desktop."
      },
      {
        "name": "space-16",
        "value": "64px",
        "usage": "Between sections. The page breathes here."
      }
    ]
  },
  "radius": {
    "note": "Square by default. Round only means 'status'.",
    "tokens": [
      {
        "name": "radius-0",
        "value": "0",
        "usage": "Rows, sections, images: everything structural."
      },
      {
        "name": "radius-sm",
        "value": "6px",
        "usage": "Buttons, tags, the toast."
      },
      {
        "name": "radius-full",
        "value": "9999px",
        "usage": "The status dot only."
      }
    ]
  },
  "shadow": {
    "note": "No elevation in the layout. One float for the toast, and the focus ring.",
    "tokens": [
      {
        "name": "shadow-float",
        "value": {
          "light": "0 1px 2px #1515140d, 0 8px 24px -6px #1515141f",
          "dark": "0 8px 24px -6px #000000b3"
        },
        "usage": "The copied-email toast. Nothing else floats."
      },
      {
        "name": "focus-ring",
        "value": {
          "light": "0 0 0 2px #fafaf8, 0 0 0 3.5px #151514",
          "dark": "0 0 0 2px #0f0f0e, 0 0 0 3.5px #ecebe7"
        },
        "usage": "Keyboard focus on buttons: a 2px paper gap, then a solid ink ring (17:1). Links use a 1.5px ink outline offset 3px."
      }
    ]
  },
  "layout": {
    "note": "One narrow column, left-aligned on wide screens.",
    "tokens": [
      {
        "name": "column",
        "value": "560px",
        "usage": "Max width of the content column. Everything lives inside it."
      },
      {
        "name": "label-col",
        "value": "112px",
        "usage": "Width of the section label column on screens 640px and wider; labels stack above content below that."
      },
      {
        "name": "page-top",
        "value": "96px",
        "usage": "Space above the name on desktop; 48px on phones."
      }
    ]
  },
  "duration": {
    "note": "Motion is a colour change, not a journey.",
    "tokens": [
      {
        "name": "dur-fast",
        "value": "120ms",
        "usage": "Hover colour and underline changes."
      },
      {
        "name": "dur-base",
        "value": "200ms",
        "usage": "Sibling dimming in lists; the toast fading in."
      }
    ]
  }
};
