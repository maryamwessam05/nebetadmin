import React, { useState, useEffect } from 'react';
import "./dashboard.css"
import { supabase } from "../supabase";
import Sidebar from '../components/sidebar';
import Title from '../components/title';
import not from "../assets/notif.svg";
import prof from "../assets/prof.svg";
import search from "../assets/search.svg";
import msg from "../assets/msg.svg";
import clock from "../assets/clock.svg";
import del from "../assets/delete.svg";
import StatCard from '../components/statcard';

const Messages = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [newCount, setNewCount] = useState(0);
    const [repliedCount, setRepliedCount] = useState(0);

    const fetchMessages = async () => {
        const { data, error, count } = await supabase
            .from('messages')
            .select('*', { count: 'exact' })
            .order('id', { ascending: false });

        if (error) { console.error(error); return; }
        setMessages(data);
        setTotalCount(count);
        setNewCount(data.filter(m => m.status === 'new').length);
        setRepliedCount(data.filter(m => m.status === 'replied').length);
    };

    useEffect(() => { fetchMessages(); }, []);

    const handleDelete = async (id) => {
        const { error } = await supabase.from('messages').delete().eq('id', id);
        if (error) { console.error(error); return; }
        fetchMessages();
    };

    const handleStatusChange = async (id, newStatus) => {
        const { error } = await supabase
            .from('messages')
            .update({ status: newStatus })
            .eq('id', id);
        if (error) { console.error(error); return; }
        fetchMessages();
    };

    const filtered = messages.filter(m => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            m.full_name?.toLowerCase().includes(q) ||
            m.email?.toLowerCase().includes(q) ||
            m.msgcontent?.toLowerCase().includes(q) ||
            m.status?.toLowerCase().includes(q)
        );
    });

    const formatDate = (date) => date
        ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';

    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

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
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <img className='searchicon' src={search} alt="" />
                    </div>
                    <div className="notif">
                        <img src={not} alt="" />
                        <div className="notnm">3</div>
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
                    <Title title="Messages / Inquiries" sub="Manage visitor inquiries and correspondence" />
                    <div className="line"></div>

                   
                    <div className="stats">
                        <StatCard total="Messages"  number={totalCount} />
                        <StatCard total="New"  number={newCount} />
                        <StatCard total="Replied" number={repliedCount} />
                    </div>

                    <div className="messages-list">
                        {filtered.length === 0 && (
                            <div className="no-messages">No messages found.</div>
                        )}
                        {filtered.map(m => (
                            <div className="messages" key={m.id}>
                                <div className="msg">
                                    <img src={msg} alt="" />
                                    <div className="msginf">
                                        <div className="msgname-row">
                                            <h2>{m.full_name}</h2>
                                            <span className="msgemail">{m.email}</span>
                                        </div>
                                        <p>{m.msgcontent}</p>
                                        <div className="datem">
                                            <img src={clock} alt="" />
                                            <span>{formatDate(m.date)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="msg-actions">
                                    <div className={`msgstatus status--${m.status}`}>
                                        <span>{capitalize(m.status)}</span>
                                    </div>
                                    <select
                                        className="msg-status-select"
                                        value={m.status}
                                        onChange={(e) => handleStatusChange(m.id, e.target.value)}
                                    >
                                        <option value="new">New</option>
                                        <option value="read">Read</option>
                                        <option value="replied">Replied</option>
                                    </select>
                                    <button className="delete-btn" onClick={() => handleDelete(m.id)}>
                                        <img src={del} alt="Delete" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
        </>
    );
}

export default Messages;