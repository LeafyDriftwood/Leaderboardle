import { useState, useEffect } from 'react';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { Icon } from '@iconify/react';
import { useNavigate, Link} from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { getDatabase, ref, onValue, push, child, update} from "firebase/database";
import './commonStyle.css'
import 'bootstrap/dist/css/bootstrap.min.css';



function NavBar() {

    // firebase consts
    const auth = getAuth()

    // navigate const
    const navigateTo = useNavigate()

    // states for username and color
    const [profileName, setProfileName] = useState("")
    const [profileColor, setProfileColor] = useState("")

    // load profile anmd and color
    const getProfileInfo = () => {

        // get firebase consts
        const db = getDatabase()
        const user = auth.currentUser

        // make call to db
        const userRef = ref(db, 'users/' + user!.uid);
        onValue(userRef, (snapshot) => {
            const data  = snapshot.val()
            setProfileColor(data.color)
            setProfileName(data.name)
        })


    }

    // signout user if logout is pressed
    function signOutUser() {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            navigateTo('/login')
        }).catch((error) => {
            // An error happened.
        });
    }

    // use effect for profile name
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                getProfileInfo()
            }
        })
    }, [])

    return (

        <Navbar className = "navbar" expand="lg"  bg = "dark" variant="dark">
            <Navbar.Brand>
                <Link to="/">
                 {/*<Icon className = "durdle" icon="simple-icons:redwoodjs" color="white" width='30px'/> */}
                 <img src = {require('../Images/pine-cone.png')} width = '40px' style = {{marginLeft: '20px'}}/>
                </Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" className= "toggle" />
            <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
                <Nav.Link as={Link} to= "/leaderboards" className = "nav-buttons">Leaderboards</Nav.Link>
                <NavDropdown menuVariant="dark" align={{ lg: 'start' }} className = "challenge-nav-title"
                title = "Challenges" id="collasible-nav-dropdown">
                    <NavDropdown.Item as={Link} to= "/mychallenges" >My Wordles</NavDropdown.Item>
                    <NavDropdown.Item  as={Link} to= "/otherchallenges" >Other Wordles</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown menuVariant="dark" align={{ lg: 'end' }} className ="dropdown-menu-right"
                title = 
                    {<div className = "navbar-user-profile-icon" style = {{background: profileColor}}>
                        {profileName[0]}
                    </div>} 
                id="collasible-nav-dropdown">
                    <NavDropdown.Item as={Link} to= "/profile" >Profile</NavDropdown.Item>
                    <NavDropdown.Item  onClick={signOutUser}>Sign Out</NavDropdown.Item>
                </NavDropdown>
            </Nav>
            </Navbar.Collapse>
    </Navbar>   
    )

}

export default NavBar