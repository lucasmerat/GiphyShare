buttonArr = ["OMG", "Good Morning", "LOL", "NO", "Ok", "Good"]; //Initial sample search values
loadButtons();
//Creates and displays buttons for all in array
function loadButtons() {
  $("#button-area").empty();
  for (let i = 0; i < buttonArr.length; i++) {
    let newButton = $('<button class="button">').text(buttonArr[i]);
    newButton.attr("data-number", i);
    $("#button-area").append(newButton);
  }
}
//If search bar is filled, calls the performCall function
function performSearchClick(event) {
  event.preventDefault();
  console.log($("#user-input").val() === "");
  if ($("#user-input").val() === "") {
    alert("Enter a search to find giphys!");
  } else {
    performCall($("#user-input").val());
  }
}
//Takes either button clicked innerText or value of user input bar and performs AJAX call
function performCall(value) {
  let query = value;
  let queryUrl =
    "https://api.giphy.com/v1/gifs/search?api_key=VXGe08mkPRvKJZQIFGMHmx9xiIhGYg7t&q=" +
    query +
    "&limit=10&offset=0&rating=G&lang=en";
  console.log("query is" + query);
  //Adds query value to button array, assuming the value is not already there
  if (buttonArr.includes(query)) {
    console.log(query + " is already in the array");
  } else {
    buttonArr.push(query);
  }
  loadButtons(); //Reloads buttons to display all values including new one added
  $.ajax({ url: queryUrl, method: "GET" }).then(giphyPull); //AJAX call takes giphyPull function as callback
}
//Takes image data from Giphy API and uses it to display images on page
function giphyPull(response) {
  console.log(response); //Display JSON
  $("#image-area").empty(); //Clear all images, each new query
  $("#user-input").val(""); //Clears user search bar
  for (let i = 0; i < response.data.length; i++) {
    console.log(response.data[i]);
    let image = $();
    $("#image-area").append(
      "<div class=image-box><img src =" +
      response.data[i].images.original_still.url +
      " class=gif animated=" +
      response.data[i].images.original.url + //Adding animated image as arg
      " still=" +
      response.data[i].images.original_still.url + //Still image as second arg to revert off hover
        "><a id=facebook class=social target=_blank href='https://www.facebook.com/sharer/sharer.php?u="+ response.data[i].images.original.url + "&amp;src=sdkpreparse'><a id=twitter class=social href='www.twitter.com'><a id=favorite class=social href='www.lucas.com'>"
    );
  }
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
//Event listeners
$("#search-btn").click(performSearchClick);
$(document).on("click", ".button", () => performCall(event.target.innerText));
$(document).on("mouseenter", ".image-box", move);
$(document).on("mouseleave", ".image-box", still);
