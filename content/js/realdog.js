(function() {

  let dogy;
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      if(xhr.status == 200){
        dogy = xhr.responseText;
      }
      if(xhr.status == 404){
        console.log("ups");
      }
    }
  };
  xhr.open('post', 'https://eternalloneliness.dog/dogy', false);
  xhr.send();

  let taped = "";
  document.addEventListener("keypress", function(e){
    taped += e.key;
    if(taped.includes(dogy)){
      window.location.href = "./home";
    }
  });

  let html = document.querySelector('html');
  let clicks = [];
  let openTime = Date.now();

  html.addEventListener('click', function(e){
    clicks.push(Date.now()-openTime);

    for(let i=0; i<clicks.length-3; i++){
      let goody = (clicks[i+1]-clicks[i] > 1000) &&
                  (clicks[i+2]-clicks[i+1] > 1000) &&
                  (clicks[i+3]-clicks[i+2] < 1000);
      if(goody){
        window.location.href = "./home";
      }
    }
  });

})()
