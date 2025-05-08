

import React, { useEffect, useState } from 'react'
import './TripHistory.css'
import { doc, collection, deleteDoc, getDocs, query, where,  } from 'firebase/firestore'
import { db } from '../../../service/firebaseConfig'

import getPlaceImages from '../../../service/PlaceImages'
import { useNavigate } from 'react-router-dom'


const TripData = () => {
    const [user, setUser] = useState('')
    const [userEmail, setuserEmail] = useState('')
    const [userTrips, setuserTrips] = useState([])
    const [tripImages, settripImages] = useState({})//it is a object accesses used . operator and  stored []: value


    const Navigate = useNavigate();

    const handleNavigate = (tripId)=>{
      Navigate(`/view-trip/${tripId}`)
    }

    useEffect(() => {
        const fetchuser  = localStorage.getItem('user')
        const parseduser  = JSON.parse(fetchuser)
        setuserEmail(parseduser?.email)
        setUser(parseduser)
    }, [])

    useEffect(() => {
      fetchTripHistory(userEmail)
    }, [user])

    const fetchTripHistory = async (email)=>{
        console.log(email)
        const tripref = collection(db, 'AiGeneratedTrips')
        const q = query(tripref, where('userId.email','==' , email))
        

        const querySnapshot = await getDocs(q);
        setuserTrips([])
        console.log(" consoling the querysnapshot ")
        console.log(querySnapshot)
        const trips = querySnapshot.docs.map(doc =>({
          id : doc.id,
          ...doc.data()
        }))
        setuserTrips(trips)
        console.log(trips) 

        trips.forEach(trips =>{
          if(trips?.destination)
          {
            fetchimages(trips?.id, trips?.destination)
          
          }
        })

     

    }



    const fetchimages = async(tripId, destination)=>{
      const url = await getPlaceImages(destination)
      settripImages(prev => ({...prev, [tripId]: url}))
    }

    const handledelete = async(tripid)=>{
      
      try{
        confirm(" Are you sure ")
        await deleteDoc(doc(db,'AiGeneratedTrips', tripid))
        window.location.reload();
        alert("Deleted")
        
      }catch(err)
      {
        alert("Error Occured During Delete")
        console.log("error in deleting", err)
      }
    }
    
    
  
  return (
    <>
      <div className="trip-container">
        <h2 className='heading2'>My Trips</h2>
          <div className="grid-container">
            {userTrips ?  (
              userTrips.map((tripdata, index)=>(
                
                <div className="placess-card" key = {index}  onClick={()=>handleNavigate(tripdata?.id)} >
                  <img src={`${import.meta.env.VITE_BACKEND_URL}/image?url=${encodeURIComponent(tripImages[tripdata?.id])}`} alt="placeimage" />
                  <h2>Destination : {tripdata?.destination}</h2>
                  <h2>Days : {tripdata?.days}</h2>
                  <div className="delete-btn-div"><button className='delete-btn' onClick={(e)=>{e.stopPropagation();
                    handledelete(tripdata?.id)}}>Delete</button></div>
                </div> 
              ))
            ) : "Nothing is Stored"}
          </div>
      </div>
      
    </>
  )
}

export default TripData