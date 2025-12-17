// src/pages/AccountSettings.tsx
import AppHeader from "../components/layout/AppHeader";
import NotificationSettings from "../components/Notifications/NotificationSettings";
import "./../styles/AboutUsStyle.css";

export default function AccountSettings() {
  // TEMP until authentication exists
  const userId = "chokodanika@gmail.com";

  return (
    <>
      <AppHeader title="Kontoindstillinger" />
      <div style={{ marginTop: 70 }} />

      <div className="about-container">
        {/* 🔹 Boks: Notifikationer */}
        <div className="about-box-1">
          <NotificationSettings userId={userId} />
        </div>
      </div>
    </>
  );
}
