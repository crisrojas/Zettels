loadIndex()

// Highlight with jQuery
// from: https://stackoverflow.com/questions/41533785/how-to-highlight-search-text-in-html-with-the-help-of-js
// @todo: This is the only use of jQuery. Find a vanila JS way
jQuery.fn.highlight = function(pat) {

	function innerHighlight(node, pat) {

		var skip = 0;

		if (node.nodeType == 3) {

			var pos = node.data.toUpperCase().indexOf(pat);

			if (pos >= 0) {

				var spannode       = document.createElement('span');
				spannode.className = 'highlighted';
				var middlebit      = node.splitText(pos);
				var endbit         = middlebit.splitText(pat.length);
				var middleclone    = middlebit.cloneNode(true);

				spannode.appendChild(middleclone);
				middlebit.parentNode.replaceChild(spannode, middlebit);

				skip               = 1;

			}

		} else if (node.nodeType == 1 && node.childNodes && !/(script|style) /i.test(node.tagName)) {
			for (var i = 0; i < node.childNodes.length; ++i) {

				i += innerHighlight(node.childNodes[i], pat);

			}

		}

		return skip;

	}

	return this.each(function() {

		innerHighlight(this, pat.toUpperCase());

	});

 };

jQuery.fn.removeHighlight = function() {

	function newNormalize(node) {

		for (var i = 0, children = node.childNodes, nodeCount = children.length; i < nodeCount; i++) {

			var child = children[i];

			if (child.nodeType == 1) {

				newNormalize(child);
				continue;

			}

			if (child.nodeType != 3) { continue; }

			var next = child.nextSibling;

			if (next == null || next.nodeType != 3) { continue; }

			var combined_text = child.nodeValue + next.nodeValue;
			new_node          = node.ownerDocument.createTextNode(combined_text);

			node.insertBefore(new_node, child);
			node.removeChild(child);
			node.removeChild(next);
			i--;
			nodeCount--;

		}

	}

	return this.find("span.highlighted").each(function() {

		var thisParent = this.parentNode;
		thisParent.replaceChild(this.firstChild, this);
		newNormalize(thisParent);

	}).end();

};

$(function() {

	$('#search-input').bind('keyup change', function(ev) {

		// pull in the new value
		var searchTerm = $(this).val();

		// remove any old highlighted terms
		$('body').removeHighlight();

		// disable highlighting if empty
		if ( searchTerm ) {

			// highlight the new term
			$('body').highlight( searchTerm );

		}

	});

});

///

var scrollTop = 0
document.addEventListener("turbolinks:before-render", function() {
  var search_index = document.getElementById("search-results");
  var y = search_index.scrollTop;
  scrollTop = y

 
})

document.addEventListener("turbolinks:render", function() {
	var search_index = document.getElementById("search-results");
	search_index.scrollTop = scrollTop
})
	
document.addEventListener("turbolinks:load", function() {
	setNoteWrapperState()
	
	
	const current = window.location.href
	  
	 var els = document.getElementsByTagName("a");
	 for (var i = 0, l = els.length; i < l; i++) {
		 var el = els[i];
		
		 if (el.href === current) {
			 el.classList.add("selected")
		 } else {
			 el.classList.remove("selected")
		 }
	 }
})

