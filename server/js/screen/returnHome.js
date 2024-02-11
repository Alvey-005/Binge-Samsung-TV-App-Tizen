window.returnHome = {
  id: "return-home-screen",
  previous: null,
  selected: false,

  init: function () {
    var returnHome_element = document.createElement("div");
    returnHome_element.id = returnHome.id;

    returnHome_element.innerHTML =
      '<div class="content">' +
      '  <div class="window">' +
      `    <div class="text">${translate.go(`exit.return_home`)}` +
      "  </div>" +
      '    <div class="buttons">' +
      `      <div class="button" onclick="returnHome.handleYes()" id="return-home-screen-yes">${translate.go("exit.yes")}</div>` +
      `      <div class="button" onclick="returnHome.handleNo()" id="return-home-screen-no">${translate.go("exit.no")}</div>` +
      "    </div>" +
      "</div>";
    document.body.appendChild(returnHome_element);

    returnHome.previous = main.state;
    main.state = returnHome.id;
    returnHome.move(false);
  },

  handleYes: function() {
    window.location.reload();
  },

  handleNo: function() {
    returnHome.destroy();
  },

  destroy: function () {
    document.getElementById(this.id) && document.body.removeChild(document.getElementById(this.id));
    main.state = returnHome.previous;
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        returnHome.destroy();
        break;
      case tvKey.KEY_EXIT:
        returnHome.destroy();
        break;
      case tvKey.KEY_LEFT:
        returnHome.move(true);
        break;
      case tvKey.KEY_RIGHT:
        returnHome.move(false);
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        returnHome.action(returnHome.selected);
        break;
    }
  },

  move: function (selected) {
    returnHome.selected = selected;
    document.getElementById(returnHome.id + "-" + (selected ? "yes" : "no")).className = "button selected";
    document.getElementById(returnHome.id + "-" + (!selected ? "yes" : "no")).className = "button";
  },

  action: function (selected) {
    if (selected) {
      window.location.reload();
    } else {
      returnHome.destroy();
    }
  },
};
