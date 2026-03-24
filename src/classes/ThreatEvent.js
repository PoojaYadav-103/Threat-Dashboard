// OO JavaScript — Encapsulates threat event data and behavior
export class ThreatEvent {
  constructor({ id, type, severity, source, target, timestamp, description, country, status }) {
    this.id = id;
    this.type = type;
    this.severity = severity;
    this.source = source;
    this.target = target;
    this.timestamp = new Date(timestamp);
    this.description = description;
    this.country = country;
    this.status = status || 'active';
    this._score = this._computeScore();
  }

  _computeScore() {
    const weights = { critical: 100, high: 75, medium: 45, low: 20 };
    return weights[this.severity] || 0;
  }

  get score() { return this._score; }

  get formattedTime() {
    return this.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  get ageMinutes() {
    return Math.floor((Date.now() - this.timestamp.getTime()) / 60000);
  }

  get severityColor() {
    const map = { critical: '#ff2d55', high: '#ff6b35', medium: '#ffd60a', low: '#30d158' };
    return map[this.severity] || '#8e8e93';
  }

  isCritical() { return this.severity === 'critical'; }
  isResolved() { return this.status === 'resolved'; }

  resolve() {
    this.status = 'resolved';
    return this;
  }

  toSummary() {
    return `[${this.severity.toUpperCase()}] ${this.type} from ${this.source} → ${this.target}`;
  }
}

// Inheritance — specialized subclass
export class MalwareEvent extends ThreatEvent {
  constructor(data) {
    super({ ...data, type: 'Malware' });
    this.malwareFamily = data.malwareFamily || 'Unknown';
    this.hash = data.hash || '';
  }

  get ioc() {
    return `SHA256:${this.hash.substring(0, 16)}...`;
  }

  toSummary() {
    return `${super.toSummary()} | Family: ${this.malwareFamily}`;
  }
}
