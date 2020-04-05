(function() {

  /* TITLE CHANGE */
  let title = document.getElementsByTagName("title")[0];
  let titles = ["Roses", "are", "red", "Romance", "is", "dead", "Everyday", "I", "suffer", "From", "existential", "dread"];
  let i = 0;
  setInterval(function() {
    title.innerHTML = titles[i % 12];
    i++;
  }, 500);

  /* OPEN ETERNAL */
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
      window.location.href = "./home/";
    }
  });
})()
