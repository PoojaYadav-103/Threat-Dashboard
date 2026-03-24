// ============================================================
// STATEFUL / CONTAINER COMPONENTS
// Own state, handle logic, pass data down to presentational
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { ThreatAnalyzer } from '../../classes/ThreatAnalyzer';
import { fetchThreatEvents, fetchGeoInfo, resolveEventAPI } from '../../utils/api';
import {
  StatCard, LoadingState, EmptyState,
  Navbar, ThreatRow, AttackerItem,
} from '../stateless/Presentational';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend, Filler);

const analyzer = new ThreatAnalyzer();

// ─── StatsRow — stateful, owns KPI data ───────────────────
export function StatsRow({ stats }) {
  return (
    <div className="stats-grid">
      <StatCard label="Total Threats" value={stats.total} sub="Last 12 hours" variant="score" />
      <StatCard label="Critical" value={stats.critical} sub="Immediate action" variant="critical" />
      <StatCard label="Active" value={stats.active} sub="Unresolved" variant="active" />
      <StatCard label="Resolved" value={stats.resolved} sub="Closed events" variant="resolved" />
    </div>
  );
}

// ─── TimelineChart — stateful, owns chart config ─────────
export function TimelineChart({ timelineData }) {
  const data = {
    labels: timelineData.map(d => d.label),
    datasets: [{
      label: 'Threat Events',
      data: timelineData.map(d => d.count),
      borderColor: '#00d4ff',
      backgroundColor: 'rgba(0,212,255,0.08)',
      borderWidth: 1.5,
      pointRadius: 3,
      pointBackgroundColor: '#00d4ff',
      fill: true,
      tension: 0.4,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f1629', borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1 } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4a5568', font: { family: 'Share Tech Mono', size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#4a5568', font: { family: 'Share Tech Mono', size: 10 }, stepSize: 1 } },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-card__title">Attack Timeline — 12h</div>
      <div style={{ height: 160 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

// ─── SeverityChart — stateful, owns doughnut config ──────
export function SeverityChart({ breakdown }) {
  const colors = { critical: '#ff2d55', high: '#ff6b35', medium: '#ffd60a', low: '#30d158' };
  const data = {
    labels: breakdown.map(b => b.label),
    datasets: [{
      data: breakdown.map(b => b.count),
      backgroundColor: breakdown.map(b => colors[b.label] + '33'),
      borderColor: breakdown.map(b => colors[b.label]),
      borderWidth: 1.5,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#7a8db3', font: { family: 'Share Tech Mono', size: 10 }, padding: 12 } },
      tooltip: { backgroundColor: '#0f1629', borderColor: 'rgba(0,212,255,0.2)', borderWidth: 1 },
    },
    cutout: '65%',
  };

  return (
    <div className="chart-card">
      <div className="chart-card__title">Severity Split</div>
      <div style={{ height: 160 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

// ─── ThreatTable — stateful, owns filter state ───────────
export function ThreatTable({ analyzer, onResolve }) {
  const [severity, setSeverity] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  analyzer.setFilter('severity', severity)
           .setFilter('status', status)
           .setFilter('search', search);

  const events = analyzer.filtered;

  return (
    <div className="threat-table-card">
      <div className="table-header">
        <div className="table-header__title">Live Threat Feed</div>
        <div className="table-header__controls">
          <input
            className="search-input"
            placeholder="Search type, IP, target..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="filter-select" value={severity} onChange={e => setSeverity(e.target.value)}>
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {events.length === 0 ? (
        <EmptyState />
      ) : (
        <table className="threat-table">
          <thead>
            <tr>
              <th>ID</th><th>Type</th><th>Severity</th><th>Source IP</th>
              <th>Target</th><th>Country</th><th>Time</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <ThreatRow key={event.id} event={event} onResolve={onResolve} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── Sidebar — stateful, owns nav selection ───────────────
export function Sidebar({ analyzer }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const topAttackers = analyzer.topAttackers;

  const navItems = [
    { key: 'dashboard', icon: '◈', label: 'Dashboard', badge: null },
    { key: 'threats', icon: '⚠', label: 'Threats', badge: analyzer.stats.active },
    { key: 'assets', icon: '◉', label: 'Assets', badge: null },
    { key: 'reports', icon: '◧', label: 'Reports', badge: null },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__section">
        <div className="sidebar__section-title">Navigation</div>
        {navItems.map(item => (
          <div
            key={item.key}
            className={`sidebar__nav-item ${activeNav === item.key ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => setActiveNav(item.key)}
          >
            <span><span className="nav-icon">{item.icon}</span>{item.label}</span>
            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-title">Top Attackers</div>
        {topAttackers.map((a, i) => (
          <AttackerItem key={i} source={a.source} count={a.count} />
        ))}
      </div>
    </aside>
  );
}

// ─── App — root stateful component, orchestrates everything ─
export function App() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [geoInfo, setGeoInfo] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [, forceUpdate] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [threatData, geo] = await Promise.all([fetchThreatEvents(), fetchGeoInfo()]);
    analyzer.load(threatData);
    setEvents(threatData);
    setGeoInfo(geo);
    setLastUpdated(new Date().toLocaleTimeString('en-IN'));
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleResolve = useCallback(async (id) => {
    await resolveEventAPI(id);
    analyzer.resolveEvent(id);
    forceUpdate(n => n + 1);
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar threatCount={0} geoInfo={null} lastUpdated="--:--" />
        <LoadingState />
      </div>
    );
  }

  const stats = analyzer.stats;
  const timeline = analyzer.timelineData;
  const breakdown = analyzer.severityBreakdown;

  return (
    <div className="dashboard">
      <Navbar threatCount={stats.active} geoInfo={geoInfo} lastUpdated={lastUpdated} />
      <div className="dashboard__body">
        <Sidebar analyzer={analyzer} />
        <main className="dashboard__main">
          <StatsRow stats={stats} />
          <div className="charts-row">
            <TimelineChart timelineData={timeline} />
            <SeverityChart breakdown={breakdown} />
          </div>
          <ThreatTable analyzer={analyzer} onResolve={handleResolve} />
        </main>
      </div>
    </div>
  );
}
