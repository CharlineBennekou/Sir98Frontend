import '../../styles/ActivityMenuStyle.css';
import { FiList, FiActivity, FiCalendar, FiHome, FiUser, FiPlus } from "react-icons/fi";
import { LiaUserTieSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";

export default function ActivityMenu() {
  const navigate = useNavigate();

  return (
    <div className="menu-wrapper">

      <div className="menu-item" onClick={() => navigate('/aktiviteter')}>
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

      <div className="menu-item">
        <LiaUserTieSolid className="menu-icon" />
        <span>Instruktør</span>
      </div>

      <div className="menu-item">
        <FiUser className="menu-icon" />
        <span>Konto</span>
      </div>

      <div className="menu-item" onClick={() => navigate('/create')}>
        <FiPlus className="menu-icon" />
        <span>Opret aktivitet</span>
      </div>

    </div>
  );
}
