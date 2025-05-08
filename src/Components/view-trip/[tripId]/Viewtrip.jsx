import React, { use, useState } from 'react'
import { Links, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import {db} from '../../../../service/firebaseConfig.jsx'
import {doc, getDoc} from 'firebase/firestore'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import '../../../index.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import getPlaceImages from '../../../../service/PlaceImages.jsx'

const Viewtrip = () => {
 
  
  const [trip, settrip] = useState();
  const {tripId} = useParams();// use the same name as params tripId else it will throw error 
  const [bgurl, setBgUrl] = useState(null)
  const [spoturl, setSpotUrl] = useState(null)
  const [hoteImageUrl, setHotelImgUrl] = useState(null)

  const Navigate = useNavigate()

  //Image fetching 
  useEffect(() => {
    const fetchimages = async()=>{

      //for destination images 
      if(trip?.destination)
      {
        let url = await getPlaceImages(trip.destination)
        setBgUrl(url)  
      }

      //for getting hotel images 
      if(trip?.tripplan?.hotels){
        const hotelobj = {}
        for(const hotel of trip?.tripplan?.hotels)
        {
          const Hotelref = await getPlaceImages(hotel.name)
          hotelobj[hotel.name] = Hotelref
        }
        setHotelImgUrl(hotelobj)
      }
      console.log(" hotel image is fetched")
      

      //for the places 
      if(trip?.tripplan?.itinerary){
        const allplaceimages = {};
        
        for(const day of trip.tripplan.itinerary )
        {
          for(const place  of day.places){
            const placeImage = await getPlaceImages(place.name)
            allplaceimages[place.name] = placeImage
          }
        }
        setSpotUrl(allplaceimages);
      }

      
    }
    fetchimages();
  }, [trip])
  
  


  //for tripdata from the database 
  const getTripData = async()=>{
    const docref = doc(db,'AiGeneratedTrips',tripId);
    const docsnap = await getDoc(docref)

    if(docsnap.exists)
    {
      settrip(docsnap.data())
      // console.log("document data ",docsnap.data())
    }
    else{
      console.log("db fetching error")
    }
  }

  //it is for getting trip data 
  useEffect(() => {
    getTripData()
  }, [tripId])
  
  const handletrip = ()=>{
    console.log('clicked into the handlegenrate trip')
    Navigate('/create-trip')
  }

  return (
    <>
      <div className="main-page">

      
       <div className="info">
          <div className="flex-bg">
            {/* <img src="../../../../public/bg.jpg" alt="bgimage" className='bgimage' /> */}
            {bgurl && 
              (<img 
                src={`${import.meta.env.VITE_BACKEND_URL}/image?url=${encodeURIComponent(bgurl)}`} 
                alt="Trip Image" 
                className='bg-img'
              />)
            }

          </div>
          <div className="subdiv1">
            <div className='dbm'><span className='bold'>Destination 🌍</span> : <span className='bold2'>{trip?.destination}</span></div>
            <div className='dbm'><span className='bold'>Budget 💸</span> : <span className='bold2'>{trip?.budget}</span></div>
            <div className='dbm'><span className='bold'>Members 👪</span> :<span className='bold2'>{trip?.members}</span></div>
            <div className='dbm'><span className='bold'>Days 📅 </span> : <span className='bold2'>{trip?.days}</span></div>
          </div>
       </div>




       <h2 className="heading-hotel"> <span className='heading-span'>🏩 Hotel Recommendation 🛌</span></h2>
       <div className="hotels-info-div">   
          {trip?.tripplan?.hotels?.map((hotel, index) => (
            <Link to={'https://www.google.com/maps/search/?api=1&query='+ hotel?.name +" ,"+ hotel?.address} target = '_blank' key={index} className='link-element'>
              <div className="hotel-card animate-fade" >
                { hoteImageUrl && 
                  (<img src={hoteImageUrl?.[hotel.name] ? `${import.meta.env.VITE_BACKEND_URL}/image?url=${encodeURIComponent(hoteImageUrl[hotel.name])}`  : '../../../../public/bg.jpg'} alt="hotelimages" />)

                }
                <div className="hotel-name">{hotel.name}</div>
                <div className="hotel-address"> 📍{hotel.address}</div>
                <div className="hotel-price">🏷️ Price: {hotel.price}</div>
              </div>
            </Link>
          ))}  
       </div>






        <h2 className='heading-places'><span className='heading-span-places'>⛰️ Places To Visit 🏞️</span> </h2>
        <div className="trip-info">
          {trip?.tripplan?.itinerary?.map((data, index) => (
            <div className='place-card-container' key={index}>

              <h3 className='day-heading-places'>Day {data?.day}</h3>
              {data?.places?.map((place, i) => (
                <Link to={'https://www.google.com/maps/search/?api=1&query='+ place?.name + "," + place?.address} key={i} target = '_blank' className='link-element'>
                  <div className="place-card">

                          <div className='img-card'>
                            {spoturl &&
                              (<img src={spoturl?.[place.name] ? `${import.meta.env.VITE_BACKEND_URL}/image?url=${encodeURIComponent(spoturl[place.name])}` : '../../../../public/bg.jpg'} 
                              alt='placename'
                              className='place-img'/> )
                            }
                          </div>
                          <div className="place-info">
                              <h4 className='place-name-h4'>{place?.name}</h4>
                              <p><strong className='strong'>📍 Address:</strong> {place?.address}</p>
                              <p><strong className='strong'>📝 Details:</strong> {place?.details}</p>
                              <p><strong className='strong'>🕒 Travel Time:</strong> {place?.travel_time}</p>
                              <p><strong className='strong'>🎟️ Ticket Price:</strong> ₹{place?.ticket_price}</p>
                          </div>


                  </div>
                </Link>
              ))}
              </div>
          ))}
        </div>


        </div>
        <div className="footer">
        <div className="footer-buttons">
        <button className='footer-btn' onClick={()=> {(handletrip())}}>Generate Another Trip</button>
      </div>
        </div>


    </>
  )
}

export default Viewtrip


{/* <div className={`places-grid ${data?.places?.length == 1 ? 'one-card': data?.places?.length == 2 ? 'two-cards' : 'grid-cards'}`}> */}