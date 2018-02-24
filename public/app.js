var jwtToken = null;

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
      var selectedCountry = JSON.stringify(getSelectedCountries()).replace(/['"]+/g, '');
      document.getElementById("selected").innerHTML = selectedCountry;

      if (jwtToken) {
        fetch("http://localhost:8080/api/posts/" + selectedCountry, {
          headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken
          }
        }).then(response => {
          console.log(response);
          return response.json();
        }).then(data => {
          //loop through the data array
          //get the username and put it into html
          //get the content and put it into html
          let commentsDiv = document.getElementById('comments');
          document.getElementById('comments').innerHTML = '';

          data.forEach(post => {
            commentsDiv.innerHTML = '<p>' + post.username + ': ' + post.content + '</p>'
          });
        })
      }
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

function addEventListeners() {
  // $('.btn_red').on('click',function(){
  //     $('.usrform').css("display","block");
  //     $('.useruser').html(username);
  // });
  $("#start").click(function(){
    $(".blog-intro").hide();
  });

  $("#login_form").click(function() {
    $(".social_login").hide();
    $(".user_login").show();
  });

  $("#register_form").click(function() {
    $(".social_login").hide();
    $(".user_register").show();
    $(".header_title").text('Register');
  });

  $(".back_btn").click(function() {
    $(".user_login").hide();
    $(".user_register").hide();
    $(".social_login").show();
    $(".header_title").text('Login');
  });

  $("#formenter").click(function(){
    $(".user_login").show();
    $(".user_register").hide();
  });

  $("#registrationForm").submit(function (event) {
    event.preventDefault();

    const username = event.target["0"].value;
    const password = event.target["1"].value;
    
    var requestBody = {
      username,
      password
    };

    fetch("http://localhost:8080/api/users/", {
      body: JSON.stringify(requestBody),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    }).then(response => {
      console.log(response);
    });

  });


  $("#loginForm").submit(function (event) {
    event.preventDefault();

    const username = event.target["0"].value;
    const password = event.target["1"].value;
    
    var requestBody = {
      username,
      password
    };

    fetch("http://localhost:8080/api/auth/login", {
      body: JSON.stringify(requestBody),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    }).then(response => {
      return response.json();
    }).then(data => {
      jwtToken = data.authToken;
    });

    $(".popupBody").hide();
    $("#welcome").show();
    $("#welcome").html("Welcome " + username);
  });

  // $("").submit(function(event))
};


$(document).ready(function(){
    addEventListeners();
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