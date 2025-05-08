import axios from "axios";
const getPlaceImages = async (querryparam) => {
    if(!querryparam) return;

    const url = 'https://places.googleapis.com/v1/places:searchText';
    const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

    console.log(" correct api key")
    
    const parami = {
      textQuery: querryparam,
    };
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.photos',
      },
    };

    
    try{
      
      const response = await axios.post(url,parami,config);

      const refphoto = response?.data?.places[0]?.photos[0]?.name
      console.log("the below is placeref ")
      console.log(refphoto)

      if(!refphoto){
        console.log(" nothing empty ")
        return null;
      }
      const photoUrl = `https://places.googleapis.com/v1/${refphoto}/media?key=${apiKey}&maxWidthPx=900&maxHeightPx=500`
      console.log("returning the photourls")
      return photoUrl;
    }
    catch(error)
    {
      console.log("error while fetching the google place api");
      return null;
    }
    finally{
      console.log("successfully fetched the image ");
    }
}
export default getPlaceImages;


