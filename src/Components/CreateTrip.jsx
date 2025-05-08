import { useState } from 'react';
// import '../index2.css';
import '../CreateTripStyle.css'
import { BugetOption, MembersOptions } from '../assets/Options';
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';






const CreateTrip = () => {
  const [destination, setdestination] = useState()
  const [days, setdays] = useState()
  const [budget, setbudget] = useState()
  const [members, setmembers] = useState()

  const [showPopOver, setShowPopOver] = useState(false);
  const [openDialogBox, setopenDialogBox] = useState(false)
  const [loading, setloading] = useState(false)




  const navigate = useNavigate();
  

  const handlegenerateTrip = async()=>{
    setloading(true)
    const userId = localStorage.getItem('user');
    if(!userId)
    {
      setopenDialogBox(true)
      setloading(false)
      return;
    }
   
    if(!destination || !days || !budget || !members ){
      alert(" Fill all the fields before clicking on the generate trip")
      return;
    }
    else{
      const tripData = {destination, days, budget, members, userId}
      try
      {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-trip`,{
          method : "POST",
          headers :{"Content-Type": "application/json"},
          body :JSON.stringify(tripData)
        });

        if(!response.ok)
        {
          console.log("error occurred at response")
        }
        else
        {
          const data = await response.json();
          if(data.success)
          {
            
            navigate(`/view-trip/${data.docId}`)
          } 
        }
      }
      catch(error)
      {
        console.log("error occured while fetch", error)
        alert("failed to connect server")
      }
      finally
      {
        setloading(false)
      }
    }
  }

  const login = useGoogleLogin({ 
    onSuccess: (codeResponse) => getuserProfile(codeResponse), 
    onError: (error) => console.log(error),
    ux_mode: "redirect",  
     //redirect_uri: "http://localhost:5174"  Ensure this matches the Google Console URI
     redirect_uri :  "https://setmytrip-production.up.railway.app"
  });
  
  const getuserProfile = (tokeninfo) => {
    console.log("getuserprofile method is called ");
    // console.log("Token Info:", tokeninfo);  // Debugging
    if(tokeninfo)
    {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokeninfo.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokeninfo.access_token}`,
          Accept: "application/json"
        }
      }).then((res) => {
        console.log("User Profile:", res.data);
        localStorage.setItem("user",JSON.stringify(res.data))
        alert(" login Successfull Enter the Information ")
        window.location.reload()
        setopenDialogBox(false)

        // handlegenerateTrip();
        
      }).catch((error) => {
        console.error("Error fetching user profile:", error);
      });
    }
    else{
      console.log(" no access token found")
      return
    }
  };

  return (
    <>
      <div className="container-main">
        <div className="sub-container-main">
          <div className="block1">Tell us your Preferences 
              <div className='subdiv'>Provide the basic information about the trip and AI will completely generate the plan.</div>
          </div>

          <div className="block2">What is your Destination place?
            <div className="subdiv2">
              
                <input className='inputtag2' type="text" placeholder='Enter destination' value={destination} onChange={(e)=>{setdestination(e.target.value)} }/>
            
            </div>
          </div>

          <div className="block2">How many days are you planning for your trip?
            <div className="subdiv2"><input  className='inputtag2' type="number" placeholder='Ex: 3'  value={days} onChange={(e)=>{setdays(e.target.value)}}/></div>
          </div>

          <div className="block3">What is your Budget for your trip?
            <div className="subdiv3">
              {BugetOption.map((item) => (
                <div  key={item.id} onClick={()=>{setbudget(item.title)}} className={`item-div ${budget === item.title ? "selected-item" : " "}`}>
                  {item.title}
                  <div className='desc-div'>{item.desc}</div>
                  {item.icon && <img className='icon-image' src={item.icon} alt="icon" />}
                </div>
              ))}
            </div>
          </div>

          <div className="block4">
            How Many Members are travelling?
            <div className="subdiv4">
              {MembersOptions.map((item) => (
                <div  key={item.id} onClick={()=>{setmembers(item.title)}} className={`item-div ${members === item.title ? "selected-item": ""}`}>
                  {item.title}
                  {item.icon && <img className='icon-image2' src={item.icon} alt="icon" />}
                </div>
              ))}
            </div> 
          </div>
        </div>
      </div> 
      <div className="buttons">
        <button disabled = {loading} onClick={handlegenerateTrip}>
          { loading ? <AiOutlineLoading3Quarters className='loading-icon'/>: "Generate Trip"}
        </button>
      </div>

      
    

      {/* Dialog Box for User Not Logged In */}
      {openDialogBox && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <img className='logo-db' src="public/logo.png" alt="" />
            <div>Login required to continue</div>
            <button onClick={login}>Sign in using Google</button>
            <div>
              <button className="close" onClick={()=>{setopenDialogBox(false)
              setloading(false)}}>Close</button>
            </div>
          </div>
        </div>
      )}


    </>
  );
};

export default CreateTrip;
