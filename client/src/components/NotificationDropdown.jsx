
import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationItem from "./NotificationItem.jsx";

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();
  const { notifications, unreadCount } = state;

  function handleMarkAllRead() {
    dispatch({ type: "MARK_ALL_READ" });
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        right: 0,
        width: "340px",
        maxWidth: "90vw",
        backgroundColor: "#fff",
        color: "#1f2937",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <strong>Notifications</strong>

        <button
          onClick={onClose}
          aria-label="Close notifications"
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ×
        </button>
      </div>

      {unreadCount > 0 && (
        <div style={{ padding: "10px 16px", textAlign: "right" }}>
          <button
            onClick={handleMarkAllRead}
            style={{
              border: "none",
              background: "none",
              color: "#4f46e5",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            Mark all as read
          </button>
        </div>
      )}

      <div style={{ maxHeight: "360px", overflowY: "auto" }}>
        {notifications.length === 0 ? (
          <p style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
            No notifications yet.
          </p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
}
