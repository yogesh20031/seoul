type QueryValue = string | number | undefined | null;

/** Builds `path?…` from the given params, dropping empty ones so filter links stay tidy. */
export const withQuery = (path: string, params: Record<string, QueryValue>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "")
      search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
};

/** Next gives repeated params as arrays; filters only ever use the first value. */
export const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;
