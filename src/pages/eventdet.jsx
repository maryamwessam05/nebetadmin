import React, { useState, useEffect } from 'react';
import "./dashboard.css"
import { supabase } from "../supabase";
import Sidebar from '../components/sidebar';
import Title from '../components/title';
import not from "../assets/notif.svg";
import prof from "../assets/prof.svg";
import search from "../assets/search.svg";

const EXHIBIT_ID = 2;

const EventDet = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [form, setForm] = useState({
        name: '',
        location: '',
        format: '',
        duration: '',
        entry_type: '',
        exhibit_date: '',
        exhibit_enddate: '',
        time_slot_1: '',
        time_slot_2: '',
        time_slot_3: '',
        description: '',
    });
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchExhibit = async () => {
            const { data, error } = await supabase
                .from('exhibit')
                .select('name, location, format, duration, entry_type, exhibit_date, exhibit_enddate, time_slot_1, time_slot_2, time_slot_3, description')
                .eq('id', EXHIBIT_ID)
                .single();

            if (error) { console.error(error); return; }
            setForm({
                name:           data.name           || '',
                location:       data.location       || '',
                format:         data.format         || '',
                duration:       data.duration       || '',
                entry_type:     data.entry_type     || '',
                exhibit_date:   data.exhibit_date   || '',
                exhibit_enddate:data.exhibit_enddate || '',
                time_slot_1:    data.time_slot_1    || '',
                time_slot_2:    data.time_slot_2    || '',
                time_slot_3:    data.time_slot_3    || '',
                description:    data.description    || '',
            });
        };

        fetchExhibit();
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setSuccessMsg('');
        setErrorMsg('');
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccessMsg('');
        setErrorMsg('');

        const { error } = await supabase
            .from('exhibit')
            .update(form)
            .eq('id', EXHIBIT_ID);

        setSaving(false);
        if (error) { setErrorMsg('Failed to save changes.'); return; }
        setSuccessMsg('Changes saved successfully.');
    };

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
                            placeholder="Search..."
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
                    <Title title="Event Details" sub="Configure exhibition information and logistics" />
                    <div className="line"></div>

                    <div className="eventform">
                        <div className="eventrow">
                            <div className="group">
                                <label>Event Name</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} />
                            </div>
                            <div className="group">
                                <label>Location</label>
                                <input type="text" name="location" value={form.location} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="eventrow">
                            <div className="group">
                                <label>Format</label>
                                <input type="text" name="format" value={form.format} onChange={handleChange} />
                            </div>
                            <div className="group">
                                <label>Duration</label>
                                <input type="text" name="duration" value={form.duration} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="eventrow">
                            <div className="group">
                                <label>Entry Type</label>
                                <input type="text" name="entry_type" value={form.entry_type} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="eventrow">
                            <div className="group">
                                <label>Start Date</label>
                                <input type="date" name="exhibit_date" value={form.exhibit_date} onChange={handleChange} />
                            </div>
                            <div className="group">
                                <label>End Date</label>
                                <input type="date" name="exhibit_enddate" value={form.exhibit_enddate} onChange={handleChange} />
                            </div>
                        </div>


                        <div className="eventrow">
                            <div className="group">
                                <label>Time Slot 1</label>
                                <input type="time" name="time_slot_1" value={form.time_slot_1} onChange={handleChange} />
                            </div>
                            <div className="group">
                                <label>Time Slot 2</label>
                                <input type="time" name="time_slot_2" value={form.time_slot_2} onChange={handleChange} />
                            </div>
                            <div className="group">
                                <label>Time Slot 3</label>
                                <input type="time" name="time_slot_3" value={form.time_slot_3} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="group">
                            <label>Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
                        </div>

                        {errorMsg && <span className="modal-error">{errorMsg}</span>}
                        {successMsg && <span className="success-msg">{successMsg}</span>}

                        <div className="eventsavebtn">
                            <button className="modal-save" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
        </>
    );
}

export default EventDet;