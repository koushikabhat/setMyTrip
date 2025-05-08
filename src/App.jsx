import Navbar from "./Components/Navbar"
import Indexpage from "./Components/Indexpage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import CreateTrip from "./Components/CreateTrip"
import Viewtrip from "./Components/view-trip/[tripId]/Viewtrip"
import TripData from "./Components/my-trip/TripData"

function App() {
  

  return (

    <>
      
      <Router>
        <Navbar/>

        <Routes>
          <Route path="/" element={<Indexpage/>}/>
          <Route path="/create-trip" element={<CreateTrip/>}/>
          <Route path="/view-trip/:tripId" element={<Viewtrip/>}/>
          <Route path="/my-trip" element={<TripData/>}/>
        </Routes>
        
      </Router>
    </>
  )
}

export default App
