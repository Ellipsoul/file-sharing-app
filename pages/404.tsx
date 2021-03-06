import { useEffect } from "react";
import { useRouter } from "next/router";

// This 404 page routes back to the app if user attempts to access a page that doesn't exist
export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/app");
  });
  return null;
}
