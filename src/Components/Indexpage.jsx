import React from 'react'

import '../IndexStyle.css'
import { useNavigate } from 'react-router-dom'

const Indexpage = () => {
    const navigate = useNavigate();
  return (
    <>
        <div className='index-box'>
            <div className='forflex1'>
                <div className='para1'>
                    Plan Your Perfect Trip with AI
                </div>
                <div className='para2'>
                    Discover, Plan, Travel, Effortlessly  in seconds with our AI-driven trip planner
                </div>
            </div>
            <div className="button-gs">
                <button onClick={()=>{navigate('/create-trip')}}>Get Started</button>
            </div> 
            <div className="background-img">
                <img src="./background2.png" alt="bg" className="background-img-img" />
            </div>      
        </div>
        
      
    </>
  )
}

export default Indexpage
