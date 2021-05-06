function openNav() {
    var x = document.getElementById("close-btn");
    var z = document.getElementById("back-btn");
    x.style.display = "block";
	z.style.display = "none"
    document.getElementById("splitview").style.width = "48%";
	
  }
  
  function closeNav() {
    var x = document.getElementById("close-btn");
    var z = document.getElementById("back-btn");
    x.style.display = "none";
    z.style.display = "inline-block";
    document.getElementById("splitview").style.width = "0";
    
  }
  document.onkeydown = function(e) {
      e = e || window.event;
      if (e.keyCode == '72') {
          alert('h key pressed')
      }
  }
  document.onkeydown = function(evt) {
      evt = evt || window.event;
      var isEscape = false;
      //if (evt.keyCode == '37') {
      //    window.history.back();
      //}
      //if (evt.keyCode == '39') {
      //    window.history.forward();
      // }
      //if (evt.keyCode == '') {
      //    window.location.href = "./"
      //}
      if ("key" in evt) {
          isEscape = (evt.key === "Escape" || evt.key === "Esc");
      } else {
          isEscape = (evt.keyCode === 27);
      }
      if (isEscape) {
          closeNav()
      }
  
  };
  
  function toggleZettel(id) {
    var x = document.getElementById(id);
    if (x.style.display === "none") {
    x.style.display = "block";
    } else {
    x.style.display = "none";
    }
  }