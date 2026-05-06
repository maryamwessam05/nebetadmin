import { useEffect, useState } from 'react';
import "./dashboard.css"
import Sidebar from '../components/sidebar';
import Title from '../components/title';
import not from "../assets/notif.svg";
import prof from "../assets/prof.svg";
import search from "../assets/search.svg";
import eye from "../assets/eye.svg";
import edit from "../assets/edit.svg"; // add your edit icon asset
import FilterTab from '../components/filtertab';
import EditContentModal from '../components/editcontentmodal';
import { supabase } from "../supabase";

const TAB_RANGES = {
    Home:        { min: 1,  max: 5  },
    Rituals:     { min: 6,  max: 11 },
    Origins:     { min: 12, max: 21 },
    Ingredients: { min: 22, max: 28 },
    Experience:  { min: 29, max: 36 },
};

const TABS = Object.keys(TAB_RANGES);

const ContentMan = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [allContent, setAllContent] = useState([]);
    const [activeTab, setActiveTab] = useState('Home');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingRow, setEditingRow] = useState(null);

    const fetchContent = async () => {
        const { data, error } = await supabase
            .from('webcontent')
            .select('id, created_at, text, desc, identifier')
            .order('id', { ascending: true });
        if (error) { console.error(error); return; }
        setAllContent(data);
    };

    useEffect(() => { fetchContent(); }, []);

    const { min, max } = TAB_RANGES[activeTab];
    const filtered = allContent
        .filter(row => row.id >= min && row.id <= max)
        .filter(row => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            row.identifier?.toLowerCase().includes(q) ||
            row.text?.toLowerCase().includes(q) ||
            row.desc?.toLowerCase().includes(q)
        );
    });
    const truncate = (str, n = 40) => str && str.length > n ? str.slice(0, n) + '…' : str;

    const getType = (row) => {
        if (row.desc || row.desc_ar) return 'Text + Desc';
        if (row.text_ar) return 'Bilingual';
        return 'Text';
    };

    const formatDate = (iso) =>
        new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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
                    <Title title="Content Management" sub="Manage and edit all website content sections for the NEBET exhibition experience." />
                    <div className="line"></div>

                    <div className="searchbar">
                        <input
                            className='search'
                            type="text"
                            placeholder="Search content fields..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <img className='searchicon' src={search} alt="" />
                    </div>

                    <div className="filter">
                        <div className="tabs">
                            {TABS.map(tab => (
                                <FilterTab
                                    key={tab}
                                    text={tab}
                                    style={activeTab === tab ? 'filtertab' : 'filtertabunactive'}
                                    onClick={() => setActiveTab(tab)}
                                />
                            ))}
                        </div>

                        <div className="filteroptions">
                            <div className="fields">{filtered.length} Fields</div>
                            <button className='preview'>
                                <img src={eye} alt="" />
                                <span>Preview Page</span>
                            </button>
                        </div>

                    </div>
                        <div className="table">
                            <div className="table-wrapper">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Label</th>
                                            <th>Content (EN)</th>
                                            <th>Type</th>
                                            <th>Last Updated</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(row => (
                                            <tr key={row.id}>
                                                <td><span className="identifier-badge">{row.identifier}</span></td>
                                                <td><div className="desc-cell">{truncate(row.text || row.desc)}</div></td>
                                                <td><span className="type-badge">{getType(row)}</span></td>
                                                <td className='td'>{formatDate(row.created_at)}</td>
                                                <td>
                                                    <button className="edit-btn" onClick={() => setEditingRow(row)}>
                                                        <img src={edit} alt="Edit" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                </div>
            </div>

            {editingRow && (
                <EditContentModal
                    row={editingRow}
                    onClose={() => setEditingRow(null)}
                    onSaved={() => { fetchContent(); setEditingRow(null); }}
                />
            )}
        </main>
    );
};

export default ContentMan;