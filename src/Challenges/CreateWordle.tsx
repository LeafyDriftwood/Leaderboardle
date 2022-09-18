import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col, Modal, Form, Button} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { WORDS } from "../CommonComp/Words"
import SuccessToast from "../CommonComp/SuccessToast"


function CreateWordle () {

    // firebase consts
    const auth = getAuth();

    // declare const states
    const [wordle, setWordle] = useState("")
    const [validWordle, setValidWordle] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [color, setColor] = useState("violet")
    const [showToast, setShowToast] = useState(false)

    // consts for modal
    const handleClose = () => { setShowModal(false); setWordle("") }
    const handleOpen = () => setShowModal(true)

    // Check whether the wordle is a valid word or not
    const handleWordCheck = (word : string) => {
        setWordle(word)
        if (word.length !== 5 || !WORDS.includes(word.toLowerCase())) {
            setValidWordle(false)
        } else {
            setValidWordle(true)
        }

    }

    // write wordle to database
    const createWordle = () => {

        // firebase consts
        const db  = getDatabase();
        const uid = auth.currentUser?.uid as string;

        // post data 
        const challengePostData = {
            owner: uid,
            word: wordle.toLowerCase(),
            color: color,
            members: ''
        };

        // Get a key for a new Post.
        const newPostKey = push(child(ref(db), 'challenges')).key; 

        // update constants
        const challengeUpdates : {[key : string] : {[key: string] : string} | string} = {}

        // set updates
        challengeUpdates['/challenges/' + newPostKey] = challengePostData;
        challengeUpdates['/users/' + uid + "/mychallenges/" + newPostKey] = wordle.toLowerCase();

        // commit updates
        update(ref(db), challengeUpdates);

        // display confirmation toast
        setShowToast(true)


    }

    return (
        <div>
            <div className = "create-wordle" onClick = {handleOpen}>
                <Icon icon="akar-icons:circle-plus" className = "plus-icon" color="white" rotate={2} width='30px' />
                New Wordle
            </div>
            <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Create Wordle</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Wordle </Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Swashbuckling word"
                    autoFocus
                    onChange={e => handleWordCheck(e.target.value)}
                    value = {wordle}
                />
                </Form.Group>
                <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
                >
                <Form.Label>Wordle Color</Form.Label>
                <Form.Select aria-label="Default select example"  onChange={e => setColor(e.target.value)}>
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
            <Button variant="secondary" onClick={() => {handleClose(); createWordle();}} disabled = {!validWordle}>
                Create Wordle
            </Button>
            </Modal.Footer>
        </Modal>
        <SuccessToast show = {showToast} text = {"Wordle created!"} onClose = {setShowToast}/>
        </div>
    )
}

export default CreateWordle;