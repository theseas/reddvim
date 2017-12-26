// ==UserScript==
// @name Reddit
// @description Enhances reddit user expirience by allowing the user to navigate the
// site using the keyboard sortcuts.
// @namespace theseas
// @homepage http://127.0.0.1:8000/reddit.user.js
// @match https://www.reddit.com/*
// @grant GM_openInTab
// @version 0.0.3.16
// @run-at document-end
// ==/UserScript==


class Post{
	constructor(posts){
		this.posts = posts;
		this.set_focus(0); // focus at the first post
		this.highlight();
	}

	// Sets the counter that keep the number of
	// the currrently focused post
	set_focus(num){
		if(num<0){
			num = 0
		}
		if(num>=this.posts.length){
			num = this.posts.length - 1
		}
		this.__focus = num;
	}
	
	// returns the number of the currently focused post
	get_focus(){
		return this.__focus;
	}

	// Highlights the currently focused post
	highlight(){
		var el = this.posts[this.get_focus()];
		el.style.borderLeft = "3px solid #ccc";
		el.style.backgroundColor = "#def";
		el.querySelector('[data-event-action="comments"]').focus();
	}

	// removes highlight from the currently focused post
	remove_highlight(){
		var el = this.posts[this.get_focus()];
		el.style.borderLeft = "0px";
		el.style.backgroundColor = "#fff";
	}

	// moves the focus to the next post
	move_down(){
		this.remove_highlight();
		this.set_focus(this.get_focus() + 1);
		this.highlight();
	}
	
	// moves the focus to the previous post
	move_up(){
		this.remove_highlight();
		this.set_focus(this.get_focus() - 1);
		this.highlight();
	}

	// opens the currently focused post
	open(){
		var post_url = this.posts[this.get_focus()].querySelector('[data-event-action="comments"]').href;
		GM_openInTab(post_url);
	}
}

function listener(e){
	var key = e.key;
	if(key === 'j' || key === 'J'){
		post.move_down();
	}else if (key === 'k' || key === 'K'){
		post.move_up();
	}else if (key === 'l' || key === 'L'){
		post.open();
	}
	e.preventDefault()
}


function main(){
	var table = document.getElementById('siteTable');
	post = new Post(table.querySelectorAll('[id^="thing_"]'));
	window.addEventListener('keypress', listener, true);
	console.log('main called');
}

window.addEventListener('load', main);
console.log('It works!');
