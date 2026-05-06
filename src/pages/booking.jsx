import React, { useState, useEffect } from 'react';
import "./dashboard.css"
import { supabase } from "../supabase";
import Sidebar from '../components/sidebar';
import Title from '../components/title';
import not from "../assets/notif.svg";
import prof from "../assets/prof.svg";
import search from "../assets/search.svg";
import StatCard from '../components/statcard';

const Booking = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [bookings, setBookings] = useState([]);
    const [bookingCount, setBookingCount] = useState(0);
    const [confirmedCount, setConfirmedCount] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [visitorCount, setVisitorCount] = useState(0);

    useEffect(() => {
        const fetchBookings = async () => {
            const { data, error, count } = await supabase
                .from('booking')
                .select('id, first_name, last_name, email, ticket_type, visit_date, visit_time, num_tickets, total_price, booking_status', { count: 'exact' })
                .order('id', { ascending: false });

            if (error) { console.error(error); return; }

            setBookings(data);
            setBookingCount(count);
            setConfirmedCount(data.filter(b => b.booking_status === 'confirmed').length);
            setRevenue(data.reduce((sum, b) => sum + (b.total_price || 0), 0));
        };

        const fetchVisitors = async () => {
            const { count, error } = await supabase
                .from('user')
                .select('id', { count: 'exact', head: true });

            if (error) { console.error(error); return; }
            setVisitorCount(count);
        };

        fetchBookings();
        fetchVisitors();
    }, []);

    const filtered = bookings.filter(b => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            b.first_name?.toLowerCase().includes(q) ||
            b.last_name?.toLowerCase().includes(q) ||
            b.email?.toLowerCase().includes(q) ||
            b.ticket_type?.toLowerCase().includes(q) ||
            b.booking_status?.toLowerCase().includes(q) ||
            String(b.id).includes(q)
        );
    });

    const formatDate = (date) => date
        ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';

    const formatTime = (time) => {
        if (!time) return '—';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
    };

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
                    <Title title="Bookings" sub="Manage exhibition ticket bookings" />
                    <div className="line"></div>

                    <div className="stats">
                        <StatCard total="Visitors"  number={visitorCount} />
                        <StatCard total="Bookings"  number={bookingCount} />
                        <StatCard total="Confirmed" number={confirmedCount} />
                        <StatCard total="Revenue"   number={`$${revenue.toLocaleString()}`} />
                    </div>

                    <div className="searchbar">
                        <input
                            className='search'
                            type="text"
                            placeholder="Search users, bookings..."
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
                                        <th>Booking ID</th>
                                        <th >User</th>
                                        <th>Ticket Type</th>
                                        <th>Date & Time</th>
                                        <th>Attendees</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(row => (
                                        <tr className='bookingtr' key={row.id}>
                                            <td>
                                                <span className="identifier-badge">BK-00{row.id}</span>
                                            </td>
                                            <td>
                                                <div className="user-cell">
                                                    <h4>{row.first_name} {row.last_name}</h4>
                                                    <span>{row.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="type-badge">{capitalize(row.ticket_type)}</span>
                                            </td>
                                            <td>
                                                <div className="user-cell">
                                                    <h4>{formatDate(row.visit_date)}</h4>
                                                    <span>{formatTime(row.visit_time)}</span>
                                                </div>
                                            </td>
                                            <td className='numb'>{row.num_tickets}</td>
                                            <td className='numb'>${row.total_price?.toLocaleString()}</td>
                                            <td>
                                                <div className={`status status--${row.booking_status}`}>
                                                    <span>{capitalize(row.booking_status)}</span>
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

export default Booking;