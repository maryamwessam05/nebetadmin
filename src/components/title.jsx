import React from 'react';
import "./title.css"

const Title = (props) => {
    return ( 
        <>
            <div className="title">
                <h1>{props.title}</h1>
                <p>{props.sub}</p>
            </div>
        </>
     );
}
 
export default Title;