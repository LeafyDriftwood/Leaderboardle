import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import './App.css';
import Home from './Home/Home'
import Home2 from './Home/Home2/Home2'

import Login from './Login/login'
import Leaderboard from './Leaderboard/Leaderboard'
import LeaderboardScreen from './Leaderboard/LeaderboardScreen'
import Profile from './Profile/Profile2/Profile'
import Signup from './Login/signup'


import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate} from 'react-router-dom';
import GuessDisplay from './GuessDisplay/GuessDisplay';
import ManualEntry from './ManualEnter/ManualEntry';
import MyChallenges from './Challenges/MyChallenges';
import OtherChallenges from './Challenges/OtherChallenges';
import ChallengeWordle from './Challenges/ChallengeWordle';
import ChallengeScreen from './Challenges/ChallengeScreen';
import ChallengeGuessDisplay from './GuessDisplay/ChallengeGuessDisplay';
import JoinChallenge from './JoinURL/JoinChallenge';
import JoinLeaderboard from './JoinURL/JoinLeaderboard';
import PasswordReset from './Login/passwordreset';
import ErrorPage from './Errors/ErrorPage';
import ChangePassword from './Profile/Profile2/ChangePassword'




function App() {


  // keep track of whether user is logged in
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false)

  // get screen width and render appropriate home component
  let width = window.innerWidth;
  let homeEle = <Home />
  if (width < 480) (
    homeEle = <Home2 />
  )


  // return the App component
  return (
      
    <Router>
        <Routes>
            <Route path="/" element={homeEle}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/passwordreset" element={<PasswordReset />}/>
            <Route path="/leaderboards" element={<Leaderboard />}/>
            <Route path="/leaderboard/:code" element={<LeaderboardScreen />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/guessdisplay/:code/:uid/:date" element={<GuessDisplay />}/>
            <Route path="/manual/:uid/:date" element={<ManualEntry />}/>
            <Route path="/mychallenges" element={<MyChallenges />}/>
            <Route path="/otherchallenges" element={<OtherChallenges />}/>
            <Route path="/challengewordle/:challengeID/:uid" element={<ChallengeWordle />}/>
            <Route path="/challengescreen/:challengeID" element={<ChallengeScreen />}/>
            <Route path="/challengeguessdisplay/:challengeID/:uid" element={<ChallengeGuessDisplay />}/>
            <Route path = "/joinchallenge/:challengeID" element = {<JoinChallenge />}/>
            <Route path = "/joinleaderboard/:leaderboardID" element = {<JoinLeaderboard />}/>
            <Route path = "/changepassword" element = {<ChangePassword />}/>
            <Route path = "/*" element = {<ErrorPage />}/>
        </Routes>
      </Router> 
    );
}

export default App;
