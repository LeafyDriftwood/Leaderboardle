import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from '../CommonComp/NavBar';
import ChallengeDisplay from './ChallengeDisplay';
import CreateWordle from './CreateWordle';




import './styles.css'


function MyChallenges () {

    // firebase consts
    const auth = getAuth();

    // const states
    const [challengeWords, setChallengeWords] = useState<string []>([])
    const [challengeCodes, setChallengeCodes] = useState<string []>([])
    const [searchText, setSearchText] = useState('')
    // read in challenges
    const readChallenges = () => {

        // get reference to db
        const db = getDatabase()

        // get current user
        const user = auth.currentUser
        // get reference to challenges for user
        const listingsRef = ref(db, "users/" + user?.uid +"/mychallenges")
        // read leaderboards and set to state
        onValue(listingsRef, (dataSnapshot) => {
            const userChallenges = dataSnapshot.val() as {[key: string] : string}

            // check if the path exists
            if (userChallenges === null) {
                setChallengeWords([])
                setChallengeCodes([])
            }
            else {

                // set the words and their corresponding codes
                const userChallengeCodes = Object.keys(userChallenges)
                const userChallengeWords = Object.values(userChallenges)

                setChallengeCodes(userChallengeCodes)
                setChallengeWords(userChallengeWords)
            }
        })

    }

    // filter challenges to fit search text 
    const filterChallenges = () => {
       const filteredIndices = challengeWords.map((ele : string, ind : number) => ({ele, ind}))
       .filter((ele) => (ele.ele.includes(searchText.toLowerCase())))
       .map((ele) => ele.ind)

       return filteredIndices;
    }

    // use effect to get user's challenge info
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                readChallenges()
            }
        });
    }, [])

    

    return (
        <div>
            <NavBar />
            <Row className = "row g-0">
                <Col xl = {5} lg = {5}  md = {6} xs = {12}>
                    <div className = "challenge-tidbits">
                        <input placeholder = "Search..." className = "search-wordle-form"
                            onChange = {(e) => setSearchText(e.target.value.toUpperCase())}
                            value = {searchText} />
                        <CreateWordle />
                    </div>
                </Col>
             </Row>
            <Row  className = "row g-0">
                { filterChallenges().map((ele) => (challengeWords[ele])).length !== 0 &&
                    filterChallenges().map((ele, index) => 
                        <Col key = {challengeCodes[ele]} xl = {2} lg = {3}  md = {4} xs = {6} >
                            <ChallengeDisplay key = {challengeCodes[ele]} name = {challengeWords[ele].toUpperCase()} code = {challengeCodes[ele]}/>
                        </Col> 
                    )
                }

            </Row>

        </div>
        
    )
}

export default MyChallenges;