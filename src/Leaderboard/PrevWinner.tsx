import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { Icon } from '@iconify/react';
import {Row, Col} from "react-bootstrap"
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";

interface PrevWinnerProps {
    userScores: {[key: string]: number}
}

function PrevWinner (props: PrevWinnerProps) {

    // state for winner name
    const [winner, setWinner] = useState("")

    // get the winner's name
    const getWinnerName = () => {
        const result = Object.entries(props.userScores).reduce((a, b) => a[1] < b[1] ? a : b)[0]
        
        const db = getDatabase()
        const scoreRef = ref(db, "users/" + result)

        onValue(scoreRef, (snapshot) =>{
            console.log(props)
            console.log(result)
            setWinner(snapshot.val().name)
        })
    }

    useEffect(() => {
        getWinnerName()
    }, [props.userScores])

    return (
        <div className = "prev-winner-text">
            {winner}
        </div>
    )

}

export default PrevWinner; 