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





  var regUsersArray = [],
	  usersNicknames = [],
	  usersNames = [],
	  isValid = false,
	  isBirthField = false,
	  form = document.getElementById('register-form'),
	  inputs = document.querySelectorAll('.required');

  form.addEventListener("submit", function(e) {
  	e.preventDefault();

  	var forSubmit = null;

    forSubmit = (regUsersArray.length > 0) ? extendedValidation(inputs) : validateInputs(inputs);
 
  	if (forSubmit){
      removeAlerts();
      hideNotifications();
      document.getElementById("success-submit").classList.remove("hidden");
      document.getElementById("success-submit").setAttribute('aria-hidden', false);
      storeInputData(inputs);
      document.getElementById("registered-users").innerHTML = regUsersArray;
      document.getElementById("registered-users").classList.remove("hidden");
      if (isBirthField) {
      	isBirthField = false;
      	document.getElementById("birthyear").classList.remove("required");
		document.getElementById("extended-validation-field").classList.add("hidden");
		document.getElementById("extended-validation-field").setAttribute('aria-hidden', true);
	  }
  	}
    else {
      addAlert();
    }
  });

  function validateInputs(el) {
	  var phoneRegExp = /^[0-9]+$/,
		  emailRegExp = /^.+@.+\..+$/;

	  for (x = 0; x < el.length; x++) {
		  if (el[x].value === '') {
			  setDangerState(el[x]);
			  isValid = false;
		  }
		  else {
			  setSuccessState(el[x]);
			  isValid = true;
		  }
	  }

	  if (!phoneRegExp.test(el[3].value)) {
		  setDangerState(el[3]);
		  document.getElementById("phone-error").classList.remove("hidden");
		  document.getElementById("phone-error").setAttribute('aria-hidden', false);
		  isValid = false;
	  }
	  else {
		  setSuccessState(el[3]);
		  document.getElementById("phone-error").classList.add("hidden");
		  document.getElementById("phone-error").setAttribute('aria-hidden', true);
	  }

	  if (!emailRegExp.test(el[5].value)) {
		  setDangerState(el[5]);
		  document.getElementById("email-error").classList.remove("hidden");
		  document.getElementById("email-error").setAttribute('aria-hidden', false);
		  isValid = false;
	  }
	  else {
		  setSuccessState(el[5]);
		  document.getElementById("email-error").classList.add("hidden");
		  document.getElementById("email-error").setAttribute('aria-hidden', true);
	  }

	  return isValid;
  }

  function setDangerState(field) {
	  field.classList.remove('is-success');
	  field.classList.add('is-danger');
	  field.setAttribute('aria-invalid', 'true');
  }

  function setSuccessState(field) {
	  field.classList.remove('is-danger');
	  field.classList.add('is-success');
	  field.setAttribute('aria-invalid', 'false');
  }

  function extendedValidation(el) {
	  var userName = el[1].value +" "+ el[2].value,
		  inputs = document.querySelectorAll('.required');

	  validateInputs(inputs);

	  if (usersNicknames.indexOf(el[0].value) > -1){
		  setDangerState(el[0]);
		  document.getElementById("nickname-error").classList.remove("hidden");
		  document.getElementById("nickname-error").setAttribute('aria-hidden', false);
		  isValid = false;
	  }
	  else if (usersNames.indexOf(userName) > -1 && !isBirthField){
		  hideNotifications();
		  document.getElementById("birthyear").classList.add("required");
		  document.getElementById("extended-validation-field").classList.remove("hidden");
		  document.getElementById("extended-validation-field").setAttribute('aria-hidden', false);
		  document.getElementById("extended-field-warning").classList.remove("hidden");
		  document.getElementById("extended-field-warning").setAttribute('aria-hidden', false);
		  isBirthField = true;
		  isValid = false;
	  }
	  return isValid;
  }

  function addAlert() {
    removeAlerts();
    var newAlert = document.createElement("p");
    newAlert.setAttribute("role", "alert");
    newAlert.setAttribute("id", "alert");
    var msg = document.createTextNode('Please enter correct data');
    newAlert.appendChild(msg);
    document.getElementById('general-error').appendChild(newAlert).focus();
    document.getElementById("success-submit").classList.add("hidden");
	document.getElementById("success-submit").setAttribute('aria-hidden', true);
  }

  function removeAlerts() {
    var oldAlert = document.getElementById("alert");
    if (oldAlert){
      document.getElementById('general-error').removeChild(oldAlert);
    }
  }

  function hideNotifications() {
    document.getElementById("success-submit").classList.add("hidden");
    document.getElementById("success-submit").setAttribute('aria-hidden', true);
    document.getElementById("nickname-error").classList.add("hidden");
    document.getElementById("nickname-error").setAttribute('aria-hidden', true);
  	document.getElementById("extended-field-warning").classList.add("hidden");
  	document.getElementById("extended-field-warning").setAttribute('aria-hidden', true);
	setSuccessState(inputs[0]);
  }

  function storeInputData(el) {
	  for (x = 0; x < el.length; x++) {
		  regUsersArray.push(el[x].value);
	  }
	  usersNicknames.push(el[0].value);
	  usersNames.push(el[1].value +" "+ el[2].value);
	  //window.localStorage.setItem('regUsers',regUsersArray);
  }

})();
