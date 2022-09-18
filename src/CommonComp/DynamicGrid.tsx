import Grid from "../CommonComp/Grid"
import React, {useEffect, useState, useCallback, VoidFunctionComponent} from 'react';
import NavBar from '../CommonComp/NavBar'
import {useNavigate, useParams} from "react-router-dom";
import { getDatabase, ref, onValue, DataSnapshot, update} from "firebase/database";
import { initializeApp} from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {Row, Col, Modal, Form, Button} from "react-bootstrap"
import { colorMap } from "../CommonComp/Utils"
import { borderMap } from "../CommonComp/Utils"
import { Guess } from "../CommonComp/Utils"
import { WORDS } from "../CommonComp/Words"
import { SOLUTIONS } from "./Solutions"
import Keyboard from "./Keyboard"

import './commonStyle.css'

interface DynamicGridProps {
    solution: string;
    challengeID: string;

}


function DynamicGrid (props: DynamicGridProps) {

    // firebase consts
    const auth = getAuth()


    // States for the wordle values and colors
    const [values, setValues] = useState(Array.from(Array(6), () => Array(5).fill("")))
    const [colors, setColors] = useState(Array.from(Array(6), () => Array(5).fill("#2E2932")))
    const [borderColors, setBorderColors] = useState(Array.from(Array(6), () => Array(5).fill("#f5cff7")))
    const [keyColors, setKeyColors] = useState({})
    const [isComplete, setIsComplete] = useState(false)
    const [showCorrectModal, setShowCorrectModal] = useState(false)
    const [showIncorrectModal, setShowIncorrectModal] = useState(false)

    // state for the solution
    const [solution, setSolution] = useState(props.solution)
    

    // states for board position
    const [col, setCol] = useState(0)
    const [row, setRow] = useState(0)

    // consts for showing/hiding modal
    const correctHandleClose = () => setShowCorrectModal(false)
    const incorrectHandleClose = () => setShowIncorrectModal(false)
    

    // based on the key pressed, take appropriate action
    const enterIntoGrid = useCallback((event: KeyboardEvent) => {
        if(!isComplete) {
            // enter into gird
            if (event.key.toLowerCase() != event.key.toUpperCase() && event.key.length === 1) {
                if(col <= 4) {
                // Insert that value into the grid and update column number

                const newValues = [...values]
                newValues[row][col] = event.key

                setValues(newValues)
                setCol(col + 1)
                }
            }
            // move onto next row
            else if (event.key === "Enter" && col === 5) {
                const latestGuess = values[row].join("").toLowerCase()
                if (WORDS.includes(latestGuess)) {
                    revealAnswers()
                    setRow(row + 1)
                    setCol(0)
                }
            }

            // delete last key
            else if (event.key === "Backspace" && col !== 0) {
                const newValues = [...values]
                newValues[row][col - 1] = ""

                setValues(newValues)
                setCol(col - 1)

            }
            
        }
      }, [row, col, values]);


    // same as enterIntoGrid, except for a key press
    // based on the key pressed, take appropriate action
    const enterKeyIntoGrid = (key: string) => {
        if(!isComplete) {
            // enter into gird
            if (key.toLowerCase() != key.toUpperCase() && key.length === 1) {
                if(col <= 4) {
                // Insert that value into the grid and update column number

                const newValues = [...values]
                newValues[row][col] = key

                setValues(newValues)
                setCol(col + 1)
                }
            }
            // move onto next row
            else if (key === "Enter" && col === 5) {
                const latestGuess = values[row].join("").toLowerCase()
                if (WORDS.includes(latestGuess)) {
                    revealAnswers()
                    setRow(row + 1)
                    setCol(0)
                }
            }

            // delete last key
            else if (key === "Backspace" && col !== 0) {
                const newValues = [...values]
                newValues[row][col - 1] = ""

                setValues(newValues)
                setCol(col - 1)

            }
        }
      };
    

    // set up listern for key press
    useEffect(() => {
    document.addEventListener("keydown", enterIntoGrid, false);

    return () => {
        document.removeEventListener("keydown", enterIntoGrid, false);
    };
    }, [col, row]);

    // reveal answers for the guess 
    const revealAnswers = () => {

        // map for the correct values
        const correctDictionaryMap : {[key : string] : number} = {}
            for (let i  = 0; i < solution.length; i++) {
                correctDictionaryMap[solution[i]] = solution.split(solution[i]).length-1
            }

        // define consts for the guess map
        const guessDicitionaryMap : {[key : string] : number} = {} 
        const latestGuess = values[row].join("").toLowerCase()

        // create new color grids
        const newColors = [...colors]
        const newBorderColors = [...borderColors]

        let presenceString = "eeeee" 

        // first pass to check for correct characters
        for (let i  = 0; i < latestGuess.length; i++) {

            
            // use appropriate color
            if(latestGuess[i] === solution[i]) {
                newColors[row][i] = colorMap["c"]
                newBorderColors[row][i] = borderMap["c"]
                presenceString = presenceString.substring(0, i) + "c" + presenceString.substring(i+1)
                correctDictionaryMap[latestGuess[i]] = correctDictionaryMap[latestGuess[i]] - 1
            } 

        }


        for (let i  = 0; i < latestGuess.length; i++) {

                if (presenceString[i] === "e") {
                    guessDicitionaryMap[latestGuess[i]] = guessDicitionaryMap[latestGuess[i]] ? guessDicitionaryMap[latestGuess[i]] + 1 : 1

                if (!correctDictionaryMap[latestGuess[i]]) {
                    newColors[row][i] = colorMap["a"]
                    newBorderColors[row][i] = borderMap["a"]
                    presenceString = presenceString.substring(0, i) + "a" + presenceString.substring(i+1)
                }
                else if(guessDicitionaryMap[latestGuess[i]] <= correctDictionaryMap[latestGuess[i]]) {
                    newColors[row][i] = colorMap["p"]
                    newBorderColors[row][i] = borderMap["p"]
                    presenceString = presenceString.substring(0, i) + "p" + presenceString.substring(i+1)
                }
                else {
                    newColors[row][i] = colorMap["a"]
                    newBorderColors[row][i] = borderMap["a"]
                    presenceString = presenceString.substring(0, i) + "a" + presenceString.substring(i+1)
                } 
            }
            
           
        }




        // update keyColors
        let newKeyColors : {[key: string]: string} = {}
        newKeyColors = keyColors;
        for (let i = 0; i < latestGuess.length; i++) {
            if (newKeyColors[latestGuess[i]] !== 'c' && (newKeyColors[latestGuess[i]] !== 'p' || presenceString[i] === 'c')) {
                newKeyColors[latestGuess[i]] = presenceString[i]
            }
        }


         // set is correct
         if (presenceString === "ccccc") {
            setShowCorrectModal(true)
            setIsComplete(true)
            writeGuessToDatabase()
        } 
        else {
            if(row === 5) {
                setShowIncorrectModal(true)
                setIsComplete(true)
                writeGuessToDatabase()
            }
        }

        

        setColors(newColors)
        setBorderColors(newBorderColors)
        setKeyColors(newKeyColors)
    }

    // write to database
    const writeGuessToDatabase = () => {
    
        // firebase constants
        const user = auth.currentUser
        const db = getDatabase()

        // initialize post data
        const postData : {[key: string] : Guess} = {}

        // create presence strings
        for (let j = 0; j < 6; j++) {

            // map for the correct values
            const correctDictionaryMap : {[key : string] : number} = {}
            for (let i  = 0; i < solution.length; i++) {
                correctDictionaryMap[solution[i]] = solution.split(solution[i]).length-1
            }

            // define consts for the guess map
            const guessDicitionaryMap : {[key : string] : number} = {} 
            const latestGuess = values[j].join("").toLowerCase()

            let presenceString = "eeeee" 

            // first pass to check for correct characters
            for (let i  = 0; i < latestGuess.length; i++) {

                // use appropriate color
                if(latestGuess[i] === solution[i]) {
                    presenceString = presenceString.substring(0, i) + "c" + presenceString.substring(i+1)
                    correctDictionaryMap[latestGuess[i]] = correctDictionaryMap[latestGuess[i]] - 1
                } 

            }


            for (let i  = 0; i < latestGuess.length; i++) {

                if (presenceString[i] === "e") {
                    guessDicitionaryMap[latestGuess[i]] = guessDicitionaryMap[latestGuess[i]] ? guessDicitionaryMap[latestGuess[i]] + 1 : 1

                    if (!correctDictionaryMap[latestGuess[i]]) {
                        presenceString = presenceString.substring(0, i) + "a" + presenceString.substring(i+1)
                    }
                    else if(guessDicitionaryMap[latestGuess[i]] <= correctDictionaryMap[latestGuess[i]]) {
                        presenceString = presenceString.substring(0, i) + "p" + presenceString.substring(i+1)
                    }
                    else {
                        presenceString = presenceString.substring(0, i) + "a" + presenceString.substring(i+1)
                    } 
                }         
            }

            if (latestGuess !== "") {
                postData[latestGuess] = {presence: presenceString, guess_no: j}
            }
        }

        // Write the new post's data to the db
        const updates : {[key: string] : {[key: string] : Guess} | string} = {};

        updates['/users/' + user?.uid + '/otherchallenges/' + props.challengeID] = props.solution;
        updates['/challenges/' + props.challengeID + "/members/" + user?.uid] = postData;


        // Commit updates
        update(ref(db), updates);


    }

    // copy results to share
    const copyResults = () => {

    }


    return (
        <div>
            <Modal show={showCorrectModal} onHide={correctHandleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Congratulations!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>The correct answer was {solution.toUpperCase()}. </Form.Label>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>;
            <Modal show={showIncorrectModal} onHide={incorrectHandleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Nice try!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>The correct answer was {solution.toUpperCase()}. </Form.Label>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>;
            <Grid 
                values = {values}
                colors = {colors}
                borderColors = {borderColors}
                shrunk = {false} />
            <Keyboard colors = {keyColors} updateKey = {enterKeyIntoGrid}/> 
        </div>
    )
}

export default DynamicGrid