import '../../styles/NavigationStyle.css';
import { Link } from 'react-router-dom';

export function Navigation() {
    return (
        <>
            {/* Desktop navigation */}
            <nav className="nav-desktop">
                <ul>
                    <li><Link to="/">Aktiviteter</Link></li>
                    <li><Link to="/instructor">Instruktør</Link></li>
                    <li><Link to="/account">Konto</Link></li>
                </ul>
            </nav>

            {/* Mobile navigation */}
            <nav className="nav-mobile">
                <ul>
                    <li><Link to="/">Aktiviteter</Link></li>
                    <li><Link to="/instructor">Instruktør</Link></li>
                    <li><Link to="/account">Konto</Link></li>
                </ul>
            </nav>
        </>
    );
}
