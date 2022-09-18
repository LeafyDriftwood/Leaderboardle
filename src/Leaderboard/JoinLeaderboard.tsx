import React, {useEffect, useState, KeyboardEvent} from 'react';
import { Icon } from '@iconify/react';
import { Row, Col, Modal, Button, Form, Dropdown} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import SuccessToast from '../CommonComp/SuccessToast'

interface joinLeaderboardProps {
    refreshFunc : () => void
}

function JoinLeaderboard(props: joinLeaderboardProps) {

    // firebase constants
    const auth = getAuth()

    // States for modal
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [code, setCode] = useState("")
    const [invalidText, setInvalidText] = useState("")

    // functions to open and close modal
    const handleShow = () => {setShowModal(true); setInvalidText("")}
    const handleClose = () => setShowModal(false)

    // function to join the new leaderboard
    const joinLeaderboard = () => {

        // check if user has already joined this leaderboard

        const user = auth.currentUser
        const db = getDatabase()
        const leaderboardRef = ref(db, 'leaderboards/' + code+"/")

        onValue(leaderboardRef, (snapshot) => {

            const data : {color: string, owner : string, title: string, numMembers: number, members: {[key: number]: string}} = snapshot.val();

            if (Object.keys(data.members).includes(user!.uid)) {
                // error message
                setInvalidText("You have already joined this leaderboard")
            } 
            else if(snapshot.exists()) {

                // define constants for updates for users and leaderboards
                const userUpdates : {[key: string] : string} = {};
                const leaderboardUpdates: {[key: string]: any} = {}
                const leaderboardName = data.title

                // make updates
                userUpdates['/users/' + user?.uid + '/leaderboards/' + code] = leaderboardName;
                leaderboardUpdates['/leaderboards/' + code + '/numMembers'] = data.numMembers + 1;
                leaderboardUpdates['/leaderboards/' + code + '/members/' + user?.uid] = data.numMembers

                update(ref(db), userUpdates);
                update(ref(db), leaderboardUpdates);

                handleClose();
                setShowToast(true)
                
                
            } else {
                // error message
                setInvalidText("Invalid leaderboard code")

            }
        },
        { 
            onlyOnce: true
        });

    }

    // enter key detection on modal
    const keySignin = (e : any) => {
        if (e.key === "Enter") {
            e.preventDefault()
            joinLeaderboard(); 
            props.refreshFunc()
        }
    }

    return (
        <div>
        <div className = "join-leaderboard" onClick = {handleShow}>
            <Icon icon="akar-icons:circle-plus" className = "plus-icon" color="white" rotate={2} width='30px' />
            Join Leaderboard
        </div>

        <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Join Leaderboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Leaderboard Code</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter leaderboard code"
                autoFocus
                onChange={e => setCode(e.target.value)}
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
        <Button variant="secondary" onClick={() => {joinLeaderboard(); props.refreshFunc()}} >
            Join Leaderboard
        </Button>
        </Modal.Footer>
        </Modal>
        <SuccessToast show = {showToast} text = {"Leaderboard successfully joined!"} onClose = {setShowToast}/>
        </div>
    )

}

export default JoinLeaderboard