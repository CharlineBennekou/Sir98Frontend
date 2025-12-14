import { useNavigate } from "react-router-dom";
import {FiActivity, FiCalendar, FiUser, FiBell } from "react-icons/fi";
import { LiaUserTieSolid } from "react-icons/lia";
import "./../styles/DashboardStyle.css";

import AppHeader from "../components/layout/AppHeader";

export default function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
   
    {
      label: "Træninger",
      icon: <FiActivity />,
      onClick: () => navigate("/aktiviteter?type=training"),
      color: "#2196F3",
    },
    {
      label: "Begivenheder",
      icon: <FiCalendar />,
      onClick: () => navigate("/aktiviteter?type=events"),
      color: "#FF9800",
    },
    {
      label: "Mine aktiviteter",
      icon: <FiBell />,
      onClick: () => navigate("/aktiviteter?type=mine"),
      color: "#9C27B0",
    },

    // KAN LET UDVIDES EFTER BEHOV:
    {
      label: "Instruktører",
      icon: <LiaUserTieSolid />,
      onClick: () => navigate("/instructor"),
      color: "#E91E63",
    },
    {
      label: "Kontoindstillinger",
      icon: <FiUser />,
      onClick: () => navigate("/login"),
      color: "#607D8B",
    },
    {

    }


  ];

  return (
    <>
        <AppHeader title="Forside" />
    <div className="im-menu-wrapper">
    

      <div className="im-menu-grid">
        {menuItems.map((item, idx) => (
          <div
            key={idx}
            className="im-menu-card"
            onClick={item.onClick}
          >
            <div className="im-icon-wrapper" style={{ background: item.color }}>
              {item.icon}
            </div>

            <span className="im-menu-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
