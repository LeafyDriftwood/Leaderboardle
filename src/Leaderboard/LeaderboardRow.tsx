import React, {useEffect, useState} from 'react';
import NavBar from '../CommonComp/NavBar';
import {Row, Col, Container, Table} from "react-bootstrap"
import {useLocation, useNavigate} from 'react-router-dom'
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth } from "firebase/auth";

import './styles.css'
import { isDate } from 'util';

interface LeaderboardRowProps {
    userID: string
    scores: number[]
    rankings: number[] 
    dates: string[]
    leaderboardCode: string
    prevWinner: string []
}
function LeaderboardRow(props: LeaderboardRowProps) {

    // firebase consts
    const auth = getAuth()

    // router consts
    const navigateTo = useNavigate()

    // state for userName
    const [profileName, setProfileName] = useState("")


    // Dictionary for mapping positions to class names
    const rankToClass : {[key: string]: string}= {0: "first-place", 1:"second-place", 2: "third-place"}
    

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
    
    // get user name onceuser is loaded
    useEffect(() => {
        if(auth.currentUser != null) {
            getUserName()
        }
    }, [])

    // check whether a specific date has been completed by the user
    const checkWordleCompleted = (uid: string, date: string) => {

        // get user and db
        const db = getDatabase()
        const user = auth.currentUser

        // get today's date
        const currDate = new Date();
        var dd = String(currDate.getDate()).padStart(2, '0');
        var mm = String(currDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = currDate.getFullYear();

        const dateString  = mm + dd + yyyy

        console.log(dateString)
        console.log(date)
        // define ref to database
        const userRef = ref(db, "users/" + user?.uid + "/guesses/" + date)
        onValue(userRef, (snapshot) => {
            if(uid === auth.currentUser!.uid || snapshot.exists() ) {
                navigateToDisplay(uid, date)
            }
        }, {
            onlyOnce: true
        }
        )

    }

    // navigate to a guessdisplay once clicked
    const navigateToDisplay = (uid: string, date: string) => {

        navigateTo("/guessdisplay/" + props.leaderboardCode + "/" + uid + "/" + date, {state: {uid: uid, profileName: profileName, date: date, leaderboardCode: props.leaderboardCode}})
    }

    //define style for cursor
    const style = {
        cursor: 'pointer',
        textAlign: 'center' as const
    }


    if (props.rankings != undefined) {
    return (
            <tr>
                <td className = "leaderboard-row" >
                    <span>
                        {props.prevWinner.includes(props.userID) &&
                            <img src = {require('../Images/crown.png')} width = '25px' className = "crown-image"/>
                        }
                        {profileName}
                    </span>
                </td>
                {props.scores.map((_, index) => (
                    <td key={index + profileName} className = "leaderboard-cell">
                        <div className = {rankToClass[props.rankings[index]]} style = {style} onClick = {() => {checkWordleCompleted(props.userID, props.dates[index])}}>
                            {props.scores[index]}
                        </div>
                    </td>
                ))}
            </tr>
        )
    }
    else {
        return (
            <tr></tr>
        )
    }
}


export default LeaderboardRow