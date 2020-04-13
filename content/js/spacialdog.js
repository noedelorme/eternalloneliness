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
  xhr.open('post', 'http://localhost:8101/dogy', false);
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

  html.addEventListener('click', function(e){
    clicks.push(e.clientX<window.innerWidth/2);
    for(let i=0; i<clicks.length-4; i++){
      let goody = !clicks[i] &&
                  clicks[i+1] &&
                  clicks[i+2] &&
                  !clicks[i+3] &&
                  clicks[i+4];
      if(goody){
        window.location.href = "./home";
      }
    }
  });;

})()
