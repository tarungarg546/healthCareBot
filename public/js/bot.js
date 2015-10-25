var generateSuggestion=function(disease){
  var length=disease.length;
  var res=[];
  if(disease[length-1]=='s')
  {
    var orig=disease.substr(0,length-1);
    res.push(orig);
    res.push(orig+'ing');
    res.push(orig+'ed');
  }
  else if(disease[length-1]=='g' && disease[length-2]=='n' && disease[length-3]=='i'){
    var orig=disease.substr(0,length-3);
    res.push(orig);
    res.push(orig+'ed');
    res.push(orig+'s');
  }
  else if(disease[length-1]=='d' && disease[length-2]=='e'){
    var orig=disease.substr(0,length-2);
    res.push(disease.substr(0,length-2));
    res.push(orig+'s');
    res.push(orig+'ing');
  }
  else
  {
    res.push(disease+'s');
    res.push(disease+'ing');
    res.push(disease+'ed');
  }
  return res;
};
function changeUI(data){
  console.log(data);
  $('#query').val(data);
  $('#target').submit();
}
$("#target").submit(function(ev){    
  ev.preventDefault();
  $("#api_result").children().remove();
  $("#hospital_result").children().remove();
  var disease = $("#query").val();
  var suggestions=generateSuggestion(disease);
  //console.log(sugg);
  $('#sugg').html(' ');
  $('#sugg').append('You might be interested in :- ');
  suggestions.forEach(function(value,idx){
    $('#sugg').append('<div class="chip" data-val="'+value+'" onclick="changeUI(\''+value+'\')">'+value+'</div>');  
  });
  $.get("api_request",{"data":disease},function( data , status){
    var data1 = JSON.parse(data);
    data1=JSON.parse(data1);

    $("#api_result").append( "<center><p><i class='material-icons'> android</i>&nbsp;Suggested Medicines</center> <p>" );
    for( x in data1.response.suggestions){
      //console.log(data1.response.suggestions[x].suggestion);
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