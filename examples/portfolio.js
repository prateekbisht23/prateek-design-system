/* A home page composed only from window.Prateek components. Example copy: replace with your own. */
(function () {
  window.PK_EXAMPLES = window.PK_EXAMPLES || {};
  window.PK_EXAMPLES.Portfolio = function Portfolio() {
    var P = window.Prateek, h = window.React.createElement;
    var email = 'prateek@example.com';
    return h('div', { className: 'pk-page' },
      h(P.Header, { name: 'Prateek', links: [{ label: 'Work', href: '#', active: true }, { label: 'Notes', href: '#' }, { label: 'About', href: '#' }] }),
      h('div', { className: 'pk-hero' },
        h('h1', { className: 'pk-name' }, 'Prateek'),
        h(P.Status, null, 'Building message routing at Fyscal'),
        h('p', { className: 'pk-lede' }, 'Backend engineer in Delhi. I build systems that stay out of the way.')
      ),
      h('div', { className: 'pk-stack', style: { marginTop: 'var(--space-8)', gap: 'var(--space-6)' } },
        h('p', { className: 'pk-body' }, 'I work at ', h(P.TextLink, { href: 'https://example.com' }, 'Fyscal'), ' on a communications platform, where email, SMS and push go through one routing layer. Before that I spent eight months at ', h(P.TextLink, { href: '#' }, 'Kelly Tech'), '. Lately I’m building agents that turn specs into tickets.'),
        h('div', { className: 'pk-row' },
          h(P.Button, { variant: 'solid', href: 'mailto:' + email }, 'Say hello'),
          h(P.CopyButton, { value: email })
        )
      ),
      h('div', { className: 'pk-sections' },
        h(P.Section, { label: 'Work' },
          h(P.WorkList, { items: [
            { title: 'Connectra', note: 'message routing', year: 2026 },
            { title: 'Onexo runner', note: 'infra', year: 2026 },
            { title: 'Spec to work items', note: 'agent', year: 2026 },
            { title: 'Agent swarm', note: 'tooling', year: 2026 },
            { title: 'Kelly Tech', note: 'internship', year: 2025 }
          ] })
        ),
        h(P.Section, { label: 'Stack' }, h(P.Tag, { items: ['TypeScript', 'Node.js', 'AWS', 'Terraform', 'SQS', 'ClickHouse'] })),
        h(P.Section, { label: 'Contact' },
          h('div', { className: 'pk-stack', style: { gap: 'var(--space-1)' } },
            h('span', null, email),
            h(P.LocalTime, { place: 'Delhi', timeZone: 'Asia/Kolkata', zoneLabel: 'IST' })
          )
        ),
        h(P.Section, { label: 'Elsewhere' },
          h(P.LinkList, { items: [
            { label: 'Resume', href: '#', meta: 'PDF' },
            { label: 'GitHub', href: 'https://github.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com' },
            { label: 'X', href: 'https://x.com' }
          ] })
        )
      )
    );
  };
})();
