import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store";

export function useCartSync() {
  const session = useSession();
  const loadFromDB = useCartStore((s) => s.loadFromDB);
  const clearCart = useCartStore((s) => s.clearCart);
  const hasLoadedRef = useRef(false);

  // Safe access to session data
  const status = session?.status || "loading";
  const userEmail = session?.data?.user?.email;

  useEffect(() => {
    // Only load once when user first logs in
    if (status === "authenticated" && userEmail && !hasLoadedRef.current) {
      console.log("[useCartSync] User authenticated, loading cart from DB");
      hasLoadedRef.current = true;
      loadFromDB();
    }

    // Reset cart when user logs out
    if (status === "unauthenticated" && hasLoadedRef.current) {
      console.log("[useCartSync] User logged out, clearing cart");
      hasLoadedRef.current = false;
      clearCart();
    }
  }, [status, userEmail, loadFromDB, clearCart]);

  // Reload cart when tab becomes visible or window gains focus
  useEffect(() => {
    if (status !== "authenticated") return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("[useCartSync] Tab visible, reloading cart");
        loadFromDB();
      }
    };

    const handleFocus = () => {
      console.log("[useCartSync] Window focused, reloading cart");
      loadFromDB();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [status, loadFromDB]);
}
