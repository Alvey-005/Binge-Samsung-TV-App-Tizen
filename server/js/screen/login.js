window.login = {
  id: "login-screen",
  selected: 0,
  input: NaN,

  init: function () {
    var login_element = document.createElement("div");
    login_element.id = login.id;

    login_element.innerHTML = `
    <div class="content">
      <div class="box">
        <div class="logo">
          <img src="server/img/logo-big.svg" alt="">
        </div>
        <div class="form">
          <div class="input focus ${login.id}-option">
            <input type="tel" id="login" placeholder="${translate.go("login.number")}">
          </div>
          <span id="login-error-message"></span>
          <a class="button ${
            login.id
          }-option" translate onclick="login.keyDown(event)">${translate.go(
      "login.generateOtp"
    )}</a>
        </div>
      </div>
    </div>`;
    document.body.appendChild(login_element);
    login.input = document.getElementById('login').focus();
    
    // document
    //   .getElementById("generateOtpBtn")
    //   .addEventListener("click", function (e) {
    //     console.log("generate otp clicked", e);
    //     login.keyDown(e);
    //   });

    login.move(login.selected);
    main.state = login.id;
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(this.id));
  },

  keyDown: function (event) {
    if (event.type === "click") {
      console.log('clicked login', event);
      login.move(login.selected == 1 ? 1 : login.selected + 1);
      login.action(this.selected);
    } else {
      console.log("login keydown event", event);
      switch (event.keyCode) {
        case tvKey.KEY_BACK:
        case tvKey.KEY_ESCAPE:
        case tvKey.KEY_LEFT:
        if (document.activeElement) {
          document.activeElement.blur();
        }
        menu.open();
          break;
        case tvKey.KEY_UP:
          login.move(login.selected == 0 ? 0 : login.selected - 1);
          break;
        case tvKey.KEY_DOWN:
          login.move(login.selected == 1 ? 1 : login.selected + 1);
          break;
        case tvKey.KEY_ENTER:
        case tvKey.KEY_PANEL_ENTER:
          login.action(this.selected);
          break;
      }
    }
  },

  move: function (selected) {
    login.selected = selected;
    var options = document.getElementsByClassName(login.id + "-option");
    for (var i = 0; i < options.length; i++) {
      options[i].className = options[i].className.replace(" focus", "");
      if (i == selected) {
        options[i].className = options[i].className + " focus";
      }
    }
  },

  error: function (message) {
    var element = $("#login-error-message");
    element.text(message);
    element.show();
    setTimeout(function () {
      element.hide();
    }, 3000);
  },

  action: function (selected) {
    var options = document.getElementsByClassName(login.id + "-option");
    if (selected == 1) {
      var phone = options[0].firstElementChild.value;
      if (phone.length < 10 || phone.length > 11) {
        login.error(translate.go("login.error.invalid"));
      } else {
        login.destroy();
        loading.init();
        session.storage.phone = "+88" + phone;
        api.login({
          data: {
            phone: "+88" + phone,
          },
          success: function (response) {
            loading.destroy();
            otp.init();
          },
          error: function (error) {
            loading.destroy();
            login.init();
          },
        });
        // otp.init();
        // session.start(number, {
        //   success: function () {
        //     main.events.login();
        //   },
        //   error: function () {
        //     loading.destroy();
        //     login.init();
        //   },
        // });
      }
    } 
    else {
      // keyboard.init(options[selected].firstElementChild);
      document.activeElement.blur();
    }
  },
};
