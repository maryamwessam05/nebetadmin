import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './dashboard';
import ContentMan from './content';
import EventDet from './eventdet';
import Booking from './booking';
import Users from './users';
import Messages from './messages';
import Analytics from './analytics';

const AppRoutes = () => {
    return ( 
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard/>} />
                <Route path="/contentmanagement" element={<ContentMan />} />
                <Route path="/eventdetails" element={<EventDet />} />
                <Route path="/bookings" element={<Booking />} />
                <Route path="/users" element={<Users/>} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/notifications" element={<Dashboard/>} />
                <Route path="/settings" element={<Dashboard/>} />
                <Route path="/addproduct" element={<Dashboard/>} />


            </Routes>
        </BrowserRouter>
        </>
     );
}
 
export default AppRoutes;
