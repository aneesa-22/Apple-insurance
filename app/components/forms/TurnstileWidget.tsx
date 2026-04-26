"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

type TurnstileWidgetProps = {
  enabled?: boolean;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
};

export default function TurnstileWidget({
  enabled = true,
  onVerify,
  onExpire,
  onError,
  className = "",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const cleanupWidget = () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Ignore cleanup errors from stale widgets during dev refreshes.
        }
        widgetIdRef.current = null;
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };

    if (!enabled) {
      cleanupWidget();
      return;
    }

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) return;

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current) return;

      cleanupWidget();

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        callback: (token: string) => onVerifyRef.current(token),
        "expired-callback": () => onExpireRef.current?.(),
        "error-callback": () => onErrorRef.current?.(),
      });
    };

    if (window.turnstile) {
      renderWidget();
      return cleanupWidget;
    }

    const existingScript = document.querySelector(
      'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", renderWidget);

      return () => {
        existingScript.removeEventListener("load", renderWidget);
        cleanupWidget();
      };
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      cleanupWidget();
    };
  }, [enabled]);

  return <div ref={containerRef} className={className} />;
}
