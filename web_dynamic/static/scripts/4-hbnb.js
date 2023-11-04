$(document).ready(function () {
  // Initialize an object to store the selected amenity IDs and names
  var selectedAmenities = {};

  // Function to check the API status and update the `api_status` div
  function checkAPIStatus() {
    $.get('http://0.0.0.0:5001/api/v1/status', function (data) {
      if (data.status === 'OK') {
        // If the status is "OK," add the class "available" to the div#api_status
        $('#api_status').addClass('available');
      } else {
        // If the status is not "OK," remove the class "available" from the div#api_status
        $('#api_status').removeClass('available');
      }
    });
  }

  // Initially, check the API status when the page loads
  checkAPIStatus();

  // Function to load places from the API and display them
  function loadPlaces() {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: function (data) {
        // Loop through the result and create article tags for each Place
        data.forEach(function (place) {
          var placeHTML = '<article>' +
            '<div class="title_box">' +
            '<h2>' + place.name + '</h2>' +
            '<div class="price_by_night">$' + place.price_by_night + '</div>' +
            '</div>' +
            '<div class="information">' +
            '<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>' +
            '<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>' +
            '<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>' +
            '</div>' +
            '<div class="description">' + place.description + '</div>' +
            '</article>';
          $('.places').append(placeHTML);
        });
      }
    });
  }

  // Load places from the API when the page loads
  loadPlaces();

  // Listen for changes on each input checkbox tag
  $('input[type="checkbox"]').on('change', function () {
    var checkbox = $(this);
    var amenityId = checkbox.data('id');
    var amenityName = checkbox.data('name');

    // Check if the checkbox is checked
    if (checkbox.is(':checked')) {
      // Add the Amenity ID and Name to the object
      selectedAmenities[amenityId] = amenityName;
    } else {
      // Remove the Amenity ID from the object
      delete selectedAmenities[amenityId];
    }

    // Update the h4 tag inside the div Amenities with the list of selected Amenities
    var amenitiesList = Object.values(selectedAmenities).join(', ');
    $('.popover h4').text(amenitiesList);
  });

  // Listen for the button click event to filter places
  $('button[type="button"]').on('click', function () {
    // Make a POST request to places_search with selected amenities
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      contentType: 'application/json',
      data: JSON.stringify({ amenities: Object.keys(selectedAmenities) }),
      success: function (data) {
        // Clear the existing places and display the filtered places
        $('.places').empty();
        data.forEach(function (place) {
          var placeHTML = '<article>' +
            '<div class="title_box">' +
            '<h2>' + place.name + '</h2>' +
            '<div class="price_by_night">$' + place.price_by_night + '</div>' +
            '</div>' +
            '<div class="information">' +
            '<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>' +
            '<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>' +
            '<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>' +
            '</div>' +
            '<div class="description">' + place.description + '</div>' +
            '</article>';
          $('.places').append(placeHTML);
        });
      }
    });
  });
});
