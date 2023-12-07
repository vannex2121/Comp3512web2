// Import the 'api' constant from 'assign2.js'
import { api } from './assign2.js';
// Convert JSON strings to objects
let songs = [];
let lastSortField = "title";
let lastSortAscending = false;
const artists = JSON.parse(artistsData);
const genres = JSON.parse(genresData);
// Select elements
const artistSelect = document.getElementById("artistSelect");
const genreSelect = document.getElementById("genreSelect");
const songListBody = document.getElementById("songTableBody");
// Add event listeners to column headings for sorting
const titleHeader = document.getElementById("titleHeader");
const artistHeader = document.getElementById("artistHeader");
const yearHeader = document.getElementById("yearHeader");
const genreHeader = document.getElementById("genreHeader");
const popularityHeader = document.getElementById("popularityHeader");
// Event Listener for the title, artist, genre, popularity
titleHeader.addEventListener("click", () => {
    sortSongs("title");
    populateSongList();
});
artistHeader.addEventListener("click", () => {
    sortSongs("artist");
    populateSongList();
});
yearHeader.addEventListener("click", () => {
    sortSongs("year");
    populateSongList();
});
genreHeader.addEventListener("click", () => {
    sortSongs("genre");
    populateSongList();
});
popularityHeader.addEventListener("click", () => {
    sortSongs("popularity");
    populateSongList();
});
// Function to populate select lists
function populateSelectOptions(selectElement, dataArray) {
    // Clear existing options
    selectElement.innerHTML = "";
    dataArray.forEach(item => {
        const option = document.createElement("option");
        option.text = item.name;
        selectElement.add(option);
    });
}
populateSelectOptions(artistSelect, artists);
populateSelectOptions(genreSelect, genres);
// Function to find name by ID
function findNameById(id, dataArray) {
    const item = dataArray.find(item => item.id === id);
    return item ? item.name : "Unknown";
}
// Function to find artist name by artist ID
function findArtistName(artistId) {
    return findNameById(artistId, artists);
}
// Function to find genre name by genre ID
function findGenreName(genreId) {
    return findNameById(genreId, genres);
}
// Function to sort the songs array
function sortSongs(field) {
    const isSameField = field === lastSortField;
    const isAscending = isSameField ? !lastSortAscending : true;
    songs.sort((a, b) => {
// Use localeCompare for string comparison, handle genre as a special case
        const comparison =
            field === "title"
                ? a[field].localeCompare(b[field])
                : field === "artist"
                ? findArtistName(a[field].id).localeCompare(findArtistName(b[field].id))
                : field === "genre"
                ? findGenreName(a[field].id).localeCompare(findGenreName(b[field].id))
                : field === "popularity"
                ? a.details[field] - b.details[field]
                : parseInt(a[field]) - parseInt(b[field]);
            return isAscending ? comparison : -comparison;
    });
    // Update the sort indicator
    updateSortIndicator(field, isAscending);
    // Update the last sort field and order
    lastSortField = field;
    lastSortAscending = isAscending;
}
// Function to update the sort indicator
function updateSortIndicator(field, isAscending) {
    // Remove the "sorted" class from all headers
    [titleHeader, artistHeader, yearHeader, genreHeader, popularityHeader].forEach(header => {
        header.classList.remove("sorted", "asc", "desc");
    });
     // Add the "sorted" class to the clicked header
    const clickedHeader = document.getElementById(`${field}Header`);
    clickedHeader.classList.add("sorted");
    // Add the appropriate class for the sorting order
    clickedHeader.classList.add(isAscending ? "asc" : "desc");
}
//Single View Page Function and chart view for the song details
function showSingleSongView(song) {
    const hideElement = (element) => element.style.display = 'none';
    const showElement = (element) => element.style.display = 'block';
    const songTable = document.getElementById('songTable');
    const mainDiv = document.querySelector('#filterForm');
    hideElement(songTable);
    hideElement(mainDiv);
    const singleSongView = document.getElementById('singleSongView');
    showElement(singleSongView);
    const { details, analytics, title, artist, genre, year } = song;
    const{bpm,loudness,popularity}=details;
    const { danceability, energy, valence, speechiness, liveness, acousticness } = analytics;
    const durationString = `${Math.floor(details.duration / 60)}:${details.duration % 60}`;
    const singleSongViewContent = `
      <h2>Single Song View</h2>
      <div class="song-details">
        <h3>Song Information</h3>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Artist:</strong> ${findArtistName(artist.id)}</p>
        <p><strong>Genre:</strong> ${findGenreName(genre.id)}</p>
        <p><strong>Year:</strong> ${year}</p>
        <p><strong>Duration:</strong> ${durationString} minutes</p>
        <h3>Analysis data</h4>
        <h5 id="bpm">bpm: <b>${bpm}</b></h5>
        <h5 id="songEnergy">Energy: ${energy}</h5>
        <h5 id="songLoudness">Loudness: ${loudness}</h5>
        <h5 id="songDanceability">Danceability: ${danceability}</h5>
        <h5 id="songLiveness">Liveness: ${liveness}</h5>
        <h5 id="songValence">Valence: ${valence}</h5>
        <h5 id="songAcousticness">Acousticness: ${acousticness}</h5>
        <h5 id="songSpeechiness">Speechiness: ${speechiness}</h5>
        <h5 id="songPopularity">Popularity: ${popularity}</h5>
      </div>
      <div class="radar-chart">
        <h3>Radar Chart</h3>
        <canvas id="radarChartCanvas"></canvas>
      </div> `;
    singleSongView.innerHTML = singleSongViewContent;
    const radarChartCanvas = document.getElementById('radarChartCanvas');
    const radarChart = new Chart(radarChartCanvas, {
      type: 'radar',
      data: {
        labels: ['Danceability', 'Energy', 'Valence', 'Speechiness', 'Loudness', 'Liveness'],
        datasets: [{
          label: 'Song Metrics',
          data: [danceability, energy, valence, speechiness,loudness, liveness],
          backgroundColor: 'rgba(0, 0, 225, 0.3)',
          borderColor: 'rgba(60, 60, 60, 60)',
          borderWidth: 2
        }]
      },
      options: {
        scale: {
          ticks: { beginAtZero: true },
          pointLabels: { fontSize: 20 }
        }
      }
    });
    return radarChart;
  }
 //function to populate the song in the table
  function populateSongList() {
    songListBody.innerHTML = ""; 
    for (const song of songs) {
      const row = songListBody.insertRow();
      row.addEventListener('click', () => showSingleSongView(song));
      row.classList.add('clickable-row');
      const titleCell = row.insertCell(0);
      titleCell.innerHTML = `<a href="#" class="song-link">${song.title}</a>`;
      titleCell.addEventListener('click', (event) => {
        event.stopPropagation();
        showSingleSongView(song);
      });
      row.insertCell(1).innerText = findArtistName(song.artist.id);
      row.insertCell(2).innerText = song.year;
      row.insertCell(3).innerText = findGenreName(song.genre.id);
      row.insertCell(4).innerText = song.details.popularity;
  
      row.setAttribute("data-artist-id", song.artist.id);
      row.setAttribute("data-genre-id", song.genre.id);
  
      const addToPlaylistButton = document.createElement("button");
      addToPlaylistButton.innerText = "Add";
      addToPlaylistButton.addEventListener('click', (event) => {
        event.stopPropagation();
        addToPlaylist(song);
      });
      const addToPlaylistCell = row.insertCell(5);
      addToPlaylistCell.appendChild(addToPlaylistButton);
    }
  }
