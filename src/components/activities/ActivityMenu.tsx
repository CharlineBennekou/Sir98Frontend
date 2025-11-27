import '../../styles/ActivityMenuStyle.css';
import { FiList, FiActivity, FiCalendar, FiHome } from "react-icons/fi";

export default function ActivityMenu() {
  return (
    <div className="menu-wrapper">

      <div className="menu-item">
        <FiList className="menu-icon" />
        <span>Alle aktiviteter</span>
      </div>

      <div className="menu-item">
        <FiActivity className="menu-icon" />
        <span>Træninger</span>
      </div>

      <div className="menu-item">
        <FiCalendar className="menu-icon" />
        <span>Begivenheder</span>
      </div>

      <div className="menu-item">
        <FiHome className="menu-icon" />
        <span>Mine aktiviteter</span>
      </div>

    </div>
  );
}
