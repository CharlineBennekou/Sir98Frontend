// src/components/Notifications/PushHelper.ts
export const VAPID_PUBLIC_KEY =
  "BDVzVxg_Qd8OqCOHLmA4EAxxF_FQ8qAAv-jYmWSfxofkIWe69EZgJFl2lk-U18kbE6s-Jp9j7v-VrT8eEQDTarQ";

// Convert base64 URL-safe string to Uint8Array (needed by pushManager.subscribe)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export type PushSubscriptionDto = {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

/**
 * Ensures permission is granted (optionally), ensures a push subscription exists,
 * and POSTs it to your backend endpoint (addtotest).
 */
export async function subscribeAndSendToBackend(options: {
  userId: string;
  apiUrl: string; 
  requestPermission?: boolean; // default true
}): Promise<void> {
  const { userId, apiUrl, requestPermission = true } = options;

  if (!("serviceWorker" in navigator)) {
    alert("Service workers are not supported in this browser.");
    return;
  }

  if (!("PushManager" in window)) {
    alert("Push notifications are not supported in this browser.");
    return;
  }

  if (!userId || userId.trim().length === 0) {
    alert("UserId (email) is required (temporary until auth is implemented).");
    return;
  }

  // 1) Permission (only if requested)
  if (requestPermission) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      alert("Notification permission was not granted.");
      return;
    }
  }

  // 2) Wait for the service worker that vite-plugin-pwa registered
  const registration = await navigator.serviceWorker.ready;
  console.log("SW ready for push:", registration);

  // 3) Reuse existing subscription if present, otherwise subscribe
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  console.log("Push subscription:", subscription);

  // 4) Build payload expected by your C# backend (PushSubscriptionDto)
  // Use subscription.toJSON() so we get keys in the standard string form.
  const json = subscription.toJSON();
  const p256dh = json.keys?.p256dh;
  const auth = json.keys?.auth;

  if (!p256dh || !auth) {
    console.error("Failed to get keys from subscription JSON", json);
    alert("Failed to get push subscription keys.");
    return;
  }

  const body: PushSubscriptionDto = {
    userId,
    endpoint: subscription.endpoint,
    p256dh,
    auth,
  };

  console.log("Payload to send to backend:", body);

  // 5) Send to your API
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to send subscription", text);
    alert("Failed to send subscription to server.");
    return;
  }

  alert("Subscription registered on server!");
}
