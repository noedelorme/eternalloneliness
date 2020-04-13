(function() {

  let dogy;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      if(xhr.status == 200){
        dogy = JSON.parse(xhr.responseText);
        if(dogy.connected){
          //window.location.replace(dogy.goTo);
          window.location.href = dogy.goTo;
        }
      }
      if(xhr.status == 404){
        console.log("ups");
      }
    }
  };

  let dogyurl = "http://localhost:8101/dogy";
  //let dogyurl = "https://eternalloneliness.dog/dogy";

  let taped = "";
  let clicks = "";
  let html = document.querySelector('html');

  document.addEventListener("keypress", function(e){
    taped += e.key;
    if(taped.length>=10){
      xhr.open('post', dogyurl, false);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send('dogy=' + taped + '&dogymobile=' + clicks);
    }
  });

  html.addEventListener('click', function(e){
    clicks += e.clientX<window.innerWidth/2 ? "g" : "d";
    if(clicks.length>=5){
      xhr.open('post', dogyurl, false);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send('dogy=' + taped + '&dogymobile=' + clicks);
    }
  });;

})()
