import React from 'react';
import { NavLink } from 'react-router-dom';
import "./sidebarlink.css";

const SidebarLink = (props) => {
    return (
        <NavLink
            to={props.to}
            end={props.end}
            className={({ isActive }) => isActive ? "active" : "unactive"}
        >
            <img src={props.img} alt="" />
            {!props.collapsed && <h3>{props.text}</h3>}
        </NavLink>
    );
}

export default SidebarLink;