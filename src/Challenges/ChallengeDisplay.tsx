import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../CommonComp/NavBar';
import { URL } from '../CommonComp/Utils'

import './styles.css'

import { nameColor } from "../CommonComp/Utils"
import { codeColor } from "../CommonComp/Utils"


// props for the ChallengeDisplay
interface ChallengeDisplayProps {
    name: string
    code : string
}

function ChallengeDisplay (props: ChallengeDisplayProps) {

    // firebase consts
    const auth = getAuth();

    // navigate consts
    const navigateTo = useNavigate();

    // text for either copy/ copied
    const [copyText, setCopyText] = useState("Code");
    const [copyURL, setCopyURL] = useState("URL")
    const [color, setColor] = useState("")

    // route to challenge
    const routeToChallenge = () => {
        navigateTo("/challengescreen/" + props.code)
    }

    // copy code to clipboard
    const copyCodeToClipboard = () => {
        navigator.clipboard.writeText(props.code)
        setCopyText("Copied!")
        setTimeout(() => {
            setCopyText("Code");
          }, 1500)
    }

    // copy url to clipboard
    const copyURLToClipboard = () => {
        const challengeURL = URL + '/joinchallenge/' + props.code
        navigator.clipboard.writeText(challengeURL)
        setCopyURL("Copied!")
        setTimeout(() => {
            setCopyURL("URL");
          }, 1500)
    }

    // read database for color
    const getColor = () => {
        
        // get database
        const db = getDatabase();

        const challengeRef = ref(db, "challenges/" + props.code)

        onValue(challengeRef, (snapshot) => {

            // get challenge info and set color
            const challengeInfo = snapshot.val()
            setColor(challengeInfo.color)
        })
    }

    // styles for color
    const wordStyle = {
        background: nameColor[color]
    }

    const codeStyle = {
        background: codeColor[color]
    }

    // use effect for color
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                getColor()
            }
        });
    }, [])

    return (
        <div className = "challenge-display-div">
            <div className = "challenge-word-div" style = {wordStyle} onClick = {routeToChallenge}>
                {props.name}
            </div>
            <div className = "challenge-code-div" style = {codeStyle} >
                <div className = "challenge-code-split" style = {{borderRight: '2px solid ' + nameColor[color]}} onClick = {copyURLToClipboard}>{copyURL}</div>
                <div className = "challenge-code-split" onClick = {copyCodeToClipboard}>{copyText}</div>
            </div>
        </div>

    )
}

export default ChallengeDisplay;