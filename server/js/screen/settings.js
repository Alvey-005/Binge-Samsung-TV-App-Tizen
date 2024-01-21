window.settings = {
  id: "settings-screen",
  isDetails: false,
  customer: NaN,
  options: [
    // {
    //   id: "videoquality",
    //   label: "settings.menu.video_quality",
    //   type: "list",
    // },
    {
      id: "about",
      label: "settings.menu.about",
      type: "html",
    },
    {
      id: "subscription",
      label: "settings.menu.subscription",
      type: "html",
    },
    {
      id: "vouchers",
      label: "settings.menu.vouchers",
      type: "html",
    },
    {
      id: "interest",
      label: "settings.menu.interest",
      type: "list",
    },
    {
      id: "delete",
      label: "settings.menu.delete",
      type: "html",
    },
  ],
  // qualities: {
  //   auto: "Auto",
  //   240: "240p",
  //   360: "360p",
  //   480: "480p",
  //   720: "720p HD",
  //   1080: "1080p HD",
  // },
  interests: {
    action: "ACTION",
    comedy: "COMEDY",
    reality: "REALITY",
    history: "HISTORY",
    horror: "HORROR",
    romance: "ROMANCE",
    thriller: "THRILLER",
    drama: "DRAMA",
    crime: "CRIME",
    war: "WAR",
    fantasy: "FANTASY",
    music: "MUSIC",
  },
  previous: NaN,

  init: function () {
    var settings_element = document.createElement("div");
    settings_element.id = settings.id;

    settings_element.innerHTML = `
      <div class="content">
        <div class="container-mid">
          <ul class="options" id="settings-menu">${settings.generateMenu()}</ul>
        </div>
        <div class="container" id="settings-details"></div>
      </div>`;

    document.body.appendChild(settings_element);
    settings.details.show(settings.options[0]);
  },

  destroy: function () {
    settings.isDetails = false;
    document.body.removeChild(document.getElementById(settings.id));
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case tvKey.KEY_ESCAPE:
        menu.open();
        break;
      case tvKey.KEY_UP:
        if (settings.isDetails) {
          var options = $(`.options li`);
          var current = options.index($(`.options li.active`));
          settings.details[settings.options[current].type].move(-1);
        } else {
          var options = $(`.options li`);
          var current = options.index($(`.options li.selected`));

          options.removeClass("selected");
          var newCurrent = current > 0 ? current - 1 : current;
          options.eq(newCurrent).addClass("selected");
          settings.details.show(settings.options[newCurrent]);
        }
        break;
      case tvKey.KEY_DOWN:
        if (settings.isDetails) {
          var options = $(`.options li`);
          var current = options.index($(`.options li.active`));
          settings.details[settings.options[current].type].move(1);
        } else {
          var options = $(`.options li`);
          var current = options.index($(`.options li.selected`));

          options.removeClass("selected");
          var newCurrent = current < options.length - 1 ? current + 1 : current;
          options.eq(newCurrent).addClass("selected");
          settings.details.show(settings.options[newCurrent]);
        }
        break;
      case tvKey.KEY_LEFT:
        if (settings.isDetails) {
          var options = $(`.options li`);
          var current = options.index($(`.options li.active`));
          options.removeClass("active");
          options.eq(current).addClass("selected");
          settings.details[settings.options[current].type].move(false);
          settings.isDetails = false;
        } else {
          menu.open();
        }
        break;
      case tvKey.KEY_RIGHT:
        if (!settings.isDetails) {
          var options = $(`.options li`);
          var current = options.index($(`.options li.selected`));
          options.removeClass("selected");
          options.eq(current).addClass("active");

          settings.isDetails = true;
          settings.details[settings.options[current].type].move(0);
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        if (settings.isDetails) {
          var options = $(`.options li`);
          var current = options.index($(`.options li.active`));

          var element = settings.options[current];
          settings.details[element.type].action(element.id);
        }
        break;
    }
  },

  generateMenu: function (index) {
    var className = index === undefined ? "selected" : "active";
    var selected = index === undefined ? 0 : index;
    return settings.options
      .map((option, index) => `<li class="${index === selected ? className : ""}">${translate.go(option.label)}</li>`)
      .join("");
  },

  details: {
    show: function (element) {
      $("#settings-details").html(settings.details[element.type].create(element.id));
    },

    list: {
      create: function (id) {
        switch (id) {
          // case "videoquality":
          //   var options = settings.qualities;
          //   var active = session.storage.quality || "auto";
          //   break;
          case "interest":
            var options = settings.interests;
            var active = "action";
            break;
        }
        // console.log("sssssssssss", options);
        // Object.keys(options).map((option) => console.log(option));
        return (
          '<ul class="list-active" id="list-details-offset">' +
          Object.keys(options)
            .map((option) => `<li class="${option === active ? "active" : ""}">${options[option]}</li>`)
            .join("") +
          "</ul>"
        );
      },

      adjust: function (index, size, elementId) {
        var marginTop = 0;
        if (size > 6 && index > 5) {
          if (index > size - 2) {
            marginTop = -((size - 6) * 104);
          } else {
            marginTop = -((index - 5) * 104);
          }
        }

        document.getElementById(elementId).style.marginTop = `${marginTop}px`;
      },

      action: function (id) {
        var optionsMenu = $(`#settings-details li`);
        var index = optionsMenu.index($(`#settings-details li.selected`));

        switch (id) {
          case "videoquality":
            var options = settings.qualities;
            var method = function (value) {
              session.storage.quality = value;
              session.update();
            };
            break;
        }
        method(Object.keys(options)[index]);
        optionsMenu.removeClass("active");
        optionsMenu.eq(index).addClass("active");
      },

      move: function (index) {
        var options = $(`#settings-details li`);
        if (index === false) {
          options.removeClass("selected");
          return;
        }
        var currentSelected = options.index($(`#settings-details li.selected`));
        var current = currentSelected >= 0 ? currentSelected : options.index($(`#settings-details li.active`));

        options.removeClass("selected");
        if (index < 0) {
          var newCurrent = current > 0 ? current + index : current;
        } else {
          var newCurrent = current + index < options.length ? current + index : current;
        }

        options.eq(newCurrent).addClass("selected");
        settings.details.list.adjust(newCurrent, options.length, "list-details-offset");
      },
    },

    html: {
      create: function (id) {
        switch (id) {
          case "about":
            if (session.storage.customer) {
              api.profileDetails({
                id: session.storage.customer.id,
                success: function (response) {
                  if (response) {
                    let sessionInfo = JSON.parse(localStorage.getItem("session"));
                    const mergedCustomerDetails = { ...session.storage.customer, ...response };
                    sessionInfo.customer = mergedCustomerDetails;
                    settings.customer = mergedCustomerDetails;
                    localStorage.setItem("session", JSON.stringify(sessionInfo));
                  } else {
                    settings.customer = session.storage.customer;
                  }
                },
                error: function (error) {
                  console.error(error);
                },
              });
            } else {
              settings.customer = session.storage.customer;
            }

            return `
          <div style="height: 65vh;display: flex;flex-direction:column; justify-content: space-between; color: #fff;font-size: 23px;line-height: 51px;">
            <div style="display: flex;justify-content: center;align-items: center;height:80%">
                <div style="width: 200px; height:200px; border-radius: 50%; background-color: #fff">

                </div>
                <div style="margin-left: 30px">
                 <h1>${settings.customer.name || "Yeasin Zilani"}</h1>
                 <p style="text-align: right;">${settings.customer.phone || "01833184275"}</p>
                </div>
            </div>
            <div style="display: flex; flex-direction:column; justify-content: end; align-items: center;height:20%">
                <div>Binge  TV app.</div>
                <div>Copyright ©2024 Robi Axiata Limited. All Rights Reserved.</div>
            </div>
              </div>`;
          case "subscription":
            if (!settings.customer && !session.storage.customer.active_subscriptions) {
              api.profileDetails({
                id: session.storage.customer.id,
                success: function (response) {
                  if (response) {
                    let sessionInfo = JSON.parse(localStorage.getItem("session"));
                    const mergedCustomerDetails = { ...session.storage.customer, ...response };
                    sessionInfo.customer = mergedCustomerDetails;
                    settings.customer = mergedCustomerDetails;
                    localStorage.setItem("session", JSON.stringify(sessionInfo));
                  } else {
                    settings.customer = session.storage.customer;
                  }
                },
                error: function (error) {
                  console.error(error);
                },
              });
            }
            subscriptionDetails = settings.customer.active_subscriptions || [];
            if (subscriptionDetails.length > 0) {
              return `
              <div>
              ${subscriptionDetails.map(function (sub) {
                return `
                <div style="color: #fff">
                  <div style="display: flex;">
                    <img src="https://pre.binge.buzz/assets/svg/tickMark.svg" style="heigth: 50px; width: 50px;margin-right: 30px">
                    <h1 style="font-size: 3rem">Active Subscription</h1>
                  </div>
                  <h2 style="font-size: 2.25rem">${sub.package.title}</h2>
                  <p style="font-size: 2.25rem">Expires on: <span style="color: #Ff0000;margin-left: 10px;">${sub.expiry_date}</span></p>
                  <button style="background-color: red;color: white;border-radius: 0.25rem; border: none;padding: 10px 50px 10px 50px; transition: background-color 0.3s;"  onmouseover="this.style.backgroundColor='rgb(229, 9, 20)'" onmouseout="this.style.backgroundColor='red'">Unsubscribe</button>
             </div>`;
              })}
              </div>`;
            } else {
              return `
              <div style=" color: #fff;height: 65vh; display: flex;align-items: center;justify-content: center;">
                <div>
                  <h1 style="font-size: 3rem">Choose your desired plan</h1>
                  <div  style="font-size: 2.25rem">
                    <p><span style="color:green; margin-right: 15px">&#10003;</span> Watch what you want Ad Free!</p>
                    <p><span style="color:green; margin-right: 15px">&#10003;</span> Multi-devices Access</p>
                    <p><span style="color:green; margin-right: 15px">&#10003;</span> Change or Unsubscribe anytime you want.</p>
                  </div>
                </div>
              </div>`;
            }
          case "vouchers":
            return `
            <div style="color: #fff">
              <div style="display: flex;">
                <img src="https://pre.binge.buzz/assets/svg/voucher.svg" style="heigth: 50px; width: 50px;margin-right: 30px">
                <h1 style="font-size: 3rem">Vouchers</h1>
              </div> 
              <input style="color: #808080;width: 100%;outline: none;border-style: dotted;border-radius: 0.25rem;background-color: transparent; height: 50px;" placeholder="Enter Your Coupon here" />
              <button style="background-color: red;color: white;border-radius: 0.25rem; border: none;padding: 10px 50px 10px 50px; transition: background-color 0.3s;"  onmouseover="this.style.backgroundColor='rgb(229, 9, 20)'" onmouseout="this.style.backgroundColor='red'">Redeem</button>
            </div>`;
          case "delete":
            return `
            <div style="color: #fff">
              <div style="display: flex;">
                <img src="https://pre.binge.buzz/assets/svg/delete.svg" style="heigth: 50px; width: 50px;margin-right: 30px">
                <h1 style="font-size: 3rem">Delete Account</h1>
              </div>
              <p>This will permanently delete your account.</p> 
              <button style="background-color: red;color: white;border-radius: 0.25rem; border: none;padding: 10px 50px 10px 50px; transition: background-color 0.3s;"  onmouseover="this.style.backgroundColor='rgb(229, 9, 20)'" onmouseout="this.style.backgroundColor='red'">Delete</button>
            </div>
            `;
        }
      },

      move: function () {},
    },
  },
};
