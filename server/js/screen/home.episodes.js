window.home_episodes = {
  id: "home_episodes-screen",
  previous: NaN,
  appScreen: NaN,
  data: {
    seasons: [
      {
        number: "1",
        title: "Season",
      },
    ],
    episodes: NaN,
  },

  init: function (item, screen) {
    home_episodes.data.episodes = item.related_product;
    home_episodes.appScreen = screen;
    var episode_contents = document.createElement("div");
    episode_contents.className = `${home_episodes.id} ${home_episodes.id}_content`;

    episode_contents.innerHTML = `
    <div class="option seasons">
      <div class="title resize">${item.name}</div>
      <div class="seasons-list">
        <div id="seasons-list-offset"></div>
      </div>
    </div>
    <div class="option episodes active">
      <div class="title"></div>
      <div class="episodes-list"></div>
    </div>
    `;
    $(`#${screen.id}`).append(episode_contents);
    var seasons_html = "";
    home_episodes.data.seasons.forEach((season, index) => {
      seasons_html += `
          <div class="season${index === 0 ? " selected active" : ""}">${season.number}. ${season.title}</div>`;
    });
    $(".seasons #seasons-list-offset").eq(0).html(seasons_html);
    home_episodes.load(home_episodes.data.seasons[0]);

    $(`body`).addClass(`${home_episodes.id}`);

    home_episodes.previous = main.state;
    main.state = home_episodes.id;
  },

  load: function (season) {
    $(".episodes .title")[0].innerText = `${season.number}. ${season.title}`;
    $(".episodes .episodes-list")[0].slick && $(".episodes .episodes-list")[0].slick.destroy();
    $(".episodes .episodes-list")[0].innerHTML = "";

    var episodes_html = "";
    home_episodes.data.episodes.forEach((episode, index) => {
      episodes_html += `
      <div class="episode" onclick="home_episodes.episodeClickHandler('${index}')">
        <div class="episode-image">
          <img src="${api.api.imageStageURl}/${episode.thumb_path || episode.image}">
        </div>
        <div class="episode-details">
          <div class="episode-title">${index + 1}. ${episode.name}</div>
          <div class="episode-description">${episode.description}</div>
        </div>
      </div>`;
    });
    for (var index = 0; index < 4; index++) {
      episodes_html += `
      <div class="episode">
        <div class="episode-image">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
        </div>
      </div>`;
    }
    $(".episodes .episodes-list").eq(0).html(episodes_html);

    $(".episodes .episodes-list").slick({
      vertical: true,
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 5,
      slidesToScroll: 3,
      speed: 0,
      waitForAnimate: false,
    });

    $(".episodes .episodes-list")[0].slick.slickGoTo(0);

    $('.seasons').on('click', '.selected', function(event) {
      console.log('this is selected');
    });

    // $('.episodes').on('click', function(event) {
    //   const target = home_episodes.data.episodes[$(".episodes .episodes-list")[0].slick.currentSlide];
    //   console.log('this is selected episode', target);
    // });
  },

  episodeClickHandler: function(index) {
    var options = $(`.${home_episodes.id}.${home_episodes.id}_content .option`);
    var current = options.index($(`.${home_episodes.id}.${home_episodes.id}_content .option.active`));
    $(".episodes .episodes-list")[0].slick.slickGoTo(2);
    options.removeClass("active");
    

    var options1 = $(`.${home_episodes.id}.${home_episodes.id}_content .option`);
    var current1 = options.index($(`.${home_episodes.id}.${home_episodes.id}_content .option.active`));
    options.addClass("active");
    var item = home_episodes.data.episodes[index];
    console.log('Its from the click function', item, current, current1);
    // home_episodes.data.episodes[current-1].removeClass('active');

    // --------------------------------------------------

    // var options = $(`.${home_episodes.id}.${home_episodes.id}_content .option`);
    // var current = options.index($(`.${home_episodes.id}.${home_episodes.id}_content .option.active`));
    // options.removeClass("active");
    // console.log('before', $(".episodes .episodes-list")[0].slick.currentSlide)
    // $(".episodes .episodes-list")[0].slick.slickGoTo(index);
    // console.log('hi episode', home_episodes.data.episodes[current - 1]);
    // console.log('hi episode 1', home_episodes.data.episodes[index]);
   // console.log('after', $(".episodes .episodes-list")[0].slick.currentSlide)
    // home_episodes.data.episodes[index].className = home_episodes.data.episodes[index].className + 'option' + 'active';
    // options.eq(current < options.length - 1 ? current + 1 : current).addClass("active");
  },

  view: function (episode) {
    return episode.playhead !== 0
      ? `<div class="progress" style="width: ${(episode.playhead * 100) / episode.duration}%" value="${
          episode.duration === episode.playhead
            ? translate.go("home.episodes.watched")
            : episode.duration - episode.playhead + "m"
        }"></div>`
      : "";
  },

  premium: function (episode) {
    return episode.free_or_premium === 2 ? `<i class="fa-solid fa-crown premium"></i>` : "";
  },

  destroy: function () {
    $(`body`).removeClass(`${home_episodes.id}`);
    setTimeout(() => {
      $(`body`).removeClass(`${home_episodes.id}`);
      $(`.${home_episodes.id}`).remove();
      main.state = home_episodes.previous;
    }, 0 /*400*/);
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        home_episodes.destroy();
        break;
      case tvKey.KEY_LEFT:
        var options = $(`.${home_episodes.id}.${home_episodes.id}_content .option`);
        var current = options.index($(`.${home_episodes.id}.${home_episodes.id}_content .option.active`));
        options.removeClass("active");
        options.eq(current > 0 ? current - 1 : current).addClass("active");
        break;
      case tvKey.KEY_RIGHT:
        var options = $(`.${home_episodes.id}.${home_episodes.id}_content .option`);
        var current = options.index($(`.${home_episodes.id}.${home_episodes.id}_content .option.active`));
        options.removeClass("active");
        options.eq(current < options.length - 1 ? current + 1 : current).addClass("active");

        options = $(`.seasons-list .season`);
        current = options.index($(`.seasons-list .season.active`));
        $(`.seasons-list .season`).removeClass("selected");

        var marginTop = 0;
        if (options.length > 8 && current > 4) {
          if (current > options.length - 4) {
            marginTop = -((options.length - 8) * 72);
          } else {
            marginTop = -((current - 4) * 72);
          }
        }

        options.eq(current).addClass("selected");
        document.getElementById("seasons-list-offset").style.marginTop = `${marginTop}px`;
        break;
      case tvKey.KEY_UP:
        var options = $(`.${home_episodes.id}.${home_episodes.id}_content .option`);
        var current = options.index($(`.${home_episodes.id}.${home_episodes.id}_content .option.active`));
        if (current > 0) {
          $(".episodes .episodes-list")[0].slick.prev();
        } else {
          options = $(`.seasons-list .season`);
          current = options.index($(`.seasons-list .season.selected`));

          options.removeClass("selected");
          var newCurrent = current > 0 ? current - 1 : current;
          options.eq(newCurrent).addClass("selected");

          var marginTop = 0;
          if (options.length > 8 && newCurrent > 4) {
            if (newCurrent > options.length - 4) {
              marginTop = -((options.length - 8) * 72);
            } else {
              marginTop = -((newCurrent - 4) * 72);
            }
          }

          document.getElementById("seasons-list-offset").style.marginTop = `${marginTop}px`;
        }
        break;
      case tvKey.KEY_DOWN:
        console.log('hii hii key down');
        var options = $(`.${home_episodes.id}.${home_episodes.id}_content .option`);
        var current = options.index($(`.${home_episodes.id}.${home_episodes.id}_content .option.active`));
        if (current > 0) {
          $(".episodes .episodes-list")[0].slick.next();
        } else {
          options = $(`.seasons-list .season`);
          current = options.index($(`.seasons-list .season.selected`));

          options.removeClass("selected");
          var newCurrent = current < options.length - 1 ? current + 1 : current;
          options.eq(newCurrent).addClass("selected");

          var marginTop = 0;
          if (options.length > 8 && newCurrent > 4) {
            if (newCurrent > options.length - 4) {
              marginTop = -((options.length - 8) * 72);
            } else {
              marginTop = -((newCurrent - 4) * 72);
            }
          }

          document.getElementById("seasons-list-offset").style.marginTop = `${marginTop}px`;
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var options = $(`.${home_episodes.id}.${home_episodes.id}_content .option`);
        var current = options.index($(`.${home_episodes.id}.${home_episodes.id}_content .option.active`));
        if (current > 0) {
          const target = home_episodes.data.episodes[$(".episodes .episodes-list")[0].slick.currentSlide];
          api.contentDetails({
            body: {
              id: target.id,
              content_type: target.content_type,
            },
            success: function (response) {
              video.init(response, home_episodes.appScreen);
            },
          });
        } else {
          options = $(`.seasons-list .season`);
          current = options.index($(`.seasons-list .season.selected`));

          options.removeClass("active");
          options.eq(current).addClass("active");
          home_episodes.load(home_episodes.data.seasons[current]);
        }
        break;
    }
  },
};
