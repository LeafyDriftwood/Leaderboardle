import { useState } from 'react';
import './commonStyle.css'
import 'typeface-roboto'
import 'bootstrap/dist/css/bootstrap.min.css';

interface SquareProps {
    value: string;
    color: string;
    borderColor: string;
    shrunk: boolean;

}

function Square (props: SquareProps) {

    const regstyle = {

        border: '2px solid' + props.borderColor,
        background: props.color,
        
        
    }

    const shrunkstyle = {
        border: '1px solid' + props.borderColor,
        background: props.color,
        width: '30px',
        height: '30px',
        fontWeight: '400',
        fontSize: '18px',
        lineHeight: '27px',
        marginRight: '0.085pc',
        marginLeft: '0.085pc',
        borderRadius: '2px'
        
    }

    if(props.shrunk) {
        return (
            <div className = "square"  style={shrunkstyle}>{props.value.toUpperCase()}</div>
        )

    }
    else {
        return (
            <div className = "square"  style={regstyle}>{props.value.toUpperCase()}</div>
        )
    }
    

}

export default Square