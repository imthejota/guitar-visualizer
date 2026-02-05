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
            {/* Circle of Fifths - Hidden for now
            <NavLink
                to="/circle-of-fifths"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
                Circle of Fifths
            </NavLink>
            */}
        </nav>
    );
};
