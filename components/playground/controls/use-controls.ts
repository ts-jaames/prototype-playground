"use client";

import { useCallback, useEffect, useState } from "react";

import {
  defaultValues,
  randomValues,
  sanitizeValues,
  type ControlSchema,
  type ControlValues,
} from "./schema";

export type ControlsApi<S extends ControlSchema> = {
  schema: S;
  values: ControlValues<S>;
  set: <K extends keyof S>(key: K, value: ControlValues<S>[K]) => void;
  reset: () => void;
  randomize: () => void;
};

/**
 * Control values persisted to localStorage under `pp:<namespace>:controls`.
 * Renders defaults on the server and first client paint, then loads saved values on mount.
 */
export function useControls<S extends ControlSchema>(namespace: string, schema: S): ControlsApi<S> {
  const storageKey = `pp:${namespace}:controls`;
  const [values, setValues] = useState<ControlValues<S>>(() => defaultValues(schema));
  // Nothing is written until saved values have been read, or defaults would overwrite them.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let saved: unknown = null;
    try {
      const raw = window.localStorage.getItem(storageKey);
      saved = raw ? JSON.parse(raw) : null;
    } catch {
      saved = null;
    }
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage only exists after mount */
    if (saved) setValues(sanitizeValues(schema, saved));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [storageKey, schema]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {
      // Storage full or disabled: controls still work, they just don't persist.
    }
  }, [hydrated, storageKey, values]);

  const set = useCallback<ControlsApi<S>["set"]>(
    (key, value) => setValues((current) => ({ ...current, [key]: value })),
    [],
  );
  const reset = useCallback(() => setValues(defaultValues(schema)), [schema]);
  const randomize = useCallback(
    () => setValues((current) => randomValues(schema, current)),
    [schema],
  );

  return { schema, values, set, reset, randomize };
}
