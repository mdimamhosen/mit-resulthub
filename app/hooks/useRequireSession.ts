import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getSession, refreshSession } from "../lib/auth";
import { ensureDbInitialized } from "../lib/init";
import type { Session } from "../lib/types";

export function useRequireSession() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    ensureDbInitialized()
      .then(() => refreshSession())
      .then((s) => {
        if (cancelled) return;
        if (!s) {
          navigate("/", { replace: true });
          return;
        }
        setSession(s);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return { session, loading };
}
