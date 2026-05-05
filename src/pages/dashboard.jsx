import { useEffect, useState } from 'react';
import { supabase } from "../supabase";
import Sidebar from '../components/sidebar';
import "./dashboard.css"
import Title from '../components/title';
import not from "../assets/notif.svg"
import prof from "../assets/prof.svg"
import StatCard from '../components/statcard';
import staticon1 from "../assets/staticon01.svg"
import staticon2 from "../assets/staticon02.svg"
import staticon3 from "../assets/staticon03.svg"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RANGE_START = '2026-04-26';
const RANGE_END   = '2026-05-06';

const Dashboard = () => {
    const [visitorData, setVisitorData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [visitorCount, setVisitorCount] = useState(0);
    const [bookingCount, setBookingCount] = useState(0);
    const [revenue, setRevenue] = useState(0);

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

        fetchVisitors();
        fetchBookings();
    }, []);

    return (
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
                    <Title title="Dashboard" sub="Welcome back to NEPET admin portal" />
                    <div className="stats">
                        <StatCard icon={staticon1} total="Visitors" number={visitorCount} percent="+12.5%" />
                        <StatCard icon={staticon2} total="Bookings" number={bookingCount} percent="+5%" />
                        <StatCard icon={staticon3} total="Revenue" number={`$${revenue.toLocaleString()}`} percent="+12.5%" />
                    </div>
                    <div className="row">
                        <div className="chartcard">
                            <h2>Visitor Trend</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={visitorData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                                    <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} />
                                    <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '8px', color: '#F0E1CE', fontFamily: 'Darker Grotesque' }}
                                        labelStyle={{ color: '#F0E1CE' }}
                                        itemStyle={{ color: '#F0E1CE' }}
                                    />
                                    <Area type="monotone" dataKey="visitors" stroke="#F0E1CE" strokeWidth={2} fill="url(#visitorGradient)" dot={{ fill: '#F0E1CE', r: 3 }} activeDot={{ r: 5, fill: '#F0E1CE' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chartcard">
                            <h2>Revenue</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                                    <XAxis dataKey="label" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} />
                                    <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '8px', color: '#F0E1CE', fontFamily: 'Darker Grotesque' }}
                                        labelStyle={{ color: '#F0E1CE' }}
                                        itemStyle={{ color: '#F0E1CE' }}
                                        formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                                    />
                                    <Bar dataKey="revenue" fill="#F0E1CE" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                        <div className="chartcard2">
                            <div className="bokheader">
                            <h2>Recent Bookings</h2>
                            <button>View All</button>

                            </div>
                            <div className="bookingdat">
                                <div className="bookingrow">
                                    
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;