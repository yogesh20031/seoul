import { notFound } from "next/navigation";

// Unknown paths under a locale land here so they get the localized 404 inside the site layout,
// instead of falling through to the bare root layout (which has no <html>).
export default function CatchAllPage() {
  notFound();
}
