window.home_details = {
  id: "home_details-screen",
  appendScreen: NaN,
  previous: NaN,
  is_wishlist: false,
  data: {
    this: NaN,
    continue: NaN,
    contentDetails: NaN,
  },
  callbacks: {
    init: NaN,
    destroy: NaN,
  },

  init: function (item, contentDetails, screen, init, destroy) {
    home_details.data.contentDetails = contentDetails;
    home_details.is_wishlist = contentDetails.is_wishlist;
    home_details.appendScreen = screen;
    home_details.callbacks.init = init;
    home_details.callbacks.destroy = destroy;
    home_details.callbacks.init && home_details.callbacks.init(item);

    var buttons = document.createElement("div");
    var elemtentExisit = document.getElementById(`${home_details.id}`);
    if(elemtentExisit){
      return;
    }
    buttons.className = `${home_details.id} ${home_details.id}_buttons`;
    buttons.innerHTML = `
    <a class="selected">
      <i class="fa-solid fa-play"></i>
      <p>${translate.go("home.details.play")}</p>
      <span></span>
    </a>
    ${
      !session.storage.isAnonymous
        ? `<a>
        <i class="fa-solid ${home_details.is_wishlist == true ? "fa-check" : "fa-bookmark"}"></i>
        <p>${home_details.is_wishlist ? translate.go("home.details.added") : translate.go("home.details.add")}</p>
      </a>`
        : ``
    }
    ${
      home_details.data.contentDetails.related_product.length
        ? `<a>
        <i class="fa-solid fa-list"></i>
        <p>${translate.go("home.details.episodes")}</p>
      </a>`
        : ``
    }
    <!--
    <a>
      <i class="fa-solid fa-clone"></i>
      <p>${translate.go("home.details.related")}</p>
    </a>
    -->
    `;

    home_details.data.this = item;
    $(`#${screen.id} .details .info`).append(buttons);

    $(`#${screen.id} .details`).addClass("full");
    $(`body`).addClass(`${home_details.id}`);

    if (session.storage.customer) {
      api.getCustomerDetails({
        success: function () {
          console.log("Getting customer Data");
        },
      });
    }
    home_details.previous = main.state;
    main.state = home_details.id;
  },

  destroy: function () {
    $(`body`).removeClass(`${home_details.id}`);
    $(`#${home_details.appendScreen.id} .details.full`).removeClass("full");
    $(`.${home_details.id}`).remove();
    home_details.data.continue = NaN;
    home_details.data.this = NaN;
    home_details.data.contentDetails = NaN;
    main.state = home_details.previous;
    home_details.callbacks.destroy && home_details.callbacks.destroy();
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        home_details.destroy();
        break;
      case tvKey.KEY_UP:
        var buttons = $(`.${home_details.id}.${home_details.id}_buttons a`);
        var current = buttons.index($(`.${home_details.id}.${home_details.id}_buttons a.selected`));
        buttons.removeClass("selected");
        buttons.eq(current > 0 ? current - 1 : current).addClass("selected");
        break;
      case tvKey.KEY_DOWN:
        var buttons = $(`.${home_details.id}.${home_details.id}_buttons a`);
        var current = buttons.index($(`.${home_details.id}.${home_details.id}_buttons a.selected`));
        buttons.removeClass("selected");
        buttons.eq(current < buttons.length - 1 ? current + 1 : current).addClass("selected");
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var buttons = $(`.${home_details.id}.${home_details.id}_buttons a`);
        var current = buttons.index($(`.${home_details.id}.${home_details.id}_buttons a.selected`));

        if (session.storage.isAnonymous && current == 1) {
          current++;
        }
        switch (current) {
          case 0:
            video.init(home_details.data.contentDetails, home_details.appendScreen); // screen = home_details.appendScreen;
            break;
          case 1:
            if (home_details.is_wishlist == true) {
              api.deleteFavourite({
                data: {
                  customer_id: session.storage.customer.id,
                  product_id: home_details.data.contentDetails.id,
                },
                success: function (response) {
                  var item = home_details.data.this;
                  home_details.is_wishlist = !home_details.is_wishlist;
                  var wishlistIcon = home_details.is_wishlist ? "fa-check" : "fa-bookmark";
                  var wishlistText = home_details.is_wishlist
                    ? translate.go("home.details.added")
                    : translate.go("home.details.add");
                  var wishlistButton = $(`.${home_details.id}.${home_details.id}_buttons a`).eq(1);
                  wishlistButton.find("i").removeClass("fa-check fa-bookmark").addClass(wishlistIcon);
                  wishlistButton.find("p").text(wishlistText);

                  api.contentDetails({
                    body: {
                      id: item.id,
                      content_type: item.content_type,
                    },
                    success: function (data) {
                      home_details.data.contentDetails = data;
                    },
                  });
                },
                error: function (error) {
                  loading.destroy();
                  console.log(error);
                },
              });
            } else {
              api.addToFavourites({
                data: {
                  customer_id: session.storage.customer.id,
                  product_id: home_details.data.contentDetails.id,
                },
                success: function (response) {
                  var item = home_details.data.this;
                  home_details.is_wishlist = !home_details.is_wishlist;
                  var wishlistIcon = home_details.is_wishlist ? "fa-check" : "fa-bookmark";
                  var wishlistText = home_details.is_wishlist
                    ? translate.go("home.details.added")
                    : translate.go("home.details.add");
                  var wishlistButton = $(`.${home_details.id}.${home_details.id}_buttons a`).eq(1);
                  wishlistButton.find("i").removeClass("fa-check fa-bookmark").addClass(wishlistIcon);
                  wishlistButton.find("p").text(wishlistText);

                  api.contentDetails({
                    body: {
                      id: item.id,
                      content_type: item.content_type,
                    },
                    success: function (data) {
                      home_details.data.contentDetails = data;
                    },
                  });
                },
                error: function (error) {
                  loading.destroy();
                  console.log(error);
                },
              });
            }
            break;
          case 2:
            home_episodes.init(home_details.data.contentDetails, this.appendScreen);
            break;
          case 3:
            console.log("related");
            break;
        }
        break;
    }
  },
};
