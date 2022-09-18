import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col, Modal, Form, Button} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { WORDS } from "../CommonComp/Words"
import DynamicGrid from '../CommonComp/DynamicGrid';
import NavBar from "../CommonComp/NavBar"
import { Guess } from '../CommonComp/Utils';
import ChallengeGuessDisplay from "../GuessDisplay/ChallengeGuessDisplay"


interface ChallengeRowProps {
    challengeID: string
    uid: string
    score : number
    style: {[key : string] : string}
}

function ChallengeRow (props: ChallengeRowProps) {

    // firebase consts
    const auth = getAuth()

    // navigation const
    const navigateTo = useNavigate(); 

    // state for userName
    const [profileName, setProfileName] = useState("")


    // get the user name
    const getUserName = () => { 
        // get database
        const db = getDatabase()

        const userRef = ref(db, 'users/' + props.uid);
        onValue(userRef, (snapshot) => {
            const data  = snapshot.val()
            setProfileName(data.name)
        })

    }

    // navigate to challenge guess display
    const navigateToDisplay = () => {
        navigateTo("/challengeguessdisplay/" + props.challengeID + "/" + props.uid)
    }
    
    useEffect(() => {
        if(auth.currentUser != null) {
            getUserName()
        }
    }, [])


    return (
            <tr>
                <td className = "leaderboard-row">{profileName}</td>
                <td key={props.uid} className = "leaderboard-cell">
                    <div className = "challenge-stat-score" style = {props.style} onClick = {navigateToDisplay}>
                        {props.score}
                    </div>
                </td>
            </tr>
        )

}

export default ChallengeRow; 