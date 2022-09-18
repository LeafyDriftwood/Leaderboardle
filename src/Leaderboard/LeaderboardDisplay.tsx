import React, {useEffect, useState, Dispatch, SetStateAction} from 'react';
import NavBar from '../CommonComp/NavBar';
import {Row, Col, Tooltip, OverlayTrigger, Overlay} from "react-bootstrap"
import {useLocation} from 'react-router-dom'
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth } from "firebase/auth";
import {Link, useNavigate} from 'react-router-dom'

import { nameColor } from "../CommonComp/Utils"
import { codeColor } from "../CommonComp/Utils"
import { URL } from "../CommonComp/Utils"


import './styles.css'

interface LeaderboardDisplayProps {
    code: string
}


function LeaderboardDisplay(props:  LeaderboardDisplayProps) {

    // const for navigation
    const navigate = useNavigate()


    // State to keep track of the leaderboard's color
    const [color, setColor] = useState("")
    const [title, setTitle] = useState("")
    const [owner, setOwner] = useState("")
    const [members, setMembers] = useState<{[key: number]: string}>({})

    // states for copy to clipboard text
    const [URLText, setURLText] = useState("URL")
    const [codeText, setCodeText] = useState("Code")

    // constants for tooltips
    const [tooltipText, setToolTipText] = useState("Copy to clipboard")
    
    // Search for the data of this leaderboard to get its color 
    const getLeaderboard = () => {

        // get reference to db
        const db = getDatabase()
        // get reference to leaderboards for user
        const listingsRef = ref(db, "leaderboards/" + props.code)
        // read leaderboards and set to state
        onValue(listingsRef, (dataSnapshot) => {
            const leaderboardInfo = dataSnapshot.val()
            setColor(leaderboardInfo.color)
            setTitle(leaderboardInfo.title)
            setOwner(leaderboardInfo.owner)
            setMembers(leaderboardInfo.members)
        })
    }

    // Navigate to leaderboard with props
    const navigateToLeaderboard = () => {
        navigate("/leaderboard/" + props.code, {state : {code: props.code}})
    }

    // copy the leaderboard code to clipboard
    const copyToClipboard = (textToCopy: string, originalText: string, stateModifier: Dispatch<SetStateAction<string>>) => {
        navigator.clipboard.writeText(textToCopy)
        stateModifier("Copied!")
        setTimeout(() => {
            stateModifier(originalText);
          }, 1500)

    }

    useEffect(() => {
        getLeaderboard()
    }, [])




    const namestyle = { 
        background: nameColor[color]
    }

    const codestyle = {
        background: codeColor[color]
    }

    return (

        <div className = "leaderboard" onMouseOut={() => {setTimeout(() => {
            setToolTipText("Copy to clipboard")
          }, 200); }}>
            <div className = "leaderboard-name" onClick = {navigateToLeaderboard} style = {namestyle}>
                {title}
            </div>
            <div className = "leaderboard-code" style = {codestyle}>
                <div className = "leaderboard-copy-info" onClick = {() => copyToClipboard(URL + "/joinleaderboard/" + props.code, "URL", setURLText)} style = {{borderRight : '2px solid ' + nameColor[color]}}>
                    {URLText}
                </div>
                <div className = "leaderboard-copy-info" onClick = {() => copyToClipboard(props.code, "Code", setCodeText)}>
                    {codeText}
                </div>
            </div>
        </div>
    )
}

export default LeaderboardDisplay