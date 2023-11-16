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

// Function to sort the table based on the selected column
function sortTable(columnIndex) {
    const tbody = document.getElementById("songTableBody");
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent;
        const cellB = b.cells[columnIndex].textContent;
        return cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' });
    });

    // Clear the existing tbody and append the sorted rows
    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));
}

// Initial population of the song list
populateSongList();
