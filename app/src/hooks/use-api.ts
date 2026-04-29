/**
 * Static-build stub of the original DB-backed `useApi` hook.
 *
 * In the original project this hook fetched dynamic content from a PHP/MySQL
 * backend exposed under `/api/content/...`. The static build removes that
 * backend, so this hook now returns `null` immediately and every section
 * falls back to its hardcoded DEFAULT_* data.
 */

import { useState } from 'react';

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(_endpoint: string, _options: UseApiOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  return {
    data,
    loading: false,
    error: null as string | null,
    refetch: async () => {},
    setData,
  };
}
