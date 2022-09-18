import React, {useEffect, useState} from 'react';
import NavBar from '../CommonComp/NavBar'
import {useNavigate} from "react-router-dom";
import Grid from '../CommonComp/Grid'
import { getDatabase, ref, onValue, DataSnapshot, get} from "firebase/database";
import { initializeApp} from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Combine from './Combine'
import {Row, Col, Spinner} from "react-bootstrap"
import './styles.css'

export type Guess  = {
  guess_no : number
  presence : string
}

interface GuessInfo {
  splitGuesses : string[][]
  splitColors : string[][]
  splitBorderColors : string[][]
}

const colorMap : { [id: string] : string; } = {"c": "#32884A", "p":"#C9BC45", "a": "#6E7582", "e": "#0b141bc5"};
const borderMap : { [id: string] : string; } = {"c": "#32884A", "p":"#C9BC45", "a": "#6E7582", "e": "#f5cff7"};



function Home() {

  const [allGuessInfo, setGuessInfo] = useState<GuessInfo[]>()
  const [loadedInfo, setLoadedInfo] = useState(false)

  const auth = getAuth()

  function readData() {
    //const dateStrings : string[] = getDates();
    const db = getDatabase();
    const user  = auth.currentUser
    const starCountRef = ref(db, 'users/' + user!.uid + '/guesses');
    onValue(starCountRef, (snapshot) => {
      const data : {[date : string] : {[guess : string] : Guess}} = snapshot.val();
      newLoadData(data)
    },
    {
      onlyOnce: true
    });

  }

  function newLoadData(data : {[date : string] : {[guess : string] : Guess}}) {

    let allDateGuesses : GuessInfo [] = []
    const dates = getDates()
    for (var i = 0; i < dates.length; i++) {
      if(data[dates[i]] != null) {
        allDateGuesses.push(loadData(data[dates[i]]))
      }
      else {
        allDateGuesses.push({splitGuesses : [[""]], splitColors : [[""]], splitBorderColors : [[""]]})
      }

    }
    setGuessInfo(allDateGuesses)
  }

  /**
   * Gets the list of the previous 7 dates in the format stored in Firebase
   */
  function getDates() {
    let currDate : Date = new Date();
    let dateStrings : string [] = []
    for (let i = 0; i < 7; i++) {

      var dd = String(currDate.getDate()).padStart(2, '0');
      var mm = String(currDate.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = currDate.getFullYear();

      dateStrings.push(mm + dd + yyyy);

      currDate.setDate(currDate.getDate() -1)
      
    }

    return dateStrings;

  }
  
  function getWordleNumbers() {
    const START_NUM = 300 // Wordle number of April 15th
    const AUG_15TH : Date = new Date("04/15/2022")

    let wordleNums : number []= []
    let currDate : Date = new Date();

    currDate.setHours(0, 0, 0, 0);

    const difference = currDate.getTime() - AUG_15TH.getTime();
    const dayDifference = difference / (1000 * 3600 * 24);

    wordleNums.push(dayDifference + START_NUM)

    for (let i = 1; i < 7; i++) {
      wordleNums.push(wordleNums[i-1] - 1);      
    }
    
    return wordleNums



  }
  

  function loadData (data : { [guess : string] : Guess}) {

    var items : [string, Guess] [] = Object.keys(data).map(
      (key) => { return [key, data[key]] });
    
    items.sort((a , b) => (a[1].guess_no > b[1].guess_no) ? 1 : -1)
    
    const guessSplitArray : string[][]  = items.map((ele) => (ele[0].split("").map((el) => el.toUpperCase())))
    const presenceSplitArray : string [][] = items.map((ele) => ele[1].presence.split(""))
    const colorsSplitArray : string [][] =[]
    const bordersSplitArray : string [][] =[]

    while (guessSplitArray.length < 6) {
      guessSplitArray.push(['','', '','', ''])
      presenceSplitArray.push(['e','e', 'e','e', 'e'])
    }
    
    for (let i = 0; i<presenceSplitArray.length; i++) {
      let newColors : string[] = []
      let newBorders : string[] = []
      for (let j = 0; j<presenceSplitArray[i].length; j++) {
        newColors.push(colorMap[presenceSplitArray[i][j]])
        newBorders.push(borderMap[presenceSplitArray[i][j]])
      }
      colorsSplitArray.push(newColors)
      bordersSplitArray.push(newBorders)
    }

    let newGuessInfo = {splitGuesses: guessSplitArray, splitColors: colorsSplitArray, splitBorderColors : bordersSplitArray}
    return newGuessInfo;
    
  }

  let navigateTo = useNavigate()

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigateTo("/login")
    }
    else if (!loadedInfo){
      setLoadedInfo(true)
      readData()
    }
  });

  if(allGuessInfo!= null) {
    return (
       <div className = "home-screen">
        <NavBar />
        <div>
          <Row className = "row g-0" >
            <Col xs = {11} ms ={3} md = {10} lg={4} className = "mx-auto align-self-center">
            <div className = "large-background">
                {allGuessInfo.slice(0,1).map((ele, index) => (
                  <Combine 
                  key = {index} 
                  guessInfo = {ele} 
                  wordleNum = {getWordleNumbers()[index]} 
                  shrunk = {false} 
                  uid = {auth.currentUser!.uid}
                  date = {getDates()[index]}/>
                ))}

            </div>
          </Col>
            <Col xs = {11} ms ={3} md = {10} lg={5}  className = "mx-auto">
              <div className = "container-fluid other-small">
              <Row className = "row g-0 " >
            {allGuessInfo.slice(1).map((ele, index) => (
              <Col lg = {6} s = {6} xs={6} className = "my-start" key = {index}>
              <div className = "word-grid">
                <Combine key = {index} 
                  guessInfo = {ele}
                  wordleNum = {getWordleNumbers()[index +1]}
                  shrunk = {true}
                  uid = {auth.currentUser!.uid}
                  date = {getDates()[index+1]}/>
                  
              </div>
              </Col>
              ))}
            </Row>
            </div>
            </Col>
            </Row>
        </div>
      </div>
        
    )
  }
  else {
    return (
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

export default Home;