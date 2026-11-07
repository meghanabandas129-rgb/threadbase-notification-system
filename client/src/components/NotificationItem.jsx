
import { useMutation } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

export default function NotificationItem({ notification }) {
  const { dispatch } = useNotifications();

  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      return apiClient.patch(`/api/notifications/${id}/read`);
    },

    // Update the UI immediately before the API request finishes.
    onMutate: async (id) => {
      dispatch({
        type: "MARK_READ",
        payload: id,
      });
    },

    // If the API request fails, reload the server's notification state.
    onError: async (error) => {
      console.error("Failed to mark notification as read:", error);

      try {
        const response = await apiClient.get("/api/notifications");

        dispatch({
          type: "LOAD_NOTIFICATIONS",
          payload: response.data,
        });
      } catch (reloadError) {
        console.error("Failed to restore notifications:", reloadError);
      }
    },
  });

  const handleClick = () => {
    if (!notification.isRead && !markReadMutation.isPending) {
      markReadMutation.mutate(notification.id);
    }
  };

  const title =
    notification.title ||
    notification.message ||
    notification.body ||
    "New notification";

  const description =
    notification.title
      ? notification.message || notification.body || ""
      : notification.description || "";

  return (
    <div
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${title}${notification.isRead ? ", read" : ", unread"}`}
      style={{
        padding: "14px 16px",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: notification.isRead ? "#fff" : "#eef2ff",
        cursor: notification.isRead ? "default" : "pointer",
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          width: "9px",
          height: "9px",
          minWidth: "9px",
          marginTop: "6px",
          borderRadius: "50%",
          backgroundColor: notification.isRead ? "#d1d5db" : "#4f46e5",
        }}
      />

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: notification.isRead ? "400" : "700",
            fontSize: "14px",
            color: "#1f2937",
          }}
        >
          {title}
        </div>

        {description && (
          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              margin: "5px 0 0",
            }}
          >
            {description}
          </p>
        )}

        {notification.createdAt && (
          <small style={{ color: "#9ca3af" }}>
            {new Date(notification.createdAt).toLocaleString()}
          </small>
        )}
      </div>
    </div>
  );
}
