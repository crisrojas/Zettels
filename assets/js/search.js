// var firstRun = true;
loadIndex()

document.addEventListener("turbolinks:load", function() {
	setNoteWrapperState()
	selectedNoteOnIndex()
})

function loadIndex() {
	  fetchJSON(function(response) {
	
		const notes = response;
		const search_results = document.querySelector('#search-results');
		
		notes.forEach(note => {
			const title = '<h4>'+ note.title + '</h4>';
			const summary = '<div>' + note.summary + '</div>';
			const permalink = note.permalink
			const list_content = '<li><a href="' + permalink + '" tabindex="0">' + title + summary + '</a></li>'
			const child = document.createElement("li");
			child.innerHTML = list_content;
			search_results.append(child)
		});
		
	  });
	}
	
	
function fetchJSON(callback) {
	  
	const requestURL = '/index.json';
	const request = new XMLHttpRequest();
	request.open('GET', requestURL, true);
	request.responseType = 'json';
	request.onreadystatechange = function() {
	  if (request.readyState === 4 && request.status === 200) {
		  callback(request.response);
	  }
	};
	request.send(null);
}

function performSearch() {

	  var input, filter, ul, li, a, i, txtValue;
	  input = document.getElementById('search-input');
	  filter = input.value.toUpperCase();
	  ul = document.getElementById("search-results");
	  li = ul.getElementsByTagName('li');
	
	  for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("a")[0];
		txtValue = a.textContent || a.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
		  li[i].style.display = "";
		} else {
		  li[i].style.display = "none";
		}
	  }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(evt) {
	
	if (evt.metaKey && evt.which === 75 || evt.ctrlKey && evt.which === 75) {
		handleNavVisibility()
	}
	
	if (evt.key === "Escape" || evt.key === "Esc" | evt.keyCode === 27) {
		hideNav()
	}
	
});

var nav_is_visible = false;
function handleNavVisibility() {
	if (!nav_is_visible) {
		showNav();

	} else {
		hideNav()
	}
}

function showNav() {
	
	// if (firstRun) {
	// 	loadIndex();
	// 	firstRun = false;
	// }
	
	document.getElementById("search").style.width = "300px";
	document.getElementById("search").style.opacity = 1;
	document.getElementById("search-header").style.opacity = 1;
	document.getElementById("search-header").style.width = "299px";
	document.getElementById("search-input").focus();
	pushNoteWrapper()
	
	nav_is_visible = true;
}

function hideNav() {
	document.getElementById("search").style.width = "0";
	document.getElementById("search-header").style.width = "0";
	document.getElementById("search").style.opacity = 0;
	document.getElementById("search-header").style.opacity = 0;
	document.getElementById("main").style.marginLeft= "0";
	pullNoteWrapper()
	
	nav_is_visible = false;
}

function setNoteWrapperState() {
	if (nav_is_visible) {
		pushNoteWrapper()
	} else {
		pullNoteWrapper()
	}
}

function pushNoteWrapper() {
	document.getElementById("main").style.marginLeft = "300px";
}

function pullNoteWrapper() {
	document.getElementById("main").style.marginLeft = "0";
}

function selectedNoteOnIndex() {

	const current_note = window.location.href;
	const search_results = document.querySelector('#search-results');
	
	console.log("@todo: select note on index");
	
	var list = search_results.getElementsByTagName("a");
	
	// for (var i = 0; i < list.length; i++) {
	// 	console.log(list[i].id); //second console output
	// };
	
// 	var i = 0
// 	for(i;i<listed_items.length;i++){
// 
// 		var note_link = listed_items[i].href.split("/");
// 		console.log(note_link)
// 		if(note_link[note_link.length-1] == currentPage) {
// 		listed_items[i].className = "selected";
// 		
// 		}
// 	}
}