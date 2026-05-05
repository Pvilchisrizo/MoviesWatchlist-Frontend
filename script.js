fetch(`http://localhost:3000/movies`)

.then(response => response.json())

.then(data => {

    console.log(data)

})