console.log("Connected to app.js!");
// 1: On Load
// ==========

// The first thing this js file will do: ask the back end for a json with all animals
$.getJSON("/all", function(data) {
  // For each entry of that json... Instead add to handlebars
//   for (var i = 0; i < data.length; i++) {
//     // Append each of the animal's properties to the table
//     $("#results").append("<tr><td>" + data[i].name + "</td>" +
//                          "<td>" + data[i].numlegs + "</td>" +
//                          "<td>" + data[i].class + "</td>" +
//                          "<td>" + data[i].weight + "</td>" +
//                          "<td>" + data[i].whatIWouldReallyCallIt + "</td></tr>");
//   }
});


// 2: Button Interactions
// ======================

// When user clicks the weight sort button, display table sorted by weight
$("#scrapeArticles").on("click", function() {
  // First, empty the table
  $(".newsItems").empty();
  // Then re-append the header of the table
  $("#results").append("<tr><th>Name</th><th>Num Legs</th><th>Class</th>" +
    "<th id='active'>Weight</th><th>But I'd Call It...</th></tr>");
  // Now do an api call to the back end for a json with all animals, sorted by weight
  $.getJSON("/weight", function(data) {
    // For each entry of that json...
    for (var i = 0; i < data.length; i++) {
      // Append each of the animal's properties to the table
      $("#results").append("<tr><td>" + data[i].name + "</td>" +
                           "<td>" + data[i].numlegs + "</td>" +
                           "<td>" + data[i].class + "</td>" +
                           "<td>" + data[i].weight + "</td>" +
                           "<td>" + data[i].whatIWouldReallyCallIt + "</td></tr>");
    }
  });
});

  $(document).on('click', '#myModal', function(e){
    e.preventDefault();
    return false;
  });

  $(document).on('click', '#commentBtn', function(e){
    e.preventDefault();
    var comment = $("#articleMessage").val().trim();
    return false;
  });

// All users can leave comments on the stories you collect. They should also be allowed to delete whatever comments they want removed. All stored comments should be visible to every user.
// You'll need to use Mongoose's model system to associate comments with particular articles.