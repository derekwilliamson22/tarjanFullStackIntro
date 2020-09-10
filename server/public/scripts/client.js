$(document).ready(onReady);

function onReady() {
  getSongs();
  $("#addSongButton").on("click", addSong);
  $(document).on("click", ".deleteSongBtn", deleteSong);
  $(document).on("click", ".rankUp", rankUp);
  $(document).on("click", ".rankDown", rankDown);
} // end onReady

function addSong() {
  let objectToSend = {
    rank: $("#rankIn").val(),
    artist: $("#artistIn").val(),
    track: $("#trackIn").val(),
    published: $("#publishedIn").val(),
  }; // end object to send
  $.ajax({
    method: "POST",
    url: "/songs",
    data: objectToSend,
  })
    .then(function (response) {
      console.log("back from POST with:", response);
      getSongs();
    })
    .catch(function (err) {
      alert("error!");
      console.log(err);
    }); // end AJAX POST
} // end addSong

function getSongs() {
  $.ajax({
    method: "GET",
    url: "/songs",
  })
    .then(function (response) {
      console.log("back from GET with:", response);
      // display songs on DOM
      let el = $("#songsOut");
      el.empty();
      for (let i = 0; i < response.length; i++) {
        el.append(`<li>
            ${response[i].rank}
            ${response[i].track}
            ${response[i].artist}
            ${response[i].published.split("T")[0]}
            <button class='deleteSongBtn' data-id='${
              response[i].id
            }'>Delete Me</button>
            <button class='rankUp' data-id='${response[i].id}'>Up</button>
            <button class='rankDown' data-id='${response[i].id}'>Down</button>
            </li>`);
      } // end for
    })
    .catch(function (err) {
      alert("error!");
      console.log(err);
    }); // end AJAX GET
} // end getSongs()

function deleteSong() {
  console.log("in delete");

  let songId = $(this).data("id"); // TODO
  $.ajax({
    method: "DELETE",
    url: `/songs/${songId}`,
  })
    .then(function (response) {
      console.log("deleted", response);
      getSongs();
    })
    .catch(function (error) {
      console.log("error in delete", error);
    });
} // end deleteSong

function rankUp() {
  let songId = $(this).data("id");
  console.log("rank up!", songId);
  $.ajax({
    method: "PUT",
    url: `/songs/${songId}`,
    data: {
        direction: 'up'
    }
  })
    .then(function (response) {
      console.log("response from rankUp", response);
      getSongs();
    })
    .catch(function (error) {
      console.log("error in rankUp", error);
    });
} // end rankUp

function rankDown() {
  let songId = $(this).data("id");
  console.log("rank down!", songId);
} // end rankDown
