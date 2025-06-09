import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

const NavLink = ({ to, iconClass, label, isSidebar = false, onClick }) => {
    return (
        <RouterNavLink to={to}>
            {({ isActive }) => (
                <li
                    className={`${isSidebar ? 'sidebar-link' : 'navbar-link'} ${isActive ? 'active' : ''}`}
                    onClick={onClick}>
                    <i className={`${iconClass} ${isActive ? 'active-icon' : ''}`}></i>
                    {label}
                </li>
            )}
        </RouterNavLink>
    );
};

export default NavLink;
