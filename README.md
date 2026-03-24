# ThreatScope — Cyber Threat Intelligence Dashboard

A production-ready React dashboard built to demonstrate all CloudSEK SDE Intern frontend requirements.

## Skills Demonstrated

| Skill | Where |
|---|---|
| **OO JavaScript** | `src/classes/ThreatEvent.js`, `ThreatAnalyzer.js` — classes, inheritance, getters, encapsulation |
| **React stateful components** | `src/components/stateful/Containers.jsx` — useState, useEffect, useCallback, data orchestration |
| **React stateless components** | `src/components/stateless/Presentational.jsx` — pure props-in, JSX-out, zero internal state |
| **REST API integration** | `src/utils/api.js` — axios GET/PATCH to live APIs (JSONPlaceholder + ipapi.co) |
| **Webpack** | `webpack.config.js` — entry, output, loaders, HtmlWebpackPlugin, dev server, content hash |
| **Babel** | `.babelrc` — @babel/preset-env + @babel/preset-react |
| **Sass/SCSS** | `src/styles/main.scss` — variables, mixins, @each map loops, nesting, @keyframes |
| **Bootstrap** | Imported in index.js, overridden via CSS variables in SCSS |
| **Component architecture** | Clear container/presentational split throughout |

## How to Run

```bash
npm install
npm start        # dev server at http://localhost:3000
npm run build    # production build → /dist
```

## Add to Resume As

**ThreatScope — Cyber Intelligence Dashboard** *(React.js · OO JavaScript · Webpack/Babel · Sass · REST APIs · Bootstrap)*
- Architected a full-stack React dashboard with clear stateful/stateless component separation, consuming live REST APIs via axios
- Implemented OO JavaScript class hierarchy (`ThreatEvent`, `MalwareEvent`, `ThreatAnalyzer`) for encapsulated business logic and data analysis
- Configured Webpack 5 + Babel pipeline from scratch with Sass loader, CSS loader, and HtmlWebpackPlugin
- Integrated Bootstrap with SCSS variable overrides; styled a responsive dark-mode UI with Chart.js timeline and doughnut visualizations
