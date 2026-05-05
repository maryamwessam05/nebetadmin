import React from 'react';
import "./statcard.css"

const StatCard = (props) => {
    return (
        <>
            <div className="statcard">
                <div className="statxt">
                    <img src={props.icon} alt="" />
                    <div className="count">
                        <span>Total {props.total}</span>
                        <h3>{props.number}</h3>
                    </div>
                </div>
                <h6>{props.percent}</h6>
            </div>
        </>
      );
}
 
export default StatCard;