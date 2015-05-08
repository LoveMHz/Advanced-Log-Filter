/*
Copyright 2015 Dustin Holden

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

if (location.protocol === 'chrome-devtools:') (function() {
    'use strict';
	var tags = {};
	
	function proccess_console_add(element) {
		var tag = false;

		/* Sanity check */
		if(typeof element.querySelector != 'function')
			return;
		
		if(element.querySelector('.console-message.console-error-level'))
			tag = 'Error';
		
		if(element.className == 'console-message-wrapper' && element.querySelector('.console-message-text.source-code span')) {
			var str = element.querySelector('.console-message-text.source-code span').innerText;
			var re = /^\[(.*)\]/; 
			var match;
			 
			if((match = re.exec(str)) !== null) {
				if(match.index === re.lastIndex)
					re.lastIndex++;
			}

			if(match)
				tag = match[1];
		}
		
		if(!tag && element.className == 'console-message-wrapper') {
			tag = tag ? tag : 'Other';
		} else if(!tag)
			return;
		
		element.setAttribute('data-tag', tag);
		element.style.display = tags[tag] ? 'initial' : 'none';
		
		/* Update our tag filter */
		update_tags(tag);
	}
	
	function update_tags(tag) {
		/* Migrate any possible security concerns */
		tag = tag.replace(/(<([^>]+)>)/ig,"");
		
		/* Add tag to list of tags */
		if(!tags.hasOwnProperty(tag)) {
			var html = '';
			if(tag == 'Error' || tag == 'Other')
				html = '<label><input type="checkbox" checked="checked" class="filter-console-tag" data-tag="' + tag + '"><strong>' + tag + '</strong> <span class="counter">1</span></label>';
			else
				html = '<label><input type="checkbox" checked="checked" class="filter-console-tag" data-tag="' + tag + '">' + tag + ' <span class="counter">1</span></label>';
			window.frames[0].document.querySelector('.status-bar-advance').insertAdjacentHTML('beforeend', html);
			
			/* Add tag to global object */
			tags[tag] = true;
		}
		update_counters();
	}
	
	function update_counters() {
		/* Update Counter and Remove tags with 0 messages. */
		var filter_node = window.frames[0].document.querySelectorAll('.filter-console-tag');
		for(var i = 0; i < filter_node.length; i++) {
			var filter_node_tag = filter_node[i].getAttribute('data-tag');
			var tag_count = window.frames[0].document.querySelectorAll('.console-message-wrapper[data-tag="' + filter_node_tag + '"]').length;
			window.frames[0].document.querySelector('.filter-console-tag[data-tag="' + filter_node_tag + '"]').parentElement.querySelector('.counter').innerHTML = tag_count;
			
			/* Remove if 0 */
			if(tag_count == 0 && filter_node_tag != 'Error' && filter_node_tag != 'Other') {
				var child = window.frames[0].document.querySelector('.filter-console-tag[data-tag="' + filter_node_tag + '"]').parentNode;
				child.parentNode.removeChild(child);
				delete tags[filter_node_tag];
			}
		}
	}
	
	/* Monitor for filter change */
	window.frames[0].document.onclick = function(event) {
		var element = event.target;
		if(element.className == 'filter-console-tag') {
			var tag_node = window.frames[0].document.querySelectorAll('.filter-console-tag');
			for(var i = 0; i < tag_node.length; i++) {
				tags[(tag_node[i].getAttribute('data-tag'))] = tag_node[i].checked;
			}
			var message_node = window.frames[0].document.querySelectorAll('.console-message-wrapper');
			for(var i = 0; i < message_node.length; i++) {
				var message_node_tag = message_node[i].getAttribute('data-tag');
				if(tags.hasOwnProperty(message_node_tag))
					message_node[i].style.display = tags[message_node_tag] ? 'initial' : 'none';
			}
		}
	};
	
	/* Do you even JS without jQuery? */
	/* Hack to make sure everything is loaded */
	setInterval(function() {
		if(!window.frames[0].document.querySelector('.console-view .status-bar-advance') && window.frames[0].document.querySelector('.console-view .status-bar')) {
			/* CSS rules */
			window.frames[0].document.querySelector('head').insertAdjacentHTML('beforeend', 
				'<style>' +
				'input[type="checkbox"] { vertical-align: text-top; }' +
				'.status-bar-advance label { border-right: 1px solid #E7E7E7; padding: 0 8px; }' +
				'.status-bar-advance label input[type="checkbox"] { vertical-align: text-top; }' +
				'.status-bar-advance label .counter { padding: 2px; box-sizing: content-box; font-size: 0.9em; color: #1E9903; }' +
				'.status-bar-advance { border-top: 1px solid #aaa; border-bottom: 1px solid #aaa; padding: 6px; vertical-align: -webkit-baseline-middle; }' +
				'</style>');
			
			/* Toolbar */
			window.frames[0].document.querySelector('.console-view .status-bar').insertAdjacentHTML(
				'afterend', 
				'<div class="status-bar status-bar-advance"><strong>Advance Log Filter</strong></div>'
			);
			
			/* Add the 'Other' and 'Error' tag so they appear at the start.. Hopefully we'll sort the tags in the future */
			update_tags('Error');
			update_tags('Other');
			
			/* Tag messages that where in the console before the console window was loaded */
			var message_node = window.frames[0].document.querySelectorAll('.console-message-wrapper');
			for(var i = 0; i < message_node.length; i++) {
				proccess_console_add(message_node[i]);
			}
			
			/* Event for when a message is added to the console. Tag it! */
			window.frames[0].document.querySelector('.console-group-messages').addEventListener (
				'DOMNodeInserted', 
				function(event) {
					proccess_console_add(event.srcElement);
				}, false
			);
			
			/* Try to capture event for when the console is cleared. */
			window.frames[0].document.querySelector('.console-group-messages').addEventListener (
				'DOMNodeRemoved', 
				function(event) {
					setTimeout(update_counters, 200); /* No idea... */
				}, false
			);
			
			return false;
		}
	}, 500);
})();
