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
      var f = document.createElement('form');
      f.action='/home';
      f.method='POST';

      var i=document.createElement('input');
      i.type='hidden';
      i.name='pass';
      i.value=dogy;
      f.appendChild(i);

      document.body.appendChild(f);
      f.submit();
    }
  });
})()
