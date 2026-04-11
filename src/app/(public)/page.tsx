// This route group segment intentionally has no homepage —
// the "/" route is served by app/page.tsx.
// Next.js may warn about duplicate routes; if so, delete this file.
import { redirect } from "next/navigation";

export default function PublicGroupRoot() {
  redirect("/tutors");
}
