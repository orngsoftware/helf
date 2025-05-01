import { Link } from "react-router-dom";
import { X } from "@phosphor-icons/react";
import { useState } from "react";

const BlockReader = (props: any) => {
    window.onkeydown = function(e) {
        if (e.key == 'Escape') {
            props.togglePopup()
        }
    }

    return (
        <div className="popup-overlay">
            <div className="white-card popup" style={{textAlign: "left"}}>
                <div style={{cursor: "pointer"}} onClick={props.togglePopup} className="to-top-right"><X weight="bold" size={20} /></div>
                <h3 className="sm-heading" style={{marginTop: "30px"}}>{props.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: props.text }} className="reader-body" />
            </div>
        </div>
    )
}

const Block = (props: any) => {
    const [isOpen, setOpen] = useState(false)
    const toggleReader = () => {
        setOpen(!isOpen)
    }

    return (
        <div>
            <h3 className="sm-heading">{props.blockName}</h3>
            <div className="white-card" style={{maxWidth: 500}}>
                <div className="sm-row">
                    <p style={{fontWeight: 550}}>Learn this week</p>
                    <Link to="/" className="classic-link to-right">All</Link>
                </div>
                <p className="light-text" style={{lineHeight: 1.5}}>{props.tldrInfo}</p>
                <div className="sm-row">
                    <button className="btn-primary" onClick={toggleReader}>Read more</button>
                    <p className="light-text">~ {props.timeInfo} min</p>
                </div>
            </div>
            {isOpen && <BlockReader togglePopup={toggleReader} text={props.bodyInfo} title={props.blockName}/>}
        </div>
    )
}

export default Block;
