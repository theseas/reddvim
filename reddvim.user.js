// ==UserScript==
// @name ReddVim
// @description Enhances reddit user experience by allowing the user to navigate the site using vim-like keyboard shortcuts.
// @namespace theseas
// @homepage https://github.com/theseas/reddvim/raw/master/reddvim.user.js
// @match https://www.reddit.com/*
// @grant GM_openInTab
// @version 0.0.3.23
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

	upvote(){
		var el = this.posts[this.get_focus()].querySelector('[data-event-action="upvote"]');
		el.click();
	}

	downvote(){
		var el = this.posts[this.get_focus()].querySelector('[data-event-action="downvote"]');
		el.click();
	}
}

class ReddVim{
	constructor(post){
		this.modes = {
			normal:0,
			insert:1
		};
		this.mode = this.modes.normal;
		this.post = post;
	}

	switch_mode(){
		if(this.mode === this.modes.normal){
			this.mode = this.modes.insert;
		}else{
			this.mode = this.modes.normal;
		}
	}

	insert_mode(e){
		if(e.key === 'Escape'){
			this.switch_mode();
		}
	}

	normal_mode(e){
		if(e.key === 'j'){
			this.post.move_down();
		}else if(e.key === 'k'){
			this.post.move_up();
		}else if(e.key === 'l'){
			this.post.open();
		}else if(e.key === 'i' || e.key === 'Insert'){
			this.switch_mode();
		}else if(e.ctrlKey && e.key === 'a'){
			this.post.upvote();
		}else if(e.ctrlKey && e.key === 'x'){
			this.post.downvote();
		}
		e.preventDefault();
	}

	handler(e){
		console.log('Key: ' + e.key);
		if(this.mode === this.modes.normal){
			this.normal_mode(e);
		}else if(this.mode === this.modes.insert){
			this.insert_mode(e);
		}
	}
}

function main(){
	var table = document.getElementById('siteTable');
	var post = new Post(table.querySelectorAll('[id^="thing_"]'));
	reddvim = new ReddVim(post);
	window.addEventListener('keypress', function(e){
		reddvim.handler(e);
	}, true);
	console.log('main called');
}

window.addEventListener('load', main);
console.log('It works!');
