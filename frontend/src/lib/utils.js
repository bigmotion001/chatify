export function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      year: "numeric",
      month: "long",
      day: "2-digit"
    });
  }