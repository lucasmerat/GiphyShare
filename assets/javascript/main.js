//TODO: Make it so I can continue to increase gif limit on each click. Make it so clicking button stores value for additional gif button click. Use gif limit varibale in initial call?, make it more functional. Need to reduce repetition here

let firstCall = true;
let gifLimit = 20;
//Setting array of buttons to be array saved in local storage
let buttonArr = JSON.parse(localStorage.getItem("savedButtons"));
//Setting default buttons when array is empty
if (!Array.isArray(buttonArr)) {
  buttonArr = ["OMG", "Goodmorning!", "LOL", "OK", "WTF"];
}
//Setting array of favorite gifs to saved value in local storage
let favoritesArr = JSON.parse(localStorage.getItem("savedImages"));
if (!Array.isArray(favoritesArr)) {
  favoritesArr = [];
}
loadButtons(); //Initial load of stored buttons

//Creates and displays buttons for all in array
function loadButtons() {
  $("#button-area").empty();
  for (let i = 0; i < buttonArr.length; i++) {
    let newButton = $('<button class="button">').text(buttonArr[i]);
    newButton.attr("data-number", i); //Setting data attribute for button
    $("#button-area").append(newButton);
  }
}
//If search bar is filled, calls the performCall function w argument of the user's search
function performSearch(event) {
  event.preventDefault();
  firstCall = true;
  if ($("#user-input").val() === "") {
    alert("Enter a search to find giphys!");
  } else {
    performCall($("#user-input").val());
  }
}
//Takes either button clicked innerText or value of user input bar and performs AJAX call
function performCall(value) {
  let query = value;
  console.log(query);
  let queryUrl =
    "https://api.giphy.com/v1/gifs/search?api_key=VXGe08mkPRvKJZQIFGMHmx9xiIhGYg7t&q=" +
    query +
    "&limit=100&offset=0&rating=G&lang=en";
  console.log("query is" + query);
  //Adds query value to button array, assuming the value is not already there
  if (buttonArr.includes(query)) {
    console.log(query + " is already in the array");
  } else {
    buttonArr.push(query);
    localStorage.setItem("savedButtons", JSON.stringify(buttonArr)); //Saves new list of buttons to local storage
  }
  loadButtons(); //Reloads buttons to display all values including new one added
  console.log(firstCall)
  if(firstCall === true){
  $.ajax({ url: queryUrl, method: "GET" }).then(giphyPullInitial); //AJAX call takes giphyPull function as callback
    }else{
  $.ajax({ url: queryUrl, method: "GET" }).then(giphyPullAdditional); //AJAX call takes giphyPull function as callback
  }
}
//Takes image data from Giphy API and uses it to display images on page
function giphyPullInitial(response) {
  console.log(response); //Display JSON
  $("#image-area").empty(); //Clear all images, each query
  //Adds button to load more images
  $("#image-area").append(
    "<div class=load-more-box><a class=load-more data-load='" +
      $("#user-input").val() + //saving data attribute with user query
      "'>Load 10 more</a>"
  );
  $("#user-input").val(""); //Clears user search bar
  for (let i = 0; i < 10; i++) {
    $("#image-area").prepend(
      "<div class=image-box><img src =" +
      response.data[i].images.original_still.url +
      " class=gif animated=" +
      response.data[i].images.original.url + //Adding animated image as arg
      " still=" +
      response.data[i].images.original_still.url + //Still image as second arg to revert off hover
      "><a id=facebook class=social target=_blank href='https://www.facebook.com/sharer/sharer.php?u=" + //Link to share on Facebook
      response.data[i].images.original.url +
      "&amp;src=sdkpreparse'><a id=twitter class=social target=_blank href='https://twitter.com/intent/tweet?text=" + //Link to share on Twitter
        response.data[i].bitly_url +
        "'><a id=favorite class=social href='www.lucas.com'></a><i class='fas fa-heart fave-icon'>" //Link to favorite item
    );
  }
  $(".footer").css("bottom", "auto");
  firstCall = false;
}
//HOW CAN I NOT REPEATE HERE
function giphyPullAdditional(response) {
    console.log(response)
    console.log(gifLimit)
    for (let i = 10; i < gifLimit; i++) {
    $("#image-area").append(
        "<div class=image-box><img src =" +
        response.data[i].images.original_still.url +
        " class=gif animated=" +
        response.data[i].images.original.url + //Adding animated image as arg
        " still=" +
        response.data[i].images.original_still.url + //Still image as second arg to revert off hover
        "><a id=facebook class=social target=_blank href='https://www.facebook.com/sharer/sharer.php?u=" + //Link to share on Facebook
        response.data[i].images.original.url +
        "&amp;src=sdkpreparse'><a id=twitter class=social target=_blank href='https://twitter.com/intent/tweet?text=" + //Link to share on Twitter
          response.data[i].bitly_url +
          "'><a id=favorite class=social href='www.lucas.com'></a><i class='fas fa-heart fave-icon'>" //Link to favorite item
      );
    }
    $(".load-more-box").remove()
    $("#image-area").append(
        "<div class=load-more-box><a class=load-more data-load='" +
          $("#user-input").val() + //saving data attribute with user query
          "'>Load 10 more</a>"
      );
    gifLimit += 10;
}

