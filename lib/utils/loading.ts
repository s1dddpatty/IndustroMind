export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function withMinimumLoadingTime<T>(promise: Promise<T>, minMs: number = 500): Promise<T> {
  const start = Date.now();
  return promise.then(async (result) => {
    const elapsed = Date.now() - start;
    if (elapsed < minMs) {
      await delay(minMs - elapsed);
    }
    return result;
  });
}
