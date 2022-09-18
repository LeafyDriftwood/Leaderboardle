import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col, Spinner} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from '@firebase/auth';

import './styles.css'
import { userEvent } from '@testing-library/user-event/dist/types/setup';


function JoinLeaderboard () {

    // get authentication
    const auth  = getAuth()

    // navigation const
    const navigateTo = useNavigate();

    // loading state
    const [loading, setLoading] = useState(true)
    const [login, setLogin] = useState(false)
    const [invalidLeaderboard, setInvalidLeaderboard] = useState(false)

    // get url params
    const params = useParams()
    const leaderboardID = params.leaderboardID

    // check database to see if challenge is valid
    const getLeaderboard = () => {

        // get current user
        const user = auth.currentUser

        // get database
        const db = getDatabase();
        const leaderboardRef = ref(db, '/leaderboards/' + leaderboardID)

        // access challenge
        onValue(leaderboardRef, (snapshot) => {
            if (snapshot.exists()) {
                const leaderboardInfo = snapshot.val()
                if (leaderboardInfo.owner === user!.uid || Object.keys(leaderboardInfo.members).includes(user!.uid)) {
                    navigateTo('/leaderboard/' + leaderboardID)
                } else {
                    joinLeaderboard()
                    
                }
            } else {
                setLoading(false)
                setInvalidLeaderboard(true)

            }
        }, {
            onlyOnce: true
        })
    }

    // join leaderboard
    const joinLeaderboard = () => {

        const user = auth.currentUser
        const db = getDatabase()
        const leaderboardRef = ref(db, 'leaderboards/' + leaderboardID+"/")

        onValue(leaderboardRef, (snapshot) => {

            const data : {color: string, owner : string, title: string, numMembers: number, members: {[key: number]: string}} = snapshot.val();

            // define constants for updates for users and leaderboards
            const userUpdates : {[key: string] : string} = {};
            const leaderboardUpdates: {[key: string]: any} = {}
            const leaderboardName = data.title

            // make updates
            userUpdates['/users/' + user?.uid + '/leaderboards/' + leaderboardID] = leaderboardName;
            leaderboardUpdates['/leaderboards/' + leaderboardID + '/numMembers'] = data.numMembers + 1;
            leaderboardUpdates['/leaderboards/' + leaderboardID + '/members/' + user?.uid] = data.numMembers

            update(ref(db), userUpdates);
            update(ref(db), leaderboardUpdates);      
            
            navigateTo('/leaderboard/' + leaderboardID)
            
        }, 
        {
            onlyOnce: true
        })

    }

    // get URL's challenge
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                getLeaderboard()
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
            {invalidLeaderboard &&
                <div className = "join-text-button">
                    <div className = "invalid-challenge-text">
                        Oops! This leaderboard does not exist.
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

export default JoinLeaderboard;