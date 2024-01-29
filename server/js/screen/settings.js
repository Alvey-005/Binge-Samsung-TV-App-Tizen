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
              const newScrollTop = settings.settingsTab.termsOfUse.scrollableContent.scrollTop - 50;
              settings.settingsTab.termsOfUse.scrollableContent.scrollTop = Math.min(
                newScrollTop,
                settings.settingsTab.termsOfUse.scrollableContent.scrollHeight -
                  settings.settingsTab.termsOfUse.scrollableContent.clientHeight
              );
            case "voucher":
              if (settings.settingsTab.voucher.selected) {
                settings.settingsTab.voucher.selected = 0;
                var input = $(`#voucher-input`);
                input.css("background-color", "white");
                var input = document.getElementById("voucher-input");
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
        }
        break;
      case tvKey.KEY_DOWN:
        if (settings.isDetails) {
          switch (this.selectedTab) {
            case "voucher":
              if (!settings.settingsTab.voucher.selected) {
                settings.settingsTab.voucher.selected = 1;
                var button = document.getElementById("redeem_button");
                button.style.backgroundColor = "rgb(229, 9, 20)";
                var voucherInput = document.getElementById("voucher-input");
                voucherInput.style.backgroundColor = "transparent";
                break;
              }
            case "terms_of_use":
              const newScrollTop = settings.settingsTab.termsOfUse.scrollableContent.scrollTop + 50;
              settings.settingsTab.termsOfUse.scrollableContent.scrollTop = Math.min(
                newScrollTop,
                settings.settingsTab.termsOfUse.scrollableContent.scrollHeight -
                  settings.settingsTab.termsOfUse.scrollableContent.clientHeight
              );
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
              $(`#delete_button`).css("background-color", "red");
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
          <div style="height: 65vh;color: #fff;font-size: 23px;line-height: 51px;display: flex; flex-direction: column; justify-content: space-between;">
            <div style="display: grid;grid-template-columns: 1fr 1fr;gap: 16px;">
              <img src="https://pre.binge.buzz/assets/svg/avatar.svg" style="width: 350px; height:350px;">
              <div style="text-align: right;margin-top: 50px">
                <h1 style="font-size: 3vh">${settings.customer.name || "Yeasin Zilani"}</h1>
                <p style="text-align: right;font-size: 2vh">${"+880" + settings.customer.phone || "+01833184275"}</p>
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
            <div style="display: flex; flex-direction:column; justify-content: end; align-items: end;font-size: 28px;color:grey">
                <div>Binge TV app.</div>
                <div>Copyright ©2024 Robi Axiata Limited. All Rights Reserved.</div>
            </div>
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
              <div style="border-style: dotted;border-radius: 0.25rem;width: 100%;margin-bottom: 40px;">
                <input id="voucher-input" style="color: #808080;width: 100%;outline: none;background-color: transparent;padding: 20px;font-size:2vh" placeholder="Enter Your Coupon here" />
              </div>
              <button id="redeem_button" style="background-color: red;color: white;border-radius: 0.5rem; border: none;padding: 20px 100px 20px 100px; transition: background-color 0.3s;font-size: 2vh">Redeem</button>
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
              <button id="delete_button" style="background-color: red;color: white;border-radius: 0.5rem; border: none;padding: 20px 100px 20px 100px; transition: background-color 0.3s;font-size: 2vh; margin-top: 30px"  onmouseover="this.style.backgroundColor='rgb(229, 9, 20)'" onmouseout="this.style.backgroundColor='red'">Delete</button>
            </div>
            `;
          case "terms_of_use":
            return `
            <div class="settings-div" id="settings-div" style="color: #fff; text-align: justify">
              <h1>TERMS OF USE</h1>

              <p>Binge provides a subscription-based service for multiscreen (TV and Mobile) that allows users to access Live TV Channels and VOD content that include (but is not limited to) Drama, Movies, Music Videos TV show,s and so on streamed over internet. Binge is the brand for streaming Service that is owned and operated by Robi Axiata Limited (hereinafter referred to as "Binge", "Site", "Website", "us", "we" or "our"). Robi Axiata Limited is committed to safeguarding the privacy of Binge's (large screen and small screen App) visitors. This terms and conditions set out how personal information will be treated. This terms and conditions apply to all Visitors and Users (collectively referred to as "Users"). In addition, this terms and condition applies to all products and services provided by this site.</p>

              <p>The following terms (‘Terms’) govern Subscriber’s access Binge platform (collectively ‘Services’).</p>

              <h2>Acceptance</h2>

              <p>By accessing and using Binge Services, Subscriber hereby agree and accept the Terms in full. If Subscriber disagree or do not accept any of the Terms, Subscriber must not use our Services.</p>

              <h2>General Term of Use</h2>

              <h2>Cookies:</h2>

              <p>Our Website uses cookies; by using our Website and/or agreeing to the Terms, you consent to our use of cookies in accordance with the terms of our Privacy Policy.</p>

              <h2>Copyright Notice:</h2>

              <p>Our Website uses cookies; by using our Website and/or agreeing to the Terms, you consent to our use of cookies in accordance with the terms of our Privacy Policy.</p>

              <h2>Cookies:</h2>

              <p>Copyright © 2020 Robi Axiata Limited, under the brand name "Binge".</p>

              <p>Subject to the express conditions of these Terms, we own and regulate all copyright and all other intellectual property rights, titles and interests in and pertaining to the Services and the products and contents of our Service (e.g. website, app, etc.).</p>

              <p>No right, title, license or interest is given to the subscriber in addition to the Services and content and equipment that are part of the Services, except for the restricted permissions given by these Terms.</p>

              <p>Except the limited permissions, provided by these Terms and Conditions, no right, title, license or interest is granted to Subscriber in relation to the Services and contents and materials that are part of the Services.</p>

              <h2>License to Use the Service</h2>

              <p>Subscribers may view pages from Binge Website in a web browser. Except as expressly permitted by provisions in these Terms and Conditions, Subscriber must not copy or download any contents or materials from any of the Binge platforms.</p>

              <p>Subscribers may only use our Services for Subscribers’ own personal purposes and must not use the concerned Services for any other purposes including, without limitation for the commercial purposes.</p>

              <p>Videos that Binge offer as part of the Services can be viewed only for personal use or at home. Organized or public showings are not allowed without prior written consent from Binge.</p>

              <p>All contents and materials on its Service are copyright protected and Subscriber may not republish material from its Service (including republication on another service); sell, rent or sub-license material or contents from our platform; show any material from its platform in public; exploit materials or contents from Binge Service for commercial purposes; or redistribute materials or contents from any platform.
              </p>

              <p>Binge large screen application Brought to you by Genex Infosys Ltd and Powered by Robi Axiata Limited Google, Android, YouTube, Android TV and other marks are trademarks of Google LLC</p>

              <p>Binge reserves the right to restrict access to areas of its platform at any time and for any reason or no reason, or indeed the whole platform, at Binge’s sole discretion; Subscribers must not circumvent or bypass, or attempt to circumvent or bypass, any access restriction measures on the platform.</p>

              <h2>Restrictions of usage</h2>

              <p>Subscribers may not use the Binge platform in any way or take any action that causes or may cause, damage to the App or impairment of the performance, availability, or accessibility of the platform.</p>
              
              <p>Subscribers may not use the Binge platform in any way that is unlawful, illegal, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity. Subscribers may not use our Binge platform to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, virus, trojan horse, worm, keystroke logger, rootkit, or other malicious software.</p>

              <p>Subscribers may not conduct any systematic or automated data collection activities (including without limitation to scraping, data mining, data extraction, and data harvesting) on or in relation to our App without our express written consent.</p>

              <p>Subscribers may not access or otherwise interact with our App using any robot, spider, or other automated means.</p>

              <p>Subscribers may not use data collected from our platform for any direct marketing activity (including without limitation email marketing, SMS marketing, telemarketing, and direct mailing).</p>

              <p>Subscribers may not use data collected from our platform to contact individuals, companies, or other persons or entities.</p>

              <p>Subscribers must ensure that all the information Subscribers supply to us through our platform, is true, accurate, current, complete, clear, and non-misleading.</p>

              <h2>About Service</h2>

              <p>Binge is a video streaming platform that offers Live TV and Video on Demand. Binge is available on different OS.</p>

              <h2>Binge Premium</h2>

              <p>Binge Premium is the premium segment of Binge for all users. Binge Prime offers popular Live TV, Latest Movies, and Binge Exclusive Originals. These contents are only accessible after successful purchasing of certain service subscriptions.</p>

              <h2>Subscription</h2>

              <p>Binge subscription will continue as specified in the selected plan, until terminated. To use the Binge service Subscriber must have Internet access and a Binge ready device, and provide a current, valid, accepted method of payment, which Subscriber may update from time to time ("Payment Method"). Unless Subscriber cancels their subscription before Subscriber’s billing date. Subscription will be auto renewed for on net user if they use DOB method of payment. Subscriber can find specific details regarding Subscription plan und subscription tab. Customer can select auto renewal and non-autorenewal pack from the pack list.</p>

              <p>Binge Premium and Subscription are mutually exclusive.</p>

              <h2>Billing:</h2>

              <h2>Billing Cycle:</h2>

              <p>The subscription fee for the Binge service and any other charges Subscriber may incur in connection with Subscriber’s use of the service, such as taxes and possible transaction fees, will be charged on a periodic basis to Subscriber’s Payment Method on the calendar day corresponding to the commencement of the paying portion of Subscriber’s subscription as auto renewal is activated for on net user if they use DOB, or at the instant the subscription plan is activated. In some cases, Subscriber’s payment date may change, for example if Subscriber’s Payment Method has not successfully settled or if Subscriber’s paid subscription began on a day not contained in a given month. User can see details information of subscribed pack, validity expiry etc. in account section and subscription section with auto renewal and non-auto renewal packs</p>

              <h2>Payment Methods</h2>

              <p>Subscriber can change Subscriber’s Payment Method by visiting Subscriber’s Binge subscription page. If a payment is not successfully settled, due to expiration, insufficient funds, or otherwise, and Subscriber do not change Subscriber’s Payment Method or cancel Subscriber’s account, Binge may change the status of the Subscriber’s to free user Service until Binge have obtained a valid Payment. When Subscriber updates their Payment, Subscriber authorizes Binge to continue charging the updated Payment and Subscriber remains responsible for any uncollected amounts. This may result in a change to Subscriber’s payment dates. Local tax charges may vary depending on the Payment Method used. Check with Subscriber’s Payment Method service provider for details. In any event, Binge shall not be held liable for any applicable taxes upon the purchase/use of the Services.</p>

              <h2>Auto Renewal</h2>

              <p>User will be able to select autorenewal and non-auto renewal packs. If customer select the autorenewal pack and it will renew automatically as per pack validity. Certain packs from DOB packs has auto renewal feature if the user is on net user and uses DOB, which will automatically renew the subscription after validity period Weekly and monthly User will get auto renewal notification before validity expires. If user subscribe any autorenewal pack and if the packs fails to renew due to insufficient balance system will take 35 attempts in next 7 days to renew the pack, after successful renewal user will get SMS notification. User can also unsubscribe the service any time in that case auto renew will not applicable. However, in case of a problem occurring with the selected Payment Method, the auto renewal function might not function as usual, and the subscription plan will only last for the paid period as per the plan. If users pay using payment gateway, then the service will not auto be renewed.</p>

              <h2>Cancellation</h2>

              <p>Mobile and WEB user can cancel or unsubscribe their Binge subscription at any time, and they will continue to have access to the Binge free service until they subscribe again, they will not able to see premium service. To the extent permitted by the applicable law, payments are non-refundable, and Binge does not provide refunds or credits for any partial use of the Service or unwatched Binge content. Though there is no option of cancellation for TV user. If they don’t pay after the validity, then user status automatically changes to Free.</p>

              <p>To cancel subscription, one must go to the "Binge subscription section" and follow the instructions for cancellation or un-subscription.</p>

              <h2>Changes to the Price and Service Plans:</h2>

              <p>Binge may change its service plans and the price of its service from time to time</p>

              <h2>Binge Service</h2>

              <p>Subscriber must be 18 years of age, or the age of majority in Subscriber’s province, territory or country, to become a member of the Binge service.</p>

              <p>The Binge service and any content viewed through the service are for Subscriber personal and non-commercial use only. Binge Subscription grant Subscriber a limited, non-exclusive, non-transferable license to access the Binge service and view Binge content. Except for the foregoing limited license, no right, title or interest shall be transferred to Subscriber. Subscriber agree not to use the service for public performances.</p>

              <p>Subscriber may view the Binge content primarily within the country in which Subscriber have established Subscriber account and only in geographic locations where Robi Axiata Limited offer our service and have licensed such content. The content that may be available to watch will vary by geographic location and will change from time to time, irrespective of the country from where the account has been created and payment has been made. The number of devices on which Subscriber may simultaneously watch is no more than 2(two) if the subscriber subscribes TV plans or as offered by Subscriber chosen subscription plan. No screen sharing for Mobile plan subscriber.</p>

              <p>Binge shall regularly make changes to the service, including the content library. In addition, Binge continually test various aspects of the service, including our website, user interfaces, promotional features and availability of Binge content.</p>

              <p>Subscriber agree to use the Binge service, including all features and functionalities associated therewith, in accordance with all applicable laws, rules and regulations, or other restrictions on use of the service or content therein. Subscriber agree not to archive, reproduce, distribute, modify, display, perform, publish, license, create derivative works from, offer for sale, or use (except as explicitly authorized in these Terms of Use) content and information contained on or obtained from or through the Binge service also agree not to: circumvent, remove, alter, deactivate, degrade or thwart any of the content protections in the Binge service; use any robot, spider, scraper or other automated means to access the Binge service; decompile, reverse engineer or disassemble any software or other products or processes accessible through the Binge service; insert any code or product or manipulate the content of the Binge service in any way; or use any data mining, data gathering or extraction method. In addition, Subscribers agree not to upload, post, e-mail or otherwise send or transmit any material designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment associated with the Binge service, including any software viruses or any other computer code, files or programs. Binge may terminate or restrict Subscriber’s use of its service if Subscriber violates the Terms of Use laid herein or are engaged in illegal or fraudulent use of the service.</p>

              <p>The quality of the display of the Binge content may vary from device to device, and may be affected by a variety of factors, such as Subscriber location, the bandwidth available through and/or speed of Subscriber Internet connection and also depends on the Devices (Mobiles and TVs) Not all content is available in all formats. Subscriber are responsible for all Internet access charges. Subscriber should check with their Internet provider for information on possible internet data usage charges.</p>

              <p>To run Binge application small screen user needs to download the application from their dedicated app market. Web user can visit binge.buzz from any country from their device browser, And large screen user can purchase the device from available store. If user’s device is compatible with our platform then they will able to enjoy our service, some device and OS may not compatible with our platform.</p>

              <p>The Binge platform is developed by, or for, Binge and is designed to enable viewing of Binge content through Binge compatible devices. The Binge software may vary by device and medium, and functionalities and features may also differ between devices (TV and android mobile). Subscriber acknowledge that the use of the service may require third-party software that is subject to third party licenses. By reading this Subscriber accept to automatically receive any updates of Binge and related third party software when available. Voice search option is not available for Bangla language.</p>

              <p>Due to some country specific regulatory policy Binge may not charge its users, availing the service from the respective country.</p>

              <p>Customer will face different ad while watching content and Live TV.</p>

              <h2>Warranties</h2>

              <p>The Binge service is provided "as is" and without warranty or condition. In particular, our service may not be uninterrupted or error-free. Subscriber waive all special, indirect and consequential damages against Robi.Robi will not be responsible for any lack of or degradation of Service if the cause is due to non-compliance from subscriber’s end or for any technical glitches.</p>

              <h2>Limitations of Liability</h2>

              <p>To the fullest extent permitted by law, in no event shall Binge and its officers, directors, employees, or agents, be liable to Subscriber for any direct, indirect, incidental, special, punitive, losses or expenses or consequential damages whatsoever resulting from any (i) errors, mistakes, or inaccuracies of content, (ii) any interruption or cessation of transmission to or from our services (iii) any unauthorized access to or use of our secure servers and/or any and all personal information and/or financial information stored therein, (iv) personal injury or property damage, of any nature whatsoever, resulting from Subscriber access to and use of our services, (iv) any bugs, viruses, trojan horses, or the like, which may be transmitted to or through our services by any third party, and/or (v) any errors or omissions in any content or for any loss or damage of any kind incurred as a result of Subscriber use of any content posted, emailed, transmitted, or otherwise made available via the services, whether based on warranty, contract, tort, or any other legal theory, and whether or not the company is advised of the possibility of such damages.</p>

              <p>Subscriber categorically acknowledge and accept that Binge or Binge related service shall not be liable for content or the defamatory, offensive, or illegal conduct of any third party and that the risk of harm or damage from the foregoing rests entirely with Subscriber.</p>

              <p>Robi Axiata Limited understand that, in some jurisdictions, warranties, disclaimers and conditions may apply that cannot be legally excluded, only if that be the scenario in Subscriber’s jurisdiction, then to the extent permitted by law, Binge limits its liability for any claims under those warranties or conditions to either supplying Subscriber the services again (or the cost of supplying Subscriber the services again).</p>

              <h2>Class Action Waiver</h2>

              <p>Where permitted under the applicable law, Subscriber and Binge agree that each may bring claims against the other only in Subscriber or its individual capacity, and not as a plaintiff or class member in any purported class or representative proceeding. Further, where permitted under the applicable law, unless both Subscriber and Binge agree otherwise, the court may not consolidate more than one person's claims with Subscriber claims and may not otherwise preside over any form of a representative or class proceeding.</p>

              <h2>Identification</h2>

              <p>By agreeing to these Terms, Subscriber agree that Subscriber shall defend, indemnify and hold Robi, Sponsor, our licensors and each such party’s parent organizations, subsidiaries, affiliates, officers, directors, members, employees, attorneys and agents harmless from and against any and all claims, costs, damages, losses, liabilities and expenses (including lawyers’ fees and costs) arising out of or in connection with: (a) Subscriber’s violation or breach of any term of these Terms or any applicable law or regulation, including any local laws or ordinances, whether or not referenced herein and (b) Subscriber use (or misuse) of the Services.</p>

              <h2>Internet Delays</h2>

              <p>The Services may be subject to limitations, delays, and other problems inherent in the use of the internet and electronic communications including the device used by Subscriber being faulty, not connected, out of range, switched off or not functioning. Binge are not responsible for any delays, delivery failures, damages or losses resulting from such problems.</p>

              <h2>Miscellaneous</h2>

              <h2>Governing Law</h2>

              <p>These Terms of Use shall be governed by and construed in accordance with the laws of the Bangladesh.</p>

              <h2>Unsolicited Materials</h2>

              <p>Binge does not accept unsolicited materials or ideas for Binge content and is not responsible for the similarity of any of its content or programming in any media to materials or ideas transmitted to Binge.</p>

              <h2>Customer Support</h2>

              <p>The subscriber can check the Binge FAQ segment on our service to discover more details about our service and its functionality or if s/he needs help with his/her application (e.g. website, app etc.). Subscriber can also provide feedback through the Binge app. Subscriber is welcomed to call Binge hotline number 01841024643 for any queries/suggestions.</p>

              <h2>Survival</h2>

              <p>The subscriber can check the Binge FAQ segment on our service to discover more details about our service and its functionality or if s/he needs help with his/her application (e.g. website, app etc.). Subscriber can also provide feedback through the Binge app. Subscriber is welcomed to call Binge hotline number 01841024643 for any queries/suggestions.</p>

              <h2>Changes to Terms of Use and Assignment</h2>

              <p>Binge may, from time to time, change these Terms of Use. Although Binge may attempt to notify Subscriber when major changes are made to these Terms of Use, Subscriber should periodically review the most up-to-date version at binge.buzz. Binge may, in our sole discretion, modify or revise these Terms of Service and policies at any time, and Subscriber agree to be bound by such modifications or revisions or update. Nothing in these Terms of Service shall be deemed to confer any third-party rights or benefits.</p>

              <h2>Electronic Communications</h2>

              <p>Binge will send Subscriber information relating to Subscriber account (e.g. payment authorizations, invoices, changes in password or Payment Method, confirmation messages, notices) in electronic form only, for example via phone number provided during registration.</p>

              <h2>Legal Action</h2>

              <p>Without prejudice to any other right pertaining to us under these Terms and/or law/equity, Robi Axiata Limited reserves the right to take legal actions against Subscriber for any breach of these Terms.</p>
              <p>Binge is owned by Robi Axiata Limited and its partners value customer data and privacy. For more information on privacy policy, please visit https://www.binge.buzz</p>
              
              <h2>Details</h2>

              <p>This Website is owned and operated by Robi Axiata Limited, operating under the brand name Binge.</p>

              <p>We are registered in Bangladesh and our registered office is at Robi Axiata Limited, Head Office: Robi Corporate Office 53 Gulshan South AvenueGulshan-1, Dhaka, 1212. Email info@binge.buzz</p>

              <p>Subscribers can contact via email in the address given above.</p>
            </div>
            `;
          case "privacy_notice":
            return `
            <div style="color: #fff">
              <div style="display: flex;">
                <img src="https://pre.binge.buzz/assets/svg/delete.svg" style="heigth: 50px; width: 50px;margin-right: 30px">
                <h1 style="font-size: 3vh">Delete Account</h1>
              </div>
              <p style="font-size: 2vh">This will permanently delete your account.</p> 
              <button id="delete_button" style="background-color: red;color: white;border-radius: 0.5rem; border: none;padding: 20px 100px 20px 100px; transition: background-color 0.3s;font-size: 2vh; margin-top: 30px"  onmouseover="this.style.backgroundColor='rgb(229, 9, 20)'" onmouseout="this.style.backgroundColor='red'">Delete</button>
            </div>
            `;
          case "faq":
            return `
            <div style="color: #fff">
              <div style="display: flex;">
                <img src="https://pre.binge.buzz/assets/svg/delete.svg" style="heigth: 50px; width: 50px;margin-right: 30px">
                <h1 style="font-size: 3vh">Delete Account</h1>
              </div>
              <p style="font-size: 2vh">This will permanently delete your account.</p> 
              <button id="delete_button" style="background-color: red;color: white;border-radius: 0.5rem; border: none;padding: 20px 100px 20px 100px; transition: background-color 0.3s;font-size: 2vh; margin-top: 30px"  onmouseover="this.style.backgroundColor='rgb(229, 9, 20)'" onmouseout="this.style.backgroundColor='red'">Delete</button>
            </div>
            `;
        }
      },

      move: function (id) {
        console.log(id);
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
          case 3:
            settings.selectedTab = "terms_of_use";
            // settings.termsOfUse.scrollableDiv = document.getElementById("settings-details");
            settings.settingsTab.termsOfUse.scrollableContent = document.getElementById("settings-div");
            // console.log(settings.termsOfUse);
            break;
          case 5:
            //delete account
            settings.selectedTab = "delete_account";
            $(`#delete_button`).css("background-color", "rgb(229, 9, 20)");
            settings.settingsTab.deleteAccount.buttonElement = document.getElementById("delete_button");
        }
      },
    },
  },
};
