window.otp = {
  id: "otp-screen",
  selected: 0,
  countdown: 60,
  input: NaN,

  init: function () {
    menu.destroy();
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
            <input type="number" id="otp" placeholder="${translate.go("login.otp")}">
          </div>
          <span id="login-error-message"></span>
          <a class="button ${
            otp.id
          }-option" translate onclick="otp.keyDown(event)">${translate.go(
      "login.verify"
    )}</a>
          <a id="resend-otp-button" class="button ${otp.id}-option resend-otp" translate>${translate.go("login.resend_otp")}</a>
        </div>
      </div>
    </div>`;
    document.body.appendChild(otp_element);
    otp.input = document.getElementById("otp").focus();
    // document
    //   .getElementById("verifyOtpBtn")
    //   .addEventListener("click", function (e) {
    //     console.log("verify otp clicked");
    //     otp.keyDown(e);
    //   });

    otp.move(otp.selected);
    main.state = otp.id;

    otp.startCountdown();
  },

  startCountdown: function () {
    otp.updateResendButton();
    var countdownInterval = setInterval(function () {
      otp.countdown--;
      if (otp.countdown <= 0) {
        clearInterval(countdownInterval);
        otp.updateResendButton();
      } else {
        otp.updateResendButton();
      }
    }, 1000);
  },

  updateResendButton: function () {
    var resendButton = document.getElementById("resend-otp-button");
    if (otp.countdown > 0) {
      resendButton.innerText = translate.go("login.resend_otp") + " (" + otp.countdown + ")";
      resendButton.setAttribute("disabled", "true");
    } else {
      resendButton.innerText = translate.go("login.resend_otp");
      resendButton.removeAttribute("disabled");
    }
  },

  resendOtp: function () {
    otp.countdown = 60;
    otp.startCountdown();

    loading.init();
    api.login({
      data: {
        phone: session.storage.phone,
      },
      success: function (response) {
        otp.destroy();
        loading.destroy();
        otp.init();
      },
      error: function (error) {
        loading.destroy();
        otp.error(translate.go("login.error.fetch"));
      },
    });
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
          // case tvKey.KEY_LEFT:
          if (document.activeElement) {
            document.activeElement.blur();
          }
        //   menu.open();
          returnHome.init();
        break;
        case tvKey.KEY_UP:
          otp.move(otp.selected == 0 ? 0 : otp.selected - 1);
          break;
        case tvKey.KEY_DOWN:
          if (!otp.selected) {
          otp.move(otp.selected == 2 ? 2 : otp.selected + 1);
        } else if (otp.countdown <= 0 && otp.selected == 1) {
          otp.move(otp.selected == 2 ? 2 : otp.selected + 1);
          }
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

  error: function (message) {
    var element = $("#login-error-message");
    element.text(message);
    element.show();
    setTimeout(function () {
      element.hide();
    }, 3000);
  },

  action: function (selected) {
    var options = document.getElementsByClassName(otp.id + "-option");
    if (selected == 2) {
      otp.resendOtp();
    } else if (selected == 1) {
      var enteredOtp = options[0].firstElementChild.value;
      if (enteredOtp.length < 4) {
        otp.error(translate.go("login.error.invalid"));
      } else {
        otp.destroy();
        loading.init();
        api.verify({
          data: {
            otp: enteredOtp,
            phone: session.storage.phone,
          },
          success: function (response) {
            window.location.reload();
            main.events.login();
          },
          error: function (error) {
            loading.destroy();
            otp.init();
            otp.error(translate.go("login.error.invalid"));
          },
        });
      }
    } else {
      document.activeElement.blur();
    }
  },

  resendOtp: function () {
    otp.countdown = 60;
    otp.startCountdown();

    loading.init();
    api.login({
      data: {
        phone: session.storage.phone,
      },
      success: function (response) {
        otp.destroy();
        loading.destroy();
        otp.init();
      },
      error: function (error) {
        loading.destroy();
        otp.error(translate.go("login.error.fetch"));
      },
    });
  },
};
