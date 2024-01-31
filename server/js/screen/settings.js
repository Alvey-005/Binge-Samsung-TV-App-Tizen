window.settings = {
  id: "settings-screen",
  isDetails: false,
  customer: NaN,
  selectedTab: "",
  settingsTab: {
    voucher: {
      selected: 0,
      keyboardElement: undefined,
    },
    deleteAccount: {
      buttonElement: undefined,
    },
    about: {},
    interests: {
      options: {
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
      optionTab: false,
    },
    termsOfUse: {
      htmlContent: null,
      scrollableContent: null,
    },
    privacyNotice: {
      htmlContent: null,
      scrollableContent: null,
    },
    faq: {
      htmlContent: null,
      scrollableContent: null,
    },
  },
  options: [
    {
      id: "about",
      label: "settings.menu.about",
      type: "html",
    },
    // {
    //   id: "subscription",
    //   label: "settings.menu.subscription",
    //   type: "html",
    // },
    {
      id: "vouchers",
      label: "settings.menu.vouchers",
      type: "html",
    },
    {
      id: "faq",
      label: "settings.menu.faq",
      type: "html",
    },
    {
      id: "terms_of_use",
      label: "settings.menu.tou",
      type: "html",
    },
    {
      id: "privacy_notice",
      label: "settings.menu.prnotice",
      type: "html",
    },
    {
      id: "delete",
      label: "settings.menu.delete",
      type: "html",
    },
  ],

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
          switch (this.selectedTab) {
            case "interest":
              var options = $(`.options li`);
              var current = options.index($(`.options li.active`));
              settings.details[settings.options[current].type].move(-1);
              break;
            case "terms_of_use":
              const touScrollContainer = settings.settingsTab.termsOfUse.scrollableContent;
              const touNewScrollTop = touScrollContainer.scrollTop - 50;
              touScrollContainer.scrollTop = Math.min(
                touNewScrollTop,
                touScrollContainer.scrollHeight - touScrollContainer.clientHeight
              );
              break;
            case "privacy_notice":
              const pnScrollContainer = settings.settingsTab.privacyNotice.scrollableContent;
              const pnNewScrollTop = pnScrollContainer.scrollTop - 50;
              pnScrollContainer.scrollTop = Math.min(
                pnNewScrollTop,
                pnScrollContainer.scrollHeight - pnScrollContainer.clientHeight
              );
              break;
            case "faq":
              const faqScrollContainer = settings.settingsTab.faq.scrollableContent;
              const faqNewScrollTop = faqScrollContainer.scrollTop - 50;
              faqScrollContainer.scrollTop = Math.min(
                faqNewScrollTop,
                faqScrollContainer.scrollHeight - faqScrollContainer.clientHeight
              );
              break;
            case "voucher":
              if (settings.settingsTab.voucher.selected) {
                settings.settingsTab.voucher.selected = 0;
                var input = $(`#voucher-input`);
                input.css("background-color", "white");
                var input = document.getElementById("voucher-input");
                var button = document.getElementById("redeem_button");
                button.style.backgroundColor = "transparent";
                settings.settingsTab.voucher.keyboardElement = input;
              }
              break;
          }
        } else {
          var options = $(`.options li`);
          var current = options.index($(`.options li.selected`));

          options.removeClass("selected");
          var newCurrent = current > 0 ? current - 1 : current;
          options.eq(newCurrent).addClass("selected");
          settings.details.show(settings.options[newCurrent]);

          if (settings.options[newCurrent].id === "faq") {
            if (!settings.settingsTab.faq.htmlContent) {
              api.fetchFAQ({
                success: function (response) {
                  // console.log(response, typeof response);
                },
                error: function (error) {
                  console.log(error);
                },
              });
            }
          } else if (settings.options[newCurrent].id === "privacy_notice") {
            if (!settings.settingsTab.privacyNotice.htmlContent) {
              api.fetchPrivacy({
                success: function (response) {
                  // console.log(response, typeof response);
                },
                error: function (error) {
                  console.log(error);
                },
              });
            }
          } else {
            if (settings.options[newCurrent].id === "terms_of_use") {
              if (!settings.settingsTab.termsOfUse.htmlContent) {
                api.fetchTermsConditions({
                  success: function (response) {
                    // console.log(response, typeof response);
                  },
                  error: function (error) {
                    console.log(error);
                  },
                });
              }
            }
          }
        }
        break;
      case tvKey.KEY_DOWN:
        if (settings.isDetails) {
          switch (this.selectedTab) {
            case "voucher":
              if (!settings.settingsTab.voucher.selected) {
                settings.settingsTab.voucher.selected = 1;
                var button = document.getElementById("redeem_button");
                button.style.backgroundColor = "red";
                var voucherInput = document.getElementById("voucher-input");
                voucherInput.style.backgroundColor = "transparent";
                break;
              }
            case "terms_of_use":
              const touScrollContainer = settings.settingsTab.termsOfUse.scrollableContent;
              const touNewScrollTop = touScrollContainer.scrollTop + 50;
              touScrollContainer.scrollTop = Math.min(
                touNewScrollTop,
                touScrollContainer.scrollHeight - touScrollContainer.clientHeight
              );
              break;
            case "faq":
              const faqScrollContainer = settings.settingsTab.faq.scrollableContent;
              const faqNewScrollTop = faqScrollContainer.scrollTop + 50;
              faqScrollContainer.scrollTop = Math.min(
                faqNewScrollTop,
                faqScrollContainer.scrollHeight - faqScrollContainer.clientHeight
              );
              break;
            case "privacy_notice":
              const pnScrollContainer = settings.settingsTab.privacyNotice.scrollableContent;
              const pnNewScrollTop = pnScrollContainer.scrollTop + 50;
              pnScrollContainer.scrollTop = Math.min(
                pnNewScrollTop,
                pnScrollContainer.scrollHeight - pnScrollContainer.clientHeight
              );
              break;
            case "delete_account":
            case "interest":
              var options = $(`.options li`);
              var current = options.index($(`.options li.active`));
              settings.details[settings.options[current].type].move(1);
              break;
          }
        } else {
          var options = $(`.options li`);
          var current = options.index($(`.options li.selected`));

          options.removeClass("selected");
          var newCurrent = current < options.length - 1 ? current + 1 : current;
          options.eq(newCurrent).addClass("selected");
          settings.details.show(settings.options[newCurrent]);

          if (settings.options[newCurrent].id === "faq") {
            if (!settings.settingsTab.faq.htmlContent) {
              api.fetchFAQ({
                success: function (response) {
                  // console.log(response, typeof response);
                },
                error: function (error) {
                  console.log(error);
                },
              });
            }
          } else if (settings.options[newCurrent].id === "privacy_notice") {
            if (!settings.settingsTab.privacyNotice.htmlContent) {
              api.fetchPrivacy({
                success: function (response) {
                  const parser = new DOMParser();
                  const tempDocument = parser.parseFromString(response, "text/html");

                  const bodyContent = tempDocument.querySelector("body").innerHTML;

                  const privacyElement = document.getElementById("settings-details");
                  privacyElement.innerHTML = bodyContent;
                },
                error: function (error) {
                  console.log(error);
                },
              });
            }
          } else {
            if (settings.options[newCurrent].id === "terms_of_use") {
              if (!settings.settingsTab.termsOfUse.htmlContent) {
                api.fetchTermsConditions({
                  success: function (response) {
                    // console.log(response, typeof response);
                  },
                  error: function (error) {
                    console.log(error);
                  },
                });
              }
            }
          }
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
          switch (this.selectedTab) {
            case "voucher":
              settings.settingsTab.voucher.selected = 0;
              settings.settingsTab.voucher.keyboardElement = undefined;
              $(`#voucher-input`).css("background-color", "transparent");
              break;
            case "delete_account":
              $(`#delete_button`).css("background-color", "transparent");
              settings.settingsTab.deleteAccount.buttonElement = undefined;
              break;
            case "interest":
          }
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
          settings.details[settings.options[current].type].move(current);
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        if (settings.isDetails) {
          // var options = $(`.options li`);
          // var current = options.index($(`.options li.active`));
          // var element = settings.options[current];
          // settings.details[element.type].action(element.id);
          // settings.details[settings.options[current].type].move(1);
          switch (this.selectedTab) {
            case "voucher":
              if (!settings.settingsTab.voucher.selected) {
                settings.settingsTab.voucher.keyboardElement &&
                  keyboard.init(settings.settingsTab.voucher.keyboardElement);
              } else {
                var voucherInput = document.getElementById("voucher-input").value;
                if (voucherInput.length !== 8) {
                  document.getElementById("errorMsg").innerText = "Please Enter Correct 8 Digit Code.";
                } else {
                  document.getElementById("errorMsg").innerText = "";
                  api.voucherRedeem({
                    data: {
                      customer_id: settings.customer.id,
                      phone: settings.customer.phone,
                      voucher_code: voucherInput,
                    },
                    success: function (response) {
                      document.getElementById("errorMsg").innerText = `${response}`;
                    },
                    error: function (error) {
                      console.error(error);
                    },
                  });
                }
              }
              break;
            case "delete_account":
              if (settings.settingsTab.deleteAccount.buttonElement) {
                accountDeleteDialog.init();
                // premiumNeedDialog.init();
              }
              break;
            case "interest":
          }
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
          case "interest":
            var options = settings.settingsTab.interests.options;
            var active = "action";
            break;
        }
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
        settings.selectedTab = "interest";
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
            if (!session.storage.customer.active_subscriptions) {
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

            subscriptionDetails = settings.customer.active_subscriptions || undefined;

            return `
          <div class="about-container">
            <div class="about-profile">
              <img src="https://pre.binge.buzz/assets/svg/avatar.svg" style="width: 50%; height:auto;min-width: 200px">
              <div style="text-align: right;">
                <h1 style="font-size: 3vh">${settings.customer.name || "Your name"}</h1>
                ${settings.customer.phone && `<p style="text-align: right;font-size: 2vh">${"+880" + settings.customer.phone}</p>`}
                
              </div>
            </div>
            ${
              subscriptionDetails &&
              subscriptionDetails.map(function (sub) {
                return `
                <div style="color: #fff">
                  <div style="display: flex;">
                    <img src="https://pre.binge.buzz/assets/svg/tickMark.svg" style="heigth: 50px; width: 50px;margin-right: 30px">
                    <h1 style="font-size: 3vh">Active Subscription</h1>
                  </div>
                  <h2 style="font-size: 2.5vh">${sub.package.title}</h2>
                  <p style="font-size: 2vh">Expires on: <span style="color: #Ff0000;margin-left: 10px;">${sub.expiry_date}</span></p>
                </div>`;
              })
            }
          </div>`;
          // case "subscription":
          //   if (!settings.customer && !session.storage.customer.active_subscriptions) {
          //     api.profileDetails({
          //       id: session.storage.customer.id,
          //       success: function (response) {
          //         if (response) {
          //           let sessionInfo = JSON.parse(localStorage.getItem("session"));
          //           const mergedCustomerDetails = { ...session.storage.customer, ...response };
          //           sessionInfo.customer = mergedCustomerDetails;
          //           settings.customer = mergedCustomerDetails;
          //           localStorage.setItem("session", JSON.stringify(sessionInfo));
          //         } else {
          //           settings.customer = session.storage.customer;
          //         }
          //       },
          //       error: function (error) {
          //         console.error(error);
          //       },
          //     });
          //   }
          //   subscriptionDetails = settings.customer.active_subscriptions || [];
          //   if (subscriptionDetails.length > 0) {
          //     return `
          //     <div>
          //     ${subscriptionDetails.map(function (sub) {
          //       return `
          //       <div style="color: #fff">
          //         <div style="display: flex;">
          //           <img src="https://pre.binge.buzz/assets/svg/tickMark.svg" style="heigth: 50px; width: 50px;margin-right: 30px">
          //           <h1 style="font-size: 3vh">Active Subscription</h1>
          //         </div>
          //         <h2 style="font-size: 2.5vh">${sub.package.title}</h2>
          //         <p style="font-size: 2vh">Expires on: <span style="color: #Ff0000;margin-left: 10px;">${sub.expiry_date}</span></p>
          //         <button style="background-color: red;color: white;border-radius: 0.5rem; border: none;padding: 20px 100px 20px 100px; transition: background-color 0.3s;font-size: 2vh"  onmouseover="this.style.backgroundColor='rgb(229, 9, 20)'" onmouseout="this.style.backgroundColor='red'">Unsubscribe</button>
          //    </div>`;
          //     })}
          //     </div>`;
          //   } else {
          //     return `
          //     <div style=" color: #fff;height: 65vh;">
          //       <div>
          //         <h1 style="font-size: 3vh">Choose your desired plan</h1>
          //         <div  style="font-size: 2vh">
          //           <p><span style="color:green; margin-right: 15px">&#10003;</span> Watch what you want Ad Free!</p>
          //           <p><span style="color:green; margin-right: 15px">&#10003;</span> Multi-devices Access</p>
          //           <p><span style="color:green; margin-right: 15px">&#10003;</span> Change or Unsubscribe anytime you want.</p>
          //         </div>
          //         <button style="background-color: red;color: white;border-radius: 0.5rem; border: none;padding: 20px 100px 20px 100px; transition: background-color 0.3s;font-size: 2vh"  onmouseover="this.style.backgroundColor='rgb(229, 9, 20)'" onmouseout="this.style.backgroundColor='red'">Subscribe now</button>
          //       </div>
          //     </div>`;
          //   }
          case "vouchers":
            return `
            <div style="color: #fff">
              <div style="display: flex;margin-bottom: 30px">
                <img src="https://pre.binge.buzz/assets/svg/voucher.svg" style="heigth: 70px; width: 70px;margin-right: 30px">
                <h1 style="font-size: 3vh">Vouchers</h1>
              </div> 
              <div class="voucher-input-container">
                <input id="voucher-input" placeholder="Enter Your Coupon here" />
              </div>
              <button id="redeem_button">Redeem</button>
             <p id="errorMsg" style="font-size: 2vh; color: red"></p>
            </div>`;
          case "delete":
            return `
            <div style="color: #fff">
              <div style="display: flex;">
                <img src="https://pre.binge.buzz/assets/svg/delete.svg" style="heigth: 50px; width: 50px;margin-right: 30px">
                <h1 style="font-size: 3vh">Delete Account</h1>
              </div>
              <p style="font-size: 2vh">This will permanently delete your account.</p> 
              <button id="delete_button">Delete</button>
            </div>
            `;
          case "terms_of_use":
            return ``;
          case "privacy_notice":
            return ``;
          case "faq":
            return ``;
        }
      },

      move: function (id) {
        switch (id) {
          case 0:
          case 1:
            //voucher
            settings.selectedTab = "voucher";
            if (!settings.settingsTab.voucher.selected) {
              $(`#voucher-input`).css("background-color", "rgb(30, 30, 30)");
              settings.settingsTab.voucher.keyboardElement = document.getElementById("voucher-input");
              break;
            }
          case 2:
            settings.selectedTab = "faq";
            settings.settingsTab.faq.scrollableContent = document.getElementById("settings-div");
            break;
          case 3:
            settings.selectedTab = "terms_of_use";
            settings.settingsTab.termsOfUse.scrollableContent = document.getElementById("settings-div");
            break;
          case 4:
            settings.selectedTab = "privacy_notice";
            settings.settingsTab.privacyNotice.scrollableContent = document.getElementById("settings-div");
            break;
          case 5:
            settings.selectedTab = "delete_account";
            $(`#delete_button`).css("background-color", "rgb(229, 9, 20)");
            settings.settingsTab.deleteAccount.buttonElement = document.getElementById("delete_button");
        }
      },
    },
  },
};
