import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store";

export function useCartSync() {
  const session = useSession();
  const mergeAndSync = useCartStore((s) => s.mergeAndSync);
  const hasLoadedRef = useRef(false);

  // Safe access to session data
  const status = session?.status || "loading";
  const userEmail = session?.data?.user?.email;

  useEffect(() => {
    // When user logs in, merge local cart with DB cart
    if (status === "authenticated" && userEmail && !hasLoadedRef.current) {
      console.log("[useCartSync] User authenticated, merging cart with DB");
      hasLoadedRef.current = true;
      mergeAndSync();
    }

    // Reset flag when user logs out (but don't clear local cart - keep it for next login)
    if (status === "unauthenticated" && hasLoadedRef.current) {
      console.log("[useCartSync] User logged out");
      hasLoadedRef.current = false;
    }
  }, [status, userEmail, mergeAndSync]);

  // Reload cart when tab becomes visible or window gains focus
  useEffect(() => {
    if (status !== "authenticated") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("[useCartSync] Tab visible, syncing cart");
        mergeAndSync();
      }
    };

    const handleFocus = () => {
      console.log("[useCartSync] Window focused, syncing cart");
      mergeAndSync();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [status, mergeAndSync]);
}
