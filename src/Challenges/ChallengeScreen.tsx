import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col, Modal, Container, Table} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { WORDS } from "../CommonComp/Words"
import DynamicGrid from '../CommonComp/DynamicGrid';
import NavBar from "../CommonComp/NavBar"
import ChallengeRow from "./ChallengeRow"

import { Guess } from '../CommonComp/Utils';
import { URL } from '../CommonComp/Utils'
import { nameColor } from "../CommonComp/Utils"
import { userEvent } from '@testing-library/user-event/dist/types/setup';



function ChallengeScreen () {

    // firebase consts
    const auth = getAuth();

    // navigation const
    const navigateTo = useNavigate()

    // state for info of all member guesses
    const [guessData, setGuessData] = useState<{[key: string] : {[key: string] : Guess}}>({})
    const [color, setColor] = useState("")
    const [solution, setSolution] = useState("")
    const [owner, setOwner] = useState("")
    const [ownerName, setOwnerName] = useState("")

    // states for copying url/code
    const [copyURL, setCopyURL] = useState("URL")
    const [copyCode, setCopyCode] = useState("Code")
    // get params
    const params = useParams(); 



    // Read data for members
    const readChallengeData = () => {

        // get db
        const db = getDatabase();

        const challengeRef = ref(db, "challenges/" + params.challengeID);

        onValue(challengeRef, (snapshot) => {
            const challengeData = snapshot.val() 

            setGuessData(challengeData.members)
            setColor(nameColor[challengeData.color])
            setSolution(challengeData.word)
            setOwner(challengeData.owner)


        })

    }

    // Read data for members
    const getOwnerName = () => {

        // get db
        const db = getDatabase();

        const challengeRef = ref(db, "users/" + owner + "/name");

        onValue(challengeRef, (snapshot) => {
            if (snapshot.exists()) { 
                const ownerData = snapshot.val() 
                console.log(ownerData)

                setOwnerName(ownerData)
            }


        })

    }

    // copy code to clipboard
    const copyCodeToClipboard = () => {
        navigator.clipboard.writeText(params.challengeID!)
        setCopyCode("Copied!")
        setTimeout(() => {
            setCopyCode("Code");
          }, 1500)
    }

    // copy url to clipboard
    const copyURLToClipboard = () => {
        const challengeURL = URL + '/joinchallenge/' + params!.challengeID
        navigator.clipboard.writeText(challengeURL!)
        setCopyURL("Copied!")
        setTimeout(() => {
            setCopyURL("URL");
          }, 1500)
    }

    // use effect to get user's challenge info
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                readChallengeData()
            }
        });
    }, [])

    // use effect to get user's name
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                getOwnerName()
            }
        });
        
    }, [owner])

    // navigation for return button
    const navigateToChallenge = () => {
        if (owner === auth.currentUser?.uid) {
            navigateTo('/mychallenges')
        } else {
            navigateTo('/otherchallenges')
        }
    }

    // style for challenge header
    const headerStyle = {
        background: color,
    }

    // style for challenge table
    const tableStyle = {
        background: color+"50"
    }

    // style for challenge table
    const infoSolutionStyle = {
        background: color+"90"
    }

    return (
        <div>
            <NavBar />
            <Row className = "row g-0">
                <Col md = {6} xl = {4}>
                    <div className = "wordle-large-container" style = {tableStyle}>
                        <div className = "wordle-info-container" > 
                            <div className = "wordle-info-descriptor">
                                Solution
                            </div>
                            <div className = "wordle-info-solution-div" >
                                <div className = "wordle-info-solution" style = {infoSolutionStyle}>
                                    {solution}
                                </div>
                            </div>
                        </div>
                        <div className = "wordle-info-container" > 
                            <div className = "wordle-info-descriptor">
                                Owner
                            </div>
                            <div className = "wordle-info-solution-div" >
                                <div className = "wordle-info-solution" style = {infoSolutionStyle}>
                                    {ownerName}
                                </div>
                            </div>
                        </div>
                        <div className = "wordle-info-container" > 
                            <div className = "wordle-info-descriptor">
                                Code
                            </div>
                            <div className = "wordle-info-code-url">
                                <div className = "wordle-info-url" style = {infoSolutionStyle} onClick = {copyURLToClipboard}>
                                    {copyURL}
                                </div>
                                <div className = "wordle-info-code" style = {infoSolutionStyle} onClick = {copyCodeToClipboard}>
                                    {copyCode}
                                </div>
                            </div>
                        </div>
                        <div className = "return-button-container" > 
                            <div className = 'return-button-surrounder' style = {infoSolutionStyle} onClick = {navigateToChallenge}>
                                <Icon  icon="akar-icons:arrow-left" width = '20px' color="white" rotate={2} hFlip={true} vFlip={true} />
                            </div>
                        </div> 
                    </div>
                    
                </Col>
                <Col md = {6} xl = {8}>
                    <div className = "table-container-challenge" style = {tableStyle}> 
                        <Table responsive style = {{color: 'white'}}>
                            <thead >
                                <tr>
                                <th className = "header-cell">Name</th>
                                <th className = "header-cell">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(guessData)
                                .map((ele, index) => (
                                    <ChallengeRow 
                                    key = {ele} 
                                    challengeID = {params.challengeID as string} 
                                    uid = {ele} 
                                    style = {infoSolutionStyle}
                                    score = {Object.values(guessData[ele]).some(ele => ele.presence === 'ccccc')  
                                        ? Object.values(guessData[ele]).length : 7}/>
                                ))}
                            </tbody>
                        </Table>
                    </div> 
                </Col>
            </Row>
        </div>


    )

}

export default ChallengeScreen;