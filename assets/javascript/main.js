//JS to alter page without API data here

//Set up API query here
//Key: VXGe08mkPRvKJZQIFGMHmx9xiIhGYg7t
// URL: https://api.giphy.com/v1/gifs/search?api_key=&q=&limit=10&offset=0&rating=G&lang=en
buttonArr = ["harry potter", "hello", "tiger", "evil daemon babies"];
loadButtons();
function loadButtons() {
  $("#button-area").empty();
  for (let i = 0; i < buttonArr.length; i++) {
    let newButton = $('<button class="button">').text(buttonArr[i]);
    newButton.attr("data-number", i);
    $("#button-area").append(newButton);
  }
  console.log(buttonArr);
}

function performCall() {
  let query = $("#user-input").val();
  let queryUrl =
    "https://api.giphy.com/v1/gifs/search?api_key=VXGe08mkPRvKJZQIFGMHmx9xiIhGYg7t&q=" +
    query +
    "&limit=10&offset=0&rating=G&lang=en";
  buttonArr.push(query);
  loadButtons();
  $.ajax({ url: queryUrl, method: "GET" }).then(giphyPull);
}

function performSearch(event) {
  event.preventDefault($("#user-input").val());
  console.log($("#user-input").val() === "");
  if ($("#user-input").val() === "") {
    alert("Enter a search to find giphys!");
  } else {
    performCall();
  }
}

function giphyPull(response) {
  console.log(response);
  console.log(response.data[0].images.fixed_width_still.url);
  $('#image-area').empty();
  $("#user-input").val('');
  for (let i = 0; i < response.data.length; i++) {
    console.log(response.data[i]);
    let image = $();
    $("#image-area").append(
      "<div class=image-box><img src =" +
        response.data[i].images.original_still.url +
        " class=gif move=still>"
    );
  }
}

function stillMove() {
    //Add ability to change stills to animated
}

//JS to add API data to page dynamically here

//Running functions with event listeners here
$("#search-btn").click(performSearch);
$(".gif").click(stillMove); //Need to add functionality 