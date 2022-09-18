import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Toast, ToastContainer, Modal, Form, Button} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { AuthErrorCodes, getAuth, onAuthStateChanged } from "firebase/auth";
import { WORDS } from "../CommonComp/Words"
import NavBar from '../CommonComp/NavBar';


function JoinWordle () {

    // firebase consts
    const auth = getAuth();

    // navigate consts
    const navigateTo = useNavigate();

    // declare const states
    const [code, setCode] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [invalidText, setInvalidText] = useState("")

    // consts for modal
    const handleClose = () => {setShowModal(false); setCode(""); setInvalidText("")}
    const handleOpen = () => setShowModal(true)


    
    // get wordle associated with this code
    const getWordle = () => {

        // get database
        const db = getDatabase()

        // listings ref
        const challengeRef = ref(db, "challenges/" + code)

        // get user
        const user = auth.currentUser
        
        onValue(challengeRef, (snapshot) => {
            if (!snapshot.exists()) {

                // error message
                setInvalidText("Invalid wordle code")
            }
            else {
                const challengeInfo = snapshot.val()
                if (Object.keys(challengeInfo.members).includes(user!.uid)) {
                    // error message
                    setInvalidText("You have already completed this wordle")
                }
                else if (challengeInfo.owner === user!.uid) {
                    // error message
                    setInvalidText("You are the owner of this wordle")
                    
                } else {
                    navigateTo("/challengewordle/" + code + "/" + user!.uid)
                }
            }
        })

    }

    // enter key detection on modal
    const keySignin = (e : any) => {
        if (e.key === "Enter") {
            e.preventDefault()
            getWordle()
        }
    }


    return (
        <div>
            <div className = "create-wordle" onClick = {handleOpen}>
                <Icon icon="akar-icons:circle-plus" className = "plus-icon" color="white" rotate={2} width='30px' />
                Join Wordle
            </div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Join Wordle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Wordle Code </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter code..."
                            autoFocus
                            onChange={e => setCode(e.target.value)}
                            value = {code}
                            onKeyDown={(e) => keySignin(e)}
                        />
                        </Form.Group>
                    </Form>
                    {invalidText !== "" &&
                        <div className = "error-text">
                            {invalidText}
                        </div>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary"  onClick = {getWordle}>
                        Join Wordle
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default JoinWordle;