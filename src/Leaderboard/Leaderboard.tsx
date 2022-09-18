import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../CommonComp/NavBar';
import CreateLeaderboard from './CreateLeaderboard'
import JoinLeaderboard from './JoinLeaderboard'
import LeaderboardScreen from './LeaderboardScreen'
import LeaderboardDisplay from './LeaderboardDisplay'


import './styles.css'


type LeaderboardInfo = {
    // each listing/product ID is mapped to its dictionary of data.
    // the inner dictionary maps field names (e.g. price, address, etc) to values
    [listingID: string]: string
}

function Leaderboard() {

    // firebase consts
    const auth = getAuth()

    // State for leaderboards
    const [leaderboardsList, setLeaderboards] = useState<string []>([])


    // Navigate to login if not logged in
    let navigateTo = useNavigate()
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigateTo("/login")
        }
    });

    const getLeaderboards = () => {
        // get reference to db
        const db = getDatabase()

        // get current user
        const user = auth.currentUser
        // get reference to leaderboards for user
        const listingsRef = ref(db, "users/" + user?.uid +"/leaderboards")
        // read leaderboards and set to state
        onValue(listingsRef, (dataSnapshot) => {
            const newLeaderboards = dataSnapshot.val()
            if (newLeaderboards === null) {
                setLeaderboards([])
            }
            else {
                const leaderboardCodes = Object.keys(newLeaderboards)
                setLeaderboards(leaderboardCodes)
            }
        })

    }

    //get user info  data and start listener once when leaderboard page is initially rendered
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                getLeaderboards()
            }
        });
    }, [])


    return (
        <div className = "leaderboard-screen">
            <NavBar />
            <JoinLeaderboard refreshFunc = {getLeaderboards}/>
            <Row  className = "row g-0">
                { leaderboardsList.length != 0 &&
                     leaderboardsList.map((ele, index) => 
                     <Col xl = {3} lg = {4} md = {6} xs = {12} key = {ele} >
                         <LeaderboardDisplay  key = {ele} code = {ele} />
                    </Col>
                )}
                <Col xl = {3} lg = {4}  md = {6} xs = {12} className=  "me-auto">
                    <CreateLeaderboard />
                </Col> 
                
                
            </Row>
        </div>
    )
}

export default Leaderboard