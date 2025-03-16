import { Link } from "react-router-dom";

const Block = (props: any) => {
    return (
        <div>
            <h3 className="sm-heading">{props.blockName}</h3>
            <div className="white-card">
                <div className="sm-row">
                    <p style={{fontWeight: 550}}>Learn this week</p>
                    <Link to="/" className="classic-link to-right">All</Link>
                </div>
                <p className="light-text">{props.tldrInfo}</p>
                <div className="sm-row">
                    <button className="btn-primary">Read more</button>
                    <p className="light-text">~ {props.timeInfo} min</p>
                </div>
            </div>
        </div>
    )
}

export default Block;
