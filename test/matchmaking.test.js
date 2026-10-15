import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { io as createClient } from 'socket.io-client';
import { createMatchmaker } from '../server/matchmaking.js';
import { createModeration } from '../server/moderation.js';
import { validProfile } from '../server/validation.js';

const { Server } = createRequire(import.meta.url)('socket.io');

async function setup(options = {}) {
  const http = createServer();
  const io = new Server(http, { cors: { origin: '*' }, transports: ['websocket'] });
  const moderation = createModeration();
  const matcher = createMatchmaker({ io, moderation, maxSearchMs: 180, ...options });
  io.on('connection', (socket) => matcher.attach(socket));
  http.listen(0, '127.0.0.1'); await once(http, 'listening');
  const address = http.address(); const clients = [];
  async function client() {
    const socket = createClient(`http://127.0.0.1:${address.port}`, { transports: ['websocket'], forceNew: true, reconnection: false });
    clients.push(socket); await once(socket, 'connect'); return socket;
  }
  async function close() { clients.forEach((socket) => socket.disconnect()); await new Promise((resolve) => io.close(resolve)); }
  return { client, close, matcher };
}
function waitEvent(socket, event) { return new Promise((resolve, reject) => { const timer = setTimeout(() => reject(new Error(`timeout waiting for ${event}`)), 1200); socket.once(event, (value) => { clearTimeout(timer); resolve(value); }); }); }
function profile(nickname, gender = 'unspecified', preference = 'anyone', extra = {}) { return { nickname, gender, preference, adult: true, terms: true, guidelines: true, ...extra }; }
async function registerUser(socket, data) { const ready = waitEvent(socket, 'session-ready'); socket.emit('register-session', data); return ready; }

test('two independent clients match and messages reach only their active partner', async (t) => {
  const s = await setup(); t.after(s.close);
  const a = await s.client(), b = await s.client(), c = await s.client();
  await Promise.all([registerUser(a, profile('Alpha', 'male')), registerUser(b, profile('Beta', 'female')), registerUser(c, profile('Gamma', 'nonbinary'))]);
  const aMatch = waitEvent(a, 'match-found'), bMatch = waitEvent(b, 'match-found');
  a.emit('find-stranger'); b.emit('find-stranger');
  assert.equal((await aMatch).nickname, 'Beta'); assert.equal((await bMatch).nickname, 'Alpha');
  const received = waitEvent(b, 'message-received'); a.emit('send-message', { message: 'hello' });
  assert.equal((await received).message, 'hello');
  c.emit('send-message', { message: 'unauthorized' });
  assert.equal((await waitEvent(c, 'application-error')).code, 'NOT_IN_CHAT');
});

test('mutual gender preferences control matching and queue does not self-match', async (t) => {
  const s = await setup(); t.after(s.close);
  const a = await s.client(), b = await s.client(), c = await s.client();
  await Promise.all([registerUser(a, profile('Alpha', 'male', 'women')), registerUser(b, profile('Beta', 'male', 'anyone')), registerUser(c, profile('Gamma', 'female', 'men'))]);
  a.emit('find-stranger'); a.emit('find-stranger');
  await new Promise((r) => setTimeout(r, 25)); assert.equal(s.matcher.queue.length, 1);
  b.emit('find-stranger');
  const aMatch = waitEvent(a, 'match-found'), cMatch = waitEvent(c, 'match-found'); c.emit('find-stranger');
  assert.equal((await aMatch).nickname, 'Gamma'); assert.equal((await cMatch).nickname, 'Alpha');
});

test('invalid profile, underage, and missing acceptance cannot register', async (t) => {
  const s = await setup(); t.after(s.close); const a = await s.client();
  const error = waitEvent(a, 'application-error'); a.emit('register-session', profile('x')); assert.equal((await error).code, 'INVALID_PROFILE');
  const missingGender = waitEvent(a, 'application-error'); a.emit('register-session', profile('Valid', '', 'anyone')); assert.equal((await missingGender).code, 'INVALID_PROFILE');
  const error2 = waitEvent(a, 'application-error'); a.emit('register-session', profile('Age', 'male', 'anyone', { adult: false })); assert.equal((await error2).code, 'INVALID_PROFILE');
});

