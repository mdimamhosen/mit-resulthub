import { PortalShell } from "../components/PortalShell";
import { useRequireSession } from "../hooks/useRequireSession";

export function meta() {
  return [{ title: "Student Portal | Melbourne Institute of Technology" }];
}

export default function PortalLayout() {
  const { session, loading } = useRequireSession();

  if (loading) {
    return <div className="portal-loading">Loading student portal…</div>;
  }

  if (!session) return null;

  return <PortalShell session={session} />;
}
