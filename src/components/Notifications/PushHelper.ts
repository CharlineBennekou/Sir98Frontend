// src/components/Notifications/PushHelper.ts
import type { PushSubscriptionDto } from "../../types/PushSubscriptionDto";
export const VAPID_PUBLIC_KEY =
  "BDVzVxg_Qd8OqCOHLmA4EAxxF_FQ8qAAv-jYmWSfxofkIWe69EZgJFl2lk-U18kbE6s-Jp9j7v-VrT8eEQDTarQ";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);

  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer); // -> Uint8Array<ArrayBuffer>

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}



/**
 * Ensures permission is granted (optionally) and ensures a push subscription exists,
 * then returns the DTO you can send via RTK Query.
 */
export async function subscribeAndBuildDto(options: {
  userId: string;
  requestPermission?: boolean; // default true
}): Promise<PushSubscriptionDto> {
  const { userId, requestPermission = true } = options;

  if (!("serviceWorker" in navigator)) {
    throw new Error("Service workers are not supported in this browser.");
  }

  if (!("PushManager" in window)) {
    throw new Error("Push notifications are not supported in this browser.");
  }

  if (!userId || userId.trim().length === 0) {
    throw new Error("UserId is required (temporary until auth is implemented).");
  }

  if (requestPermission) {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission was not granted.");
    }
  }

  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const json = subscription.toJSON();
  const p256dh = json.keys?.p256dh;
  const auth = json.keys?.auth;

  if (!p256dh || !auth) {
    throw new Error("Failed to get push subscription keys.");
  }

  return {
    userId,
    endpoint: subscription.endpoint,
    p256dh,
    auth,
  };
}

/**
 * Helper for disabling: gets the current subscription (if any).
 * Useful so the component can call the RTKQ delete endpoint.
 */
export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) return null;

  const registration = await navigator.serviceWorker.ready;
  return await registration.pushManager.getSubscription();
}