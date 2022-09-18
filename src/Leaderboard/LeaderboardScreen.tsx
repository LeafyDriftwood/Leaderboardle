import React, {useEffect, useState} from 'react';
import NavBar from '../CommonComp/NavBar';
import {Row, Col, Container, Table} from "react-bootstrap"
import { useNavigate, useParams} from 'react-router-dom'
import { getDatabase, ref, onValue, push, remove, update, get} from "firebase/database";
import { getAuth, onAuthStateChanged, indexedDBLocalPersistence } from "firebase/auth";
import LeaderboardRow from "./LeaderboardRow"
import StatsRow from "./StatsRow"
import { Icon } from '@iconify/react'

import { Guess } from "../Home/Home"
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'
import UpdateLeaderboard from './UpdateLeaderboard';

// color imports
import { codeColor } from "../CommonComp/Utils";
import { nameColor } from "../CommonComp/Utils";
import PrevWinner from './PrevWinner';

interface AllGuesses {

    info: {[date : string] : {[guess : string] : Guess}} 
    
}

interface GuessMap {

    uid: string
    guesses: number[]
    
}


function LeaderboardScreen() {

    // firebase consts
    const auth = getAuth()

    // navigation consts
    const navigateTo = useNavigate()

    // signout on logout
    onAuthStateChanged(auth, (user) => {
        
        if (!user) {
          navigateTo("/login")
        }
    })

    // constants for setting state and navigation
    const params = useParams() as {[key : string] : string } ;

    // State to keep track of the leaderboard's properties
    const [color, setColor] = useState("")
    const [title, setTitle] = useState("")
    const [owner, setOwner] = useState("")
    const [members, setMembers] = useState<{[key: string]: number}>({})
    const [memberGuesses, setMemberGuesses] = useState<{[key: string] : number[]}>({})
    const [memberPositions, setMemberPositions] = useState<number[][]>([])
    const [prevScoreMap, setPrevScoreMap] = useState<{[key: string] : number}>({})
    const [prevWinner, setPrevWinner] = useState<string []>([])
    // date list
    const dateList = ["S", "M", "T", "W", "Th", "F", "Sa"]


    // get the names of all members
    const getAllUsers = () => {

        // get reference to db
        const db = getDatabase()
        // get reference to leaderboards for user
        const listingsRef = ref(db, "leaderboards/" + params.code)
        // read leaderboards and set to state
        onValue(listingsRef, (dataSnapshot) => {
            const leaderboardInfo = dataSnapshot.val()
            setMembers(leaderboardInfo.members)
            setTitle(leaderboardInfo.title)
            setColor(nameColor[leaderboardInfo.color])
            setOwner(leaderboardInfo.owner)
        })
        
    } 

    // leave a leaderboard
    const leaveLeaderboard = () => {

        // get reference to db
        const db = getDatabase()

        // get user
        const user = auth.currentUser

        // get reference to the user in this leaderboard
        const leaderboardRef = ref(db, "leaderboards/" + params.code +"/members/" + user?.uid)
        const userRef = ref(db, "users/" + user?.uid + "/leaderboards/" + params.code)
        // delete user from leaderboard
        remove(leaderboardRef)
        remove(userRef)

        navigateTo("/leaderboards")
    }



    // get the most recent week's dates
    const getDates = () => {

        // get today's date
        const dateToday = new Date();

        // set counter date
        const dateCounter = new Date(dateToday);

        // get most recent sunday
        dateCounter.setDate(dateCounter.getDate() - dateCounter.getDay());

        // store next 7 dates after sunday
        var dateList : string[]  = []
        for(let i = 0; i <= dateToday.getDay(); i++) {
            var dd = String(dateCounter.getDate()).padStart(2, '0');
            var mm = String(dateCounter.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = dateCounter.getFullYear();

            dateList.push(mm + dd + yyyy);

            dateCounter.setDate(dateCounter.getDate() + 1)
        }

        return dateList

    }

    // get all the info for the users in the leaderboard
    const getLeaderboardUsers = async () => {

        // get database
        const db = getDatabase()
        // get member data for each member
        for (var key in members) {
            const listingsRef = ref(db, "users/" + key + "/guesses")
            
            // read leaderboards and set to state
            const response = await get(listingsRef)
            const json = await response.val()

            // map date object containing guesses to the string info
            const infoToJson = {info: json}
            await createScoreArray(infoToJson, key)
            await prevScore(infoToJson, key)
            
        } 
    }

    // get the score for each date
    const createScoreArray = (userInfo: AllGuesses, userID: string) => {

        const recentDates : string [] = getDates()

        var scores : number[] = []
        const guessInformation = userInfo.info

        // loop through each date, and add its score (7 if entry not present)
        for (var date in recentDates) {

            try {
                if(recentDates[date] in guessInformation ) {
                    const guessLength = Object.keys(guessInformation[recentDates[date]]).length;
                    // check for incomplete wordles
                    if (guessLength === 6) {
                        // check whether the last guess has the presence string 'ccccc'
                        const guessList = Object.values(guessInformation[recentDates[date]]);
                        let complete = true;
                        for (let j = 0; j < guessList.length; j++) {
                            if (guessList[j].guess_no === 5 && guessList[j].presence !== "ccccc"  ) {
                                complete = false;
                            }
                        }

                        // push appropriate score based on the value of complete
                        complete ? scores.push(6) : scores.push(7)
                    }
                    // player got it in less than 6 guesses
                    else {
                        scores.push(guessLength)
                    }
                }
                // just a catch 
                else {
                    scores.push(7)
                }
                // if the wordle for this date wasn't completed
            } catch {
                scores.push(7)
            }
        }
        
        
        setMemberGuesses(memberGuesses => ({...memberGuesses, [userID]: scores}));
    }


    // create rankings for each date
    const createRankingsArray = () => {

        let masterRankings :number[][] = []

        let current_row : number[] = []
        for(let i = 0; i < getDates().length; i++) {
            for(const [key, value] of Object.entries(memberGuesses)) {
                current_row.push(value[i])
            }
            // sort row
            current_row.sort()

            // get unique values
            let uniqueRow = Array.from(new Set(current_row));
            masterRankings.push(uniqueRow)

            current_row = []
        }

        // create the rankings array for each member
        let allRankings : number[][] = []
        let currRow : number[] = []
        const counter = 0;
        for(const [key, value] of Object.entries(memberGuesses)) {
            for(let j = 0; j < value.length; j++) {
                currRow.push(masterRankings[j].indexOf(value[j]))
            }
            allRankings.push(currRow)
            currRow = []
        }

        setMemberPositions(allRankings)


    }

    // convert guesses to a 2d array
    const convertGuessDict = () => {

        // create array of guessmaps
        let guessArray : GuessMap[] = []

        // push info for each user
        for(const [key, value] of Object.entries(memberGuesses)) {
            guessArray.push({uid: key, guesses: value})
        }

        // func for sum of array
        const arraySum = (arr: number[]) => {
            return arr.reduce((partialSum, a) => partialSum + a, 0);
        }


        // sort by sum of scores
        guessArray.sort((a, b) => arraySum(a.guesses) < arraySum(b.guesses) ? -1 : arraySum(a.guesses) > arraySum(b.guesses) ? 1 : 0)

        return guessArray

    }

    // get last weeks dates
    const getPrevDates = () => {

         // get today's date
         const dateToday = new Date();

         // set counter date
         const dateCounter = new Date(dateToday);
 
         // get most recent sunday
         dateCounter.setDate(dateCounter.getDate() - dateCounter.getDay() - 7);
 
         // store next 7 dates after sunday
         var dateList : string[]  = []
         for(let i = 0; i < 7; i++) {
             var dd = String(dateCounter.getDate()).padStart(2, '0');
             var mm = String(dateCounter.getMonth() + 1).padStart(2, '0'); //January is 0!
             var yyyy = dateCounter.getFullYear();
 
             dateList.push(mm + dd + yyyy);
 
             dateCounter.setDate(dateCounter.getDate() + 1)
         }
 
         return dateList

    }

    // get the score for each date
    const prevScore = (userInfo: AllGuesses, userID: string) => {
        
        const recentDates : string [] = getPrevDates()

        var score : number = 0;

        const guessInformation = userInfo.info;

        // loop through each date, and add its score (7 if entry not present)
        for (var date in recentDates) {

            try {
                if(recentDates[date] in guessInformation ) {
                    const guessLength = Object.keys(guessInformation[recentDates[date]]).length;

                    // add score depending on presence string
                    const nextScore = Object.values(guessInformation[recentDates[date]]).some(ele => ele.presence === 'ccccc')  
                                        ? guessLength : 7
                    // add score
                    score = score + nextScore
                }
                // just a catch 
                else {
                    score = score + 7
                }
                // if the wordle for this date wasn't completed
            } catch {
                score = score + 7
            }
        }

        setPrevScoreMap(prevScoreMap => ({...prevScoreMap, [userID]: score}));

    }

    // get the previous weeks winner
    const prevWeekWinner = () => {


        const result = Object.entries(prevScoreMap).reduce((a, b) => a[1] < b[1] ? a : b)
        const minValue = Object.entries(prevScoreMap).reduce((a, b) => a[1] < b[1] ? a : b)[1]
        const winnerArrays = Object.entries(prevScoreMap).filter((ele) => ele[1] === minValue)
        
        const winnerNames = winnerArrays.map((ele) => ele[0])
        setPrevWinner(winnerNames)
        
    }

    // navigate to the leaderboards screen
    const navigateToLeaderboards = () => {
        navigateTo('/leaderboards')
    }




    // set states for the leaderboard and users 
    useEffect(() => {
        getAllUsers()
    }, [])

    

    // once all members are set, get the guess info for each user
    useEffect(() => {
        getLeaderboardUsers()

    }, [members])

    // once guess info is complete, create the rankings
    useEffect(() => {
        if(Object.keys(memberGuesses).length > 0) {
            createRankingsArray()
        }
    }, [memberGuesses])

    // get the previous week's winner
    useEffect(() => {
        if(Object.keys(prevScoreMap).length > 0) {
            prevWeekWinner()
        }
    }, [prevScoreMap])


    // style for leaderboard header
    const headerStyle = {
        background: color,
    }

    // style for leaderboard table
    const tableStyle = {
        background: color+"50"
    }

    if(auth.currentUser) {
    return (
        <div>
            <NavBar />
            <Row className = "row g-0">
                <Col xs = {8} md = {4} lg = {3} className = "mx-auto" >
                    <div className = "leaderboard-header" style = {headerStyle}>
                        {title}
                    </div>
                </Col>
            </Row>
            <Container>
                <Row>
                    <Col xs = {12} className = "mx-auto" >
                    <div className = "table-container" style = {tableStyle}> 
                    <Table responsive style = {{color: 'white'}}>
                        <thead >
                            <tr>
                            <th className = "header-cell">Name</th>
                            {dateList.map((_, index) => (
                                <th className = "header-cell" key={index}>{dateList[index]}</th>
                            ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(memberGuesses).map((ele, index) => (
                                <LeaderboardRow key = {ele} userID = {ele} scores = { memberGuesses[ele]} rankings = {memberPositions[index]} dates = {getDates()} leaderboardCode = {params.code} prevWinner = {prevWinner}/>
                            ))}
                        </tbody>
                        </Table>
                        </div> 
                    </Col>
                </Row>
                <Row>
                    <Col md = {6}>
                        <div className = "table-container" style = {tableStyle}> 
                            <Table responsive style = {{color: 'white'}}>
                                <thead >
                                    <tr>
                                    <th className = "header-cell">Name</th>
                                    <th className = "header-cell">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {convertGuessDict()
                                    .map((ele, index) => (
                                        <StatsRow key = {ele.uid} userID = {ele.uid} color = {color} score = {ele.guesses.reduce((partialSum, a) => partialSum + a, 0)} prevWinner = {prevWinner}/>
                                    ))}
                                </tbody>
                            </Table>
                        </div> 
                    </Col>
                    
                    <Col md = {6} className  ="d-flex justify-content-center">
                        
                        <div className = "fourth-quadrant">
                            {owner === auth.currentUser?.uid &&
                                <div className = "leaderboard-screen-buttons">
                                    <UpdateLeaderboard style = {tableStyle} color = {color} title = {title} code = {params.code}/>
                                </div>
                            }
                            {owner !== auth.currentUser?.uid &&
                                <div className = "leaderboard-screen-buttons">
                                    <div>
                                    <button className = "leave-button" style = {tableStyle} onClick = {leaveLeaderboard}>Leave</button>
                                    </div>
                                    
                                </div>
                            }
                            <div className = "return-to-leaderboard-text" onClick = {navigateToLeaderboards}>
                                <Icon className = "return-icon" icon="akar-icons:arrow-left" color="white" rotate={2} hFlip={true} vFlip={true} />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
    }
    else {
        return (
            <NavBar />

        )
    }

}

export default LeaderboardScreen