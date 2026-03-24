import { ThreatEvent, MalwareEvent } from './ThreatEvent';

// OO JavaScript — Encapsulates all analysis logic
export class ThreatAnalyzer {
  constructor() {
    this._events = [];
    this._filters = { severity: 'all', status: 'all', search: '' };
  }

  load(rawEvents) {
    this._events = rawEvents.map(e =>
      e.type === 'Malware' ? new MalwareEvent(e) : new ThreatEvent(e)
    );
    return this;
  }

  get events() { return [...this._events]; }

  setFilter(key, value) {
    this._filters[key] = value;
    return this;
  }

  get filtered() {
    return this._events.filter(e => {
      const severityOk = this._filters.severity === 'all' || e.severity === this._filters.severity;
      const statusOk = this._filters.status === 'all' || e.status === this._filters.status;
      const searchOk = !this._filters.search ||
        e.type.toLowerCase().includes(this._filters.search.toLowerCase()) ||
        e.source.toLowerCase().includes(this._filters.search.toLowerCase()) ||
        e.target.toLowerCase().includes(this._filters.search.toLowerCase());
      return severityOk && statusOk && searchOk;
    });
  }

  get stats() {
    const all = this._events;
    return {
      total: all.length,
      critical: all.filter(e => e.severity === 'critical').length,
      active: all.filter(e => !e.isResolved()).length,
      resolved: all.filter(e => e.isResolved()).length,
      riskScore: all.reduce((sum, e) => sum + e.score, 0),
    };
  }

  get severityBreakdown() {
    const levels = ['critical', 'high', 'medium', 'low'];
    return levels.map(s => ({
      label: s,
      count: this._events.filter(e => e.severity === s).length,
    }));
  }

  get topAttackers() {
    const map = {};
    this._events.forEach(e => {
      map[e.source] = (map[e.source] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }));
  }

  get timelineData() {
    const hours = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setHours(d.getHours() - (11 - i), 0, 0, 0);
      return d;
    });
    return hours.map(h => ({
      label: h.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      count: this._events.filter(e => {
        const eh = e.timestamp.getHours();
        return eh === h.getHours();
      }).length,
    }));
  }

  resolveEvent(id) {
    const ev = this._events.find(e => e.id === id);
    if (ev) ev.resolve();
    return this;
  }
}
