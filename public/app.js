console.log("Connected to app.js!");


$(document).on('click', '#artBtn', function (e) {
  e.preventDefault();
  // Save the id from the clicked on scraped data stored in the scrapeArticles Collection
  var thisId = $(this).attr("data-id");

  //make an ajax call for this data from the scrapeArticles DB
  $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
    .done(function (data) {
      console.log("Data Retrieved from Specific Article")
      console.log(data);
      // The title of the article
      $("#myModalLabel").text( data.title);
      $("#articleId").text(data._id);

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });

  return false;
});

$(document).on('click', '#commentBtn', function (e) {
  e.preventDefault();
  var comment = $("#articleMessage").val().trim();
  // Grab the id associated with the article from the submit button
  var thisId = $("#articleId").text();
  console.log(thisId);

  // Run a POST request on entered in message
  $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        message: comment
      }
    })
    // With that done
    .done(function (data) {
      // Log the response
      console.log(data);

    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#articleMessage").val("");
  return false;
});

$(document).on('click', '#saveArt', function (e) {
  e.preventDefault();
  var result = {};
  result.title = $(this).parent().parent().children('.title').text();
  result.summary = $(this).parent().parent().children('.summary').text();
  result.link = $(this).parent().parent().children('.link').text();
  console.log(result)
})

// All users can leave comments on the stories you collect. They should also be allowed to delete whatever comments they want removed. All stored comments should be visible to every user.
// You'll need to use Mongoose's model system to associate comments with particular articles.