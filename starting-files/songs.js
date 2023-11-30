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
// Function to populate the song list
function populateSongList() {
    songListBody.innerHTML = "";
    // Populate the sorted song list using a for loop
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const row = songListBody.insertRow();
        row.insertCell(0).innerText = song.title;
        row.insertCell(1).innerText = findArtistName(song.artist.id);
        row.insertCell(2).innerText = song.year;
        row.insertCell(3).innerText = findGenreName(song.genre.id);
        row.insertCell(4).innerText = song.details.popularity;
        // Set data attributes for artist and genre IDs
        row.setAttribute("data-artist-id", song.artist.id);
        row.setAttribute("data-genre-id", song.genre.id);
    }
}
//Function to the filter the songs: title,artist,genre
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
        filteredSongs = songs.filter(song => findArtistName(song.artist.id).toLowerCase().includes(artistInput));
    } else if (selectedRadio && selectedRadio.id === 'genreRadio') {
        // Filter by genre
        filteredSongs = songs.filter(song => findGenreName(song.genre.id).toLowerCase().includes(genreInput));
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
        row.insertCell(0).innerText = song.title;
        row.insertCell(1).innerText = findArtistName(song.artist.id);
        row.insertCell(2).innerText = song.year;
        row.insertCell(3).innerText = findGenreName(song.genre.id);
        row.insertCell(4).innerText = song.details.popularity;
        // Set data attributes for artist and genre IDs
        row.setAttribute("data-artist-id", song.artist.id);
        row.setAttribute("data-genre-id", song.genre.id);
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
// Initial sort and population of the song list
fetch(api)
    .then(response => response.json())
    .then(data => {
        // Cache the data in localStorage
        localStorage.setItem('cachedSongs', JSON.stringify(data));
        // Update the songs array
        songs = data;
        // Sort the songs by title
        sortSongs("title");
        // Render the song list
        populateSongList();
    })
    .catch(error => {
        console.error("Error fetching data from the API:", error);
    });
