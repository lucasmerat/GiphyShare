//TODO: Make it more functional. Need to reduce repetition here. Specifically with using initial and additional giphy calls. Also, defining buttonClicked value to global scope to be used by other variables. How can I improve this?

let firstCall = true; //Boolean to track that user is on initial search
let gifInitial = 10; //Initial gif value of 10 for loops

let buttonArr = JSON.parse(localStorage.getItem("savedButtons")); //Setting array of buttons to be array saved in local storage
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
  firstCall = true; //Resets first call to true to perform initial search
  gifInitial = 10; //Resets initial value to start of array for new search
  if ($("#user-input").val() === "") {
    alert("Enter a search to find giphys!");
  } else {
    performCall($("#user-input").val());
  }
}
//Takes either button clicked innerText or value of user input bar and performs AJAX call
function performCall(value) {
  let query = value;
  buttonClicked = value; //Creating button clicked text variable gloabally to be used in giphy pull functions
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
  console.log("firstCall variable is" + firstCall);
  //If the call to API was made by a button click
  if (event.target.className === "button") {
    firstCall = true; //change first call value to true, making it reset values on next query
    gifInitial = 10; //Restart search query at beggining of array
  }
  if (firstCall === true) {
    //If on first search, run initial giphy pull function
    $.ajax({ url: queryUrl, method: "GET" }).then(giphyPullInitial); //AJAX call takes giphyPull function as callback
    firstCall = true;
  } else {
    //Otherwise, run function to load additional gifs
    $.ajax({ url: queryUrl, method: "GET" }).then(giphyPullAdditional); //AJAX call takes giphyPull function as callback
  }
}
//Function to clear the page and show initial 10 gifs from API call
function giphyPullInitial(response) {
  console.log(response); //Display JSON
  $("#image-area").empty(); //Clear all images, each query
  //Adds button to load more images at bottom
  $("#image-area").append(
    "<div class=load-more-box><a class=load-more data-load='" +
    $("#user-input").val() +
    buttonClicked + //saving data attribute with user query and value of button click
      "'>Load 10 more</a>"
  );
  $("#user-input").val(""); //Clears user search bar
  //Placing 10 images with social and gave buttons on page
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
  firstCall = false; //Changing boolean so additional image function will run next
  gifInitial += 10; //Increase initial gif value to show images farther in array on next call
  $(".footer").css("bottom", "auto"); //Sticking footer to bottom
}
//Pulls more gifs to bottom of page - How could I reuse the initial function above??
function giphyPullAdditional(response) {
  console.log("Performing additional pull of images");
  console.log(
    "Starting gif pull at the " + gifInitial + "th index of the data object"
  );
  for (let i = gifInitial - 10; i < gifInitial; i++) {
    //Loop starts at 10, which increments every time you load gifs
    $("#image-area").append(
      //Adding gifs to page with
      "<div class=image-box><img src =" +
        response.data[i].images.original_still.url +
        " class=gif animated=" +
        response.data[i].images.original.url +
        " still=" +
        response.data[i].images.original_still.url +
        "><a id=facebook class=social target=_blank href='https://www.facebook.com/sharer/sharer.php?u=" +
        response.data[i].images.original.url +
        "&amp;src=sdkpreparse'><a id=twitter class=social target=_blank href='https://twitter.com/intent/tweet?text=" +
        response.data[i].bitly_url +
        "'><a id=favorite class=social href='www.lucas.com'></a><i class='fas fa-heart fave-icon'>"
    );
  }
  $(".load-more-box").appendTo("#image-area"); //Move the additional gif load button to end of page
  gifInitial += 10;
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
//Pushes the favorite clicked to the faves array
function saveFavorite(event) {
  event.preventDefault();
  favoritesArr.push(
    $(this)
      .siblings(".gif")
      .attr("src")
  );
  //Puts faves array in local storage
  localStorage.setItem("savedImages", JSON.stringify(favoritesArr));
  //Heart beat animation on save of favorite
  $(this)
    .siblings(".fave-icon")
    .animate({ fontSize: "100px" }, 500, "easeInOutBounce")
    .animate({ fontSize: "0px" }, 500, "easeOutBounce");
}
//Deletes favorite from array - triggered by clicking remove favorite button
function removeFavorite() {
  let favoriteNumber = $(this).attr("data-fave");
  favoritesArr.splice(favoriteNumber, 1);
  displayFavorites();
  localStorage.setItem("savedImages", JSON.stringify(favoritesArr)); //Resets local storage of array
}
//Displays favorite gifs on page - data pulled stored values in favorites array/Local Storage rather than API
function displayFavorites() {
  event.preventDefault();
  $("#image-area").empty();
  for (let i = 0; i < favoritesArr.length; i++) {
    $("#image-area").prepend(
      "<div class=image-box><img src=" +
        favoritesArr[i] +
        " class=gif><a id=facebook class=social target=_blank href='https://www.facebook.com/sharer/sharer.php?u=" +
        favoritesArr[i] +
        "&amp;src=sdkpreparse'><a id=twitter class=social target=_blank href='https://twitter.com/intent/tweet?text=" +
        favoritesArr[i] +
        "'><a id=removefave class=social data-fave=" +
        i +
        " href='#'>Remove Favorite</a><i class='fas fa-heart fave-icon'>" //Link to favorite item
    );
  }
  $("#image-area").prepend(
    //Display favorites title at start of div
    "<div class=subtitle-box><h3 class=subtitle>Favorites</h1>"
  );
}

//Event listeners
$("#search-btn").click(performSearch);
$("#favorite-btn").click(displayFavorites);
$(document).on("click", ".button", () => performCall(event.target.innerText));
$(document).on("click", "#favorite", saveFavorite);
$(document).on("click", "#removefave", removeFavorite);
$(document).on("click", ".load-more", () =>
  performCall($(".load-more").attr("data-load"))
); //Performs a call, passing in search query saved in data-load attr as argument
$(document).on("mouseenter", ".image-box", move);
$(document).on("mouseleave", ".image-box", still);
