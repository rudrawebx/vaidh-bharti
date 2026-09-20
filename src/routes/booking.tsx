import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/booking")({
  beforeLoad: () => {
    throw redirect({ to: "/book", replace: true });
  },
  component: () => null,
});
