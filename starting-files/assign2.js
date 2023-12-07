

/* url of song api --- https versions hopefully a little later this semester */	
const api = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

 

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
function getApiData(api) {
  return fetch(api)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const genreList1 = data.map(song => song.genre);
      const artistList1 = data.map(song => song.artist);
      const songData1 = data;

      return { genreList1, artistList1, songData1 };
    })
    .catch(error => {
      console.error("Error fetching API data:", error);
      return { error: "Error fetching API data" };
    });
}
export { getApiData, api };
 
