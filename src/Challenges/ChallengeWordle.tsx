import React, {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col, Modal, Form, Button} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { WORDS } from "../CommonComp/Words"
import DynamicGrid from '../CommonComp/DynamicGrid';
import NavBar from "../CommonComp/NavBar"

function ChallengeWordle () {

    // initialize firebase consts
    const auth = getAuth();

    // state for solution
    const [solution, setSolution] = useState("")

    // get params
    const params = useParams();

    // read in solution from db
    const getSolution = () => {

        // get database
        const db = getDatabase()

        // listings ref
        const challengeRef = ref(db, "challenges/" + params.challengeID)

        // get user
        const user = auth.currentUser
        
        onValue(challengeRef, (snapshot) => {
            const challengeInfo = snapshot.val();
            setSolution(challengeInfo.word)
        })
    }

    // use effect to get user's challenge info
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, user => {
            if (user) {
                getSolution()
            }
        });
    }, [])

    if (solution !== "") {
        return (
            <div>
                <NavBar />
                <Row className = "row g-0">
                        <Col className = "gridCol mx-auto" xs = {11}  md = {8} lg={4}>
                            <DynamicGrid solution = {solution} challengeID = {params.challengeID as string}/>
                        </Col>
                </Row>
            </div>
        
        )
    }
    else {
        return (
            <div>
                <NavBar />
            </div>
        
        )

    }

}

export default ChallengeWordle;