function loadIndex() {
	  fetchJSON(function(response) {
	
		const notes = response;
		const search_results = document.getElementById('search-results');
		const tags = document.getElementById('tags');
		const current_note = window.location.href;
		notes.index.forEach(note => {
			const title = '<h4>'+ note.title + '</h4>';
			const summary = '<div>' + note.summary + '</div>';
			
			const permalink = note.permalink
			
			var thumbnail = ""
			if (note.thumbnail === "") {
				thumbnail = ""
			} else {
				// @todo: 
				// this loads the first image of the note
				// for every note in the vault
				// this isn't efficient at all
				// 2 ideas: 
				// find a way of resizing with hugo
				// use lazy loading.
				thumbnail = '<img loading="lazy" src="' + note.thumbnail + '?nf_resize=fit&w=122&h=76"/><span style="display:none";>@attachments</span>'
			}
			
			const tags = '<span style="display:none">' + note.tags + '</span>'
			var list_content;
			if (current_note === permalink) {
				list_content = '<a href="' + permalink + '" class="selected search-item" tabindex="0">' + title + summary + '</a>'
			} else {
				list_content = '<a href="' + permalink + '" class="search-item" tabindex="0">' + title + summary + thumbnail + tags + '</a>'
			}
			
			const child = document.createElement("li");
			child.innerHTML = list_content;
			search_results.append(child)
		});
		
		// @todo: wip
		// notes.tags.forEach(tag => {
		// 	const child = document.createElement("li");
		// 	child.innerHTML = '<a onclick="focusTag(this)">' + tag + '</a>'
		// 	tags.append(child)
		// });
		// 
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

function focusTag(a) {
	showNav()
	performSearchWith(a.innerText)
	
}

function performSearchWith(query) {
	
	// document.getElementById('search-input').value = query
	
	var filter, ul, li, a, i, txtValue;
	  
	  filter = query.toLowerCase();
	  filter  = filter.replace('/[.*+?^${}()|[\]\\]/g', '\\$&');
	  
	  var re = new RegExp(filter, 'g');
	  
	  ul = document.getElementById("search-results");
	  li = ul.getElementsByTagName('li');

	  for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("a")[0];
		
		txtValue = a.textContent || a.innerText;
		if (txtValue.toLowerCase().indexOf(filter) > -1) {

		  li[i].style.display = "block";
		  
		} else {
		  li[i].style.display = "none";
		}
	  }
}

function performSearch() {
	  
	  var input, filter, ul, li, a, i, txtValue;
	  input = document.getElementById('search-input');
	  
	  filter = input.value.toLowerCase();
	  filter  = filter.replace('/[.*+?^${}()|[\]\\]/g', '\\$&');
	  
	  var re = new RegExp(filter, 'g');
	  
	  ul = document.getElementById("search-results");
	  li = ul.getElementsByTagName('li');

	  for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("a")[0];
		
		txtValue = a.textContent || a.innerText;
		if (txtValue.toLowerCase().indexOf(filter) > -1) {

		  li[i].style.display = "block";
		  
		} else {
		  li[i].style.display = "none";
		}
	  }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(evt) {
	
	if (evt.metaKey && evt.which === 75 || evt.ctrlKey && evt.which === 75) {
		document.getElementById("search-input").focus();
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
	
	document.getElementById("search").style.width = "300px";
	document.getElementById("search").style.opacity = 1;
	document.getElementById("search-header").style.opacity = 1;
	document.getElementById("search-header").style.width = "299px";
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


// Prefetching
// https://github.com/turbolinks/turbolinks/issues/313
const hoverTime = 300
const fetchers = {}
const doc = document.implementation.createHTMLDocument('prefetch')

function fetchPage (url, success) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.setRequestHeader('VND.PREFETCH', 'true')
  xhr.setRequestHeader('Accept', 'text/html')
  xhr.onreadystatechange = () => {
	if (xhr.readyState !== XMLHttpRequest.DONE) return
	if (xhr.status !== 200) return
	success(xhr.responseText)
  }
  xhr.send()
}

function prefetchTurbolink (url) {
  fetchPage(url, responseText => {
	doc.open()
	doc.write(responseText)
	doc.close()
	const snapshot = Turbolinks.Snapshot.fromHTMLElement(doc.documentElement)
	Turbolinks.controller.cache.put(url, snapshot)
  })
}

function prefetch (url) {
  if (prefetched(url)) return
  prefetchTurbolink(url)
}

function prefetched (url) {
  return location.href === url || Turbolinks.controller.cache.has(url)
}

function prefetching (url) {
  return !!fetchers[url]
}

function cleanup (event) {
  const element = event.target
  clearTimeout(fetchers[element.href])
  element.removeEventListener('mouseleave', cleanup)
}

document.addEventListener('mouseover', event => {
  if (!event.target.dataset.prefetch) return
  const url = event.target.href
  if (prefetched(url)) return
  if (prefetching(url)) return
  cleanup(event)
  event.target.addEventListener('mouseleave', cleanup)
  fetchers[url] = setTimeout(() => prefetch(url), hoverTime)
})
