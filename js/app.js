var app = {
  state: false,
};

window.onload = function () {
  if (typeof main != "undefined") {
    app.state = true;
    main.init();
    networkToaster.init();
  } else {
    app.initError();
  }
};

window.addEventListener("offline", (event) => {
  window.networkToaster.show();
  console.log("The network connection has been lost.", event);
});

window.addEventListener("online", (event) => {
  window.networkToaster.hide();
  console.log("You are now connected to the network.", event);
});

app.initError = function () {
  app.state = false;
  document.getElementById("error-screen").style.display = "flex";
};

window.onunload = function () {
  if (app.state) main.destroy();
};

app.keyDown = function (e) {
  if (app.state) main.keyDown(e);
  else {
    switch (e.keyCode) {
      case tvKey.KEY_BACK:
      case tvKey.KEY_EXIT:
      case 27:
        tizen.application.getCurrentApplication().hide();
        break;
    }
  }
};
