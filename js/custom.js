(function() {
  var burger = document.querySelector(".burger");
  var menu = document.querySelector("#" + burger.dataset.target);
  burger.addEventListener("click", function() {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-active");
  });

  var tablist = document.querySelectorAll('[role="tablist"]')[0];
  var tabs;
  var panels;

  generateArrays();

  function generateArrays () {
      tabs = document.querySelectorAll('[role="tab"]');
      panels = document.querySelectorAll('[role="tabpanel"]');
  }

  var keys = {
      end: 35,
      home: 36,
      left: 37,
      right: 39,
	  enter: 13,
	  space: 32
  };

  var direction = {
      37: -1,
      39: 1
  };

  for (i = 0; i < tabs.length; ++i) {
      addListeners(i);
  }

  function addListeners (index) {
      tabs[index].addEventListener('click', clickEventListener);
      tabs[index].addEventListener('keydown', keydownEventListener);
      tabs[index].addEventListener('keyup', keyupEventListener);

      tabs[index].index = index;
  }

  function clickEventListener (event) {
      var tab = event.target;

	  if (event.target.tagName === "SPAN" ) {
		  tab = event.target.parentElement;
	  }
	  else if (event.target.tagName === "I") {
		  tab = event.target.parentElement.parentElement;
      }

      activateTab(tab, false);
  }

  function keydownEventListener (event) {
      var key = event.keyCode;

      switch (key) {
          case keys.end:
              event.preventDefault();
			  activateTab(tabs[tabs.length - 1]);
              break;
          case keys.home:
              event.preventDefault();
			  activateTab(tabs[0]);
              break;
      }
  }

  function keyupEventListener (event) {
      var key = event.keyCode;

      switch (key) {
          case keys.left:
          case keys.right:
              switchTabOnArrowPress(event);
              break;
		  case keys.enter:
		  case keys.space:
          activateTab(event.target);
			  break;
      }
  }

  function switchTabOnArrowPress (event) {
	  var pressed = event.keyCode;

	  for (x = 0; x < tabs.length; x++) {
		  tabs[x].addEventListener('focus', focusEventHandler);
	  }

	  if (direction[pressed]) {
		  var target = event.target;
		  if (target.index !== undefined) {
			  if (tabs[target.index + direction[pressed]]) {
				  tabs[target.index + direction[pressed]].focus();
			  }
			  else if (pressed === keys.left) {
				  tabs[tabs.length - 1].focus();
			  }
			  else if (pressed === keys.right) {
				  tabs[0].focus();
			  }
		  }
	  }
  }

  function activateTab (tab, setFocus) {
      setFocus = setFocus || true;
      deactivateTabs();

      tab.removeAttribute('tabindex');

      tab.setAttribute('aria-selected', 'true');
      tab.parentNode.classList.add('is-active');

      var controls = tab.getAttribute('aria-controls');

      document.getElementById(controls).removeAttribute('hidden');
      document.getElementById(controls).classList.add('is-active');

      if (setFocus) {
          tab.focus();
      }
  }

  function deactivateTabs () {
      for (t = 0; t < tabs.length; t++) {
          tabs[t].setAttribute('tabindex', '-1');
          tabs[t].setAttribute('aria-selected', 'false');
          tabs[t].parentNode.classList.remove('is-active');
		  tabs[t].removeEventListener('focus', focusEventHandler);
      }

      for (p = 0; p < panels.length; p++) {
          panels[p].setAttribute('hidden', 'hidden');
          panels[p].classList.remove('is-active');

      }
  }

  function focusEventHandler (event) {
	  var target = event.target;
	  setTimeout(checkTabFocus, 0, target);
  }

  function checkTabFocus (target) {
	  var focused = document.activeElement;

	  if (target === focused) {
		  activateTab(target, false);
	  }
  }

})();
