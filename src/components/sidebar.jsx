import React, { useState } from 'react';
import "./sidebar.css"
import sidelogo from "../assets/sidelogo.svg"
import SidebarLink from './sidebarlink';
import dashboard from "../assets/dash.svg"
import colarrow from "../assets/colarrow.svg"
import icon2 from "../assets/icon01.svg"
import icon3 from "../assets/icon02.svg"
import icon4 from "../assets/icon03.svg"
import icon5 from "../assets/icon04.svg"
import icon6 from "../assets/icon05.svg"
import icon7 from "../assets/icon06.svg"
import icon8 from "../assets/icon07.svg"
import icon9 from "../assets/icon08.svg"
import icon10 from "../assets/icon09.svg"
import icon11 from "../assets/icon10.svg"

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
            <div className="sidelogo">
                <img src={sidelogo} alt="" className="sidebar__logo" />
                <div className="line"></div>

            </div>

            <div className="divlinks">
                <SidebarLink to="/" img={dashboard} text="Dashboard" collapsed={collapsed} end />
                <SidebarLink to="/contentmanagement" img={icon2} text="Content Management" collapsed={collapsed} />
                <SidebarLink to="/eventdetails" img={icon3} text="Event Details" collapsed={collapsed} />
                <SidebarLink to="/ticketspricing" img={icon4} text="Tickets & Pricing" collapsed={collapsed} />
                <SidebarLink to="/bookings" img={icon5} text="Bookings" collapsed={collapsed} />
                <SidebarLink to="/users" img={icon6} text="Users" collapsed={collapsed} />
                <SidebarLink to="/gallery" img={icon7} text="Gallery" collapsed={collapsed} />
                <SidebarLink to="/messages" img={icon8} text="Messages / Inquiries" collapsed={collapsed} />
                <SidebarLink to="/analytics" img={icon9} text="Analytics" collapsed={collapsed} />
                <SidebarLink to="/notifications" img={icon10} text="Notifications" collapsed={collapsed} />
                <SidebarLink to="/settings" img={icon11} text="Settings" collapsed={collapsed} />
            </div>

            <div className="back">
                <button onClick={() => setCollapsed(!collapsed)}>
                    <img
                        src={colarrow}
                        alt=""
                        style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 300ms ease" }}
                    />
                </button>
            </div>
        </div>
    );
}

export default Sidebar;