window.accountDeleteDialog = {
  id: "account-delete-screen",
  previous: null,
  selected: false,

  init: function () {
    var accountDeleteDialog_element = document.createElement("div");
    accountDeleteDialog_element.id = accountDeleteDialog.id;

    accountDeleteDialog_element.innerHTML =
      '<div class="content">' +
      '  <div class="window">' +
      `    <div class="text">Are you sure you want to remove this account?</div>` +
      '    <div class="buttons">' +
      `      <div class="button" id="account-delete-screen-yes">Confirm</div>` +
      `      <div class="button" id="account-delete-screen-no">Cancel</div>` +
      "  </div>" +
      "</div>";
    document.body.appendChild(accountDeleteDialog_element);
    accountDeleteDialog.previous = main.state;
    main.state = accountDeleteDialog.id;
    accountDeleteDialog.move(false);
  },

  destroy: function () {
    document.body.removeChild(document.getElementById(this.id));
    main.state = accountDeleteDialog.previous;
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        accountDeleteDialog.destroy();
        break;
      case tvKey.KEY_EXIT:
        accountDeleteDialog.destroy();
        break;
      case tvKey.KEY_LEFT:
        accountDeleteDialog.move(true);
        break;
      case tvKey.KEY_RIGHT:
        accountDeleteDialog.move(false);
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        accountDeleteDialog.action(accountDeleteDialog.selected);
        break;
    }
  },

  move: function (selected) {
    accountDeleteDialog.selected = selected;
    document.getElementById(accountDeleteDialog.id + "-" + (selected ? "yes" : "no")).className = "button selected";
    document.getElementById(accountDeleteDialog.id + "-" + (!selected ? "yes" : "no")).className = "button";
  },

  action: function (selected) {
    if (selected) {
      api.removeAccount({
        data: {
          id: session.storage.customer.id,
        },
        success: function (response) {
          accountDeleteDialog.destroy();
          // main.init();
          settings.destroy();
          menu.destroy();
          login.init();
        },
        error: function (error) {
          accountDeleteDialog.destroy();
        },
      });
    } else {
      accountDeleteDialog.destroy();
    }
  },
};
