var thumbnail_mode = false
function imageMode() {
	const note_wrapper = document.getElementById('note-wrapper')
	const images = note_wrapper.getElementsByTagName('img')
	
	if (thumbnail_mode) {
		var els = note_wrapper.getElementsByTagName('img')
		for(var i = 0, all = els.length; i < all; i++){   
			 els[i].classList.remove('thumbnail');
		 }
		 thumbnail_mode = false
	} else {
		var els = note_wrapper.getElementsByTagName('img')
		for(var i = 0, all = els.length; i < all; i++){   
			 els[i].classList.add('thumbnail');
		 }
		 thumbnail_mode = true
	}
}