window.home_details = {
  id: "home_details-screen",
  appendScreen: NaN,
  previous: NaN,
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
    home_details.appendScreen = screen;
    home_details.callbacks.init = init;
    home_details.callbacks.destroy = destroy;
    home_details.callbacks.init && home_details.callbacks.init(item);
    
    var buttons = document.createElement("div");
    buttons.className = `${home_details.id} ${home_details.id}_buttons`;
    buttons.innerHTML = `
    <a class="selected" onclick="console.log('player clicked')">
      <i class="fa-solid fa-play"></i>
      <p>${translate.go("home.details.play", { season: 1, episode: 1 })}</p>
      <span></span>
    </a>
    <a onclick="home_details.click(event)">
      <i class="fa-solid ${home_details.data.contentDetails.is_wishlist == true ? 'fa-check' : 'fa-bookmark'}"></i>
      <p>${home_details.data.contentDetails.is_wishlist ? translate.go("home.details.added") : translate.go("home.details.add")}</p>
    </a>
    <a>
      <i class="fa-solid fa-list"></i>
      <p>${translate.go("home.details.episodes")}</p>
    </a>
    <a>
      <i class="fa-solid fa-clone"></i>
      <p>${translate.go("home.details.related")}</p>
    </a>`;

    home_details.data.this = item;
    $(`#${screen.id} .details .info`).append(buttons);

    if (item.type === "movie") {
      $(`.${home_details.id}.${home_details.id}_buttons a`).eq(2).remove();
      $(`.${home_details.id}.${home_details.id}_buttons a`)
        .eq(0)
        .addClass(`${item.playhead > 0 ? "played" : ""}`)
        .attr("percent", (item.playhead * 100) / item.duration);

      var text = translate.go(
        `home.details.${item.playhead > 0 ? "continue" : "play"}`,
        { season: 0, episode: 0 }
      );
      $(`.${home_details.id}.${home_details.id}_buttons a p`).eq(0).text(text);
      $(`.${home_details.id}.${home_details.id}_buttons a span`)
        .eq(0)
        .width((item.playhead * 100) / item.duration + "%");
    } else {
      // loading.start();
      // service.continue({
      //   data: {
      //     ids: item.id,
      //   },
      //   success: function (response) {
      //     loading.end();
      //     home_details.data.continue = mapper.continue(response);
      //     $(`.${home_details.id}.${home_details.id}_buttons a`)
      //       .eq(0)
      //       .addClass(
      //         `${home_details.data.continue.played > 0 ? "played" : ""}`
      //       )
      //       .attr("percent", home_details.data.continue.played);

      //     var text = translate.go(
      //       `home.details.${
      //         home_details.data.continue.played > 0 ? "continue" : "play"
      //       }`,
      //       {
      //         season: home_details.data.continue.season_number,
      //         episode: home_details.data.continue.episode_number,
      //       }
      //     );
      //     $(`.${home_details.id}.${home_details.id}_buttons a p`)
      //       .eq(0)
      //       .text(text);
      //     $(`.${home_details.id}.${home_details.id}_buttons a span`)
      //       .eq(0)
      //       .width(home_details.data.continue.played + "%");
      //   },
      //   error: function (error) {
      //     loading.end();
      //     console.log(error);
      //   },
      // });
    }

    $(`#${screen.id} .details`).addClass("full");
    $(`body`).addClass(`${home_details.id}`);

    home_details.previous = main.state;
    main.state = home_details.id;
  },

  click: function(event) {
    console.log('evev', event);
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
        var current = buttons.index(
          $(`.${home_details.id}.${home_details.id}_buttons a.selected`)
        );
        buttons.removeClass("selected");
        buttons.eq(current > 0 ? current - 1 : current).addClass("selected");
        break;
      case tvKey.KEY_DOWN:
        var buttons = $(`.${home_details.id}.${home_details.id}_buttons a`);
        var current = buttons.index(
          $(`.${home_details.id}.${home_details.id}_buttons a.selected`)
        );
        buttons.removeClass("selected");
        buttons
          .eq(current < buttons.length - 1 ? current + 1 : current)
          .addClass("selected");
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var buttons = $(`.${home_details.id}.${home_details.id}_buttons a`);
        var current = buttons.index(
          $(`.${home_details.id}.${home_details.id}_buttons a.selected`)
        );

        switch (current) {
          case 0:
            video.init(home_details.data.contentDetails);
            break;
          case 1:
            loading.start();
            service.addToFavourites({
              data: {
                customer_id: session.storage.customer.id,
                product_id: home_details.data.contentDetails.id,
              },
              success: function (response) {
                var item = home_details.data.this;
                var screen = home_details.appendScreen;
                home_details.destroy();

                service.contentDetails({
                  body: {
                    id: item.id,
                    content_type: item.content_type,
                  },
                  success: function (data) {
                    setTimeout(function () {
                        loading.end(); 
                    }, 1000);
                    home_details.init(item, data, screen);
                  },
                });
              },
              error: function (error) {
                loading.destroy();
                console.log(error);
              },
            });
            break;
          case 2:
            home_episodes.init(
              home_details.data.contentDetails,
              this.appendScreen
            );
            break;
          case 3:
            console.log("related");
            break;
        }
        break;
    }
  },
};
