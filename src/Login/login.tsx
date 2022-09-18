import { Icon } from '@iconify/react';
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { initializeApp} from "firebase/app";
import { useNavigate, Link} from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import {Row, Col, Alert} from "react-bootstrap"
import { MouseEvent } from 'react';


import './loginStyle.css'

import { useState, useEffect } from 'react';
import FailureToast from '../CommonComp/FailureToast';

// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDLEjNX1M-bYAD8Bo-GEcURenAOMrh5Tmo",
    authDomain: "words-23aa3.firebaseapp.com",
    projectId: "words-23aa3",
    storageBucket: "words-23aa3.appspot.com",
    messagingSenderId: "547901078728",
    appId: "1:547901078728:web:99a29b7d934492078a79fd",
    measurementId: "G-CBCKJYJTJD",
    databaseURL: "https://words-23aa3-default-rtdb.firebaseio.com",
  };
  

// intialize the firebase config
const app = initializeApp(firebaseConfig);


// Login to heroku
function Login() {

    // firebase consts
    const auth = getAuth();

    // Set up navigate consts
    const navigateTo = useNavigate()

    // States for email and password
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")    
    const [showToast, setShowToast] = useState(false)

    // Sigin to account
    function signin() {
        
        console.log(email)
        console.log(password)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigateTo("/")
                
               
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setShowToast(true)
        });
    }

    // signin with enter key

    const keySignin = (e : React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            signin()
        }
    }

    return (     
        
        <div className = "login">
            <FailureToast show = {showToast} onClose = {setShowToast} text = 'Incorrect login information' />
             <img src = {require('../Images/pine-cone.png')} className = "durdle-icon" width = '90px'/>
            {/*<Icon className = "durdle-icon" icon="simple-icons:redwoodjs" color="white" width='90px'/> */}
            <h2 className = "login-header">Leaderboardle</h2>
            <div className = "info-container">
           
                <Icon icon="iconoir:profile-circled" color="white" width='40px'/>
                <label className="email">
                    <input className = "login-form" type="email" placeholder = "Email" value = {email} 
                    onChange = {e => {setEmail(e.target.value); }}/>
                </label>
            </div>
            <div className = "info-container">
                <Icon icon="carbon:password" color="white" width='40px'/>
                <label className="password">
                    <input className = "login-form" type="password" placeholder = "Password" value = {password}
                    onChange = {e => {setPassword(e.target.value); }}
                    onKeyDown={(e) => keySignin(e)}/>
                </label>
            </div>
            <Row className = "row g-0">
                <Col className = "mx-auto">
                    <Link to = {'/signup'}className = "signup-text">
                        <div className = "signup-text">Don't have an account? Sign up!</div> 
                    </Link>
                </Col>
            </Row>
            <Row className = "row g-0">
                <Col className = "mx-auto">
                    <Link to = {'/passwordreset'}className = "signup-text">
                        <div className = "signup-text">Reset password</div> 
                    </Link>
                </Col>
            </Row>
           
            <button className="login-button" onClick={() => signin()}>Login</button>  

        </div>
    )
}

export default Login;