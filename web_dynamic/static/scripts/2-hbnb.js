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
});
