import Grid from '../CommonComp/Grid'
import {Row, Col} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import { getAuth } from "firebase/auth";

import './styles.css'

interface GuessInfo {
    splitGuesses : string[][];
    splitColors : string[][];
    splitBorderColors : string[][];
  }

interface CombineProps {
    guessInfo: GuessInfo;
    wordleNum: number;
    shrunk: boolean;
    date: string;
    uid: string;

}
function Combine (props : CombineProps) {

    // firebase auth
    const auth = getAuth()

    // navgiate const
    const navigateTo = useNavigate(); 

    // navigate to an enter manual screen
    const enterManually = () => {
        navigateTo("/manual/" + props.uid + "/" + props.date)
    }

    let style;

    if (props.wordleNum === -1) {
        style = {paddingTop: '30px'}
    }
    if(props.guessInfo.splitGuesses[0].length == 1) {
        return (
            <div>
                {props.wordleNum !== -1 &&
                <div className = "wordle-number"># {props.wordleNum}</div> }
                <div className = "unfinished-text">This wordle is incomplete</div>
                <Row className = "row g-0">
                    {props.uid === auth.currentUser!.uid &&
                     <Col className ="mx-auto manual-entry" xs = {11}  md = {7} lg={3}>
                     <button className="home-manual-entry-button" onClick = {enterManually}>Play</button>  
                     </Col> }
                 </Row>
            </div>
        )
    }
    else {

        return (
            <div style = {style}> 
                {props.wordleNum !== -1 &&
                <div className = "wordle-number" ># {props.wordleNum}</div> }
                <Grid key = {props.guessInfo.splitGuesses[3][0]} 
                    values = {props.guessInfo.splitGuesses} 
                    colors = {props.guessInfo.splitColors}
                    borderColors = {props.guessInfo.splitBorderColors} 
                    shrunk = {props.shrunk}/>    
            </div>    
            )
    }

}

export default Combine