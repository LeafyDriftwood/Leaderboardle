import React, {useEffect, useState, Dispatch, SetStateAction} from 'react';
import NavBar from '../../CommonComp/NavBar'
import {useNavigate} from "react-router-dom";
import Grid from '../../CommonComp/Grid'
import { getDatabase, ref, onValue, DataSnapshot, get} from "firebase/database";
import { initializeApp} from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Combine from '../Combine'
import {Row, Col} from "react-bootstrap"
import WordleSelectBarItem from './WordleSelectBarItem';

import './home2styles.css'

interface SelectBarProps {
    selected: number;
    setSelected: Dispatch<SetStateAction<number>>;
}

function WordleSelectBar(props: SelectBarProps) {

    // get wordle numbers
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

    return (
        <div className = 'wordle-select-bar'>
            {getWordleNumbers().map((ele, index) => (
                <WordleSelectBarItem index = {index} wordleNum = {ele} selected = {props.selected}  setSelected = {props.setSelected}/>
            ))
            }
        </div>
    )

}

export default WordleSelectBar;