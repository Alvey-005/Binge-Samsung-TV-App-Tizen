window.main = {
  urls: {
    src: "server/img",
  },
  events: {},
  mac: null,
  token: null,
  state: null,

  /* on init app */
  init: function () {
    loading.init();
    session.init();
    firebaseConfig.init();
    // translate.init();
    // main.events.login();
  },

  events: {
    logout: function () {
      if (document.getElementById(menu.id) != null) menu.destroy();

      var current_id = main.state.replace("-screen", "");
      if (window[current_id] === undefined) {
        console.log("Failed to find ID of current screen");
        menu.init();
        return;
      }
      if (document.getElementById(main.state) != null) window[current_id].destroy();
      session.clear();
      login.init();
    },

    login: function () {
      session.valid({
        success: function () {
          main.events.home();
        },
        error: function (error) {
          console.log("session invalid login initiated");
          loading.destroy();
          login.init();
        },
      });
    },

    home: function () {
      api.allCategories({
        data: {
          page: "web-home-vod",
        },
        success: function (response) {
          api.banners({
            success: function (res) {
              mapper.populate(window.home, response, res.data.banners, {
                success: function () {
                  loading.destroy();
                  home.init();
                  !menu.initialized && menu.init();
                },
              });
            },
            error: function (error) {
              console.log("banner fetch error", error);
            },
          });
        },
        error: function (error) {
          console.log(error);
          loading.destroy();
          login.init();
        },
      });
    },

    movies: function () {
      api.allCategories({
        data: {
          page: "web-movies",
        },
        success: function (response) {
          api.movieBanners({
            success: function (res) {
              mapper.populate(window.movies, response, res.data.banners, {
                success: function () {
                  loading.destroy();
                  movies.init();
                  !menu.initialized && menu.init();
                },
              });
            },
            error: function (error) {
              console.log("banner fetch error", error);
            },
          });
        },
        error: function (error) {
          console.log(error);
          loading.destroy();
          login.init();
        },
      });
    },
  },

  /* on exit app */
  destroy: function () {
    player.destroy();
  },

  log: function (text) {
    $("#console").html($("#console").html() + `${text}<br/>`);
    $("#console").scrollTop(3000000);
  },

  /* on key press */
  keyDown: function (event) {
    //('#console').html($('#console').html() + `code: ${event.keyCode}<br/>`);
    //$('#console').scrollTop(3000000);
    if (loading.active) {
      if (event.keyCode == tvKey.KEY_BACK || event.keyCode == 27) {
        loading.end();
      }
    } else {
      if (event.keyCode == tvKey.KEY_EXIT && main.state != exit.id) {
        exit.init();
      } else {
        switch (main.state) {
          case changelog.id:
            changelog.keyDown(event);
            break;
          case loading.id:
            loading.keyDown(event);
            break;
          case exit.id:
            exit.keyDown(event);
            break;
          case premiumNeedDialog.id:
            premiumNeedDialog.keyDown(event);
            break;
          case streamLimitCrossed.id:
            streamLimitCrossed.keyDown(event);
            break;
          case login.id:
            login.keyDown(event);
            break;
          case otp.id:
            otp.keyDown(event);
            break;
          case keyboard.id:
            keyboard.keyDown(event);
            break;
          case menu.id:
            menu.keyDown(event);
            break;
          case search.id:
            search.keyDown(event);
            break;
          case home.id:
            home.keyDown(event);
            break;
          case movies.id:
            movies.keyDown(event);
            break;
          case sports.id:
            sports.keyDown(event);
            break;
          case series.id:
            series.keyDown(event);
            break;
          case favourites.id:
            favourites.keyDown(event);
            break;
          case home_details.id:
            home_details.keyDown(event);
            break;
          case home_episodes.id:
            home_episodes.keyDown(event);
            break;
          case video.id:
            video.keyDown(event);
            break;
          case settings.id:
            settings.keyDown(event);
            break;
          default:
            console.log("keyboard action screen not defined.");
            break;
        }
      }
    }
  },
};
