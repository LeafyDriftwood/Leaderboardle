import { useState}  from 'react';
import { useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import { Row, Col, Spinner } from "react-bootstrap"
import { getAuth, updatePassword } from '@firebase/auth';
import NavBar from '../../CommonComp/NavBar';


function ChangePassword () {

    // auth const
    const auth = getAuth();


    // navigate const
    const navigateTo = useNavigate()

    // loading state
    const [loading, setLoading] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // handle on click for reset password
    const handleReset = () => {
        setLoading(true)
        isValidPassword()
    }

    // check valid password
    const isValidPassword = () => {

        if (!(newPassword === confirmPassword)) {
            setError("Passwords do not match")
            setLoading(false)
        } else if (confirmPassword.length < 5) {
            setError("Password must be at least 5 characters")
            setLoading(false)
        } else {
            setError('')
            resetPassword()
        }

    }

    // reset password
    const resetPassword = () => {

        // get user
        const user = auth.currentUser!; 
        
        // reset password
        updatePassword(user, newPassword).then(() => {
            setSuccess(true)
            setLoading(false)
          }).catch((error) => {
            // An error ocurred
            setError(error)
          }); 

    }


    

    return (
        <div>
        <NavBar />
        <div className = "join-url">
            <img src = {require('../../Images/pine-cone.png')} className = "pinecone-icon" width = '90px' onClick = {() => navigateTo('/')}/>
            <h2 className = "leaderboardle-header">Reset Password</h2>
            {loading && 
                <Spinner animation="border" role="status" className = "loading-spinner">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            } 
            {error !== '' &&
                <Row>
                    <Col>
                    <div className = "reset-confirmation-container ">
                        <Icon icon="akar-icons:circle-x-fill" color="darkred" width='40px' className = "checkmark-icon"/>
                        <div className = "invalid-challenge-text">
                            {error}
                        </div> 
                        </div>
                    </Col>
                </Row>

            }
            {(!loading && !success) &&
            <div>
            <div className = "new-password-container">
                <label>
                    <input className = "new-password-form" type="password" placeholder = "New password" value = {newPassword} 
                    onChange = {e => {setNewPassword(e.target.value); }}/>
                </label>
                <label>
                    <input className = "new-password-form" type="password" placeholder = "Confirm password" value = {confirmPassword} 
                    onChange = {e => {setConfirmPassword(e.target.value); }}/>
                </label>
            </div>
                <Row>
                    <Col>
                    <div className = "join-text-button">
                        <button className="join-url-buttons" onClick = {handleReset}>Reset</button>    
                    </div>
                    </Col>
                </Row>
            </div>
            } 
            {success &&
                <div>
                    <div className = "reset-confirmation-container ">
                        <Icon icon="teenyicons:tick-circle-solid" color="#11f515" width='40px' className = "checkmark-icon"/>
                        <div className = "invalid-challenge-text">
                            Update successful!
                        </div> 
                    </div>
                    <Row>
                        <Col>
                        <div className = "join-text-button">
                            <button className="join-url-buttons" onClick = {() => navigateTo('/')}>Home</button>    
                        </div>
                        </Col>
                    </Row>
                </div>
            }
        
        </div>
        </div>

    )


}

export default ChangePassword