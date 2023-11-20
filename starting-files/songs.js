// Convert JSON strings to objects
const songs = JSON.parse(songsData);
const artists = JSON.parse(artistsData);
const genres = JSON.parse(genresData);

// Select elements
const artistSelect = document.getElementById("artistSelect");
const genreSelect = document.getElementById("genreSelect");
const songListBody = document.getElementById("songTableBody");

// Populate select lists
function populateSelectOptions(selectElement, dataArray) {
    dataArray.forEach(item => {
        const option = document.createElement("option");
        option.text = item.name;
        selectElement.add(option);
    });
}

populateSelectOptions(artistSelect, artists);
populateSelectOptions(genreSelect, genres);

// Function to populate the song list
function populateSongList() {
    songListBody.innerHTML = "";

    songs.forEach(song => {
        const { title, artist, year, genre, details } = song;
        const row = songListBody.insertRow();

        row.insertCell(0).innerText = title;
        row.insertCell(1).innerText = findArtistName(artist.id);
        row.insertCell(2).innerText = year;
        row.insertCell(3).innerText = findGenreName(genre.id);
        row.insertCell(4).innerText = details.popularity;
    });
}

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
// Function to populate the song list
function populateSongList() {
    const songListBody = document.getElementById("songTableBody");
    songListBody.innerHTML = "";

    // Sort the songs array alphabetically by title
    songs.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

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

// Initial population of the song list
populateSongList();
