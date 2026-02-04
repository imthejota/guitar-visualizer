import { NavLink } from 'react-router-dom';
import './Navigation.css';

export const Navigation = () => {
    return (
        <nav className="navigation">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Scales
            </NavLink>
            <NavLink
                to="/triads"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
                Triads
            </NavLink>
            <NavLink
                to="/quiz"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
                Quiz
            </NavLink>
        </nav>
    );
};
