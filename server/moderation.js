// Counters and blocks are intentionally memory-only and reset with the process.
export function createModeration() {
  const blocks = new Map(); // socket id -> Set of blocked socket ids
  const reports = new Map(); // subject socket id -> count, for this process only
  return {
    isBlocked(a, b) { return Boolean(blocks.get(a)?.has(b) || blocks.get(b)?.has(a)); },
    block(a, b) { if (!blocks.has(a)) blocks.set(a, new Set()); blocks.get(a).add(b); },
    recordReport(subject) { const count = (reports.get(subject) || 0) + 1; reports.set(subject, count); return count; },
    clear(socketId) { blocks.delete(socketId); for (const set of blocks.values()) set.delete(socketId); reports.delete(socketId); },
  };
}
