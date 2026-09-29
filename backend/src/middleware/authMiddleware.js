// Auth Authentication Middleware — validates Firebase ID tokens

import { dbPool } from '../config/database.js';
import { createVerify } from 'crypto';

const FIREBASE_PROJECT_ID = 'interact-ai-89a55';
const GOOGLE_CERT_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let cachedCerts = null;
let certCacheExpiry = 0;

async function getFirebaseCerts() {
  if (cachedCerts && Date.now() < certCacheExpiry) return cachedCerts;

  const res = await fetch(GOOGLE_CERT_URL);
  const maxAge = res.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1] || 3600;
  cachedCerts = await res.json();
  certCacheExpiry = Date.now() + parseInt(maxAge) * 1000;
  return cachedCerts;
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4;
  const fixed = pad ? padded + '='.repeat(4 - pad) : padded;
  return Buffer.from(fixed, 'base64');
}

async function verifyFirebaseToken(idToken) {
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');

  const header = JSON.parse(base64UrlDecode(parts[0]).toString());
  const payload = JSON.parse(base64UrlDecode(parts[1]).toString());

  // Validate claims
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) throw new Error('Token expired');
  if (payload.iat > now + 60) throw new Error('Token issued in the future');
  if (payload.aud !== FIREBASE_PROJECT_ID) throw new Error('Token audience mismatch');
  if (payload.iss !== `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`) throw new Error('Token issuer mismatch');
  if (!payload.sub || payload.sub.length === 0) throw new Error('Token has no subject');

  // Verify signature
  const certs = await getFirebaseCerts();
  const cert = certs[header.kid];
  if (!cert) throw new Error('Unknown key ID');

  const signingInput = `${parts[0]}.${parts[1]}`;
  const signature = base64UrlDecode(parts[2]);

  const verify = createVerify('RSA-SHA256');
  verify.update(signingInput);
  const valid = verify.verify(cert, signature);
  if (!valid) throw new Error('Invalid token signature');

  return payload;
}

export const requireAuth = async (req, res, next) => {
  console.log(`[AUTH] ${req.method} ${req.originalUrl} request received`);
  const authHeader = req.headers.authorization;

  console.log(`[AUTH] Authorization header present: ${!!authHeader}`);
  if (authHeader) {
    console.log(`[AUTH] Authorization scheme: ${authHeader.split(' ')[0] || 'MISSING'}`);
  } else {
    console.log('[AUTH] Authorization scheme: MISSING');
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  console.log(`[AUTH] Bearer token present: ${!!token}`);

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const payload = await verifyFirebaseToken(token);
    console.log(`[AUTH] Firebase token verified: true`);

    const email = payload.email;
    const fullName = payload.name || email?.split('@')[0] || 'User';

    if (!email) {
      return res.status(401).json({ success: false, message: 'Token has no email claim.' });
    }

    // JIT-sync Firebase user into local users table
    let userResult = await dbPool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      userResult = await dbPool.query(
        'INSERT INTO users (full_name, email, role) VALUES ($1, $2, $3) RETURNING *',
        [fullName, email, 'student']
      );
    }

    const appUser = userResult.rows[0];
    console.log(`[AUTH] authenticated user id: ${appUser.id}`);

    req.user = {
      id: appUser.id,
      email: appUser.email,
      role: appUser.role,
      firebase_uid: payload.sub,
    };

    next();
  } catch (error) {
    console.error('[AUTH] Token verification failed:', error.message);
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};
