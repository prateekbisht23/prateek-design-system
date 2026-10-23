/* @ds-bundle: {"format":4,"namespace":"Prateek","components":[{"name":"Header"},{"name":"Status"},{"name":"LocalTime"},{"name":"TextLink"},{"name":"Button"},{"name":"CopyButton"},{"name":"Section"},{"name":"WorkList"},{"name":"LinkList"},{"name":"Tag"}]} */
/* generated from components/src/components.js by scripts/build.mjs */
(function () {
/*
 * Source of every component. scripts/build.mjs wraps this file into:
 *   components/bundle.js  — classic script, reads window.React, sets window.Prateek
 *   components/index.mjs  — ES module, imports React, named exports
 * Edit here, then run `npm run build`.
 */
function createPrateek(R) {
  var h = R.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function ext(href) { return typeof href === "string" && /^https?:\/\//.test(href); }

  function Header(p) {
    var links = p.links || [];
    return h("header", { className: cx("pk-header", p.className) },
      h("a", { className: "pk-header-name", href: p.homeHref || "/" }, p.name || "Prateek"),
      h("nav", { className: "pk-nav", "aria-label": "Main" },
        links.map(function (l) {
          return h("a", { key: l.label, href: l.href, "aria-current": l.active ? "page" : undefined }, l.label);
        })));
  }

  function Status(p) {
    return h("p", { className: cx("pk-status", p.live !== false && "pk-status-live", p.className), style: { margin: 0 } },
      h("span", { className: "pk-status-dot", "aria-hidden": "true" }),
      h("span", { className: "pk-status-label" }, p.label || "Now"),
      h("span", { className: "pk-status-sep", "aria-hidden": "true" }, "·"),
      h("span", null, p.children));
  }

  function formatTime(tz) {
    try {
      return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: tz }).format(new Date());
    } catch (e) { return ""; }
  }
  function LocalTime(p) {
    var tz = p.timeZone || "Asia/Kolkata";
    var s = R.useState(formatTime(tz)), t = s[0], set = s[1];
    R.useEffect(function () {
      var id = setInterval(function () { set(formatTime(tz)); }, 15000);
      return function () { clearInterval(id); };
    }, [tz]);
    return h("span", { className: cx("pk-time", p.className) },
      (p.place || "Delhi") + " · ", h("time", null, t), " " + (p.zoneLabel || "IST"));
  }

  function TextLink(p) {
    var external = p.external != null ? p.external : ext(p.href);
    return h("a", {
      className: cx("pk-link", external && "pk-link-ext", p.className),
      href: p.href,
      target: external ? "_blank" : undefined,
      rel: external ? "noopener noreferrer" : undefined
    }, p.children);
  }

  function Button(p) {
    var variant = p.variant || "ghost";
    var rest = {};
    for (var k in p) if (k !== "variant" && k !== "className" && k !== "children" && k !== "href") rest[k] = p[k];
    rest.className = cx("pk-btn", "pk-btn-" + variant, p.className);
    if (p.href) { rest.href = p.href; return h("a", rest, p.children); }
    if (!rest.type) rest.type = "button";
    return h("button", rest, p.children);
  }

  function CopyButton(p) {
    var s = R.useState(false), copied = s[0], set = s[1];
    var label = p.label || "Copy email";
    function done() { set(true); setTimeout(function () { set(false); }, 2000); }
    function onClick() {
      var v = p.value || "";
      try {
        var r = navigator.clipboard && navigator.clipboard.writeText(v);
        if (r && r.then) r.then(done, done); else done();
      } catch (e) { done(); }
    }
    return h("span", { className: "pk-copy" },
      h(Button, { variant: p.variant || "text", onClick: onClick, "aria-live": "polite" },
        copied ? h("span", { className: "pk-copied" }, p.copiedLabel || "Copied") : label),
      copied && p.showValue !== false ? h("span", { className: "pk-toast", role: "status" }, p.value) : null);
  }

  function Section(p) {
    var id = p.id || (p.label ? "s-" + String(p.label).toLowerCase().replace(/[^a-z0-9]+/g, "-") : undefined);
    return h("section", { className: cx("pk-section", p.className), "aria-labelledby": id },
      h("h2", { className: "pk-section-label", id: id }, p.label),
      h("div", { className: "pk-section-body" }, p.children));
  }

  function WorkList(p) {
    var items = p.items || [];
    return h("ul", { className: cx("pk-work", p.className) },
      items.map(function (it) {
        return h("li", { key: it.title, className: "pk-work-row" },
          h("a", { className: "pk-work-link", href: it.href || "#" },
            h("span", { className: "pk-work-title" }, it.title,
              it.note ? h("span", { className: "pk-work-note" }, " · " + it.note) : null),
            h("span", { className: "pk-work-arrow", "aria-hidden": "true" }, "↗"),
            h("span", { className: "pk-work-year" }, it.year)));
      }));
  }

  function LinkList(p) {
    var items = p.items || [];
    return h("ul", { className: cx("pk-links", p.className) },
      items.map(function (it) {
        return h("li", { key: it.label },
          h(TextLink, { href: it.href, external: it.external }, it.label),
          it.meta ? h("span", { className: "pk-links-meta" }, it.meta) : null);
      }));
  }

  function Tag(p) {
    if (p.items) return h("div", { className: cx("pk-tags", p.className) }, p.items.map(function (t) { return h("span", { key: t, className: "pk-tag" }, t); }));
    return h("span", { className: cx("pk-tag", p.className) }, p.children);
  }

  var api = { Header: Header, Status: Status, LocalTime: LocalTime, TextLink: TextLink, Button: Button, CopyButton: CopyButton, Section: Section, WorkList: WorkList, LinkList: LinkList, Tag: Tag };
  return api;
}

  var api = createPrateek(window.React);
  window.Prateek = window.Prateek || {};
  for (var n in api) window.Prateek[n] = api[n];
})();
