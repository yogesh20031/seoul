import Link from "next/link";

// Only reached for paths outside /[locale] that the proxy didn't redirect. The root layout has
// no <html> of its own, so this page renders a minimal document itself.
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center font-sans">
        <p>
          404 · <Link href="/">SeoulMate</Link>
        </p>
      </body>
    </html>
  );
}
