$("#target" ).submit(function(ev){    
  ev.preventDefault();
  $("#api_result").children().remove();
  $("#hospital_result").children().remove();
  var disease = $("#query").val();
  $.get("api_request",{"data":disease},function( data , status){
    var data1 = JSON.parse(data);
    data1=JSON.parse(data1);

    $("#api_result").append( " <center><p><i class='material-icons'> android</i>&nbsp;Suggested Medicines</center> <p>" );
    for( x in data1.response.suggestions){
      console.log(data1.response.suggestions[x].suggestion);
      $("#api_result").append( "<a href='#!' class='collection-item'>" +  data1.response.suggestions[x].suggestion + "</a>" );
    }
  });      
});
$("#findHospital" ).submit(function(ev){    
  ev.preventDefault();
  $("#hospital_result").children().remove();
  $("#api_result").children().remove();
  var  city = $("#city").val();
  var geocoder = new google.maps.Geocoder();
  var address = city;
  geocoder.geocode({'address':address},function(results, status){
    if (status == google.maps.GeocoderStatus.OK) {
      var latitude = results[0].geometry.location.lat();
      var longitude = results[0].geometry.location.lng();
      var location = latitude+ "," + longitude;
      var url =  "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location= "+ location+ "&radius=500&types=hospital&key=AIzaSyDhooyBMw1gHS96ZH6Wpnf4XZdEj8NBiW0";
      $.get(url,function(data,status){
          var data1 = JSON.parse(data);
          data1=JSON.parse(data1);
          $("#hospital_result").append( "<center><p><i class='material-icons'> android</i>&nbsp;Suggested Medicines</center> <p>" );
          for( x in data1.response.suggestions)
          {
            console.log(data1.response.suggestions[x].suggestion);
            $("#api_result").append( "<a href='#!' class='collection-item'>" +  data1.response.suggestions[x].suggestion + "</a>" );
          }
      });
    } 
  });
});