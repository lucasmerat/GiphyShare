//JS to alter page without API data here

//Set up API query here
//Key: VXGe08mkPRvKJZQIFGMHmx9xiIhGYg7t
// URL: https://api.giphy.com/v1/gifs/search?api_key=&q=&limit=10&offset=0&rating=G&lang=en
let query = "cheetah";
let queryUrl = "https://api.giphy.com/v1/gifs/search?api_key=VXGe08mkPRvKJZQIFGMHmx9xiIhGYg7t&q=" + query + "&limit=10&offset=0&rating=G&lang=en";

$.ajax({url:queryUrl,method:'GET'}).then(giphyPull)

function giphyPull(response){
    console.log(response);
}

//JS to add API data to page dynamically here

//Running functions with event listeners here