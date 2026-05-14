import dns from 'dns';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

// Node.js v24 undici (built-in fetch) + Happy Eyeballs bug: when a hostname
// resolves to both IPv4 and IPv6 and IPv6 is unreachable, all connections fail.
// Forcing IPv4-only DNS lookups avoids this. Safe in any IPv4-capable environment.
const _origLookup = dns.lookup.bind(dns);
dns.lookup = (hostname, options, cb) => {
  if (typeof options === 'function') { cb = options; options = {}; }
  if (typeof options === 'number') options = { family: options };
  if (!options.family) options = { ...options, family: 4 };
  return _origLookup(hostname, options, cb);
};

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = postgres(process.env.DATABASE_URL);

export default sql;
