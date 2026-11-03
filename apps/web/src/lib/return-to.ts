import "server-only";
import { headers } from "next/headers";
import { RETURN_TO_MAX_LENGTH } from "@seoul/shared";

/**
 * The page a Server Action was submitted from, so checkout can bring the user back to it.
 * The browser sends it as the Referer on same-origin posts. It's only a hint: the API ignores it
 * unless its origin is in WEB_URL, and a missing or odd value just falls back to the main site.
 */
export const currentPageUrl = async () => {
  const referer = (await headers()).get("referer");
  if (!referer || referer.length > RETURN_TO_MAX_LENGTH) return undefined;
  return URL.canParse(referer) ? referer : undefined;
};
