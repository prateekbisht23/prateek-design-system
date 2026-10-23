/* The web view. Reads window.PK_TOKENS, window.PK_DOCS and renders window.Prateek components live. */
(function () {
  'use strict';
  var React = window.React, ReactDOM = window.ReactDOM, h = React.createElement;
  var useState = React.useState, useEffect = React.useEffect, useRef = React.useRef;
  var P = window.Prateek, T = window.PK_TOKENS, D = window.PK_DOCS;
  var THEMES = T.color.themes.map(function (t) { return t.id; });

  /* ---------- theme ---------- */
  function readTheme() { try { return localStorage.getItem('pk-theme') || 'system'; } catch (e) { return 'system'; } }
  function applyTheme(mode) {
    var root = document.documentElement;
    if (mode === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', mode);
    try { localStorage.setItem('pk-theme', mode); } catch (e) {}
  }
  function useSystemDark() {
    var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    var s = useState(mq ? mq.matches : false);
    useEffect(function () {
      if (!mq) return;
      var on = function (e) { s[1](e.matches); };
      mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
      return function () { mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on); };
    }, []);
    return s[0];
  }

  /* ---------- helpers ---------- */
  function byName(name) { return T.color.tokens.filter(function (t) { return t.name === name; })[0]; }
  function resolve(token, theme) {
    var v = typeof token.value === 'string' ? token.value : (token.value[theme] || token.value[THEMES[0]]);
    var m = /^\{(.+)\}$/.exec(v);
    if (m) { var t = byName(m[1]); return t ? resolve(t, theme) : v; }
    return v;
  }
  function lum(hex) {
    var x = hex.replace('#', '');
    if (x.length === 3) x = x.split('').map(function (c) { return c + c; }).join('');
    var c = [0, 2, 4].map(function (i) {
      var v = parseInt(x.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function ratio(a, b) {
    if (!/^#[0-9a-f]{3,6}$/i.test(a) || !/^#[0-9a-f]{3,6}$/i.test(b)) return null;
    var x = lum(a), y = lum(b), hi = Math.max(x, y), lo = Math.min(x, y);
    return (hi + 0.05) / (lo + 0.05);
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function inline(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }
  // Tiny markdown: ## headings, - lists, paragraphs, `code`, **bold**. Drops a leading # title.
  function md(src) {
    var out = [], list = null, para = [];
    function flushP() { if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; } }
    function flushL() { if (list) { out.push('<ul>' + list.map(function (li) { return '<li>' + inline(li) + '</li>'; }).join('') + '</ul>'); list = null; } }
    src.split('\n').forEach(function (line) {
      if (/^#\s/.test(line)) { flushP(); flushL(); return; }
      var hm = /^#{2,3}\s+(.*)/.exec(line);
      if (hm) { flushP(); flushL(); out.push('<h3>' + inline(hm[1]) + '</h3>'); return; }
      var lm = /^\s*-\s+(.*)/.exec(line);
      if (lm) { flushP(); (list = list || []).push(lm[1]); return; }
      if (/^\s{2,}\S/.test(line) && list) { list[list.length - 1] += ' ' + line.trim(); return; }
      if (!line.trim()) { flushP(); flushL(); return; }
      flushL(); para.push(line.trim());
    });
    flushP(); flushL();
    return out.join('');
  }
  function Md(props) { return h('div', { className: 'ds-md', dangerouslySetInnerHTML: { __html: md(props.src || '') } }); }
  function firstPara(src) {
    var body = (src || '').split('\n').filter(function (l) { return !/^#\s/.test(l); }).join('\n').trim();
    return body.split(/\n\s*\n/)[0] || '';
  }
  function restOf(src) {
    var body = (src || '').split('\n').filter(function (l) { return !/^#\s/.test(l); }).join('\n').trim();
    var parts = body.split(/\n\s*\n/); parts.shift(); return parts.join('\n\n');
  }

  function Seg(props) {
    return h('div', { className: 'ds-seg', role: 'group', 'aria-label': props.label },
      props.options.map(function (o) {
        var val = typeof o === 'string' ? o : o.value, lab = typeof o === 'string' ? o : o.label;
        return h('button', { key: val, type: 'button', 'aria-pressed': props.value === val ? 'true' : 'false', onClick: function () { props.onChange(val); } }, lab);
      }));
  }

  function Block(props) {
    return h('section', { id: props.id, className: 'ds-block', 'aria-labelledby': props.id + '-l' },
      h('h2', { className: 'ds-block-label', id: props.id + '-l' }, props.label),
      h('div', { className: 'ds-block-body' }, props.children));
  }

  /* ---------- top bar ---------- */
  var NAV = [['overview', 'Overview'], ['guidelines', 'Guidelines'], ['color', 'Color'], ['type', 'Type'], ['space', 'Space'], ['components', 'Components'], ['page', 'Page']];
  function useActiveSection() {
    var s = useState('overview');
    useEffect(function () {
      if (!('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) s[1](e.target.id); });
      }, { rootMargin: '-80px 0px -70% 0px' });
      NAV.forEach(function (n) { var el = document.getElementById(n[0]); if (el) io.observe(el); });
      return function () { io.disconnect(); };
    }, []);
    return s[0];
  }
  function Bar(props) {
    var active = useActiveSection();
    return h('header', { className: 'ds-bar' },
      h('div', { className: 'ds-wrap ds-bar-inner' },
        h('a', { className: 'ds-brand', href: '#overview' }, 'Prateek ', h('span', null, '/ Design system')),
        h('nav', { className: 'ds-nav', 'aria-label': 'Sections' },
          NAV.map(function (n) { return h('a', { key: n[0], href: '#' + n[0], 'aria-current': active === n[0] ? 'true' : undefined }, n[1]); })),
        h(Seg, { label: 'Theme', value: props.mode, onChange: props.setMode, options: [{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }] })));
  }

  /* ---------- overview ---------- */
  function count(fam) { return (T[fam] && T[fam].tokens ? T[fam].tokens.length : 0); }
  function Overview(props) {
    var styles = T.type.groups.reduce(function (n, g) { return n + g.styles.length; }, 0);
    var comps = Object.keys(D.components).length;
    var usage = [
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400&display=swap">',
      '<link rel="stylesheet" href="tokens/tokens.css">',
      '<link rel="stylesheet" href="components/bundle.css">',
      '<script src="vendor/react.production.min.js"></script>',
      '<script src="vendor/react-dom.production.min.js"></script>',
      '<script src="components/bundle.js"></script>',
      '',
      '<script>',
      '  const { Header, Status, Button } = window.Prateek;',
      '  const h = React.createElement;',
      '  ReactDOM.createRoot(app).render(h(Status, null, "Building message routing at Fyscal"));',
      '</script>'
    ].join('\n');
    return h('div', { id: 'overview' },
      h('div', { className: 'ds-hero' },
        h('h1', { className: 'pk-name' }, 'Prateek'),
        h(P.Status, null, 'Design system v1, live in ' + (props.effective === 'dark' ? 'dark' : 'light')),
        h('p', { className: 'pk-lede', style: { maxWidth: 560 } }, 'One narrow column, light type, hairlines instead of boxes, and a single marigold dot. Every value below is read from tokens.json and every component is the real one.'),
        h('div', { className: 'ds-counts' },
          [T.color.tokens.length + ' colors', styles + ' type styles', count('spacing') + ' space steps', count('radius') + ' radii', comps + ' components', THEMES.length + ' themes'].map(function (c) { return h('span', { key: c, className: 'ds-meta' }, c); }))),
      h(Block, { id: 'start', label: 'Use it' },
        h('p', { className: 'ds-p' }, 'Plain files, no build step. Load the tokens, the component stylesheet, React 18 and the bundle; components are on window.Prateek. Set data-theme="light" or "dark" on <html> to force a theme, or leave it off to follow the OS.'),
        h(Code, { code: usage, lang: 'html' })));
  }

  /* ---------- guidelines ---------- */
  function Guidelines() {
    return h(Block, { id: 'guidelines', label: 'Guidelines' }, h(Md, { src: D.design }));
  }

  /* ---------- color ---------- */
  // Contrast is measured against the ground each token is meant to sit on; surfaces get a label instead.
  var GROUND = { 'on-ink': 'ink' };
  var SURFACES = { paper: 'ground', 'paper-raised': 'surface', line: 'hairline', 'marigold-soft': 'surface' };
  function Color(props) {
    var copied = useState(null);
    function copy(name) {
      var v = 'var(--' + name + ')';
      try { navigator.clipboard.writeText(v).then(function () { copied[1](name); }, function () { copied[1](name); }); } catch (e) { copied[1](name); }
      setTimeout(function () { copied[1](null); }, 1600);
    }
    return h(Block, { id: 'color', label: 'Color' },
      h('div', null,
        h('h3', { className: 'ds-h' }, 'Paper, ink and one marigold'),
        h('p', { className: 'ds-p', style: { marginTop: 8 } }, 'Each token shows both themes side by side and its contrast against paper in light and dark. Tap a name to copy its CSS variable.')),
      h('div', { className: 'ds-colors' },
        T.color.tokens.map(function (t) {
          var vals = THEMES.map(function (th) { return resolve(t, th); });
          var groundName = GROUND[t.name] || 'paper', ground = byName(groundName);
          var ratios = THEMES.map(function (th, i) { return ratio(vals[i], resolve(ground, th)); });
          var isAlias = typeof t.value === 'string' && /^\{/.test(t.value);
          return h('div', { key: t.name, className: 'ds-color' },
            h('div', { className: 'ds-swatches', style: { paddingBottom: 18 } },
              THEMES.map(function (th, i) {
                return h('div', { key: th, className: 'ds-swatch', style: { background: vals[i] }, title: th + ' ' + vals[i] },
                  h('span', { className: 'ds-swatch-label' }, th === props.effective ? '● ' + th.slice(0, 1).toUpperCase() : th.slice(0, 1).toUpperCase()));
              })),
            h('div', null,
              h('div', { className: 'ds-color-name' },
                h('button', { type: 'button', className: 'ds-copy-name', onClick: function () { copy(t.name); } }, copied[0] === t.name ? 'Copied' : '--' + t.name),
                h('span', { className: 'ds-meta' }, isAlias ? 'alias of ' + t.value.slice(1, -1) : vals.join(' / '))),
              h('p', { className: 'ds-color-usage' }, t.usage)),
            h('div', { className: 'ds-contrast' },
              SURFACES[t.name] ? h('span', { className: 'ds-meta' }, SURFACES[t.name]) :
                [h('span', { key: 'on', className: 'ds-meta' }, 'on ' + groundName)].concat(THEMES.map(function (th, i) {
                  var r = ratios[i]; if (r == null) return null;
                  var pass = r >= 4.5 ? 'AA' : r >= 3 ? '3:1' : '';
                  return h('span', { key: th, className: 'ds-pill' + (pass ? ' is-pass' : ''), title: 'On ' + groundName + ', ' + th + ' theme' },
                    th.slice(0, 1).toUpperCase() + ' ' + r.toFixed(1) + (pass ? ' ' + pass : ''));
                }))));
        })));
  }

  /* ---------- type ---------- */
  function Type() {
    var s = useState('');
    var families = T.type.families;
    return h(Block, { id: 'type', label: 'Type' },
      h('div', null,
        h('h3', { className: 'ds-h' }, 'Thin gets bigger, not bolder'),
        h('p', { className: 'ds-p', style: { marginTop: 8 } }, 'Geist for what people read, Geist Mono for machine facts. Type below to try your own words in every style.')),
      h('div', { className: 'ds-field' },
        h('label', { htmlFor: 'type-sample' }, 'Preview text'),
        h('input', { id: 'type-sample', className: 'ds-input', value: s[0], placeholder: 'Leave empty for the sample copy', onChange: function (e) { s[1](e.target.value); } })),
      T.type.groups.map(function (g) {
        return h('div', { key: g.name },
          h('p', { className: 'ds-sub', style: { marginBottom: 8 } }, g.name + ' · ' + (families[g.family] || '').split(',')[0].replace(/"/g, '') + (g.note ? ' · ' + g.note : '')),
          h('div', { className: 'ds-types' },
            g.styles.map(function (st) {
              return h('div', { key: st.name, className: 'ds-type' },
                h('div', { className: 'ds-type-info' },
                  h('b', null, st.name),
                  h('span', { className: 'ds-meta' }, parseInt(st.fontSize, 10) + '/' + parseInt(st.lineHeight, 10) + ' · ' + st.fontWeight + (st.letterSpacing ? ' · ' + st.letterSpacing : '')),
                  h('span', { className: 'ds-color-usage', style: { marginTop: 4 } }, st.usage)),
                h('p', { className: 'ds-type-sample t-' + st.name }, s[0] || st.sample));
            })));
      }));
  }

  /* ---------- space, radius, shadow, motion ---------- */
  function Space() {
    var maxPx = Math.max.apply(null, T.spacing.tokens.map(function (t) { return parseInt(t.value, 10); }));
    return h(Block, { id: 'space', label: 'Space' },
      h('div', null,
        h('h3', { className: 'ds-h' }, 'Space does the separating'),
        h('p', { className: 'ds-p', style: { marginTop: 8 } }, T.spacing.note)),
      h('div', { className: 'ds-scale' },
        T.spacing.tokens.map(function (t) {
          return h('div', { key: t.name, className: 'ds-scale-row' },
            h('span', { className: 'ds-mono' }, t.name),
            h('span', { className: 'ds-meta' }, t.value),
            h('div', { className: 'ds-bar-fill', style: { width: (parseInt(t.value, 10) / maxPx * 100) + '%' } }),
            h('p', null, t.usage));
        })),
      h('div', null,
        h('p', { className: 'ds-sub', style: { marginBottom: 12 } }, 'Radius · ' + T.radius.note),
        h('div', { className: 'ds-tiles' },
          T.radius.tokens.map(function (t) {
            var round = t.name === 'radius-full';
            return h('div', { key: t.name, className: 'ds-tile' },
              h('div', { className: 'ds-tile-shape', style: { borderRadius: 'var(--' + t.name + ')', width: round ? 88 : '100%' } }),
              h('span', { className: 'ds-mono' }, t.name + ' · ' + t.value),
              h('p', null, t.usage));
          }))),
      h('div', null,
        h('p', { className: 'ds-sub', style: { marginBottom: 12 } }, 'Shadow and focus · ' + T.shadow.note),
        h('div', { className: 'ds-tiles' },
          h('div', { className: 'ds-tile' },
            h('div', { className: 'ds-tile-shape', style: { boxShadow: 'var(--shadow-float)', borderColor: 'var(--line)', borderRadius: 'var(--radius-sm)' } }),
            h('span', { className: 'ds-mono' }, 'shadow-float'), h('p', null, byShadow('shadow-float'))),
          h('div', { className: 'ds-tile' },
            h('div', { className: 'ds-focus-demo' }, h('span', null, 'Focused')),
            h('span', { className: 'ds-mono' }, 'focus-ring'), h('p', null, 'Tab through this page to see it on real controls.')))),
      T.duration ? h('div', null,
        h('p', { className: 'ds-sub', style: { marginBottom: 12 } }, 'Motion · ' + T.duration.note),
        h('div', { className: 'ds-tiles' },
          T.duration.tokens.map(function (t) {
            return h('div', { key: t.name, className: 'ds-tile' },
              h('div', { className: 'ds-motion', style: { transitionDuration: 'var(--' + t.name + ')' } }, 'Hover me'),
              h('span', { className: 'ds-mono' }, t.name + ' · ' + t.value),
              h('p', null, t.usage));
          }))) : null,
      T.layout ? h('div', null,
        h('p', { className: 'ds-sub', style: { marginBottom: 12 } }, 'Layout · ' + T.layout.note),
        h('div', { className: 'ds-scale' },
          T.layout.tokens.map(function (t) {
            return h('div', { key: t.name, className: 'ds-scale-row' },
              h('span', { className: 'ds-mono' }, t.name), h('span', { className: 'ds-meta' }, t.value),
              h('span', { className: 'ds-color-usage', style: { margin: 0 } }, t.usage));
          }))) : null);
  }
  function byShadow(n) { var t = T.shadow.tokens.filter(function (x) { return x.name === n; })[0]; return t ? t.usage : ''; }

  /* ---------- code block ---------- */
  function Code(props) {
    return h('div', { className: 'ds-code' },
      h('div', { className: 'ds-code-bar' },
        h('span', { className: 'ds-meta' }, props.lang || 'jsx'),
        h(P.CopyButton, { value: props.code, label: 'Copy', copiedLabel: 'Copied', variant: 'text', showValue: false })),
      h('pre', null, h('code', null, props.code)));
  }

  /* ---------- components ---------- */
  var ZONES = {
    Delhi: { timeZone: 'Asia/Kolkata', zoneLabel: 'IST' },
    London: { timeZone: 'Europe/London', zoneLabel: 'UK' },
    'New York': { timeZone: 'America/New_York', zoneLabel: 'ET' },
    'San Francisco': { timeZone: 'America/Los_Angeles', zoneLabel: 'PT' }
  };
  var WORK = [{ title: 'Connectra', note: 'message routing', year: 2026 }, { title: 'Onexo runner', note: 'infra', year: 2026 }, { title: 'Spec to work items', note: 'agent', year: 2026 }, { title: 'Kelly Tech', note: 'internship', year: 2025 }];
  var LINKS = [{ label: 'Resume', href: '#', meta: 'PDF' }, { label: 'GitHub', href: 'https://github.com' }, { label: 'LinkedIn', href: 'https://linkedin.com' }];
  function q(s) { return JSON.stringify(s); }

  var COMPONENTS = [
    { name: 'Header', knobs: [{ key: 'active', type: 'seg', label: 'Current page', options: ['Work', 'Notes', 'About', 'Contact'] }], init: { active: 'Work' },
      render: function (k) { return h(P.Header, { name: 'Prateek', links: ['Work', 'Notes', 'About', 'Contact'].map(function (l) { return { label: l, href: '#', active: l === k.active }; }) }); },
      code: function (k) { return '<Header\n  name="Prateek"\n  links={[\n' + ['Work', 'Notes', 'About', 'Contact'].map(function (l) { return '    { label: ' + q(l) + ', href: "/' + l.toLowerCase() + '"' + (l === k.active ? ', active: true' : '') + ' },'; }).join('\n') + '\n  ]}\n/>'; } },
    { name: 'Status', knobs: [{ key: 'text', type: 'text', label: 'Now' }, { key: 'live', type: 'seg', label: 'Pulse', options: ['On', 'Off'] }], init: { text: 'Building message routing at Fyscal', live: 'On' },
      render: function (k) { return h(P.Status, { live: k.live === 'On' }, k.text); },
      code: function (k) { return '<Status' + (k.live === 'Off' ? ' live={false}' : '') + '>' + k.text + '</Status>'; } },
    { name: 'LocalTime', knobs: [{ key: 'place', type: 'seg', label: 'Place', options: Object.keys(ZONES) }], init: { place: 'Delhi' },
      render: function (k) { var z = ZONES[k.place]; return h(P.LocalTime, { key: k.place, place: k.place, timeZone: z.timeZone, zoneLabel: z.zoneLabel }); },
      code: function (k) { var z = ZONES[k.place]; return '<LocalTime place=' + q(k.place) + ' timeZone=' + q(z.timeZone) + ' zoneLabel=' + q(z.zoneLabel) + ' />'; } },
    { name: 'TextLink', knobs: [{ key: 'text', type: 'text', label: 'Link text' }, { key: 'ext', type: 'seg', label: 'Destination', options: ['External', 'Internal'] }], init: { text: 'Fyscal', ext: 'External' },
      render: function (k) { return h('p', { className: 'pk-body', style: { margin: 0, maxWidth: 480 } }, 'Right now I work at ', h(P.TextLink, { href: k.ext === 'External' ? 'https://example.com' : '#' }, k.text), ' on message routing.'); },
      code: function (k) { return '<TextLink href=' + q(k.ext === 'External' ? 'https://example.com' : '/about') + '>' + k.text + '</TextLink>'; } },
    { name: 'Button', knobs: [{ key: 'variant', type: 'seg', label: 'Variant', options: ['solid', 'ghost', 'text'] }, { key: 'text', type: 'text', label: 'Label' }, { key: 'disabled', type: 'seg', label: 'State', options: ['Enabled', 'Disabled'] }], init: { variant: 'solid', text: 'Say hello', disabled: 'Enabled' },
      render: function (k) { return h(P.Button, { variant: k.variant, disabled: k.disabled === 'Disabled' }, k.text); },
      code: function (k) { return '<Button variant=' + q(k.variant) + (k.disabled === 'Disabled' ? ' disabled' : '') + '>' + k.text + '</Button>'; } },
    { name: 'CopyButton', knobs: [{ key: 'value', type: 'text', label: 'Value' }, { key: 'variant', type: 'seg', label: 'Variant', options: ['text', 'ghost', 'solid'] }], init: { value: 'prateek@example.com', variant: 'text' },
      render: function (k) { return h('div', { className: 'pk-row', style: { minHeight: 72, alignItems: 'flex-start' } }, h(P.Button, { variant: 'solid', href: 'mailto:' + k.value }, 'Say hello'), h(P.CopyButton, { value: k.value, variant: k.variant })); },
      code: function (k) { return '<Button variant="solid" href=' + q('mailto:' + k.value) + '>Say hello</Button>\n<CopyButton value=' + q(k.value) + (k.variant !== 'text' ? ' variant=' + q(k.variant) : '') + ' />'; } },
    { name: 'Section', knobs: [{ key: 'label', type: 'text', label: 'Label' }], init: { label: 'About' },
      render: function (k) { return h(P.Section, { label: k.label }, h('p', { className: 'pk-body' }, 'Final-year CS student at BPIT, Delhi, and a backend engineer at Fyscal. I like queues, retries and the boring parts that keep things up.')); },
      code: function (k) { return '<Section label=' + q(k.label) + '>\n  <p>…</p>\n</Section>'; } },
    { name: 'WorkList', knobs: [], init: {}, hint: 'Hover a row: the others dim.',
      render: function () { return h(P.WorkList, { items: WORK }); },
      code: function () { return '<WorkList items={[\n' + WORK.map(function (w) { return '  { title: ' + q(w.title) + ', note: ' + q(w.note) + ', year: ' + w.year + ', href: "/work/' + w.title.toLowerCase().replace(/\s+/g, '-') + '" },'; }).join('\n') + '\n]} />'; } },
    { name: 'LinkList', knobs: [], init: {},
      render: function () { return h(P.LinkList, { items: LINKS }); },
      code: function () { return '<LinkList items={[\n' + LINKS.map(function (l) { return '  { label: ' + q(l.label) + ', href: ' + q(l.href) + (l.meta ? ', meta: ' + q(l.meta) : '') + ' },'; }).join('\n') + '\n]} />'; } },
    { name: 'Tag', knobs: [{ key: 'items', type: 'text', label: 'Tags, comma separated' }], init: { items: 'TypeScript, Node.js, AWS, Terraform, SQS, ClickHouse' },
      render: function (k) { return h(P.Tag, { items: split(k.items) }); },
      code: function (k) { return '<Tag items={' + JSON.stringify(split(k.items)) + '} />'; } }
  ];
  function split(s) { return s.split(',').map(function (x) { return x.trim(); }).filter(Boolean); }

  function Knob(props) {
    var k = props.knob, id = props.comp + '-' + k.key;
    if (k.type === 'seg') return h('div', { className: 'ds-knob' }, h('span', null, k.label), h(Seg, { label: k.label, value: props.value, onChange: props.onChange, options: k.options }));
    return h('label', { className: 'ds-knob', htmlFor: id }, h('span', null, k.label),
      h('input', { id: id, className: 'ds-input', value: props.value, onChange: function (e) { props.onChange(e.target.value); } }));
  }

  function ComponentDoc(props) {
    var c = props.c, st = useState(c.init), k = st[0];
    var doc = D.components[c.name] || '';
    var more = restOf(doc);
    return h('article', { className: 'ds-comp', id: 'c-' + c.name },
      h('div', { className: 'ds-comp-head' },
        h('h3', { className: 'ds-h' }, c.name),
        c.hint ? h('span', { className: 'ds-meta' }, c.hint) : null),
      h(Md, { src: firstPara(doc) }),
      h('div', { className: 'ds-stage' + (c.name === 'Header' ? ' ds-stage-wide' : '') }, c.render(k)),
      c.knobs.length ? h('div', { className: 'ds-knobs' }, c.knobs.map(function (kn) {
        return h(Knob, { key: kn.key, comp: c.name, knob: kn, value: k[kn.key], onChange: function (v) { var n = Object.assign({}, k); n[kn.key] = v; st[1](n); } });
      })) : null,
      h(Code, { code: c.code(k) }),
      more ? h('details', { className: 'ds-details' }, h('summary', null, 'Guidelines'), h('div', null, h(Md, { src: more }))) : null);
  }

  function Components() {
    return h(Block, { id: 'components', label: 'Components' },
      h('div', null,
        h('h3', { className: 'ds-h' }, 'Ten pieces, one page'),
        h('p', { className: 'ds-p', style: { marginTop: 8 } }, 'Each one is live: change the controls, then copy the JSX. Props are typed in components/index.d.ts.')),
      COMPONENTS.map(function (c) { return h(ComponentDoc, { key: c.name, c: c }); }));
  }

  /* ---------- example page in a frame, so media queries see a real width ---------- */
  function Page(props) {
    var dev = useState('desktop'), ref = useRef(null), rootRef = useRef(null), hgt = useState(1200);
    var fallback = useState(false);
    useEffect(function () {
      var f = ref.current; if (!f) return;
      var heads = Array.prototype.map.call(document.querySelectorAll('link[rel="stylesheet"], style'), function (n) { return n.hasAttribute('data-site-only') ? '' : n.outerHTML; }).join('');
      var ro;
      function mount() {
        var d = null;
        try { d = f.contentDocument; } catch (e) {}
        if (!d) { fallback[1](true); return; } // frame not readable (sandboxed host): render inline instead
        if (rootRef.current) return;
        var el = d.getElementById('root'); if (!el) return;
        rootRef.current = ReactDOM.createRoot(el);
        rootRef.current.render(h(window.PK_EXAMPLES.Portfolio));
        ro = new ResizeObserver(function () { hgt[1](Math.ceil(d.body.getBoundingClientRect().height)); });
        ro.observe(d.body);
      }
      f.addEventListener('load', mount);
      f.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="' + esc(document.baseURI) + '">' + heads + '</head><body><div id="root"></div></body></html>';
      return function () { f.removeEventListener('load', mount); if (ro) ro.disconnect(); if (rootRef.current) { rootRef.current.unmount(); rootRef.current = null; } };
    }, []);
    useEffect(function () {
      var d = ref.current && ref.current.contentDocument; if (!d || !d.documentElement) return;
      if (props.mode === 'system') d.documentElement.removeAttribute('data-theme'); else d.documentElement.setAttribute('data-theme', props.mode);
    });
    return h(Block, { id: 'page', label: 'Page' },
      h('div', { className: 'ds-comp-head' },
        h('div', null,
          h('h3', { className: 'ds-h' }, 'A home page, built only from the system'),
          h('p', { className: 'ds-p', style: { marginTop: 8 } }, 'Example copy. Switch widths to see the section labels stack on a phone.')),
        h(Seg, { label: 'Width', value: dev[0], onChange: dev[1], options: [{ value: 'desktop', label: 'Desktop' }, { value: 'phone', label: 'Phone' }] })),
      fallback[0]
        ? h('div', { className: 'ds-frame-wrap' }, h('div', { style: { width: '100%', maxWidth: dev[0] === 'phone' ? 390 : '100%' } }, h(window.PK_EXAMPLES.Portfolio)))
        : h('div', { className: 'ds-frame-wrap' + (dev[0] === 'phone' ? ' is-phone' : '') },
          h('iframe', { ref: ref, className: 'ds-frame', title: 'Example portfolio page', style: { height: hgt[0] } })));
  }

  /* ---------- app ---------- */
  function App() {
    var m = useState(readTheme()), mode = m[0];
    var sysDark = useSystemDark();
    var effective = mode === 'system' ? (sysDark ? 'dark' : 'light') : mode;
    function setMode(v) { applyTheme(v); m[1](v); }
    useEffect(function () {
      function onKey(e) {
        if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
        if (e.key === 't' && !e.metaKey && !e.ctrlKey && !e.altKey) setMode(effective === 'dark' ? 'light' : 'dark');
      }
      window.addEventListener('keydown', onKey);
      return function () { window.removeEventListener('keydown', onKey); };
    });
    return h(React.Fragment, null,
      h(Bar, { mode: mode, setMode: setMode }),
      h('main', { className: 'ds-wrap ds-main' },
        h(Overview, { effective: effective }),
        h(Guidelines),
        h(Color, { effective: effective }),
        h(Type),
        h(Space),
        h(Components),
        h(Page, { mode: mode }),
        h('footer', { className: 'ds-foot' },
          h('span', null, 'Prateek design system · v1'),
          h('span', null, 'Press ', h('span', { className: 'ds-mono' }, 'T'), ' to flip the theme'))));
  }

  ReactDOM.createRoot(document.getElementById('app')).render(h(App));
})();
