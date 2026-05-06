import { useState } from 'react';
import { supabase } from '../supabase';
import close from '../assets/close.svg'; 

const EditContentModal = ({ row, onClose, onSaved }) => {
    const [form, setForm] = useState({
        text:    row.text    || '',
        desc:    row.desc    || '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        const { error } = await supabase
            .from('webcontent')
            .update({
                text:    form.text    || null,
                desc:    form.desc    || null,
                
            })
            .eq('id', row.id);

        setSaving(false);
        if (error) { setError(error.message); return; }
        onSaved();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2>Edit Content</h2>
                        <span className="modal-identifier">{row.identifier}</span>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <img src={close} alt="Close" />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="modal-field">
                        <label>Text (EN)</label>
                        <textarea name="text" value={form.text} onChange={handleChange} rows={3} />
                    </div>
                    
                    <div className="modal-field">
                        <label>Description (EN)</label>
                        <textarea name="desc" value={form.desc} onChange={handleChange} rows={3} />
                    </div>
                    

                    {error && <div className="modal-error">{error}</div>}
                </div>

                <div className="modal-footer">
                    <button className="modal-cancel" onClick={onClose}>Cancel</button>
                    <button className="modal-save" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditContentModal;