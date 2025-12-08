import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import "../../styles/AppHeaderStyle.css";

interface Props {
  title: string;
  backTo?: string;
}

export default function AppHeader({ title, backTo = "/" }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <header className="app-header">
      <div className="header-inner">
        {!isHome && (
          <button className="back-btn" onClick={() => navigate(backTo)}>
            <FiArrowLeft size={46} />
          </button>
        )}

        <h1 className="header-title">{title}</h1>

        {!isHome && <div className="right-spacer"></div>}
      </div>
    </header>
  );
}
