const fetchData = () => {
    fetch(`http://localhost:3000/movies`)
    .then(response => response.json())
    .then(data => {
        loadDataToPage(data)
    })
}

fetchData()

const movieListContainer = document.getElementById("movie-list-container")

const loadDataToPage = data => {
    movieListContainer.innerHTML = ""
    data.forEach(movie => {
        const liElement = document.createElement("li")
        const pElement = document.createElement("p")
        const watchedButton = document.createElement("div")
        const deleteButton = document.createElement("div")
        
        pElement.innerHTML = `<b>${movie.title}</b>, ${movie.year}, starring ${movie.starring[0]} and ${movie.starring[1]}.`
        watchedButton.innerText = movie.watched ? `WATCHED` : `NOT WATCHED YET`
        watchedButton.className = movie.watched ? `watch-button green-button` : `watch-button`
        deleteButton.innerText = "×"
        deleteButton.className = "delete-button"

        watchedButton.addEventListener("click", () => {
            toggleMovieWatched(movie.id)
        })

        deleteButton.addEventListener("click", () => {
            deleteMovie(movie.id)
        })

        liElement.appendChild(pElement)
        liElement.appendChild(watchedButton)
        liElement.appendChild(deleteButton)
        movieListContainer.appendChild(liElement)
    })
}

const toggleMovieWatched = (movieId) => {
    fetch(`http://localhost:3000/movies/${movieId}/toggle-watched`, {method: 'PATCH'})
    .then(response => response.json())
    .then(() => {
        console.log(`Updated movie ${movieId}.`)
        fetchData()
    })
}

const deleteMovie = (movieId) => {
    fetch(`http://localhost:3000/movies/${movieId}`, {method: 'DELETE'})
    .then(response => response.json())
    .then(() => {
        console.log(`Deleted movie ${movieId}.`)
        fetchData()
    })
}