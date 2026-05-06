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
import staticon1 from "../assets/staticon01.svg"
import staticon2 from "../assets/staticon02.svg"
import staticon3 from "../assets/staticon03.svg"
import StatCard from '../components/statcard';

export const RANGE_START = '2026-04-26';
export const RANGE_END   = '2026-05-06';

const Analytics = () => {
    const [visitorData, setVisitorData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [visitorCount, setVisitorCount] = useState(0);
    const [bookingCount, setBookingCount] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
            const fetchVisitors = async () => {
                const { data, error, count } = await supabase
                    .from('user')
                    .select('created_at', { count: 'exact' })
                    .gte('created_at', RANGE_START)
                    .lte('created_at', RANGE_END)
    
                if (error) { console.error(error); return; }
                setVisitorCount(count);
    
                const grouped = data.reduce((acc, user) => {
                    const date = new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric'
                    });
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});
    
                const result = [];
                const start = new Date(RANGE_START);
                const end   = new Date(RANGE_END);
    
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    result.push({ date: label, visitors: grouped[label] || 0 });
                }
    
                setVisitorData(result);
            };
    
            const fetchBookings = async () => {
                const { data, error, count } = await supabase
                    .from('booking')
                    .select('total_price, visit_date', { count: 'exact' })
    
                if (error) { console.error('bookings error:', error); return; }
    
                setBookingCount(count);
    
                const totalRevenue = data.reduce((sum, b) => sum + (b.total_price || 0), 0);
                setRevenue(totalRevenue);
    
                const grouped = {};
                data.forEach(b => {
                    if (!b.visit_date) return;
                    const d = new Date(b.visit_date);
                    const bucketDay = d.getDate() % 2 === 0 ? d.getDate() - 1 : d.getDate();
                    const bucketDate = new Date(d.getFullYear(), d.getMonth(), bucketDay);
                    const label = bucketDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    grouped[label] = (grouped[label] || 0) + (b.total_price || 0);
                });
    
                const result = Object.entries(grouped)
                    .map(([label, revenue]) => ({ label, revenue }))
                    .sort((a, b) => new Date(a.label) - new Date(b.label));
    
                setRevenueData(result);
            };
    
            const fetchRecentBookings = async () => {
            const { data, error } = await supabase
                .from('booking')
                .select('id, first_name, last_name, ticket_type, visit_date, total_price, booking_status')
                .order('id', { ascending: false });
    
            if (error) { console.error('recent bookings error:', error); return; }
            setBookings(data);
        };
    
            fetchRecentBookings();
            fetchVisitors();
            fetchBookings();
        }, []);

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
                    <Title title="Analytics Dashboard" sub="Detailed insights and performance metrics" />
                    <div className="line"></div>

                   
                    <div className="stats">
                        <StatCard icon={staticon1} total="Visitors" number={visitorCount} percent="+12.5%" />
                        <StatCard icon={staticon2} total="Bookings" number={bookingCount} percent="+5%" />
                        <StatCard icon={staticon3} total="Revenue" number={`$${revenue.toLocaleString()}`} percent="+12.5%" />
                    </div>

                  
                </div>
            </div>
        </main>
        </>
    );
}

export default Analytics;