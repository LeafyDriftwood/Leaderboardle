import { useState } from 'react';
import './commonStyle.css'
import Square from './Square'

interface RowProps {
    values: string[];
    colors: string[];
    borderColors: string[];
    shrunk: boolean;
}

function Row (props: RowProps) {


    const shrunkstyle = {
        marginBottom: '0.18pc',
    }


    if (props.shrunk) {

        return (
            <div className = "row-normal" style = {shrunkstyle} >
                {props.values.map((ele, index) => (
                    <Square key={index} borderColor ={props.borderColors[index]} 
                        color ={props.colors[index]} 
                        value={props.values[index]}
                        shrunk = {props.shrunk} />
                ))}
        
            </div>
        )
    

    }
    else {
        return (
            
            <div className = "row-normal" >
                {props.values.map((ele, index) => (
                    <Square key={index} borderColor ={props.borderColors[index]} 
                        color ={props.colors[index]} 
                        value={props.values[index]}
                        shrunk = {props.shrunk} />
                ))}
        
            </div>
        )
    }

}

export default Row