import React, {useEffect, useState} from 'react';
import { Icon } from '@iconify/react';
import { Row, Col, Modal, Button, Form, Dropdown, DropdownButton} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SuccessToast from "../CommonComp/SuccessToast"


import './styles.css'

function CreateLeaderboard() {
    
    // firebase consts
    const auth = getAuth()

    // States for modal
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false)
    const [color, setColor] = useState("Violet")
    const [name, setName] = useState("")

    // functions to open and close modal
    const handleShow = () => setShowModal(true)
    const handleClose = () => setShowModal(false)

    // Create leaderboard and send info to firebase
    const createLeaderboard = () => {

        const user = auth.currentUser
        const db = getDatabase()

        // Entry for new post
        // A post entry.
        const postData = {
            owner: user?.uid,
            title: name,
            color: color.toLowerCase(),
            numMembers: 1,
            members: {
                [user?.uid as string]: 0
            }
        };

        // Get a key for a new Post.
        const newPostKey = push(child(ref(db), 'leaderboards')).key; 

        // Write the new post's data simultaneously in the leaderboard list and the user's leaderboard list.
        const updates : {[key: string] : string | { owner: string | undefined; title: string; color: string; }} = {};

        updates['/leaderboards/' + newPostKey] = postData;
        updates['/users/' + user?.uid + '/leaderboards/' + newPostKey] = postData.title;

        // Commit updates
        update(ref(db), updates);

        // display confirmation toast
        setShowToast(true)


    }

    return (
        <div>
            <div className = "create-leaderboard" onClick = {handleShow}>
                <div className = "create-leaderboard-text">
                    <Icon icon="akar-icons:circle-plus" className = "plus-icon" color="white" rotate={2} width='30px' />
                    Create Leaderboard
                </div>
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Create Leaderboard</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Leaderboard </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Awesome leaderboard title"
                        autoFocus
                        onChange={e => setName(e.target.value)}
                    />
                    </Form.Group>
                    <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                    >
                    <Form.Label>Leaderboard Color</Form.Label>
                    <Form.Select aria-label="Default select example" onChange={e => setColor(e.target.value)}>
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
                <Button variant="secondary" onClick={() => {handleClose(); createLeaderboard();}} disabled = {!(name.length > 2) || !(name.length < 18)}>
                    Create Leaderboard
                </Button>
                </Modal.Footer>
            </Modal>
            <SuccessToast show = {showToast} text = {"Leaderboard created!"} onClose = {setShowToast}/>
            
        </div>
    )

}

export default CreateLeaderboard