import React, { useState, useEffect } from 'react';
import "./dashboard.css";
import { supabase } from "../supabase";
import Sidebar from '../components/sidebar';
import Title from '../components/title';
import not from "../assets/notif.svg";
import prof from "../assets/prof.svg";
import search from "../assets/search.svg";
import StatCard from '../components/statcard';
import NotifCard from '../components/notif';


const Notifications = () => {
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

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);
        if (error) { console.error(error); return; }
        fetchNotifications();
    };

    const handleMarkRead = async (id) => {
        const { error } = await supabase
            .from('notifications')
            .update({ status: 'read' })
            .eq('id', id);
        if (error) { console.error(error); return; }
        fetchNotifications();
    };

    const handleMarkAllRead = async () => {
        const { error } = await supabase
            .from('notifications')
            .update({ status: 'read' })
            .eq('status', 'not_read');
        if (error) { console.error(error); return; }
        fetchNotifications();
    };

    const totalCount = notifications.length;
    const unreadCount = notifications.filter(n => n.status === 'not_read').length;
    const readCount = notifications.filter(n => n.status === 'read').length;

    const filtered = notifications.filter(n => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            n.sub?.toLowerCase().includes(q) ||
            n.details?.toLowerCase().includes(q) ||
            n.status?.toLowerCase().includes(q)
        );
    });

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
                    <Title title="Notifications" sub="Stay updated with system alerts and activities" />
                    <div className="line"></div>

                    <div className="stats">
                        <StatCard total="Notifications" number={totalCount} />
                        <StatCard total="Unread" number={unreadCount} />
                        <StatCard total="Read" number={readCount} />
                    </div>

                    {unreadCount > 0 && (
                        <div className="notif-header-actions">
                            <button className="mark-all-btn" onClick={handleMarkAllRead}>
                                Mark All as Read
                            </button>
                        </div>
                    )}

                    <div className="notiflist">
                        {filtered.length > 0 ? filtered.map(n => (
                            <NotifCard
                                key={n.id}
                                id={n.id}
                                sub={n.sub}
                                details={n.details}
                                timeago={n.timeago}
                                status={n.status}
                                onDelete={handleDelete}
                                onMarkRead={handleMarkRead}
                            />
                        )) : (
                            <p className="no-notifs">No notifications found.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
        </>
    );
};

export default Notifications;