import express from 'express';
import helmet from 'helmet';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createMatchmaker } from './matchmaking.js';
import { createModeration } from './moderation.js';

const app = express();
const httpServer = createServer(app);
const { Server } = createRequire(import.meta.url)('socket.io');
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3000;
const inheritedServerHandle = process.env.BATLAIYE_SERVER_HANDLE;
const origin = process.env.APP_ORIGIN?.trim();
    if (isProduction && !origin) throw new Error('APP_ORIGIN must be set in production.');
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);

app.disable('x-powered-by');
app.use(helmet({ crossOriginEmbedderPolicy: false, contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"], styleSrc: ["'self'", "'unsafe-inline'"], connectSrc: ["'self'", 'ws:', 'wss:'], imgSrc: ["'self'", 'data:'], objectSrc: ["'none'"], upgradeInsecureRequests: isProduction ? [] : null } } }));
app.use(express.json({ limit: '10kb' }));
app.get('/healthz', (_req, res) => res.json({ ok: true }));

const io = new Server(httpServer, {
  cors: isProduction ? { origin, methods: ['GET', 'POST'] } : { origin: true },
  maxHttpBufferSize: 16_384,
  pingInterval: 25_000,
  pingTimeout: 20_000,
  connectTimeout: 10_000,
  allowRequest: (req, callback) => {
    const requestOrigin = req.headers.origin;
    // Same-origin browser clients are expected. Origin is not authentication.
    callback(null, !isProduction || !requestOrigin || requestOrigin === origin);
  },
});
const moderation = createModeration();
const matcher = createMatchmaker({ io, moderation, onReport: () => {} });
io.on('connection', (socket) => matcher.attach(socket));

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '../dist');
app.use(express.static(dist, { index: false, maxAge: isProduction ? '1h' : 0 }));
app.get('*', (req, res) => {
  if (req.path.startsWith('/socket.io')) return res.sendStatus(404);
  res.sendFile(path.join(dist, 'index.html'));
});

const onListening = () => {
  // Do not log request, socket, IP, or message data.
  const address = httpServer.address();
  console.log(`batlaiye listening on port ${typeof address === 'object' ? address.port : port}`);
};
if (inheritedServerHandle) httpServer.listen({ fd: Number(inheritedServerHandle) }, onListening);
else httpServer.listen(port, '0.0.0.0', onListening);

function shutdown() {
  io.close();
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
