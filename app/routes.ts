import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "routes/signup.tsx"),
  route("portal", "routes/portal.tsx", [
    index("routes/portal._index.tsx"),
    route("assignments", "routes/portal.assignments.tsx"),
    route("grades", "routes/portal.grades.tsx"),
    route("courses", "routes/portal.courses.tsx"),
    route("schedule", "routes/portal.schedule.tsx"),
    route("notices", "routes/portal.notices.tsx"),
  ]),
] satisfies RouteConfig;
