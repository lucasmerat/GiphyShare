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

function performSearchClick(event) {
  event.preventDefault();
  console.log($("#user-input").val() === "");
  if ($("#user-input").val() === "") {
    alert("Enter a search to find giphys!");
  } else {
    performCall($("#user-input").val());
  }
}

function performCall(value) {
  let query = value;
  let queryUrl =
    "https://api.giphy.com/v1/gifs/search?api_key=VXGe08mkPRvKJZQIFGMHmx9xiIhGYg7t&q=" +
    query +
    "&limit=10&offset=0&rating=G&lang=en";
    console.log('query is'+ query)
    //Only add button to array if it's not already there
     if(buttonArr.includes(query)){
        console.log(query + ' is already in the array') 
    } else {
        buttonArr.push(query);
  }
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
$("#search-btn").click(performSearchClick);
$(document).on("click", ".button", () => performCall(event.target.innerText));
$(document).on("mouseenter", ".image-box", move);
$(document).on("mouseleave", ".image-box", still);