// Placeholder for the array that holds songs in the playlist
const songsInPlaylist = [];
// Function to update the playlist summary
function updatePlaylistSummary() {
    const totalSongsElement = document.getElementById("totalSongs");
    const averagePopularityElement = document.getElementById("averagePopularity");
    // Update the total songs count
    totalSongsElement.textContent = songsInPlaylist.length;
    // Calculate and update the average popularity
    const totalPopularity = songsInPlaylist.reduce((sum, song) => sum + song.details.popularity, 0);
    const averagePopularity = totalPopularity / songsInPlaylist.length;
    averagePopularityElement.textContent = averagePopularity.toFixed(2);
}
 //event listener for the close view button 
 const showElement = (element) => element.style.display = 'block';
 const hideElement = (element) => element.style.display = 'none';
 const mainDiv = document.querySelector('#filterForm');
 const closeViewButton = document.getElementById('closeViewButton');
 closeViewButton.addEventListener('click', () => {
     showElement(songTable);
     showElement(mainDiv);
     hideElement(singleSongView);
});
// Add a function to toggle the visibility of the main div
function toggleMainDivVisibility(displayStyle) {
    const mainDiv = document.querySelector('#filterForm');
    mainDiv.style.display = displayStyle;
}
// Function to toggle the display of the playlist view and hide the song table
function togglePlaylistView(displayStyle) {
    const playlistViewSection = document.getElementById("playlistView");
    const songTable = document.getElementById("songTable");
// Hide the main div when entering the playlist view
    if (displayStyle === "block") {
        toggleMainDivVisibility("none");
    } else {
        // Show the main div when leaving the playlist view
        toggleMainDivVisibility("block");
    }
    playlistViewSection.style.display = displayStyle;
    songTable.style.display = displayStyle === "block" ? "none" : "block";
}
// Function to add a song to the playlist
function addToPlaylist(song) {
    // Check if the song is already in the playlist
    const isDuplicate = songsInPlaylist.some(item =>
        item.title === song.title &&
        item.artist.id === song.artist.id &&
        item.year === song.year &&
        item.genre.id === song.genre.id
    );
    if (isDuplicate) {
        // Show a snackbar for the duplicate song
        const duplicateSnackbar = document.getElementById('duplicateSnackbar');
        duplicateSnackbar.innerText = `"${song.title}" is already in the playlist.`;
        duplicateSnackbar.style.display = 'block';
        duplicateSnackbar.style.opacity = '1';
        // Hide the duplicate snackbar after a few seconds
        setTimeout(() => {
            duplicateSnackbar.style.opacity = '0';
            setTimeout(() => {
                duplicateSnackbar.style.display = 'none';
            }, 300);
        }, 3000); 
         return;
    }
    // Add the song to the playlist array
    songsInPlaylist.push(song);
    // Update the playlist summary
    updatePlaylistSummary();
    // Show the snackbar
    const snackbar = document.getElementById('snackbar');
    snackbar.innerText = `"${song.title}" added to the playlist!`;
    snackbar.style.display = 'block';
    snackbar.style.opacity = '1';
    // Hide the snackbar after a few seconds
    setTimeout(() => {
        snackbar.style.opacity = '0';
        setTimeout(() => {
            snackbar.style.display = 'none';
        }, 300);
    }, 3000); 
    // For now, log to the console
    console.log(`Added "${song.title}" to the playlist!`);
    // Show the playlist view only if it's currently hidden
    if (document.getElementById('playlistView').style.display === 'none') {
        // Show the playlist view and hide the song table
        togglePlaylistView("none");
    }
    // Add the song to the playlist table
    const playlistTableBody = document.getElementById("playlistTableBody");
    const playlistRow = playlistTableBody.insertRow();
    playlistRow.insertCell(0).innerHTML = `<a href="#" class="song-link">${song.title}</a>`;
    playlistRow.insertCell(1).innerText = findArtistName(song.artist.id);
    playlistRow.insertCell(2).innerText = song.year;
    playlistRow.insertCell(3).innerText = findGenreName(song.genre.id);
    playlistRow.insertCell(4).innerText = song.details.popularity;
    // Add event listener to the title cell
    const titleCell = playlistRow.cells[0];
    titleCell.addEventListener('click', (event) => {
        event.stopPropagation();
    // Show the single song view and hide both the playlist table and the song table
        showSingleSongView(song);
        togglePlaylistView("none");
        toggleMainDivVisibility("none");
        document.getElementById('songTable').style.display = 'none';
    });
       // Show the playlist view only if it's currently hidden
       if (document.getElementById('playlistView').style.display === 'none') {
        // Show the playlist view and hide the song table
        togglePlaylistView("none");
    }
    // Add a button to remove the song from the playlist
    const removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    removeButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent row click
        removeFromPlaylist(song);
    });
    const removeCell = playlistRow.insertCell(5);
    removeCell.appendChild(removeButton);
}
// Function to remove a song from the playlist
function removeFromPlaylist(song) {
    const index = songsInPlaylist.findIndex(item => item.id === song.id);
    if (index !== -1) {
        songsInPlaylist.splice(index, 1);
        // Update the playlist summary
        updatePlaylistSummary();
        // Remove the row from the playlist table
        const playlistTableBody = document.getElementById("playlistTableBody");
        playlistTableBody.deleteRow(index);
        // If the playlist is empty, hide the playlist view
       //if (songsInPlaylist.length === 0) {
          // togglePlaylistView("display");
       // }
        // Display the snackbar for removing the song
        const removedSnackbar = document.getElementById('removedSnackbar');
        removedSnackbar.innerText = `"${song.title}" removed from the playlist.`;
        removedSnackbar.style.display = 'block';
        removedSnackbar.style.opacity = '1';
        // Hide the snackbar after a few seconds
        setTimeout(() => {
            removedSnackbar.style.opacity = '0';
            setTimeout(() => {
                removedSnackbar.style.display = 'none';
            }, 300);
        }, 3000);
    }
}
// Function to clear the entire playlist
function clearPlaylist() {
    // Clear the songsInPlaylist array
    songsInPlaylist.length = 0;
    // Update the playlist summary
    updatePlaylistSummary();
    // Remove all rows from the playlist table
    const playlistTableBody = document.getElementById("playlistTableBody");
    while (playlistTableBody.firstChild) {
        playlistTableBody.removeChild(playlistTableBody.firstChild);
    }
    // Hide the playlist view
    togglePlaylistView("none");
}
// Add an event listener to the "Clear Playlist" button
document.getElementById('clearPlaylistButton').addEventListener('click', clearPlaylist);
// Add an event listener to the "Playlist" button
document.getElementById('playlistButton').addEventListener('click', () => {
// Show the playlist view and hide the song table
togglePlaylistView("block");
});
// Function to filter the songs: title, artist, genre
function filterSongs() {
    // Get the selected radio button
    const selectedRadio = document.querySelector('input[name="searchCategory"]:checked');
    // Get the input values
    const titleInput = document.getElementById('titleInput').value.toLowerCase();
    const artistInput = document.getElementById('artistSelect').value.toLowerCase();
    const genreInput = document.getElementById('genreSelect').value.toLowerCase();
    // Filter based on the selected radio button
    let filteredSongs = [];
    if (selectedRadio && selectedRadio.id === 'titleRadio') {
        // Filter by title
        filteredSongs = songs.filter(song => song.title.toLowerCase().includes(titleInput));
    } else if (selectedRadio && selectedRadio.id === 'artistRadio') {
        // Filter by artist
        filteredSongs = songs.filter(song => findArtistName(song.artist.id).toLowerCase() === artistInput);
    } else if (selectedRadio && selectedRadio.id === 'genreRadio') {
        // Filter by genre
        filteredSongs = songs.filter(song => findGenreName(song.genre.id).toLowerCase() === genreInput);
    }
    // Sort the filtered songs and update the display
    sortSongs(lastSortField);
    displayFilteredSongs(filteredSongs);
}
// Add the event listener for the "Filter" button
document.getElementById('filterButton').addEventListener('click', filterSongs);
// Function to display filtered songs
function displayFilteredSongs(filteredSongs) {
    songListBody.innerHTML = "";
    // Display the filtered songs in the table
    filteredSongs.forEach(song => {
        const row = songListBody.insertRow();
        row.insertCell(0).innerHTML = `<a href="#" class="song-link">${song.title}</a>`;
        row.insertCell(1).innerText = findArtistName(song.artist.id);
        row.insertCell(2).innerText = song.year;
        row.insertCell(3).innerText = findGenreName(song.genre.id);
        row.insertCell(4).innerText = song.details.popularity;
        //event listener that when the title click it will show the singleview song
        const titleCell = row.cells[0];
        titleCell.addEventListener('click', (event) => {
        event.stopPropagation();
        // Show the single song view and hide both the playlist table and the song table
        showSingleSongView(song);
        togglePlaylistView("none");
        toggleMainDivVisibility("none");
        document.getElementById('songTable').style.display = 'none';
    });
        // Set data attributes for artist and genre IDs
        row.setAttribute("data-artist-id", song.artist.id);
        row.setAttribute("data-genre-id", song.genre.id);
        // Add "Add to Playlist" button
        const addToPlaylistButton = document.createElement("button");
        addToPlaylistButton.innerText = "Add";
        addToPlaylistButton.addEventListener('click', (event) => {
            event.stopPropagation();
            addToPlaylist(song);
        });
        const addToPlaylistCell = row.insertCell(5);
        addToPlaylistCell.appendChild(addToPlaylistButton);
    });
}
// Add event listener for the "Clear" button
document.getElementById('clearButton').addEventListener('click', clearFilters);
// Function to clear filters and display all songs
function clearFilters() {
    // Clear the filter inputs and select elements
    document.getElementById('titleInput').value = '';
    document.getElementById('artistSelect').value = '';
    document.getElementById('genreSelect').value = '';
    // Sort and display all songs
    sortSongs(lastSortField);
    populateSongList();
}
 // on hover of .creditsbutton .cont for 5sec
 const creditShow = document.querySelector(".creditsbutton");
 const creditContent = document.querySelector(".cont");
 creditShow.addEventListener("mouseover", () => {
   creditContent.style.display = "block";
   setTimeout(() => creditContent.style.display = "none", 5000);
 });
// Initial sort and population of the song list
const songsStorage = localStorage.getItem('songsStorage');
if (songsStorage) {
    // If cached songs are available in local storage, use them
    songs = JSON.parse(songsStorage);
    // Sort the songs by title
    sortSongs("title");
    // display the song list
    populateSongList();
} else {
    // If cached songs are not available, fetch from the API
    fetch(api)
        .then(response => response.json())
        .then(data => {
            // Cache the data in localStorage
            localStorage.setItem('songsStorage', JSON.stringify(data));
            songs = data;
            sortSongs("title");
            populateSongList();
        })
        .catch(error => {
            console.error("Error fetching data from the API:", error);
        });
}
