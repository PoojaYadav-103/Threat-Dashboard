import axios from 'axios';

// REST API Integration — wraps a public threat feed API
// Uses JSONPlaceholder-style mock + real IP geolocation API
const BASE_URL = 'https://jsonplaceholder.typicode.com';

// Real public API for IP data (no key needed)
const GEO_URL = 'https://ipapi.co';

const THREAT_TYPES = ['SQL Injection', 'XSS', 'Malware', 'Phishing', 'DDoS', 'Brute Force', 'CSRF', 'SSRF', 'RCE', 'Data Exfiltration'];
const SEVERITIES = ['critical', 'high', 'medium', 'low'];
const COUNTRIES = ['Russia', 'China', 'USA', 'Brazil', 'India', 'Germany', 'Iran', 'North Korea', 'Ukraine', 'Romania'];
const TARGETS = ['api.cloudsek.com', 'db.internal', 'auth-service', 'payment-gateway', 'cdn.assets', 's3-backup', 'admin-portal'];
const SOURCES = ['45.134.21.9', '103.79.78.10', '91.108.4.5', '185.220.101.1', '194.165.16.4', '62.233.57.1'];
const MALWARE_FAMILIES = ['Cobalt Strike', 'Emotet', 'TrickBot', 'BlackMatter', 'REvil', 'LockBit'];

function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomHoursAgo(max) {
  const d = new Date();
  d.setMinutes(d.getMinutes() - Math.floor(Math.random() * max * 60));
  return d.toISOString();
}

// Simulate a REST API call — fetches "posts" from JSONPlaceholder
// and transforms them into threat event objects (realistic mock pattern)
export async function fetchThreatEvents() {
  const { data } = await axios.get(`${BASE_URL}/posts?_limit=20`);

  return data.map((post, i) => {
    const type = THREAT_TYPES[i % THREAT_TYPES.length];
    const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
    return {
      id: post.id,
      type,
      severity,
      source: randomItem(SOURCES),
      target: randomItem(TARGETS),
      timestamp: randomHoursAgo(12),
      description: post.title.substring(0, 60) + '...',
      country: randomItem(COUNTRIES),
      status: Math.random() > 0.4 ? 'active' : 'resolved',
      malwareFamily: type === 'Malware' ? randomItem(MALWARE_FAMILIES) : undefined,
      hash: type === 'Malware' ? Math.random().toString(36).substring(2, 34) : undefined,
    };
  });
}

// Real REST API call — fetches current IP geolocation
export async function fetchGeoInfo() {
  try {
    const { data } = await axios.get(`${GEO_URL}/json/`);
    return { city: data.city, country: data.country_name, org: data.org };
  } catch {
    return { city: 'Kolkata', country: 'India', org: 'IIEST Network' };
  }
}

// Simulates a PATCH REST call to resolve a threat
export async function resolveEventAPI(id) {
  const { data } = await axios.patch(`${BASE_URL}/posts/${id}`, { status: 'resolved' });
  return data;
}
