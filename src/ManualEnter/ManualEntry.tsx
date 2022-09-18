import React, {useEffect, useState, useRef} from 'react';
import NavBar from '../CommonComp/NavBar';
import {Row, Col, Tooltip, OverlayTrigger, Overlay} from "react-bootstrap"
import {useLocation} from 'react-router-dom'
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import { getAuth } from "firebase/auth";
import {Link, useNavigate} from 'react-router-dom'


import DynamicGrid from "./DynamicGrid"


import './styles.css'


function ManualEntry () {



    return (
        <div>
            <NavBar />
            <Row className = "row g-0">
                    <Col className = "gridCol mx-auto" xs = {11}  md = {8} lg={4}>
                            <DynamicGrid />
                    </Col>
            </Row>
        </div>
    )
}



export default ManualEntry