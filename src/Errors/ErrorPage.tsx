import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col, Spinner} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from '@firebase/auth';

import './styles.css'

function ErrorPage () {

    // navigate const
    const navigateTo = useNavigate();

    return (
        <div className = "error-url">
            <img src = {require('../Images/pine-cone.png')} className = "durdle-icon" width = '90px' onClick = {() => navigateTo('/')}/>
            <h2 className = "leaderboardle-header">Leaderboardle</h2>
                <div className = "error-text-button">
                    <div className = "invalid-challenge-text">
                        Oops! This page does not exist!
                    </div> 
                    <button className="error-url-buttons" onClick = {() => navigateTo('/')} >Home</button>    
                </div>
        </div>
    )
}

export default ErrorPage; 