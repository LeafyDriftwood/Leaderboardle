import { Dispatch, SetStateAction } from "react";
import {Row, Col, Form, Toast, ToastContainer} from "react-bootstrap"
import { Icon } from '@iconify/react';


interface ToastProps {
    show: boolean;
    text: string;
    onClose: Dispatch<SetStateAction<boolean>>;
}


function SuccessToast (props: ToastProps) {

    return (
        <ToastContainer className="p-3" position={'top-center'} >
            <Toast show = {props.show} onClose = {() => props.onClose(false)} style={{ background: "#2a4231" , color: "white"}} autohide>
                <Toast.Header closeButton={true} style={{ background: "#436e4f", color: "white"}}>
                <img src = {require('../Images/pine-cone.png')} width = '30px'/>
                {/*<Icon icon="simple-icons:redwoodjs" color="white" width='30px' /> */}
                <strong className="me-auto" style = {{marginLeft: "10px"}}>Leaderboardle</strong>
                </Toast.Header>
                <Toast.Body>{props.text}</Toast.Body>
            </Toast>
        </ToastContainer>
    )

}

export default SuccessToast