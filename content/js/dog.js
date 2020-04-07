(function() {

  /* OPEN ETERNALLONLINESS */
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
  xhr.open('post', '/dogy', false);
  xhr.send();

  let taped = "";
  document.addEventListener("keypress", function(e){
    taped += e.key;
    if(taped.includes(dogy)){
      window.location.href = "./home";
    }
  });
})()
