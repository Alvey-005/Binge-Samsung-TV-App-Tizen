window.emailLogin = {
  id: "email-login-screen",
  selected: 0,

  init: function () {
    menu.destroy();
    var login_element = document.createElement("div");
    login_element.id = emailLogin.id;

    login_element.innerHTML = `
      <div class="content">
        <div class="box">
          <div class="logo">
            <img src="server/img/logo-big.svg" alt="">
          </div>
          <div class="form">
            <div class="input ${emailLogin.id}-option">
            <input type="email" placeholder="${translate.go("login.email")}">
            </div>
            <div class="input ${emailLogin.id}-option"> 
            <input type="password" placeholder="${translate.go("login.password")}">
            </div>
            <span id="email-login-error-message"></span>
            <a class="button ${emailLogin.id}-option" translate>${translate.go("login.login")}</a>
          </div>
        </div>
      </div>`;
    document.body.appendChild(login_element);

    emailLogin.move(emailLogin.selected);
    main.state = emailLogin.id;
  },

  destroy: function () {
    document.getElementById(this.id) && document.body.removeChild(document.getElementById(this.id));
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case tvKey.KEY_ESCAPE:
        // case tvKey.KEY_LEFT:
        //   menu.open();
        returnHome.init();
        break;
      case tvKey.KEY_UP:
        emailLogin.move(emailLogin.selected == 0 ? 0 : emailLogin.selected - 1);
        break;
      case tvKey.KEY_DOWN:
        emailLogin.move(emailLogin.selected >= 2 ? 2 : emailLogin.selected + 1);
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        emailLogin.action(this.selected);
        break;
    }
  },

  //   validateEmail: function (email) {
  //     const emailExpression = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //     return emailExpression.test(email);
  //   },

  move: function (selected) {
    emailLogin.selected = selected;
    var options = document.getElementsByClassName(emailLogin.id + "-option");
    for (var i = 0; i < options.length; i++) {
      options[i].className = options[i].className.replace(" focus", "");
      if (i == selected) {
        options[i].className = options[i].className + " focus";
      }
    }
  },

  error: function (message) {
    var element = $("#email-login-error-message");
    element.text(message);
    element.show();
    setTimeout(function () {
      element.hide();
    }, 3000);
  },

  action: function (selected) {
    var options = document.getElementsByClassName(emailLogin.id + "-option");
    if (selected == 2) {
      var email = options[0].firstElementChild.value;
      var password = options[1].firstElementChild.value;

      if (!email && !password) {
        emailLogin.error(translate.go("login.error.email_password_input"));
      } else if (!email) {
        emailLogin.error(translate.go("login.error.email_input"));
      } else if (!password) {
        emailLogin.error(translate.go("login.error.password_input"));
      } else {
        emailLogin.destroy();
        loading.init();
        // session.storage.phone = phone;
        api.loginWithEmail({
          data: {
            email: email,
            password: password,
          },
          success: function (response) {
            main.events.login();
          },
          error: function (error) {
            loading.destroy();
            emailLogin.init();
            emailLogin.error("Invalid credentials");
          },
        });
      }
    } else {
      keyboard.init(options[selected].firstElementChild);
    }
  },
};
