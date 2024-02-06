window.premiumNeedDialog = {
  id: "premium-needed-screen",
  previous: null,
  selected: false,

  init: function () {
    var premiumNeedDialog_element = document.createElement("div");
    premiumNeedDialog_element.id = premiumNeedDialog.id;

    premiumNeedDialog_element.innerHTML =
      '<div class="content">' +
      '  <div class="window">' +
      `    <div class="text">${translate.go(`premimumNeedDialog.message`)} </div>` +
      '    <div class="buttons">' +
      `      <div class="button" id="premium-needed-screen-yes">${translate.go("premimumNeedDialog.yes")}</div>` +
      `      <div class="button" id="premium-needed-screen-no">${translate.go("premimumNeedDialog.no")}</div>` +
      "  </div>" +
      "</div>";
    document.body.appendChild(premiumNeedDialog_element);
    premiumNeedDialog.previous = main.state;
    main.state = premiumNeedDialog.id;
    premiumNeedDialog.move(false);
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(this.id));
    main.state = premiumNeedDialog.previous;
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        premiumNeedDialog.destroy();
        break;
      case tvKey.KEY_EXIT:
        premiumNeedDialog.destroy();
        break;
      case tvKey.KEY_LEFT:
        premiumNeedDialog.move(true);
        break;
      case tvKey.KEY_RIGHT:
        premiumNeedDialog.move(false);
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        premiumNeedDialog.action(premiumNeedDialog.selected);
        break;
    }
  },

  move: function (selected) {
    premiumNeedDialog.selected = selected;
    document.getElementById(premiumNeedDialog.id + "-" + (selected ? "yes" : "no")).className = "button selected";
    document.getElementById(premiumNeedDialog.id + "-" + (!selected ? "yes" : "no")).className = "button";
  },

  action: function (selected) {
    if (selected) {
      premiumNeedDialog.destroy();
    } else {
      premiumNeedDialog.destroy();
    }
  },
};
