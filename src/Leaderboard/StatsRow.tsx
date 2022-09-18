import React, {useEffect, useState} from 'react';
import NavBar from '../CommonComp/NavBar';
import {Row, Col, Container, Table} from "react-bootstrap"
import {useLocation} from 'react-router-dom'
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth } from "firebase/auth";

import './styles.css'
import { colorMap } from '../CommonComp/Utils';

interface StatsRowProps {
    userID: string
    color: string
    score: number
    prevWinner: string [];
}
function StatsRow(props: StatsRowProps) {

    // firebase consts
    const auth = getAuth()

    // state for userName
    const [profileName, setProfileName] = useState("")


    // get the user name
    const getUserName = () => { 
        // get database
        const db = getDatabase()

        const userRef = ref(db, 'users/' + props.userID);
        onValue(userRef, (snapshot) => {
            const data  = snapshot.val()
            setProfileName(data.name)
        })

    }

    // style for score
    const scoreStyle = {
        background: props.color,
        
    }
    
    useEffect(() => {
        if(auth.currentUser != null) {
            getUserName()
        }
    }, [])


    return (
            <tr>
                <td className = "leaderboard-row">
                    {props.prevWinner.includes(props.userID) &&
                        <img src = {require('../Images/crown.png')} width = '25px' className = "crown-image"/>
                    }
                    {profileName}</td>
                <td key={props.userID} className = "leaderboard-cell">
                    <div className = "leaderboard-stat-score" style = {scoreStyle}>
                        {props.score}
                    </div>
                </td>
            </tr>
        )
    }



export default StatsRow