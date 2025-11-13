import React from "react";

export default function TimerTest() {
  const handleClick = async () => {
    console.log("Button clicked");

    if (!("Notification" in window)) {
      alert("Notifications are not supported in this browser.");
      return;
    }

    console.log("Initial permission:", Notification.permission);

    let permission = Notification.permission;
    if (permission !== "granted") {
      permission = await Notification.requestPermission();
      console.log("After request permission:", permission);
    }

    if (permission !== "granted") {
      alert("Notification permission was not granted.");
      return;
    }

    if (!("serviceWorker" in navigator)) {
      console.log("Service worker API not available");
      alert("Service Worker not available.");
      return;
    }

    console.log("Waiting for service worker to be ready...");
    const reg = await navigator.serviceWorker.ready;
    console.log("SW registration object:", reg);

    try {
      await reg.showNotification("Test notification", {
        body: "If you see this, SW notifications work.",
        tag: "demo",
        renotify: true,
      });
      console.log("showNotification() resolved");
    } catch (error) {
      console.error("Error showing notification:", error);
      alert("Failed to show notification");
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <button onClick={handleClick}>Send notification</button>
      <p>:)</p>
    </div>
  );
}
