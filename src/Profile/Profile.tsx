import React, {useEffect, useState} from 'react';
import NavBar from '../CommonComp/NavBar'
import {useNavigate} from "react-router-dom";
import Grid from '../CommonComp/Grid'
import { getDatabase, ref, onValue, DataSnapshot, update} from "firebase/database";
import { initializeApp} from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {Row, Col, Form, Toast, ToastContainer} from "react-bootstrap"

import 'bootstrap/dist/css/bootstrap.min.css';


import './style.css'
import { isNullishCoalesce } from 'typescript';
import SuccessToast from '../CommonComp/SuccessToast';
import FailureToast from '../CommonComp/FailureToast'


function Profile () {

    // firebase constants
    const auth = getAuth()

    // navigate const
    const navigateTo  = useNavigate()

    // state for profile name
    const [profileName, setProfileName]  = useState("")

    // state for profile color
    const [profileColor, setProfileColor]  = useState("")

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

            updates['/users/' + user?.uid + '/name'] = profileName
            updates['/users/' + user?.uid + '/color'] = profileColor

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
        console.log(user)

        const userRef = ref(db, 'users/' + user!.uid);
        onValue(userRef, (snapshot) => {
            const data  = snapshot.val()
            setProfileColor(data.color)
            setProfileName(data.name)
            console.log(data)
        })

    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user != null) {
                getUserProfile()
            }
        });
        
    }, [])


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