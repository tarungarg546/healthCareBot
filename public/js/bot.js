//i am trying to ES6 as much as possible
var findLevenshteinDistance=(B)=>{
  var A=$('#query').val();
  A=A.toLowerCase();
  B=B.toLowerCase();
  var lengthOfA=A.length,lengthOfB=B.length;
  //create 2 d array
  var dp = new Array(lengthOfA);
  for (var i = 0; i <=lengthOfA; i++) {
    dp[i] = new Array(lengthOfB);
  }
  for(var i=0;i<=lengthOfA;i++)
  {
    for(var j=0;j<=lengthOfB;j++)
    {
      if(i==0){
        dp[i][j]=j;//minimum j operation required if frst string is empty
      }
      else if(j==0){
        dp[i][j]=i;
      }
      else if(A[i-1]==B[j-1]){
        dp[i][j]=dp[i-1][j-1];
      }
      else{
        dp[i][j]=1+Math.min(dp[i][j-1],dp[i-1][j],dp[i-1][j-1]);
      }
    }
  }
  return dp[lengthOfA][lengthOfB]<=3;
}
var generateSuggestion=(disease)=>{
  var length=disease.length;
  //list of disease might be retreived from database in future but for this use case we decided to keep it limited for testing
  var listOfDisease=['Dengue','Vomit','Fever','Cough','Cold','Pneumonia','Cancer','Malaria','Typhoid','Swine Flu','Bird Flu','HIV Aids','Aids','Anemia','Asthama','Autism','Blood Clot','Bronchitis','Canine Flu','Chickenpox','Diabetes','Dog Bites','DVT','Down Syndrome','Ebola Virus','Glanders','Gout','Hemophilia','STD','Blood Pressure','BP','High Blood Pressure','HTC','Influenza','Kidney Failure','Kidney Disease','Leprosy','Lice','Lung Cancer','Monkeypox','Myiasis','Polio'];
  var res=listOfDisease.filter(findLevenshteinDistance);
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
  $("#api_result").append("<center><img src='images/loader.gif' id='load' style='display:inline;'></center>");
  $("#hospital_result").children().remove();
  var disease = $("#query").val();
  var suggestions=generateSuggestion(disease);
  //console.log(sugg);
  $('#sugg').html(' ');
  $('#sugg').append('You might be interested in :- ');
  suggestions.forEach(function(value,idx){
    $('#sugg').append('<div class="chip" data-val="'+value+'" onclick="changeUI(\''+value+'\')">'+value+'</div>');  
  });
  /*$.get("api_request",{"data":disease},function( data , status){
    var data1 = JSON.parse(data);
    data1=JSON.parse(data1);
    $("#load").css('display','none');
    $("#api_result").append( "<center><p><i class='material-icons'> android</i>&nbsp;Suggested Medicines</center> <p>" );
    for( x in data1.response.suggestions){
      //console.log(data1.response.suggestions[x].suggestion);
      $("#api_result").append( "<a href='#!' class='collection-item'>" +  data1.response.suggestions[x].suggestion + "</a>" );
    }
  });*/     
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