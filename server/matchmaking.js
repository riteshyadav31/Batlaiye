import { compatible, validProfile, validReport } from './validation.js';

export function createMatchmaker({ io, moderation, now = Date.now, maxSearchMs = 45000, onReport = () => {} }) {
  const users = new Map(); // socket id -> { profile, state, sessionId, timer }
  const queue = [];
  const sessions = new Map();

  function removeFromQueue(id) {
    for (let i = queue.length - 1; i >= 0; i--) if (queue[i] === id) queue.splice(i, 1);
  }
  function emitError(socket, code, message) { socket.emit('application-error', { code, message }); }
  function clearSession(sessionId, { notifyPartner = true, message = 'Your partner disconnected.', departingId = null } = {}) {
    const session = sessions.get(sessionId);
    if (!session) return;
    sessions.delete(sessionId);
    for (const member of [session.a, session.b]) {
      const user = users.get(member);
      if (user) { user.state = 'idle'; user.sessionId = null; }
    }
    const otherId = departingId === session.a ? session.b : session.a;
    if (notifyPartner && users.has(otherId)) io.to(otherId).emit('partner-disconnected', { message });
  }
  function startSession(a, b) {
    const id = `${a}:${b}:${now()}`;
    const ua = users.get(a), ub = users.get(b);
    if (!ua || !ub || ua.state !== 'waiting' || ub.state !== 'waiting') return false;
    removeFromQueue(a); removeFromQueue(b);
    ua.state = ub.state = 'chat'; ua.sessionId = ub.sessionId = id;
    const session = { id, a, b, startedAt: now() };
    sessions.set(id, session);
    io.to(a).emit('match-found', { nickname: ub.profile.nickname });
    io.to(b).emit('match-found', { nickname: ua.profile.nickname });
    return true;
  }
  function findMatch(id) {
    const user = users.get(id);
    if (!user || user.state !== 'waiting') return false;
    for (const candidateId of [...queue]) {
      if (candidateId === id) continue;
      const candidate = users.get(candidateId);
      if (!candidate || candidate.state !== 'waiting') { removeFromQueue(candidateId); continue; }
      if (!moderation.isBlocked(id, candidateId) && compatible(user.profile, candidate.profile)) return startSession(id, candidateId);
    }
    return false;
  }
  function search(socket) {
    const user = users.get(socket.id);
    if (!user) return emitError(socket, 'SESSION_REQUIRED', 'Please complete the start form first.');
    if (user.state === 'chat') return emitError(socket, 'ALREADY_IN_CHAT', 'End your current chat before searching.');
    if (user.state === 'waiting') { findMatch(socket.id); return; }
    user.state = 'waiting';
    user.timer = setTimeout(() => {
      if (user.state !== 'waiting') return;
      removeFromQueue(socket.id); user.state = 'idle'; user.timer = null;
      socket.emit('search-timeout', { message: 'समय पर आपकी पसंद से मेल खाने वाला कोई व्यक्ति नहीं जुड़ा। जब अधिक लोग ऑनलाइन हों, तब फिर कोशिश करें।' });
    }, maxSearchMs);
    user.timer.unref?.();
    queue.push(socket.id);
    socket.emit('searching', { message: 'Finding someone to chat with…' });
    if (findMatch(socket.id)) {
      const session = sessions.get(users.get(socket.id).sessionId);
      if (session) for (const member of [session.a, session.b]) {
        const matched = users.get(member);
        if (matched?.timer) { clearTimeout(matched.timer); matched.timer = null; }
      }
    }
  }
  function end(socket, reason = 'Chat ended.') {
    const user = users.get(socket.id);
    if (!user) return;
    if (user.state === 'waiting') { removeFromQueue(socket.id); if (user.timer) clearTimeout(user.timer); user.timer = null; user.state = 'idle'; socket.emit('search-cancelled', {}); return; }
    if (user.sessionId) clearSession(user.sessionId, { message: reason, departingId: socket.id });
    socket.emit('chat-ended', { message: reason });
  }
  function disconnect(socket) {
    const user = users.get(socket.id);
    if (!user) return;
    if (user.timer) clearTimeout(user.timer);
    removeFromQueue(socket.id);
    if (user.sessionId) clearSession(user.sessionId, { departingId: socket.id });
    users.delete(socket.id);
    moderation.clear(socket.id);
  }
  function sendMessage(socket, raw) {
    const user = users.get(socket.id), message = raw?.message;
    if (!user || user.state !== 'chat' || !user.sessionId) return emitError(socket, 'NOT_IN_CHAT', 'You are not in an active chat.');
    const session = sessions.get(user.sessionId);
    const recipient = session && (session.a === socket.id ? session.b : session.a);
    if (!session || !users.has(recipient) || users.get(recipient).sessionId !== session.id) return emitError(socket, 'STALE_SESSION', 'This chat has ended. Find another stranger.');
    if (typeof message !== 'string' || !message.trim() || message.length > 1000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/.test(message)) return emitError(socket, 'INVALID_MESSAGE', 'Messages must be 1–1,000 characters and contain no control characters.');
    if (user.messageTimes.filter((t) => now() - t < 10000).length >= 12) return emitError(socket, 'RATE_LIMIT', 'Slow down and try again in a moment.');
    user.messageTimes = user.messageTimes.filter((t) => now() - t < 10000); user.messageTimes.push(now());
    const text = message.trim();
    if (OBVIOUS_PROHIBITED.some((pattern) => pattern.test(text))) return emitError(socket, 'CONTENT_BLOCKED', 'That message appears to violate our rules and was not sent.');
    io.to(recipient).emit('message-received', { message: text, nickname: user.profile.nickname, timestamp: now() });
    socket.emit('message-sent', { message: text, timestamp: now() });
  }
  const OBVIOUS_PROHIBITED = [/\b(?:send|show|share)\s+(?:me\s+)?(?:nudes?|naked pics?|explicit pics?)\b/i, /\b(?:child porn|underage sex|rape threats?)\b/i];

  function attach(socket) {
    socket.on('register-session', (profile) => {
      const existing = users.get(socket.id);
      if (existing) return emitError(socket, 'ALREADY_REGISTERED', 'This connection already has a session.');
      const clean = validProfile(profile);
      if (!clean) return emitError(socket, 'INVALID_PROFILE', '2–24 अक्षरों का उपनाम चुनें, अपनी पसंद बताएँ, 18+ होने की पुष्टि करें और दोनों नीतियाँ स्वीकार करें।');
      users.set(socket.id, { profile: clean, state: 'idle', sessionId: null, timer: null, messageTimes: [], searchTimes: [] });
      socket.emit('session-ready', {});
    });
    socket.on('find-stranger', () => {
      const user = users.get(socket.id);
      if (!user) return emitError(socket, 'SESSION_REQUIRED', 'पहले शुरुआत वाला फ़ॉर्म पूरा करें।');
      user.searchTimes = user.searchTimes.filter((t) => now() - t < 60000);
      if (user.state === 'waiting' || user.state === 'chat') return search(socket);
      if (user.searchTimes.length >= 5) return emitError(socket, 'RATE_LIMIT', 'बहुत अधिक खोजें की गई हैं। कृपया एक मिनट इंतज़ार करें।');
      user.searchTimes.push(now());
      search(socket);
    });
    socket.on('cancel-search', () => end(socket, 'Search cancelled.'));
    socket.on('send-message', (payload) => sendMessage(socket, payload));
    socket.on('skip-stranger', () => { end(socket, 'Your partner moved on.'); search(socket); });
    socket.on('end-chat', () => end(socket));
    socket.on('report-user', (payload) => {
      const user = users.get(socket.id);
      const session = user?.sessionId && sessions.get(user.sessionId);
      if (!session) return emitError(socket, 'NOT_IN_CHAT', 'आप किसी सक्रिय चैट में नहीं हैं।');
      const report = validReport(payload);
      if (!report) return emitError(socket, 'INVALID_REPORT', 'कारण चुनें और विवरण 300 अक्षरों से कम रखें।');
      user.reportTimes = (user.reportTimes || []).filter((t) => now() - t < 60000);
      if (user.reportTimes.length >= 3) return emitError(socket, 'RATE_LIMIT', 'बहुत अधिक रिपोर्ट की गई हैं। कृपया फिर रिपोर्ट करने से पहले इंतज़ार करें।');
      user.reportTimes.push(now());
      const subject = session.a === socket.id ? session.b : session.a;
      const count = moderation.recordReport(subject); onReport({ reason: report.reason });
      socket.emit('report-submitted', { message: 'धन्यवाद। यह रिपोर्ट केवल मेमोरी में रखी जाती है और सर्वर रीस्टार्ट होने पर मिट जाएगी।' });
      if (count >= 3) { io.to(subject).emit('chat-ended', { message: 'कई रिपोर्ट मिलने के बाद यह चैट समाप्त कर दी गई।' }); clearSession(user.sessionId, { notifyPartner: false }); }
    });
    socket.on('block-user', () => {
      const user = users.get(socket.id), session = user?.sessionId && sessions.get(user.sessionId);
      if (!session) return emitError(socket, 'NOT_IN_CHAT', 'आप किसी सक्रिय चैट में नहीं हैं।');
      const partner = session.a === socket.id ? session.b : session.a;
      moderation.block(socket.id, partner); clearSession(user.sessionId, { message: 'Your partner ended this chat.', departingId: socket.id });
      socket.emit('user-blocked', { message: 'इस सर्वर सत्र के लिए ब्लॉक कर दिया गया।' });
    });
    socket.on('disconnect', () => disconnect(socket));
  }
  return { attach, users, queue, sessions, disconnect };
}
