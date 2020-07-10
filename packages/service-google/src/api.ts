import { get } from "google-translate-open-api/dist/token";

/**
 * Calculate TK token
 * @param tld 'com' or 'cn'
 */
export async function getTK(text: string, tld: string): Promise<string> {
  const { value } = await get(text, { tld });
  return value;
}

/**
 * Fetch series of requests
 */
export async function fetchScheduled<R>(
  requests: Array<() => Promise<R>>,
  concurrent: boolean
): Promise<R> {
  if (concurrent) {
    return new Promise((resolve, reject): void => {
      let rejectCount = 0;
      for (let i = 0; i < requests.length; i++) {
        requests[i]()
          .then(resolve)
          .catch(() => {
            if (++rejectCount === requests.length) {
              reject(new Error("All rejected"));
            }
          });
      }
    });
  } else {
    for (let i = 0; i < requests.length; i++) {
      try {
        return await requests[i]();
      } catch (e) {}
    }

    return Promise.reject(new Error("All rejected"));
  }
}
