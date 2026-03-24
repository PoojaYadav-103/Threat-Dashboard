// ============================================================
// STATELESS / PRESENTATIONAL COMPONENTS
// These receive props only — no internal state whatsoever
// ============================================================

// Displays a single KPI metric card
export function StatCard({ label, value, sub, variant }) {
  return (
    <div className={`stat-card stat-card--${variant} fade-in`}>
      <div className="stat-card__glow" />
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__sub">{sub}</div>
    </div>
  );
}

// Renders a severity badge pill
export function SeverityBadge({ severity }) {
  return <span className={`badge-${severity}`}>{severity}</span>;
}

// Renders a status badge
export function StatusBadge({ status }) {
  return <span className={`badge-${status}`}>{status}</span>;
}

// Loading spinner
export function LoadingState({ message = 'Fetching threat intelligence...' }) {
  return (
    <div className="loading">
      <div className="loading__spinner" />
      <div className="loading__text">{message}</div>
    </div>
  );
}

// Empty state message
export function EmptyState({ message = 'No threats match your filters.' }) {
  return <div className="empty">{message}</div>;
}

// Top navigation bar — purely presentational
export function Navbar({ threatCount, geoInfo, lastUpdated }) {
  return (
    <nav className="navbar">
      <div className="navbar__brand">
        Threat<span>Scope</span>
      </div>
      <div className="navbar__info">
        <span>Node: {geoInfo?.city || '...'}, {geoInfo?.country || '...'}</span>
        <span>Updated: {lastUpdated}</span>
        <span className="navbar__status">LIVE FEED</span>
      </div>
    </nav>
  );
}

// Single table row for a threat event
export function ThreatRow({ event, onResolve }) {
  return (
    <tr className="fade-in">
      <td className="td-mono">#{event.id.toString().padStart(4, '0')}</td>
      <td className="td-type">{event.type}</td>
      <td><SeverityBadge severity={event.severity} /></td>
      <td className="td-mono">{event.source}</td>
      <td className="td-mono">{event.target}</td>
      <td>{event.country}</td>
      <td className="td-time">{event.formattedTime}</td>
      <td><StatusBadge status={event.status} /></td>
      <td>
        <button
          className="resolve-btn"
          onClick={() => onResolve(event.id)}
          disabled={event.isResolved()}
        >
          {event.isResolved() ? 'Done' : 'Resolve'}
        </button>
      </td>
    </tr>
  );
}

// Top attackers list item
export function AttackerItem({ source, count }) {
  return (
    <div className="sidebar__attacker">
      <span className="sidebar__attacker-ip">{source}</span>
      <span className="sidebar__attacker-count">{count}</span>
    </div>
  );
}
