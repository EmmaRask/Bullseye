import { useEffect } from "react";

export function useIdentityToken(): void {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("identity_token");

    if (!token) return;

    localStorage.setItem("identity_token", token);

    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);
}