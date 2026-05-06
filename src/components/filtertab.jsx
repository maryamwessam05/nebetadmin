import React from 'react';
import "./filtertab.css"

const FilterTab = ({ text, style, onClick }) => {
    return (
        <button className={style} onClick={onClick}>
            {text}
        </button>
    );
};

export default FilterTab;