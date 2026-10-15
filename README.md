# batlaiye — anonymous random chat

## Proposed project structure

```text
batlaiye/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── policies.js
│   └── style.css
├── server/
│   ├── index.js
│   ├── matchmaking.js
│   ├── moderation.js
│   └── validation.js
└── test/
    └── matchmaking.test.js
```

## Implementation plan

1. Build the responsive React entry form, search states, chat UI, moderation controls, and readable policy pages.
2. Serve the Vite production build and Socket.IO from one Express process with Helmet, origin checks, payload caps, and health reporting.
3. Keep user, queue, chat, temporary report, block, and rate-limit state in memory; authorize all actions from the live socket's server-side session.
4. Add isolated multi-client automated tests and a manual launch checklist.
5. Review deployment settings and complete legal/security review before public launch.

## Requirements

- Node.js 20 or newer (use a currently supported Node.js LTS release)
- npm

## Install and run

```sh
npm install
npm run dev
```

Run `npm run dev` from the project root to start both the Express/Socket.IO backend and Vite frontend together. Vite serves the frontend at `http://localhost:5173`; its Socket.IO proxy targets `127.0.0.1:3000`. The launcher waits for the backend `/healthz` endpoint before starting Vite and forces development mode. If using `npm run dev:client` alone, separately start `npm run dev:server` in another terminal. If port 3000 is occupied, stop the other service or set `PORT` before starting. Run `npm test` for the automated server checks. Run `npm run build && npm start` to exercise the single-service production setup locally.

## Socket event contract

| Direction | Event | Payload / behavior |
| --- | --- | --- |
| Client → server | `register-session` | Nickname, required gender identity and chat preference, adult and policy-acceptance booleans; validated server-side. |
| Client → server | `find-stranger` | No payload; rate limited |
| Client → server | `cancel-search` | No payload |
| Client → server | `send-message` | `{ message }`; only forwarded to the active session partner |
| Client → server | `skip-stranger`, `end-chat` | No payload; end the old session before search/idle |
| Client → server | `report-user` | `{ reason, details }`; ephemeral in-memory counter only |
| Client → server | `block-user` | No payload; ends chat and prevents pair rematch for process/session lifetime |
| Server → client | `session-ready`, `searching`, `match-found` | Setup/search/matched peer nickname |
| Server → client | `message-received`, `message-sent` | Plain text and server timestamp; messages are not retained |
| Server → client | `search-cancelled`, `search-timeout`, `partner-disconnected`, `chat-ended` | Lifecycle state |
| Server → client | `report-submitted`, `user-blocked`, `application-error` | Moderation result or consistent error `{ code, message }` |

The client's live socket is the connection identity. A browser refresh creates a new session and cannot restore the old chat. Reconnect uses the existing Socket.IO connection where possible; if the transport reconnects, the old in-memory registration is not recreated automatically, so return to the start page and begin a new session.

## Testing

```sh
npm test
```

Automated tests use multiple independent in-process socket clients against a real Socket.IO server. They cover matching, mutual preferences, session isolation, invalid registration/messages, duplicate search, skip/end, disconnect cleanup, rate limits, report/block, age/acceptance gating, and prohibited-message rejection.

### Manual checklist

- Open two private browser windows, accept the policies and age declaration, and verify both reach chat with the correct partner nicknames.
- Try mismatched preferences in two windows, then mutually compatible preferences; verify only the latter pair matches.
- Send text, multiline text, and a 1,000-character message; confirm plain text rendering and timestamps. Try an oversized message and rapid sends.
- Skip from one client; verify the original partner is released and the skipper enters search. End chat and verify the peer sees disconnect feedback.
- Report, block, then try another search pair; confirm report feedback and that a blocked live pair is not rematched.
- Disconnect a browser while searching and while chatting; confirm the queue/session cleans up and the peer receives feedback.
- Submit invalid nicknames, leave age unchecked, and leave policy acceptance unchecked; matchmaking must not begin.
- At 320px width and desktop width, use keyboard navigation, screen-reader labels, Enter-to-send and Shift+Enter; verify no horizontal overflow and visible safety controls.

## Deploy as one Node.js service (Render example)

1. Push this folder to a Git repository and create one Render **Web Service** using the repository.
2. Use build command `npm install && npm run build` and start command `npm start`.
3. Set `NODE_ENV=production`, `APP_ORIGIN=https://<your-service-hostname>`, and `TRUST_PROXY=1` if the platform terminates TLS at a trusted proxy. The app binds to the provider's `PORT`. Do not put secrets in the frontend; this app does not need any.
4. Confirm HTTPS is enabled at the hosting edge, visit `/healthz`, and test two clients against the deployed origin.
5. Review provider log retention and access controls. The app itself avoids logging request content, socket IDs, IP addresses, and chat messages, but infrastructure logs may still contain IP or connection metadata. Do not enable payload logging.

Free hosting may sleep, restart, or impose connection limits. A restart clears every active user, queue entry, chat, report counter, rate limiter, and temporary block. CORS and Origin checks reduce accidental cross-origin access but are not authentication or a complete defense against malicious clients. IP-based controls are intentionally omitted from this MVP because shared networks and proxy trust complicate fair limits; provider-level connection limits should be configured and tested. Do not trust a self-declared age checkbox as proof of age.

## Known limitations and launch review

- Age is self-declared and not verified. The service must not be presented as verified-adult.
- Automated text rules catch only a narrow set of obvious content. They do not guarantee detection, identify users, inspect images/video, or provide human moderation.
- Reports and blocks are ephemeral; there is no durable moderation workflow or emergency response SLA.
- Socket.IO reconnect does not restore a lost session. The user must start over; messages cannot be recovered.
- Memory-only state is per process. Horizontal scaling requires sticky transport/session strategy and shared state, which this database-free build deliberately does not provide.
- Hosting infrastructure may process or retain IP addresses, connection metadata, and error logs. Review provider terms, region, subprocessors, log retention, incident response, and legal obligations.
- Fill placeholders for legal operator, contact, jurisdiction, and effective date. A qualified lawyer should review age access, privacy disclosures, liability, reporting obligations, governing law, and dispute handling before launch.
- Conduct a real security review, load test, accessibility review, and multi-client staging deployment before describing this as production-ready.