test('duplicate matchmaking requests do not duplicate queue entries', async (t) => {
  assert.ok(validProfile(profile('AA', 'male')));
  const s = await setup(); t.after(s.close); const a = await s.client(); await registerUser(a, profile('Alpha', 'male'));
  a.emit('find-stranger'); a.emit('find-stranger'); await new Promise((r) => setTimeout(r, 20));
  assert.equal(s.matcher.queue.filter((id) => id === a.id).length, 1);
});

test('invalid and prohibited messages are rejected', async (t) => {
  const s = await setup(); t.after(s.close); const a = await s.client(), b = await s.client();
  await Promise.all([registerUser(a, profile('Alpha', 'male')), registerUser(b, profile('Beta', 'female'))]);
  const am = waitEvent(a, 'match-found'), bm = waitEvent(b, 'match-found'); a.emit('find-stranger'); b.emit('find-stranger'); await Promise.all([am, bm]);
  a.emit('send-message', { message: ' '.repeat(3) }); assert.equal((await waitEvent(a, 'application-error')).code, 'INVALID_MESSAGE');
  a.emit('send-message', { message: 'Please send me nudes' }); assert.equal((await waitEvent(a, 'application-error')).code, 'CONTENT_BLOCKED');
});

test('skip ends old session, block prevents pair rematch, and disconnect cleans queue', async (t) => {
  const s = await setup(); t.after(s.close); const a = await s.client(), b = await s.client();
  await Promise.all([registerUser(a, profile('Alpha', 'male')), registerUser(b, profile('Beta', 'female'))]);
  const am = waitEvent(a, 'match-found'), bm = waitEvent(b, 'match-found'); a.emit('find-stranger'); b.emit('find-stranger'); await Promise.all([am, bm]);
  const session = s.matcher.sessions.get(s.matcher.users.get(a.id).sessionId);
  const skipper = session.a === a.id ? a : b;
  const partner = skipper === a ? b : a;
  const disconnected = waitEvent(partner, 'partner-disconnected'); skipper.emit('skip-stranger'); await disconnected;
  await new Promise((r) => setTimeout(r, 20)); assert.equal(s.matcher.queue.includes(skipper.id), true);
  skipper.emit('cancel-search'); await new Promise((r) => setTimeout(r, 20));
  const am2 = waitEvent(a, 'match-found'), bm2 = waitEvent(b, 'match-found'); a.emit('find-stranger'); b.emit('find-stranger'); await Promise.all([am2, bm2]);
  a.emit('block-user'); await waitEvent(a, 'user-blocked');
  a.emit('find-stranger'); b.emit('find-stranger'); await new Promise((r) => setTimeout(r, 25));
  assert.equal(s.matcher.queue.includes(a.id), true); assert.equal(s.matcher.queue.includes(b.id), true);
  b.disconnect(); await new Promise((r) => setTimeout(r, 25)); assert.equal(s.matcher.users.has(b.id), false);
});

test('report is accepted and matchmaking rate limit is enforced', async (t) => {
  const s = await setup(); t.after(s.close); const a = await s.client(), b = await s.client();
  await Promise.all([registerUser(a, profile('Alpha', 'male')), registerUser(b, profile('Beta', 'female'))]);
  const am = waitEvent(a, 'match-found'), bm = waitEvent(b, 'match-found'); a.emit('find-stranger'); b.emit('find-stranger'); await Promise.all([am, bm]);
  a.emit('report-user', { reason: 'Other', details: 'Concern' }); assert.match((await waitEvent(a, 'report-submitted')).message, /मेमोरी/);
  a.emit('end-chat'); await new Promise((r) => setTimeout(r, 20));
  for (let i = 0; i < 5; i++) {
    a.emit('find-stranger');
    if (i < 4) { await new Promise((r) => setTimeout(r, 15)); a.emit('cancel-search'); await new Promise((r) => setTimeout(r, 5)); }
  }
  await new Promise((r) => setTimeout(r, 20));
  const limited = waitEvent(a, 'application-error'); a.emit('find-stranger'); assert.equal((await limited).code, 'RATE_LIMIT');
});


