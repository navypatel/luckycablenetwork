type RetryOptions = { attempts?: number; baseDelayMs?: number; sleep?: (milliseconds: number) => Promise<void> };
const transientNames = new Set(["MongoServerSelectionError", "MongoNetworkError", "MongoNetworkTimeoutError", "MongoTopologyClosedError"]);
const transientCodes = new Set([6, 7, 89, 91, 189, 262, 9001]);

export function isTransientMongoError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { name?: string; code?: number; errorLabels?: string[] };
  return Boolean(candidate.name && transientNames.has(candidate.name)) || Boolean(candidate.code && transientCodes.has(candidate.code)) || candidate.errorLabels?.includes("RetryableWriteError") === true;
}

export async function retryTransient<T>(operation: () => Promise<T>, options: RetryOptions = {}) {
  const attempts = Math.max(1, options.attempts ?? 3); const baseDelayMs = Math.max(0, options.baseDelayMs ?? 250); const sleep = options.sleep ?? (milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds)));
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try { return await operation(); } catch (error) { if (attempt === attempts || !isTransientMongoError(error)) throw error; await sleep(baseDelayMs * 2 ** (attempt - 1)); }
  }
  throw new Error("Unreachable retry state");
}
