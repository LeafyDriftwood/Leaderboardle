import { useState, useEffect } from 'react'; 
import { Icon } from '@iconify/react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Row, Col, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function PasswordReset () {

    // firebase auth
    const auth = getAuth();

    // state for email
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [error, setError] = useState(false)

    // set loading to true, and send email
    const sendEmail = () => {
        setLoading(true)
        resetPassword()
    }

    // reset password
    const resetPassword = () => {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            setLoading(false)
            setCompleted(true)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            setLoading(false)
            setError(true)
        })
    }

    return (
        <div className = "join-url">
            <img src = {require('../Images/pine-cone.png')} className = "durdle-icon" width = '90px'/>
            <h2 className = "leaderboardle-header">Leaderboardle</h2>
            {(!loading && !completed && !error) &&
                <div className = "info-container">
                    <Icon icon="iconoir:profile-circled" color="white" width='40px'/>
                    <label className="email">
                        <input className = "login-form" type="email" placeholder = "Email" value = {email} 
                        onChange = {e => {setEmail(e.target.value); }}/>
                    </label>
                </div>
            } 
            {loading &&
                <Spinner animation="border" role="status" className = "loading-spinner">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            }
            {completed &&
                <div className = "reset-confirmation-container ">
                    <Icon icon="teenyicons:tick-circle-solid" color="#11f515" width='40px' className = "checkmark-icon"/>
                    <div className = "invalid-challenge-text">
                        An email has been sent!
                    </div> 
                </div>
            }
            {error &&
            <div>
            <Row>
                <Col>
                <div className = "reset-confirmation-container ">
                    <Icon icon="akar-icons:circle-x-fill" color="darkred" width='40px' className = "checkmark-icon"/>
                    <div className = "invalid-challenge-text">
                        Oops! An error occurred.
                    </div> 
                    </div>
                </Col>
            </Row>
                
                    <Row>
                        <Col>
                        <div className = "join-text-button">
                            <button className="join-url-buttons" onClick = {() => {setLoading(false); setCompleted(false); setError(false)}}>Try Again</button>    
                        </div>
                        </Col>
                    </Row>
                    
             </div>
            }
            {(!completed && !loading && !error) &&
            <div className = "join-text-button">
                <button className="join-url-buttons" onClick = {sendEmail}>Reset</button>    
            </div>
            }
            {!loading &&
            <Row>
                <Col className ="d-flex justify-content-center">
                    <Link  to = "/login" className = "login-return-label">
                        <Icon className = "return-arrow" icon="akar-icons:arrow-left" color="white" rotate={2} hFlip={true} vFlip={true} />
                    </Link>

                </Col>
            </Row>
            }
        </div>
    )
}

export default PasswordReset