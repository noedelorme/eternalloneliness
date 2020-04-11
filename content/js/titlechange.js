(function(){
  /* TITLE CHANGE */
  let title = document.getElementsByTagName("title")[0];
  let titles = ["Roses", "are", "red", "Romance", "is", "dead", "Everyday", "I", "suffer", "From", "existential", "dread"];
  let i = 0;
  setInterval(function() {
    title.innerHTML = titles[i % 12];
    i++;
  }, 700);

})()
