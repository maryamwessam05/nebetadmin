import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './dashboard';
import ContentMan from './content';
import EventDet from './eventdet';
import Booking from './booking';
import Users from './users';
import Messages from './messages';
import Analytics from './analytics';
import Notifications from './notifications';
import Error from './error';
import Login from './login';

const AppRoutes = () => {
    return ( 
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/contentmanagement" element={<ContentMan />} />
                <Route path="/eventdetails" element={<EventDet />} />
                <Route path="/bookings" element={<Booking />} />
                <Route path="/users" element={<Users/>} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/notifications" element={<Notifications/>} />
                <Route path="/" element={<Login />} />
                <Route path="*" element={<Error />} />



            </Routes>
        </BrowserRouter>
        </>
     );
}
 
export default AppRoutes;
