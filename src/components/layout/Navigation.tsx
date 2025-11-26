import '../../styles/NavigationStyle.css';

export function Navigation() {
    return (
        <>
            {/* Desktop navigation */}
            <nav className="nav-desktop">
                <ul>
                    <li><a href="#Aktiviteter">Aktiviteter</a></li>
                    <li><a href="#MineAktiviteter">Instruktør</a></li>
                    <li><a href="#Kontakt">Konto</a></li>
                </ul>
            </nav>

            {/* Mobile navigation */}
            <nav className="nav-mobile">
                <ul>
                    <li><a href="#Aktiviteter">Aktiviteter</a></li>
                    <li><a href="#MineAktiviteter">Instruktør</a></li>
                    <li><a href="#Kontakt">Konto</a></li>
                </ul>
            </nav>
        </>
    );
}
