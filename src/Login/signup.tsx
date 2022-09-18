import React, {useEffect, useState} from 'react';
import NavBar from '../CommonComp/NavBar';
import {Row, Col, Container, Table, Form, Button, Alert} from "react-bootstrap"
import {useNavigate, Link} from 'react-router-dom'
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Icon } from '@iconify/react'
import FailureToast from '../CommonComp/FailureToast'
import './loginStyle.css'
import PasswordReset from './passwordreset';

function Signup () {

    // firebase consts
    const auth = getAuth()

    // navigation constant
    const navigateTo = useNavigate()

    // states for new profile
    const [userEmail, setUserEmail] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [username, setUserName] = useState("")
    const [userColor, setUserColor] = useState("#000000")
    const [failureText, setFailureText] = useState("Unable to create account with this email")

    // states for alerts
    const [showFailure, setShowFailure] = useState(false)



    // function to create profile with user info

    const createNewUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        e.preventDefault()

        const auth = getAuth();
        if(userPassword.length < 5) {
            setFailureText('Choose a password with at least 5 characters')
            setTimeout(() => {
                setFailureText("Unable to create account with this email");
              }, 5400)
              setShowFailure(true)
            return;
        } else if (username.length < 1) {
            setFailureText('Choose a username with at least 1 character')
            setTimeout(() => {
                setFailureText("Unable to create account with this email");
              }, 5400)
              setShowFailure(true)
            return;

        }


        
        createUserWithEmailAndPassword(auth, userEmail, userPassword)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const userID = user.uid

            // create leaderboard profile with new information
            const newData = {
                color: userColor,
                name: username,
                guesses: "",
                leaderboards: ""
            }

            // get database
            const db = getDatabase()

            // create updates
            const updates : {[key: string] : {[key: string] : string}} = {}

            updates["/users/" + userID] = newData
            update(ref(db), updates)

            navigateTo("/")

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setShowFailure(true)
            
        }); 

    }

    return (
       
        <div className = "signup-overarching">
             <FailureToast show = {showFailure} text = {failureText} onClose = {setShowFailure} />
            <div className = "header-overarching">
                <img src = {require('../Images/pine-cone.png')} className = "acorn-icon" width = '70px'/>
                <h2 className = "leaderboardle-header">Leaderboardle</h2>
            </div>
        <Row className="mb-3 row g-0">
            <Col className = "mx-auto" xs = {10} lg = {5}>
                <div className = "signup-form-div">
                    <Form>
                        <Row className="mb-3 row g-0" >
                            <Form.Group as={Col} xs = {10} lg = {8} className  = "mx-auto" controlId="formGridEmail">
                            <Form.Label className = "signup-label">Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" value = {userEmail} onChange = {(e) => {setUserEmail(e.target.value)}}/>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 row g-0">
                            <Form.Group as={Col} xs = {10} lg = {8} className  = "mx-auto" controlId="formGridPassword">
                            <Form.Label className = "signup-label">Password</Form.Label>
                            <Form.Control type="password" placeholder="At least 5 characters" value = {userPassword} onChange = {(e) => {setUserPassword(e.target.value)}}/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 row g-0">
                            <Form.Group as={Col} xs = {10} lg = {8} className  = "mx-auto" controlId="formGridPassword">
                            <Form.Label className = "signup-label">Username</Form.Label>
                            <Form.Control type="text" placeholder="For example: QuantumSeaweed" value = {username} onChange = {(e) => {setUserName(e.target.value)}}/>
                            </Form.Group>
                        </Row>

                        <Row className="mb-3 row g-0">
                            <Form.Group as={Col} xs = {10} lg = {8} className  = "mx-auto" controlId="formGridPassword">
                            <Form.Label className = "signup-label">Color</Form.Label>
                            <Form.Control  type="color" onChange = {(e) => {setUserColor(e.target.value)}}/>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3 row g-0">
                            <Col className = "mx-auto text-center" xs = {6} lg = {3}>
                                <button className="sign-up-button" onClick = {(e) => createNewUser(e)}>Sign Up</button> 
                            </Col>
                            
                        </Row>
                        <Row>
                            <Col className ="d-flex justify-content-center">
                                <Link  to = "/login" className = "login-return-label">
                                    <Icon className = "return-arrow" icon="akar-icons:arrow-left" color="white" rotate={2} hFlip={true} vFlip={true} />
                                </Link>

                            </Col>
                        </Row>
                        
                    </Form>
                </div>
            </Col>
        </Row>
        </div>
    )

}

export default Signup