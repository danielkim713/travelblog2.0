var map = AmCharts.makeChart("chartdiv", {
  "type": "map",
  "theme": "light",
  "projection": "eckert3",
  "dataProvider": {
    "map": "worldLow",
    "getAreasFromMap": true
  },
  "areasSettings": {
    "selectedColor": "#CC0000",
    "selectable": true
  },
  "listeners": [{
    "event": "clickMapObject",
    "method": function(e) {
      
      if (e.mapObject.objectType !== "MapArea")
        return;
      
      var area = e.mapObject;
      
      area.showAsSelected = !area.showAsSelected;
      e.chart.returnInitialColor(area);
      document.getElementById("selected").innerHTML = JSON.stringify(getSelectedCountries());
    }
  }]
});

function getSelectedCountries() {
  var selected = "";
  console.log(map.dataProvider.areas);
  for(var i = 0; i < map.dataProvider.areas.length; i++) {
    if(map.dataProvider.areas[i].showAsSelected)
      selected = map.dataProvider.areas[i].title;
  }
  for(var i = 0; i < map.dataProvider.areas.length; i++) {
    if(map.dataProvider.areas[i].showAsSelected)
      map.dataProvider.areas[i].showAsSelected = false;
  }
  return selected;
}

//fetch api /post

function clearContents(element) {
  element.value = '';
}


$(function() {
    $("#login_form").click(function() {
        $(".social_login").hide();
        $(".user_login").show();
        return false;
    });

    $("#register_form").click(function() {
        $(".social_login").hide();
        $(".user_register").show();
        $(".header_title").text('Register');
        return false;
    });

    $(".back_btn").click(function() {
        $(".user_login").hide();
        $(".user_register").hide();
        $(".social_login").show();
        $(".header_title").text('Login');
        return false;
    });
});


$(document).ready(function(){
    $('.btn_red').on('click',function(){
        $('.usrform').css("display","block");
        $('.useruser').html(username);
    });
});

//document.getElementbyId('asdjfkl').addEventListener('submist,' function(e)){
  //e.preventDefault();
  //console.log(e);
  // var bodyPayload = { }; 
  //bodyPayload.username = e.inputfield1.value
  //bodyPayload.password = e.inputfield2.value

  //fetch('localhost:8080/users', {
  //  method: 'POST',
  //  body: JSON.stringify(bodyPayload)
  //}).then(function (response) {
  //  return response.json();
  //})