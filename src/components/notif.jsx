import React from 'react';
import "./notif.css";
import del from "../assets/delete.svg";
import check from "../assets/check.svg";

const NotifCard = ({ id, sub, details, timeago, status, onDelete, onMarkRead }) => {
    const isUnread = status === 'not_read';

    return (
        <div className={isUnread ? 'notif-unread' : 'notif-read'}>
            <div className="notiftxt">
                <h4>{sub}</h4>
                <h6>{details}</h6>
                <span>{timeago}</span>
            </div>
            <div className="notifac">
                {isUnread && <div className="activepoint"></div>}
                <div className="notifactions">
                    {isUnread && (
                        <button className='read-btn' onClick={() => onMarkRead(id)}>
                            <img src={check} alt="" />
                            <span>Mark as Read</span>
                        </button>
                    )}
                    <button className="delete-btn" onClick={() => onDelete(id)}>
                        <img src={del} alt="Delete" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotifCard;