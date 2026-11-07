
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export function useSSE(url, onMessage) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const controller = new AbortController();
    const token = localStorage.getItem("tb_token");

    if (!token) {
      console.error("[useSSE] Authentication token missing");
      return;
    }

    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

    const streamURL = url.startsWith("http")
      ? url
      : `${baseURL}${url}`;

    async function connect() {
      try {
        const response = await fetch(streamURL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`SSE connection failed: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("SSE response body is unavailable");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          buffer = buffer.replace(/\r\n/g, "\n");

          const events = buffer.split("\n\n");
          buffer = events.pop() || "";

          for (const event of events) {
            const dataLines = event
              .split("\n")
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trim());

            if (dataLines.length > 0) {
              try {
                onMessage(JSON.parse(dataLines.join("\n")));
              } catch (error) {
                console.error("[useSSE] Parse error:", error);
              }
            }
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("[useSSE] Connection error:", error);
        }
      }
    }

    connect();

    return () => {
      controller.abort();
    };
  }, [url, user, onMessage]);
}
