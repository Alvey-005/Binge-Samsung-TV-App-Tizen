window.logoutModal = {
  id: "logoutModal",
  previous: null,
  selected: false,
  methodPrevious: NaN,

  init: function (incoming) {
    console.log('incoming', incoming);
    var logoutModal_element = document.createElement("div");
    logoutModal_element.id = logoutModal.id;

    logoutModal_element.innerHTML =
      '<div class="content">' +
      '  <div class="window">' +
      `    <div class="text">${translate.go(`logoutModal.message`)} </div>` +
      '    <div class="buttons">' +
      `      <div class="button" id="${logoutModal.id}-yes">${translate.go("logoutModal.yes")}</div>` +
      `      <div class="button" id="${logoutModal.id}-no">${translate.go("logoutModal.no")}</div>` +
      "  </div>" +
      "</div>";
    document.body.appendChild(logoutModal_element);
    logoutModal.previous = main.state;
    console.log('prev', this.previous);
    main.state = logoutModal.id;
    this.methodPrevious = incoming.previous;
    logoutModal.move(false);
  },

  destroy: function () {
    document.getElementById(this.id) && document.body.removeChild(document.getElementById(this.id));
    console.log('modal previous', logoutModal.previous);
    main.state = logoutModal.previous;
    console.log('ekon state', main.state)
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        logoutModal.destroy();
        break;
      case tvKey.KEY_EXIT:
        logoutModal.destroy();
        break;
      case tvKey.KEY_LEFT:
        logoutModal.move(true);
        break;
      case tvKey.KEY_RIGHT:
        logoutModal.move(false);
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        logoutModal.action(logoutModal.selected);
        break;
    }
  },

  move: function (selected) {
    logoutModal.selected = selected;
    document.getElementById(logoutModal.id + "-" + (selected ? "yes" : "no")).className = "button selected";
    document.getElementById(logoutModal.id + "-" + (!selected ? "yes" : "no")).className = "button";
  },

  action: function (selected) {
    if (selected) {
      console.log("selected", selected);
      logoutModal.destroy();
      menu.close();
    } else {
      logoutModal.destroy();
      menu.previous = home.id;
      main.state = this.methodPrevious;
      menu.close();
    }
  },
};
