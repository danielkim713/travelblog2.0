var self = {
  jwtToken: null,
  username: null
};

var selectedCountry;
var map = AmCharts.makeChart("chartdiv", {

  "type": "map",
  "theme": "dark",
  "projection": "eckert3",
  "dataProvider": {
    "map": "worldLow",
    "getAreasFromMap": true
  },
  "areasSettings": {
    "selectedColor": "#7fc6a4",
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
      selectedCountry = JSON.stringify(getSelectedCountries()).replace(/['"]+/g, '');
      document.getElementById("selected").innerHTML = selectedCountry;

      getCountryComments();
    }
  }]
});

function getCountryComments(){
  if (self.jwtToken) {
    fetch("/api/posts/" + selectedCountry, {
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + self.jwtToken
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
        commentsDiv.innerHTML += '<div class="singleComment">' + '<h1>' + post.username + "</h1>" +  '<p>' + post.content + '</p>' + '</div>'
      });
    })
  }
}

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

    fetch("/api/users/", {
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

    fetch("/api/auth/login", {
      body: JSON.stringify(requestBody),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST'
    }).then(response => {
      return response.json();
    }).then(data => {
      self.jwtToken = data.authToken;
      $(".popupBody").hide();
      $("#welcome").show();
      $("#welcome").html("Welcome " + username);
      $("#commentForm").show();
      self.username = username;
    })
      .catch(err => {
        alert("Invalid username or password");
    });

  });

  $("#commentForm").submit(function (event) {
    event.preventDefault();
    console.log(event)
    const username = self.username;
    const content = event.target.children[0].value;
    const country = document.getElementById('selected').innerHTML;
    
    var requestBody = {
      username,
      content,
      country
    };

    fetch("/api/posts/" , {
      body: JSON.stringify(requestBody),
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + self.jwtToken
      },
      method: 'POST'
    }).then(response => {
      getCountryComments();
      $("#entercomments").val("");
    });

  });

  // $("").submit(function(event))
};


$(document).ready(function(){
    addEventListeners();
});