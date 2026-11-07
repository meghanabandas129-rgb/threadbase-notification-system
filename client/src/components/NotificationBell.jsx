
import { useState, useRef, useEffect } from "react";
import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";

export default function NotificationBell() {
  const { state } = useNotifications();
  const { unreadCount } = state;

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        onClick={() => setOpen((previous) => !previous)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.3rem",
          color: "#fff",
          position: "relative",
        }}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
      >
        {"\u{1F514}"}

        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-8px",
              right: "-10px",
              backgroundColor: "#ef4444",
              color: "#fff",
              borderRadius: "999px",
              minWidth: "18px",
              height: "18px",
              padding: "0 4px",
              fontSize: "11px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
