// src/components/AccountSettings/NotificationSettings.tsx
import React from "react";
import { subscribeAndSendToBackend } from "../Notifications/PushHelper";

type NotificationSettingsProps = {
  userId: string;
  apiUrl?: string;
};

type NotificationStatus =
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

export default function NotificationSettings({
  userId, //Given by parent component
  apiUrl = "https://localhost:7275/api/PushSubscription/addtotest",
}: NotificationSettingsProps) {
  const [isWorking, setIsWorking] = React.useState(false);
  const [status, setStatus] = React.useState<NotificationStatus>("default");

  // Determine current notification status on mount
  React.useEffect(() => {
    if (!("Notification" in window)) {
      setStatus("unsupported");
      return;
    }

    setStatus(Notification.permission as NotificationStatus);
  }, []);

  const enableNotifications = async () => {
    try {
      setIsWorking(true);

      if (!("Notification" in window)) {
        setStatus("unsupported");
        return;
      }

      await subscribeAndSendToBackend({
        userId,
        apiUrl,
        requestPermission: true,
      });

      setStatus("granted");
    } finally {
      setIsWorking(false);
    }
  };

  const disableNotifications = async () => {
    try {
      setIsWorking(true);

      if (!("serviceWorker" in navigator)) return;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
      }

      setStatus("default");
      alert("Notifikationer er slået fra på denne enhed.");
    } finally {
      setIsWorking(false);
    }
  };

  const renderStatusText = () => {
    switch (status) {
      case "unsupported":
        return "Din browser understøtter ikke notifikationer.";
      case "granted":
        return "Notifikationer er slået til.";
      case "denied":
        return "Notifikationer er blokeret i browseren.";
      default:
        return "Notifikationer er slået fra.";
    }
  };

  return (
    <section style={{ padding: 16, maxWidth: 520 }}>
      <h3>Notifikationer</h3>

      <p>
        <strong>Status:</strong> {renderStatusText()}
      </p>
      <p>   
        Nuværende bruger: {userId}
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button
          onClick={enableNotifications}
          disabled={
            isWorking ||
            status === "granted" ||
            status === "denied" ||
            status === "unsupported"
          }
        >
          {isWorking ? "Arbejder..." : "Aktivér notifikationer"}
        </button>

        <button
          onClick={disableNotifications}
          disabled={isWorking || status !== "granted"}
        >
          Slå notifikationer fra
        </button>
      </div>

      {status === "denied" && (
        <p style={{ marginTop: 12 }}>
          Du har blokeret notifikationer i browseren. Dette kan kun ændres i
          browserens indstillinger.
        </p>
      )}
    </section>
  );
}
