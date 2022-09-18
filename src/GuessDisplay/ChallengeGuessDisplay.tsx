import React, {useEffect, useState} from 'react';
import NavBar from '../CommonComp/NavBar'
import {useNavigate, useParams} from "react-router-dom";
import { getDatabase, ref, onValue, DataSnapshot, get} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {Row, Col, Spinner} from "react-bootstrap"
import { Guess } from "../CommonComp/Utils";
import { loadData } from "../CommonComp/Utils";
import Combine from '../Home/Combine';
import { Icon } from '@iconify/react';


import './style.css'

function ChallengeGuessDisplay () {

    // firebase const
    const auth = getAuth()
    

    // router consts
    const navigateTo = useNavigate()
    const params = useParams() as {[key: string] : string}

    // load states
    const [profileName, setProfileName] = useState("")
    const [guessInfo, setGuessInfo] = useState<{[guess: string]: Guess}>()
    const [incompleteChallenge, setIncompleteChallenge] = useState(false)
    // signout on logout
    onAuthStateChanged(auth, (user) => {
        if (!user) {
          navigateTo("/login")
        }
    })

    
    // get the profile name for the user id
    const getUserName = () => {
        // get db and user
        const db = getDatabase()
        
        // get reference to specifc guess
        const guessRef = ref(db, 'users/' + params.uid);

        // set up listener at this ref
        onValue(guessRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setProfileName(data.name as string)
            } else {
                setIncompleteChallenge(true)
            }
        })

    }

    // make call to firebase db to load the guess info
    const loadGuess = () => {

        // get db
        const db = getDatabase()
        
        // get reference to specifc guess
        const guessRef = ref(db, 'challenges/' + params.challengeID + '/members/' + params.uid);

        // set up listener at this ref
        onValue(guessRef, (snapshot) => {
            const data = snapshot.val()
            setGuessInfo(data)
        })

    
    }

    // navigate back to leaderboard when done
    const navigateToLeaderboard = () => {
        navigateTo("/challengescreen/" + params.challengeID)
    }

    // load data
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                getUserName()
                loadGuess()
            }
        });
    }, [])


    if(guessInfo) {
        return (
            <div>
                <NavBar />
                <Row className = "row g-0">
                    <Col className ="mx-auto guess-display-wrapper" xs = {11}  md = {7} lg={3}>
                        <div className = "username-text">
                            {profileName}'s Wordles
                        </div>
                    </Col>
                </Row>
                
                <Row className = "row g-0">
                    <Col className ="mx-auto guess-display-wrapper" xs = {11}  md = {7} lg={3}>
                        <div>
                            <Combine guessInfo = {loadData(guessInfo)} wordleNum = {-1} shrunk = {false} uid = {auth.currentUser!.uid}
                            date = {'hi'}/>
                        </div>
                    </Col>
                </Row>
                <Row className = "row g-0">
                    <Col className ="mx-auto" xs = {11}  md = {7} lg={3} >
                        <div className = "return-to-leaderboard-text" onClick = {navigateToLeaderboard}>
                            <Icon className = "return-icon" icon="akar-icons:arrow-left" color="white" rotate={2} hFlip={true} vFlip={true} />
                        </div>
                        
                    </Col>
                </Row>
            </div>

        )
    }
    else if (incompleteChallenge) {
        return (
            <div>
                <NavBar />
                <Row className = "row g-0">
                    <Col className ="mx-auto guess-display-wrapper" xs = {11}  md = {7} lg={3}>
                        <div className = "username-text">
                            {profileName}'s Wordles
                        </div>
                    </Col>
                </Row>
                <Row className = "row g-0">
                    <Col className ="mx-auto guess-display-wrapper" xs = {11}  md = {7} lg={3}>
                        <div>
                        <Combine 
                        guessInfo = {{splitGuesses : [[""]], splitColors : [[""]], splitBorderColors : [[""]]}} 
                        wordleNum = {-1} 
                        shrunk = {false}
                        uid = {auth.currentUser!.uid}
                        date = {'hi'}/>
                        </div>
                    </Col>
                </Row>
                <Row className = "row g-0">
                    <Col className ="mx-auto" xs = {11}  md = {7} lg={3} >
                        <div className = "return-to-leaderboard-text" onClick = {navigateToLeaderboard}>
                            <Icon className = "return-icon" icon="akar-icons:arrow-left" color="white" rotate={2} hFlip={true} vFlip={true} />
                        </div>
                    </Col>
                </Row>
            </div>
        )
    } else {

        return  (
            <div>
                <NavBar />
                <div className = "join-url">
                    <img src = {require('../Images/pine-cone.png')} className = "durdle-icon" width = '90px' onClick = {() => navigateTo('/')}/>
                    <Spinner animation="border" role="status" className = "loading-spinner">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </div>
        )

    }



}

export default ChallengeGuessDisplay;