window.loginToaster = {
  id: "loginToaster",
  toasterTimer: NaN,

  init: function () {
    var loginToasterElement = document.createElement("div");
    loginToasterElement.id = loginToaster.id;
    loginToasterElement.className = "toaster";
    document.body.appendChild(loginToasterElement);
  },

  show: function (showText = "Something Went Wrong") {
    var toaster = document.getElementById(loginToaster.id);
    toaster.innerText = showText;
    toaster.style.display = "block";
    toasterTimer = setTimeout(function () {
      toaster.style.display = "none";
    }, 5000);
  },

  hide: function () {
    var toaster = document.getElementById(loginToaster.id);
    toaster.style.display = "none";
    clearTimeout(loginToaster.toasterTimer);
  },

  destroy: function () {
    document.getElementById(this.id) && document.body.removeChild(document.getElementById(this.id));
  },
};
