import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Block = (props: any) => {
    const token = localStorage.getItem("token")
    const request_data = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    const [blockData, setBlockData] = useState({
        block_name: "",
        tldr_info: "",
        body_info: "",
        time_info: ""
    })

    const fetchBlockData = async () => {
        const planResponse = await fetch(`http://127.0.0.1:5002/plans/get-block-data?plan_id=${props.plan_id}&block_id=${props.current_block_num}`, request_data)
        const planResponseData = await planResponse.json()
        
        setBlockData({
            block_name: planResponseData.block_name,
            tldr_info: planResponseData.tldr_info,
            body_info: planResponseData.body_info,
            time_info: planResponseData.time_info
        })
    }

    useEffect(() => {
        fetchBlockData()
    }, [props.plan_id, props.current_block_num])

    return (
        <div>
            <h3 className="sm-heading">{blockData.block_name}</h3>
            <div className="white-card">
                <div className="sm-row">
                    <p style={{fontWeight: 550}}>Learn this week</p>
                    <Link to="/" className="classic-link to-right">All</Link>
                </div>
                <p className="light-text">{blockData.tldr_info}</p>
                <div className="sm-row">
                    <button className="btn-primary">Read more</button>
                    <p className="light-text">~ {blockData.time_info} min</p>
                </div>
            </div>
        </div>
    )
}

export default Block;
