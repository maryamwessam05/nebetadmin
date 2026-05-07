import React, { useEffect, useState } from 'react';
import "./dashboard.css"
import Sidebar from '../components/sidebar';
import not from "../assets/notif.svg";
import prof from "../assets/prof.svg";
import search from "../assets/search.svg";
import { supabase } from '../supabase';
import { Link } from 'react-router-dom';
import noacc from "../assets/noacc.svg"

const NoAccess = () => {
     const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);

    const fetchNotifications = async () => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('id', { ascending: false });

        if (error) { console.error(error); return; }
        setNotifications(data);
    };

    useEffect(() => { fetchNotifications(); }, []);

    const unreadCount = notifications.filter(n => n.status === 'not_read').length;

    

    return ( 
        <>
        <main>
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <div className={`dashboard ${collapsed ? "dashboard--collapsed" : ""}`}>
                <header>
                    <div className="searchbar">
                        <input
                            className='search'
                            type="text"
                            placeholder="Search notifications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <img className='searchicon' src={search} alt="" />
                    </div>
                    <div className="notif">
                        <img src={not} alt="" />
                        {unreadCount > 0 && <div className="notnm">{unreadCount}</div>}
                    </div>
                    <div className="profile">
                        <img src={prof} alt="" />
                        <div className="name">
                            <h4>Admin</h4>
                            <span>Administrator</span>
                        </div>
                    </div>
                </header>

                <div className="content">
                    <div className="ercon">
                        <img src={noacc} alt="" />
                        <h5>You don’t have access</h5>
                        <Link to={"/"}>
                            <button>Contact Admin</button>
                        
                        </Link>

                    </div>
                </div>
            </div>
        </main>
        </>
     );
}
 
export default NoAccess;