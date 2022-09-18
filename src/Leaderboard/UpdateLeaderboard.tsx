import React, {useEffect, useState} from 'react';
import { Icon } from '@iconify/react';
import { Row, Col, Modal, Button, Form, Dropdown, DropdownButton} from "react-bootstrap"
import { getDatabase, ref, onValue, push, remove, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {useLocation, useNavigate} from 'react-router-dom'
import NavBar from '../CommonComp/NavBar';


import './styles.css'
import { stringify } from 'querystring';

// props of the UpdateLeaderboardProps
interface UpdateLeaderboardProps {
    style : {[key: string] : string}
    color: string
    title: string
    code: string
    
}

function UpdateLeaderboard(props: UpdateLeaderboardProps) {

    // color map
    
    const nameToColor : { [id: string] : string; } = {"#527744" : "green", "#446E77": "aqua", "#A4912C": "ochre", "#445077": "navy", "#4C4477": "indigo", "#6A4477": "violet", "#774444": "red", "#77445c" : "indianred"};
    // firebase consts
    const auth = getAuth()

    // States for modal
    const [showModal, setShowModal] = useState(false);
    const [color, setColor] = useState(nameToColor[props.color])
    const [name, setName] = useState(props.title)

    // functions to open and close modal
    const handleShow = () => setShowModal(true)
    const handleClose = () => setShowModal(false)

    // navigate consts
    const navigateTo = useNavigate()

    // Update leaderboard and send info to firebase
    const updateLeaderboard = () => {

        // firebase constants
        const db = getDatabase()

        // Write the new post's data simultaneously in the leaderboard list and the user's leaderboard list.
        const updates : {[key: string] : string} = {};

        updates['/leaderboards/' + props.code + "/title"] = name;
        updates['/leaderboards/' + props.code + "/color"] = color;

        // Commit updates
        update(ref(db), updates);


    }

    // const delete leaderboard and reroute to Leaderboards
    const deleteLeaderboard = () => {

        // firebase consts
        const db = getDatabase()

        // get leaderboard ref
        const leaderboardRef = ref(db, "leaderboards/" + props.code + "/members")

        onValue(leaderboardRef, (dataSnapshot) => {

            // dictionary mapping user num to id
            const members : {[key: number]: string} = dataSnapshot.val()

            // Get all userIds for this leaderboard
            const userIDs = Object.keys(members)

            // Loop through each user id, and remove from leaderboard
            for(let userID in userIDs) {

                // get ref to user and remove
                const userRef = ref(db, "users/" + userIDs[userID] + "/leaderboards/" + props.code)
                remove(userRef)
            }

            // remove leaderboard
            const leaderboardRef = ref(db, "leaderboards/" + props.code)
            remove(leaderboardRef)

            // navigate to leaderboards
            navigateTo("/leaderboards")


        })

    }

    return (
        <div>
            
            <button className = "leave-button" style = {props.style} onClick = {handleShow}>Edit</button>
            
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Update Leaderboard</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Leaderboard </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Awesome leaderboard title"
                        autoFocus
                        value = {name}
                        onChange={e => setName(e.target.value)}
                    />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                    <Form.Label>Leaderboard Color</Form.Label>
                    <Form.Select aria-label="Default select example" defaultValue = {nameToColor[props.color]} onChange={e => setColor(e.target.value)}>
                        <option value="violet">Violet</option>
                        <option value="indigo">Indigo</option>
                        <option value="red">Red</option>
                        <option value="indianred">Maroon</option>
                        <option value="aqua">Aqua</option>
                        <option value="navy">Navy</option>
                        <option value="ochre">Ochre</option>
                        <option value="green">Green</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => {handleClose(); updateLeaderboard();}} disabled = {!(name.length > 1)}>
                    Update Leaderboard
                </Button>
                <Button variant="secondary" onClick={() => {handleClose(); deleteLeaderboard();}}>
                    Delete Leaderboard
                </Button>
                </Modal.Footer>
            </Modal>
            
        </div>
    )

}

export default UpdateLeaderboard