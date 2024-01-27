window.otp = {
  id: "otp-screen",
  selected: 0,

  init: function () {
    var otp_element = document.createElement("div");
    otp_element.id = otp.id;

    otp_element.innerHTML = `
    <div class="content">
      <div class="box">
        <div class="logo">
          <img src="server/img/logo-big.svg" alt="">
        </div>
        <div class="form">
          <div class="input ${otp.id}-option">
            <input type="text" placeholder="${translate.go("login.otp")}">
          </div>
          <a class="button ${
            otp.id
          }-option" translate onclick="otp.keyDown(event)">${translate.go(
      "login.verify"
    )}</a>
        </div>
      </div>
    </div>`;
    document.body.appendChild(otp_element);
    // document
    //   .getElementById("verifyOtpBtn")
    //   .addEventListener("click", function (e) {
    //     console.log("verify otp clicked");
    //     otp.keyDown(e);
    //   });

    otp.move(otp.selected);
    main.state = otp.id;
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(this.id));
  },

  keyDown: function (event) {
    if (event.type === "click") {
      console.log('triggering');
      otp.move(otp.selected == 1 ? 1 : otp.selected + 1);
      otp.action(this.selected);
    } else {
      switch (event.keyCode) {
        case tvKey.KEY_BACK:
        case tvKey.KEY_ESCAPE:
          exit.init();
          break;
        case tvKey.KEY_UP:
          otp.move(otp.selected == 0 ? 0 : otp.selected - 1);
          break;
        case tvKey.KEY_DOWN:
          otp.move(otp.selected == 1 ? 1 : otp.selected + 1);
          break;
        case tvKey.KEY_ENTER:
        case tvKey.KEY_PANEL_ENTER:
          otp.action(this.selected);
          break;
      }
    }
  },

  move: function (selected) {
    otp.selected = selected;
    var options = document.getElementsByClassName(otp.id + "-option");
    for (var i = 0; i < options.length; i++) {
      options[i].className = options[i].className.replace(" focus", "");
      if (i == selected) {
        options[i].className = options[i].className + " focus";
      }
    }
  },

  action: function (selected) {
    var options = document.getElementsByClassName(otp.id + "-option");
    if (selected == 1) {
      var enteredOtp = options[0].firstElementChild.value;
      if (enteredOtp.length < 4) {
        console.log("Enter valid credentials...");
      } else {
        otp.destroy();
        loading.init();
        api.verify({
          data: {
            otp: enteredOtp,
            phone: session.storage.phone,
          },
          success: function (response) {
            session.storage.isAnonymous = false;
            main.events.login();
          },
          error: function (error) {
            loading.destroy();
            login.init();
          },
        });
      }
    } else {
      // keyboard.init(options[selected].firstElementChild);
      document.activeElement.blur();
    }
  },
};
