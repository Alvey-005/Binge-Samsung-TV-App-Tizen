window.movies_details = {
  id: "movies_details-screen",
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

  init: function (item, init, destroy) {
    movies_details.callbacks.init = init;
    movies_details.callbacks.destroy = destroy;
    const contentDetailResponse = api.contentDetails({
      body: {
        id: item.id,
        content_type: item.content_type,
      },
      success: function (data) {
        movies_details.data.contentDetails = data;
      },
    });
    movies_details.callbacks.init && movies_details.callbacks.init(item);
    var buttons = document.createElement("div");
    buttons.className = `${movies_details.id} ${movies_details.id}_buttons`;
    buttons.innerHTML = `
      <a class="selected">
        <i class="fa-solid fa-play"></i>
        <p>${translate.go("home.details.play", { season: 1, episode: 1 })}</p>
        <span></span>
      </a>
      <a>
        <i class="fa-solid fa-bookmark"></i>
        <p>${translate.go("home.details.add")}</p>
      </a>
      <a>
        <i class="fa-solid fa-list"></i>
        <p>${translate.go("home.details.episodes")}</p>
      </a>
      <a>
        <i class="fa-solid fa-clone"></i>
        <p>${translate.go("home.details.related")}</p>
      </a>`;

    movies_details.data.this = item;
    $(`#${home.id} .details .info`).append(buttons);

    if (item.type === "movie") {
      $(`.${movies_details.id}.${movies_details.id}_buttons a`).eq(2).remove();
      $(`.${movies_details.id}.${movies_details.id}_buttons a`)
        .eq(0)
        .addClass(`${item.playhead > 0 ? "played" : ""}`)
        .attr("percent", (item.playhead * 100) / item.duration);

      var text = translate.go(
        `home.details.${item.playhead > 0 ? "continue" : "play"}`,
        { season: 0, episode: 0 }
      );
      $(`.${movies_details.id}.${movies_details.id}_buttons a p`)
        .eq(0)
        .text(text);
      $(`.${movies_details.id}.${movies_details.id}_buttons a span`)
        .eq(0)
        .width((item.playhead * 100) / item.duration + "%");
    } else {
      loading.start();
      api.continue({
        data: {
          ids: item.id,
        },
        success: function (response) {
          loading.end();
          movies_details.data.continue = mapper.continue(response);
          $(`.${movies_details.id}.${movies_details.id}_buttons a`)
            .eq(0)
            .addClass(
              `${movies_details.data.continue.played > 0 ? "played" : ""}`
            )
            .attr("percent", movies_details.data.continue.played);

          var text = translate.go(
            `home.details.${
              movies_details.data.continue.played > 0 ? "continue" : "play"
            }`,
            {
              season: movies_details.data.continue.season_number,
              episode: movies_details.data.continue.episode_number,
            }
          );
          $(`.${movies_details.id}.${movies_details.id}_buttons a p`)
            .eq(0)
            .text(text);
          $(`.${movies_details.id}.${movies_details.id}_buttons a span`)
            .eq(0)
            .width(movies_details.data.continue.played + "%");
        },
        error: function (error) {
          loading.end();
          console.log(error);
        },
      });
    }

    $(`#${movies.id} .details`).addClass("full");
    $(`body`).addClass(`${movies_details.id}`);

    movies_details.previous = main.state;
    main.state = movies_details.id;
  },

  destroy: function () {
    $(`body`).removeClass(`${movies_details.id}`);
    $(`#${movies.id} .details.full`).removeClass("full");
    $(`.${movies_details.id}`).remove();
    movies_details.data.continue = NaN;
    movies_details.data.this = NaN;

    main.state = movies_details.previous;
    movies_details.callbacks.destroy && movies_details.callbacks.destroy();
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        movies_details.destroy();
        break;
      case tvKey.KEY_UP:
        var buttons = $(`.${movies_details.id}.${movies_details.id}_buttons a`);
        var current = buttons.index(
          $(`.${movies_details.id}.${movies_details.id}_buttons a.selected`)
        );
        buttons.removeClass("selected");
        buttons.eq(current > 0 ? current - 1 : current).addClass("selected");
        break;
      case tvKey.KEY_DOWN:
        var buttons = $(`.${movies_details.id}.${movies_details.id}_buttons a`);
        var current = buttons.index(
          $(`.${movies_details.id}.${movies_details.id}_buttons a.selected`)
        );
        buttons.removeClass("selected");
        buttons
          .eq(current < buttons.length - 1 ? current + 1 : current)
          .addClass("selected");
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var buttons = $(`.${movies_details.id}.${movies_details.id}_buttons a`);
        var current = buttons.index(
          $(`.${movies_details.id}.${movies_details.id}_buttons a.selected`)
        );
        console.log("home details data", movies_details);

        switch (current) {
          case 0:
            video.init(movies_details.data.contentDetails);
            break;
          case 1:
            console.log("add list");
            break;
          case 2:
            home_episodes.init(movies_details.data.contentDetails);
            break;
          case 3:
            console.log("related");
            break;
        }
        break;
    }
  },
};
