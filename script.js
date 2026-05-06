// ─────────────────────────────────────────────
// This file is the FRONTEND JavaScript — it runs in the browser (not Node.js)
// It communicates with our Express server using the fetch() API
// fetch() lets the browser make HTTP requests to our backend without reloading the page
// This pattern is called a REST API — the frontend and backend talk through HTTP requests
// ─────────────────────────────────────────────


// fetchData() — asks the server for the full movies list and loads it onto the page
const fetchData = () => {
    fetch(`http://localhost:3000/movies`) // sends a GET request to our /movies route (GET is the default method)
    .then(response => response.json()) // .then() runs when the server responds — .json() converts the raw response into a JavaScript array/object we can work with
    .then(data => { // data is now the parsed array of movie objects from our server
        console.log(data) // useful for debugging — logs the movies array in the browser console
        loadDataToPage(data) // passes the data to the function that builds the UI
    })
    // Note: fetch() is asynchronous — it doesn't pause the code, it just says "when this is done, run .then()"
    // This is the Promise-based pattern (.then chains) — an alternative to async/await
}

fetchData() // calls fetchData immediately when the page loads so the movie list appears right away


// grabs the <ul> or container element from the HTML where we'll inject the movie list
const movieListContainer = document.getElementById("movie-list-container")


// loadDataToPage() — takes the movies array and builds the HTML elements to display each movie
const loadDataToPage = data => {
    movieListContainer.innerHTML = "" // clears the container before re-rendering — important! without this, movies would duplicate every time this function runs

    data.forEach(movie => { // loops through every movie object in the array
        
        // createElement() creates new HTML elements in memory — they aren't visible yet until we append them to the page
        const liElement = document.createElement("li")       // list item that wraps each movie
        const pElement = document.createElement("p")         // paragraph for the movie info text
        const watchedButton = document.createElement("div")  // button to toggle watched status
        const deleteButton = document.createElement("div")   // button to delete the movie
        
        // builds the movie info text using a template literal
        // movie.starring is an array so we access each actor by index [0] and [1]
        pElement.innerHTML = `<b>${movie.title}</b>, ${movie.year}, starring ${movie.starring[0]} and ${movie.starring[1]}.`
        
        // ternary operator (condition ? valueIfTrue : valueIfFalse) sets the button text based on watched status
        watchedButton.innerText = movie.watched ? `WATCHED` : `NOT WATCHED YET`
        
        // also uses a ternary to add a "green-button" CSS class if the movie is watched, for visual feedback
        watchedButton.className = movie.watched ? `watch-button green-button` : `watch-button`
        
        deleteButton.innerText = "×" // × is the HTML symbol for the × character (looks like a close/delete icon)
        deleteButton.className = "delete-button"

        // addEventListener() listens for a click on the button and runs a function when it happens
        // we pass movie.id so the function knows WHICH movie to toggle
        // this is called a closure — the callback function "remembers" the movie.id from the outer forEach loop
        watchedButton.addEventListener("click", () => {
            toggleMovieWatched(movie.id)
        })

        deleteButton.addEventListener("click", () => {
            deleteMovie(movie.id)
        })

        // appendChild() adds each element inside another — order matters here!
        // we build the structure: li > p + watchedButton + deleteButton
        // then add the full li into the container on the page
        liElement.appendChild(pElement)
        liElement.appendChild(watchedButton)
        liElement.appendChild(deleteButton)
        movieListContainer.appendChild(liElement) // this is the moment the movie becomes visible on the page
    })
}


// toggleMovieWatched() — sends a PATCH request to flip the watched status of one movie
const toggleMovieWatched = (movieId) => {
    fetch(`http://localhost:3000/movies/${movieId}/toggle-watched`, {method: 'PATCH'}) // movieId is injected into the URL so the server knows which movie to update
    .then(response => response.json())
    .then(() => { // we don't need the response data here, we just want to know it succeeded
        console.log(`Updated movie ${movieId}.`)
        fetchData() // re-fetches the full list from the server and re-renders the page so the UI reflects the change
        // this is called an "optimistic re-render" pattern — always re-fetch after a change to keep frontend and backend in sync
    })
}


// deleteMovie() — sends a DELETE request to remove a movie from the server's list
const deleteMovie = (movieId) => {
    fetch(`http://localhost:3000/movies/${movieId}`, {method: 'DELETE'}) // movieId in the URL tells the server which movie to delete
    .then(response => response.json())
    .then(() => {
        console.log(`Deleted movie ${movieId}.`)
        fetchData() // re-fetches and re-renders the list after deletion so the deleted movie disappears from the UI
    })
}
//fetchData() is called after every change (toggle or delete) to keep the UI in sync with the server — the frontend never modifies the array directly, it always asks the server for the latest data.

