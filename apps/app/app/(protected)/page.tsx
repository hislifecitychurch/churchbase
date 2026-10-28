import type { JSX } from "react";

// shortcut: this route group is not an auth boundary; add a server-side staff guard before real staff data.
export default function Page(): JSX.Element {
  return <main>Hello world</main>;
}
