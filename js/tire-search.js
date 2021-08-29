$(document).ready(function(){

  populateApplications();

  $( '#search-application' ).on('change', function(e){
    application = $(this).val();
    // clearPositions();
    populatePositions(application);
  });

  $( '#search-position' ).on('change', function(e){
    position = $(this).val();
    application = $( '#search-application' ).val();
    // clearSizes();
    populateSizes(position, application);
  });
})

function populateApplications() {
  $.ajax({
    method: "GET",
    url: "/search/tire_search",
    dataType: 'json',
  })
    .done(function( data ) {
      $('#search-application').html('');
      $.each(data, function(key, value){
        $('#search-application').append(
          "<option value='" + key + "'>" + value + "</option>"
        );
      });
      $('#search-application').trigger('change');
    });

}

function populatePositions(application) {
  $.ajax({
    method: "POST",
    url: "/search/tire_search",
    dataType: 'json',
    data: {application: application}
  })
    .done(function( data ) {
      $('#search-position').html('');
      $.each(data, function(key, value){
        $('#search-position').append(
          "<option value='" + key + "'>" + value + "</option>"
        );
      });
      $('#search-position').trigger('change');
    });

}

function populateSizes(position, application) {
  $.ajax({
    method: "POST",
    url: "/search/tire_search",
    dataType: 'json',
    data: {position: position, application: application}
  })
    .done(function( data ) {
      $('#search-size').html('');
      $.each(data, function(key, value){
        $('#search-size').append(
          "<option value='" + key + "'>" + value + "</option>"
        );
      });
    });

}
