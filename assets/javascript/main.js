//JS to alter page without API data here
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

function performSearch(event) {
  event.preventDefault();
  console.log($("#user-input").val() === "");
  if ($("#user-input").val() === "") {
    alert("Enter a search to find giphys!");
  } else {
    performCall();
  }
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

function giphyPull(response) {
  console.log(response);
  console.log(response.data[0].images.fixed_width_still.url);
  $("#image-area").empty();
  $("#user-input").val("");
  for (let i = 0; i < response.data.length; i++) {
    console.log(response.data[i]);
    let image = $();
    $("#image-area").append(
      "<div class=image-box><img src =" +
        response.data[i].images.original_still.url +
        " class=gif animated=" +
        response.data[i].images.original.url +
        " still=" +
        response.data[i].images.original_still.url +
        "><h4 id=facebook class=social> <h4 id=twitter class=social> <h4 id=download class=social>"
    );
  }
}

function move() {
  $(this).children('.gif').attr('src', $(this).children('.gif').attr("animated")) 
  console.log($(this).children('.gif'))
//Loading issue where text will pop before the image comes up
    $(this).children().css('visibility','visible')
    $(this).children('#facebook').text('Share on Facebook')//selects the h4 and adds text
    $(this).children('#twitter').text('Share on Twitter')//selects the h4 and adds text
    $(this).children('#download').text('Copy download link')//selects the h4 and adds text
}

function still() {
    $(this).children('.gif').attr('src', $(this).children('.gif').attr("still")) 
    $(this).children('.social').css('visibility','hidden')
 // $(this).siblings().children().empty()
}

//JS to add API data to page dynamically here

//Running functions with event listeners here
$("#search-btn").click(performSearch);
$(document).on("mouseenter", ".image-box", move);
$(document).on("mouseleave", ".image-box", still);
