import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col, Spinner} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from '@firebase/auth';

import './styles.css'


function JoinChallenge () {

    // get authentication
    const auth  = getAuth()

    // navigation const
    const navigateTo = useNavigate();

    // loading state
    const [loading, setLoading] = useState(true)
    const [login, setLogin] = useState(false)
    const [invalidChallenge, setInvalidChallenge] = useState(false)

    // get url params
    const params = useParams()
    const challengeID = params.challengeID

    // check database to see if challenge is valid
    const getChallenge = () => {

        // get current user
        const user = auth.currentUser

        // get database
        const db = getDatabase();
        const challengeRef = ref(db, '/challenges/' + challengeID)

        // access challenge
        onValue(challengeRef, (snapshot) => {
            if (snapshot.exists()) {
                const challengeInfo = snapshot.val()
                console.log(snapshot.val())
                if (challengeInfo.owner === user!.uid || Object.keys(challengeInfo.members).includes(user!.uid)) {
                    navigateTo('/challengescreen/' + challengeID)
                } else {
                    navigateTo('/challengewordle/' + challengeID + '/' + user!.uid)
                }
            } else {
                setLoading(false)
                setInvalidChallenge(true)

            }
        }, {
            onlyOnce: true
        })
    }

    // get URL's challenge
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                getChallenge()
            } else {
                setLoading(false)
                setLogin(true)
            }
        });
    }, [])

    return (
        <div className = "join-url">
            <img src = {require('../Images/pine-cone.png')} className = "durdle-icon" width = '90px' onClick = {() => navigateTo('/')}/>
            <h2 className = "leaderboardle-header">Leaderboardle</h2>
            {loading && 
                <Spinner animation="border" role="status" className = "loading-spinner">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            {invalidChallenge &&
                <div className = "join-text-button">
                    <div className = "invalid-challenge-text">
                        Oops! This challenge does not exist.
                    </div> 
                    <button className="join-url-buttons" onClick={() => navigateTo('/')}>Home</button>    
                </div>
            }
            {login &&
                <div className = "join-text-button">
                    <div className = "invalid-challenge-text">
                        Oops! You are not logged in.
                    </div> 
                    <button className="join-url-buttons" onClick={() => navigateTo('/login')}>Login</button>    
                </div>
            }   
        </div>
    )
}

export default JoinChallenge;