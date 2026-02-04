import { NavLink } from 'react-router-dom';
import './Navigation.css';

export const Navigation = () => {
    return (
        <nav className="navigation">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Scales
            </NavLink>
            <NavLink to="/triads" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Triads
            </NavLink>
        </nav>
    );
};
