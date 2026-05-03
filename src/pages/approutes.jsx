import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from './dashboard';
import ContentMan from './content';
import EventDet from './eventdet';

const AppRoutes = () => {
    return ( 
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard/>} />
                <Route path="/contentmanagement" element={<ContentMan />} />
                <Route path="/eventdetails" element={<EventDet />} />
                <Route path="/ticketspricing" element={<Dashboard/>} />
                <Route path="/bookings" element={<Dashboard/>} />
                <Route path="/users" element={<Dashboard/>} />
                <Route path="/gallery" element={<Dashboard/>} />
                <Route path="/messages" element={<Dashboard/>} />
                <Route path="/analytics" element={<Dashboard/>} />
                <Route path="/notifications" element={<Dashboard/>} />
                <Route path="/settings" element={<Dashboard/>} />
                <Route path="/addproduct" element={<Dashboard/>} />


            </Routes>
        </BrowserRouter>
        </>
     );
}
 
export default AppRoutes;