//Changes gif to animated, called by hovering over image w mouseenter event
function move() {
  $(this)
    .children(".gif")
    .attr(
      "src",
      $(this)
        .children(".gif")
        .attr("animated")
    );
  //Displaying social buttons on hover
  $(this)
    .children()
    .css("visibility", "visible");
  $(this)
    .children("#facebook")
    .text("Share on Facebook"); //selects the h4 and adds text
  $(this)
    .children("#twitter")
    .text("Share on Twitter"); //selects the h4 and adds text
  $(this)
    .children("#favorite")
    .text("Save to favorites"); //selects the h4 and adds text
}
//Reverts image to still and clears social buttons. Called with mouseleave event
function still() {
  $(this)
    .children(".gif")
    .attr(
      "src",
      $(this)
        .children(".gif")
        .attr("still")
    );
  $(this)
    .children(".social")
    .css("visibility", "hidden");
}

function saveFavorite(event) {
  //Make it so that you can't save the same favorite twice
  event.preventDefault();
  favoritesArr.push(
    $(this)
      .siblings(".gif")
      .attr("src")
  );
  localStorage.setItem("savedImages", JSON.stringify(favoritesArr));
  //Heart beat animation on save of favorite
  $(this)
    .siblings(".fave-icon")
    .animate({ fontSize: "100px" }, 500, "easeInOutBounce")
    .animate({ fontSize: "0px" }, 500, "easeOutBounce");
}

function removeFavorite() {
  let favoriteNumber = $(this).attr("data-fave");
  favoritesArr.splice(favoriteNumber, 1);
  displayFavorites();
  localStorage.setItem("savedImages", JSON.stringify(favoritesArr));
}

function displayFavorites() {
  event.preventDefault();
  $("#image-area").empty();
  for (let i = 0; i < favoritesArr.length; i++) {
    console.log(favoritesArr[i]);
    $("#image-area").prepend(
      "<div class=image-box><img src=" +
      favoritesArr[i] +
      " class=gif><a id=facebook class=social target=_blank href='https://www.facebook.com/sharer/sharer.php?u=" + //Link to share on Facebook
      favoritesArr[i] +
      "&amp;src=sdkpreparse'><a id=twitter class=social target=_blank href='https://twitter.com/intent/tweet?text=" + //Link to share on Twitter
        favoritesArr[i] +
        "'><a id=removefave class=social data-fave=" +
        i +
        " href='#'>Remove Favorite</a><i class='fas fa-heart fave-icon'>" //Link to favorite item
    );
  }
  $("#image-area").prepend(
    "<div class=subtitle-box><h3 class=subtitle>Favorites</h1>"
  );
}

//Event listeners
$("#search-btn").click(performSearch);
$("#favorite-btn").click(displayFavorites);
$(document).on("click", ".button", () => performCall(event.target.innerText));
$(document).on("click", "#favorite", saveFavorite);
$(document).on("click", "#removefave", removeFavorite);
$(document).on("click", ".load-more", () => performCall($('.load-more').attr('data-load')));
$(document).on("mouseenter", ".image-box", move);
$(document).on("mouseleave", ".image-box", still);