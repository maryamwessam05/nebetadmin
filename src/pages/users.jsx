import React, { useState, useEffect } from 'react';
import "./dashboard.css"
import { supabase } from "../supabase";
import Sidebar from '../components/sidebar';
import Title from '../components/title';
import not from "../assets/notif.svg";
import prof from "../assets/prof.svg";
import search from "../assets/search.svg";
import del from "../assets/delete.svg";   
import eye from "../assets/eye.svg";      
import StatCard from '../components/statcard';

const Users = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [adminCount, setAdminCount] = useState(0);
    const [visitorCount, setVisitorCount] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        const { data, error, count } = await supabase
            .from('user')
            .select('*', { count: 'exact' })
            .order('id', { ascending: false });

        if (error) { console.error(error); return; }
        setUsers(data);
        setTotalCount(count);
        setAdminCount(data.filter(u => u.role === 'admin').length);
        setVisitorCount(data.filter(u => u.role === 'visitor').length);
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id) => {
        const { error } = await supabase.from('user').delete().eq('id', id);
        if (error) { console.error(error); return; }
        fetchUsers();
    };

    const filtered = users.filter(u => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            u.first_name?.toLowerCase().includes(q) ||
            u.last_name?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.role?.toLowerCase().includes(q) ||
            String(u.id).includes(q)
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
                    <Title title="Users" sub="Manage registered exhibition visitors and admins" />
                    <div className="line"></div>

                    <div className="stats">
                        <StatCard total="Total Users"  number={totalCount} />
                        <StatCard total="Visitors"     number={visitorCount} />
                        <StatCard total="Admins"       number={adminCount} />
                    </div>

                    <div className="searchbar">
                        <input
                            className='search'
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <img className='searchicon' src={search} alt="" />
                    </div>

                    <div className="table">
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Joined</th>
                                        <th>Bookings</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(row => (
                                        <tr className='bookingtr' key={row.id}>
                                            <td>
                                                <span className="identifier-badge">#{row.id}</span>
                                            </td>
                                            <td>
                                                <div className="user-cell">
                                                    <h4>{row.first_name} {row.last_name}</h4>
                                                    <span>{row.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`type-badge role--${row.role}`}>
                                                    {capitalize(row.role)}
                                                </span>
                                            </td>
                                            <td className='numb'>{formatDate(row.joined || row.created_at)}</td>
                                            <td className='numb'>{row.number_of_bookings}</td>
                                            <td>
                                                <div className="action-btns">                                    
                                                    <button className="delete-btn" onClick={() => handleDelete(row.id)}>
                                                        <img src={del} alt="Delete" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>

       
        </>
    );
}

export default Users;