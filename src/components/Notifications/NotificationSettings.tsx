import React from "react";
import { subscribeAndBuildDto, getCurrentPushSubscription } from "../Notifications/PushHelper";
import {useUpsertPushSubscriptionMutation,useDeletePushSubscriptionMutation} from "../../store/apis/api"; // adjust path
type NotificationSettingsProps = { userId: string };
type NotificationStatus = "unsupported" | "default" | "granted" | "denied";

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [isWorking, setIsWorking] = React.useState(false);
  const [status, setStatus] = React.useState<NotificationStatus>("default");
  const [upsertPushSubscription] = useUpsertPushSubscriptionMutation();
  const [deletePushSubscription] = useDeletePushSubscriptionMutation();

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

      const dto = await subscribeAndBuildDto({ userId, requestPermission: true });
      await upsertPushSubscription(dto).unwrap();

      setStatus("granted");
      alert("Subscription registered on server!");
    } catch (e: any) {
      alert(e?.message ?? "Failed to enable notifications.");
    } finally {
      setIsWorking(false);
    }
  };

  const disableNotifications = async () => {
    try {
      setIsWorking(true);

      const subscription = await getCurrentPushSubscription();
      if (subscription) {
        // remove in backend
        await deletePushSubscription({ userId, endpoint: subscription.endpoint }).unwrap();
        // remove locally
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
