window.streamLimitCrossed = {
  id: "stream-limit-crossed",
  previous: null,
  selected: false,

  init: function () {
    var streamLimitCrossed_element = document.createElement("div");
    streamLimitCrossed_element.id = streamLimitCrossed.id;

    streamLimitCrossed_element.innerHTML =
      '<div class="content">' +
      '  <div class="window">' +
      `    <div class="text">${translate.go(`streamLimitCrossed.message`)} </div>` +
      '    <div class="buttons">' +
      `      <div onclcik="console.log('its yes')" class="button" id="${streamLimitCrossed.id}-yes">${translate.go("streamLimitCrossed.yes")}</div>` +
      `      <div onclcik="streamLimitCrossed.handleNo(event)" class="button" id="${streamLimitCrossed.id}-no">${translate.go("streamLimitCrossed.no")}</div>` +
      "  </div>" +
      "</div>";
    document.body.appendChild(streamLimitCrossed_element);
    console.log("prem", streamLimitCrossed_element);
    streamLimitCrossed.previous = main.state;
    main.state = streamLimitCrossed.id;
    streamLimitCrossed.move(false);
  },

  handleYes: function(event) {
    console.log('yes');
    streamLimitCrossed.destroy();
  },

  handleNo: function(event) {
    console.log('no');
    streamLimitCrossed.destroy();
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(this.id));
    main.state = streamLimitCrossed.previous;
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        streamLimitCrossed.destroy();
        break;
      case tvKey.KEY_EXIT:
        streamLimitCrossed.destroy();
        break;
      case tvKey.KEY_LEFT:
        streamLimitCrossed.move(true);
        break;
      case tvKey.KEY_RIGHT:
        streamLimitCrossed.move(false);
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        streamLimitCrossed.action(streamLimitCrossed.selected);
        break;
    }
  },

  move: function (selected) {
    streamLimitCrossed.selected = selected;
    document.getElementById(streamLimitCrossed.id + "-" + (selected ? "yes" : "no")).className = "button selected";
    document.getElementById(streamLimitCrossed.id + "-" + (!selected ? "yes" : "no")).className = "button";
  },

  action: function (selected) {
    if (selected) {
      console.log("selected", selected);
      streamLimitCrossed.destroy();
    } else {
      streamLimitCrossed.destroy();
    }
  },
};
