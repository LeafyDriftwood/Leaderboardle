import React, {useEffect, useState, Dispatch, SetStateAction} from 'react';
import NavBar from '../../CommonComp/NavBar'
import {useNavigate} from "react-router-dom";
import Grid from '../../CommonComp/Grid'
import { getDatabase, ref, onValue, DataSnapshot, get} from "firebase/database";
import { initializeApp} from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Combine from '../Combine'
import {Row, Col} from "react-bootstrap"


interface ItemProps {
    index: number
    wordleNum: number
    selected: number
    setSelected: Dispatch<SetStateAction<number>>;
}

function WordleSelectBarItem(props: ItemProps) {

    let style;

    const leftStyle = {
        borderRadius: '30px 0px 0px 30px'
    }

    const rightStyle = {
        borderRadius: '0px 30px 30px 00px',
        borderRight: '2px solid #FFFFFF'
    }

    const selectedStyle = {
        background: '#a65c0d',
    }

    if (props.index === 0) {
        style = Object.assign({}, style, leftStyle);
    } else if (props.index === 6) {
        style = Object.assign({}, style, rightStyle);;
    }

    if (props.selected === props.index) {
        style = Object.assign({}, style, selectedStyle);
    }



    return (
        <div className = 'wordle-select-bar-item' style = {style} onClick = {() => props.setSelected(props.index)}>
            {props.wordleNum}
        </div>
    )
}

export default WordleSelectBarItem