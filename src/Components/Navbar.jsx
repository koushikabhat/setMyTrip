

import React, { useRef, useEffect, useState } from 'react';
import '../NavStyle.css';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate, useNavigation } from 'react-router-dom';


const Navbar = () => {
  const [profileImg, setProfileImg] = useState();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [showPopOver, setShowPopOver] = useState(false);

  const popoverref = useRef(null);
  const navigate = useNavigate()


  useEffect(() => {
    if (user) {
      console.log("this is a user information ", user);
      const profile = user.picture;
      console.log(profile);
      setProfileImg(profile);
    }
  }, [user]);

  const togglepopover = () => {
    setShowPopOver(prev => !prev);
    console.log(showPopOver);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverref.current && !popoverref.current.contains(e.target)) {
        setShowPopOver(false);
      }
    };

    if (showPopOver) {
      document.addEventListener('mouseup', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, [showPopOver]);

  const login = useGoogleLogin({
    onSuccess: tokenResponse => fetchUserData(tokenResponse),
    onError: error => console.log(error),
    ux_mode: "redirect",
    redirect_uri: "http://localhost:5174"
  });

  const fetchUserData = (tokendata) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokendata.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokendata.access_token}`,
        Accept: "application/json"
      }
    }).then((response) => {
      console.log(response);
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);             // ✅ update state properly
      setProfileImg(response.data.picture);
    }).catch((error) => {
      console.log("Error occurred during sign in", error);
    });
  };

  const handleSignIn = async () => {
    login(); // ✅ only login, do not call fetchUserData here
  };

  const handleLogout = () => {
    googleLogout();
    console.log("clicked logout");
    navigate('/')
    localStorage.clear();
    window.location.reload();
    
  };

  const handleMyTrips = async()=>{
    navigate('/my-trip')
  }

  const handlelogoonclick=()=>{
    navigate('/')
  }
  return (
    <>
      <div className="navbar">
        <img className='logo2-img' src="/logo.png" alt="logo" onClick={()=>handlelogoonclick()}/>
        {user ? (
          <div className='profile-div'>
            <button className="signin-btn" onClick={handleMyTrips}>My Trips</button>
            <img src={profileImg} referrerPolicy='no-referrer' className='profile-image' alt="profile" onClick={togglepopover} />
          </div>
        ) : (
          <button className='signin-btn' onClick={handleSignIn}>Sign In</button>
        )}
      </div>

      {showPopOver && (
        <div className="popover" ref={popoverref}>
          <button className="popover-btn" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </>
  );
}

export default Navbar;

