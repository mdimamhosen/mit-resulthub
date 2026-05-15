import { useOutletContext } from "react-router";
import type { Session } from "../lib/types";

export function usePortalContext() {
  return useOutletContext<{ session: Session }>();
}
