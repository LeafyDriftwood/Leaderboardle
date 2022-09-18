import React, {useEffect, useState, PureComponent} from 'react';
import NavBar from '../../CommonComp/NavBar'
import {useNavigate} from "react-router-dom";
import Grid from '../../CommonComp/Grid'
import { getDatabase, get, ref, onValue, DataSnapshot, update} from "firebase/database";
import { initializeApp} from "firebase/app";
import { getAuth, onAuthStateChanged, updatePassword } from "firebase/auth";
import {Row, Col, Form, Toast, ToastContainer} from "react-bootstrap"
import { Icon } from '@iconify/react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, TooltipProps } from 'recharts';

  
import 'bootstrap/dist/css/bootstrap.min.css';


import './style.css'
import SuccessToast from '../../CommonComp/SuccessToast';
import FailureToast from '../../CommonComp/FailureToast'
import { Guess, dateToString, NUM_WEEKS } from '../../CommonComp/Utils';
import { createTrue } from 'typescript';


function Profile () {

    // firebase constants
    const auth = getAuth()

    // state for profile name
    const [profileName, setProfileName]  = useState("")

    // state for profile color
    const [profileColor, setProfileColor]  = useState("")

    // set stats for barchart 
    const [barChartData, setBarChartData] = useState<{[key: string] : number}[]>([])
    const [challengeBarData, setChallengeBarData] =  useState<{[key: string] : number}[]>([])

    // other stats
    const [bestLeaderboardScore, setBestLeaderboardScore] = useState(0)
    const [leaderboardSuccess, setLeaderboardSuccess] = useState(0)
    const [challengeSuccess, setChallengeSuccess] = useState(0)
    // state for toast
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [showFailureToast, setShowFailureToast] = useState(false)

    // update user selection
    const updateUserProfile = () => {
        // get database
        const db = getDatabase()

        // get user
        const user = auth.currentUser

        if (profileName.length > 1 && profileName.length < 16) {
            // define updates
            let updates : {[key: string] : string} = {}

            updates['/users/' + user!.uid + '/name'] = profileName
            updates['/users/' + user!.uid + '/color'] = profileColor

            update(ref(db), updates)

            setShowSuccessToast(true)
        } else {

            // show failure toast
            setShowFailureToast(true)

        }
    }

    // get user profile stats
    const getUserProfile = () => {
        // get database
        const db = getDatabase()

        // get user
        const user = auth.currentUser

        const userRef = ref(db, 'users/' + user!.uid);
        onValue(userRef, (snapshot) => {
            const data  = snapshot.val()
            setProfileColor(data.color)
            setProfileName(data.name)
        })

    }

    // get leaderboard related stats
    const getLeaderboardStats = () => {

        // get db and user
        const db = getDatabase();
        const user = auth.currentUser;

        const userRef = ref(db, 'users/' + user!.uid + '/guesses');

        // call on value
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
            const data  = snapshot.val()
            const guesses : {[key: string]: Guess}[] = Object.values(data)
            
            // mapping of number of guesses to number of times they occur
            const guessesByNum  : {[key: string] : number}[] = [];

            for (let i = 1; i < 7; i++) {
                guessesByNum.push({
                    'name': i,
                    'Count': guesses.filter((ele) => 
                    Object.keys(ele).length === i).length,
                });
            }

            setBarChartData(guessesByNum)
            }

        }, {
            onlyOnce: true
        })
    
    }

    // create bar chart
    const createBarChart = (guessByNum: {[key: string] : number}[]) => {
    
       
        return (<BarChart
          width={350}
          height={250}
          data={guessByNum}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}}/>
          <Bar dataKey="Count" fill="#c79302" className = "individual-bar"/>
        </BarChart>
        );
    }

    // custom tooltip
    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>): JSX.Element => {
        if (active) {
          return (
            <div className="custom-tooltip">
              <p className="label">{`${payload?.[0].value}`}</p>
            </div>
          );
        }
      
        return <div></div>;
      };

    // get best weekly score
    const getBestScore = () => {

         // get db and user
         const db = getDatabase();
         const user = auth.currentUser;
 
         const userRef = ref(db, 'users/' + user!.uid + '/guesses');

         // get the lowest scoring week
         onValue(userRef, (snapshot) => {
            
            const data = snapshot.val();

            calcBestScore(data)

         })

    }

    // calculate best score
    const calcBestScore = (guessData: {[key: string] : {[key: string] : Guess}}) => {

        // array of weekly scores
        const weeklyScores : number[] = []
        // get today's date
        const startDate = new Date();

        // get most recent sunday
        startDate.setDate(startDate.getDate() - startDate.getDay() - (NUM_WEEKS * 7));

        // temp date counter
        let tempDate = startDate;

        // incomplete wordles
        let incompleteWordles = 0;

        // loop through NUM_WEEKS weeks, and calc score
        for (let i = 0; i < NUM_WEEKS; i++) {

            let currScore = 0;

            for (let j = 0; j < 7; j++) {
                const dateString = dateToString(tempDate)
                if (guessData[dateString]) {

                    // get number of guesses
                    const guessLength = Object.values(guessData[dateString]).length;

                    // check that the wordle was completed
                    const nextScore = Object.values(guessData[dateString]).some(ele => ele.presence === 'ccccc')  
                                        ? guessLength : 7

                    // increment incomplete wordles
                    if (nextScore === 7) incompleteWordles = incompleteWordles + 1

                    // update currScore
                    currScore = currScore + nextScore; 
                } else {

                    // wordle incomplete, so add 7
                    currScore = currScore + 7; 
                    incompleteWordles = incompleteWordles + 1
                }

                tempDate.setDate(tempDate.getDate() + 1)
            }

            weeklyScores.push(currScore)

        }

        setLeaderboardSuccess(Math.round((1 - (incompleteWordles)/(NUM_WEEKS * 7)) * 100))
        setBestLeaderboardScore(Math.min.apply(Math, weeklyScores));

    }

    // get scores of challenges
    const getChallengeScores = async () => {

         // get db
         const db = getDatabase();
         const user = auth.currentUser;
 
         const userRef = ref(db, 'users/' + user!.uid + '/otherchallenges');

         onValue(userRef, (snapshot) => {
             if (snapshot.exists()) {
                
                // get ids of all challenges complete
                const data = snapshot.val()
                const keyList = Object.keys(data)

                // keep track of scores in bar chart format
                const challengeData : {[key: number]: {[key: string]: number}}  = {
                    1: {'name': 1, 'Count': 0}, 
                    2: {'name': 2, 'Count': 0},
                    3: {'name': 3, 'Count': 0},
                    4: {'name': 4, 'Count': 0},
                    5: {'name': 5, 'Count': 0},
                    6: {'name': 6, 'Count': 0}
                }

                // keep track of incomplete challenges
                let incompleteChallenges = 0;
                // loop through each, and add its score
                for (let i = 0; i < keyList.length; i++) {
                    getScore(keyList[i]).then((val) => {
                        if (val === 7) {
                            incompleteChallenges = incompleteChallenges + 1;
                            setChallengeSuccess(Math.round((1 - (incompleteChallenges/keyList.length)) * 100))
                        }  else {
                            challengeData[val]['Count'] = challengeData[val]['Count'] + 1
                            setChallengeBarData([...Object.values(challengeData)])
                        }
                    })


                }

             }
         })


    }

    const getScore = async (key: string) => {

        // get db
        const db = getDatabase();
        const user = auth.currentUser;

        const challengeRef = ref(db, "challenges/" + key + "/members/" + user?.uid)
            
        // read leaderboards and set to state
        const response = await get(challengeRef)
        const guesses : Guess[] = await response.val()

        return Object.values(guesses).some(ele => ele.presence === 'ccccc')  
                                        ? Object.values(guesses).length : 7


        // add length to list
        return Object.keys(guesses).length

    }


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user != null) {
                getUserProfile()
                getLeaderboardStats()
                getBestScore()
                getChallengeScores()
            }
        });
        
    }, [])

    // logout if not logged in
    let navigateTo = useNavigate()

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            navigateTo("/login")
        }
    });

    if(profileColor !== "") {

        return (
            <div>
                <NavBar />
                <Row className = "row g-0">
                    <Col xs = {11} lg = {5} className="justify-content-center mx-auto profile-changeables">
                        <Row className = "row g-0">
                            <Col className = "d-flex justify-content-center mx-auto" xl = {4}>
                                <div className = "user-profile-icon" style = {{background: profileColor}}>
                                    {profileName[0]}
                                </div>
                            </Col>
                        </Row>
                        <Row className = "row g-0">
                            <Col className = "d-flex justify-content-center">
                                <div className = "profile-username-text">
                                    Username
                                </div>
                            </Col>
                        </Row>
                        <Row className = "row g-0">
                            <Col className = "d-flex justify-content-center">
                                <div className = "profile-info-container">
                                    <label className="username-input">
                                        <input className = "username-input-form" type="text" value = {profileName} onChange = {(e) => setProfileName(e.target.value)}/>
                                    </label>
                                </div>
                            </Col>
                        </Row>
                        <Row className = "row g-0">
                            <Col className = "d-flex justify-content-center">
                                <div className = "profile-username-text">
                                    Password
                                </div>
                            </Col>
                        </Row>
                        <Row className = "row g-0">
                            <Col className = "d-flex justify-content-center">
                                <div className = "profile-info-container">
                                <button className="change-password-button" onClick = {() => navigateTo('/changepassword')}>Change</button>    
                                </div>
                            </Col>
                        </Row>
                        <Row className = "row g-0">
                            <Col className = "d-flex justify-content-center">
                                <div className = "profile-color-text">
                                    Color
                                </div>
                            </Col>
                        </Row>
                        <Row className = "row g-0">
                            <Col className = "d-flex justify-content-center" >
                                <Form.Control
                                    className = "color-selector"
                                    type="color"
                                    id="exampleColorInput"
                                    value= {profileColor}
                                    title="Choose your color"
                                    onChange = {(e) => setProfileColor(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className = "row g-0">
                            <Col className = "d-flex justify-content-center">
                                <button className="update-button" onClick = {updateUserProfile}>Update</button>    
                            </Col>
                        </Row>
                    </Col>
                    <Col xs = {11} lg = {6} className="justify-content-center mx-auto profile-changeables">
                        <Row className = "row g-0">
                            <Col className = "d-flex justify-content-center">
                                <Icon icon="gridicons:stats-alt" color="white" width='90px' className = 'stats-icon'/>
                            </Col>
                        </Row>
                        
                        <Row className = "row g-0">
                            <Col xs = {12} md = {6} className = "mx-auto">
                                <Row className = "row g-0">
                                    <Col className = " d-flex justify-content-center">
                                        <div className = "stats-info-descriptor">
                                            Leaderboards
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className = "d-flex justify-content-center">
                                        <div className = "bar-chart">
                                        {createBarChart(barChartData)}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className = "d-flex justify-content-center">
                                        <div className = "best-score-container">
                                            <div className = "best-score-descriptor">
                                                Best score: 
                                            </div>
                                            <div className = "best-score-value" style = {{background: "#c79302"}}>
                                                {bestLeaderboardScore}
                                            </div>
                                        </div>   
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className = "d-flex justify-content-center">
                                        <div className = "best-score-container">
                                            <div className = "best-score-descriptor">
                                                Completion Rate: 
                                            </div>
                                            <div className = "best-score-value" style = {{background: "#c79302"}}>
                                                {leaderboardSuccess}%
                                            </div>
                                        </div>   
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs = {12} md = {6} className = "">
                                <Row className = "row g-0">
                                    <Col className = "d-flex justify-content-center">
                                        <div className = "stats-info-descriptor">
                                            Challenges
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className = "d-flex justify-content-center">
                                        <div className = "bar-chart">
                                        {createBarChart(challengeBarData)}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className = "d-flex justify-content-center">
                                        <div className = "best-score-container">
                                            <div className = "best-score-descriptor">
                                                Completion Rate: 
                                            </div>
                                            <div className = "best-score-value" style = {{background: "#c79302"}}>
                                                {challengeSuccess}%
                                            </div>
                                        </div>   
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <SuccessToast show = {showSuccessToast} text = {"Your profile was updated!"} onClose = {setShowSuccessToast}/>
                <FailureToast show = {showFailureToast} text = {"Choose a valid profile name between 2 - 16 chars"} onClose = {setShowFailureToast} />
            </div>
        )
    }
    else {
        return (
            <div></div>
        )
    }

}

export default Profile