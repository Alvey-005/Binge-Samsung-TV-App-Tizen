window.main = {
  urls: {
    src: "server/img",
  },
  events: {},
  mac: null,
  token: null,
  state: null,

  /* on init app */
  init: async function () {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      // this.open.apply(this, arguments);
      // Save method and URL for later use in onreadystatechange
      this._method = method;
      this._url = url;

      return originalOpen.apply(this, arguments);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
      // Check if the URL includes 'manifest.m3u8'
      if (this._url && (this._url.includes("manifest") || this._url.includes("playlist"))) {
        this.setRequestHeader("Authorization", `Bearer ${window.session.storage.jwtToken}`);
        this.setRequestHeader("Device-Type", "tizen");
        this.setRequestHeader("os-Type", "tizen");
      }

      return originalSend.apply(this, arguments);
    };

    loading.init();
    await session.init();
    await checkCountry();
    await firebaseConfig.init();
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
      if (document.getElementById(main.state) != null) {
        window[current_id].destroy();
      }
      session.clear();
      window.location.reload();
    },

    login: function () {
      session.valid({
        success: function () {
          main.events.home();
        },
        error: function (error) {
          console.error("session invalid login initiated", error);
          loading.destroy();
          login.init();
        },
      });
    },

    home: function () {
      api.allCategories({
        data: {
          page: "tizen-home-vod",
        },
        success: function (response) {
          api.banners({
            success: function (res) {
              if (response.categories.length > 0) {
                mapper.populate(window.home, response, res.data.banners, {
                  success: function () {
                    loading.destroy();
                    home.init();
                    !menu.initialized && menu.init();
                  },
                });
              } else {
                loading.destroy();
                home.init();
                !menu.initialized && menu.init();
              }
            },
            error: function (error) {
              console.error("banner fetch error", error);
            },
          });
        },
        error: function (error) {
          console.error(error);
          loading.destroy();
          login.init();
        },
      });
    },

    movies: function () {
      api.allCategories({
        data: {
          page: "tizen-movies",
        },
        success: function (response) {
          api.movieBanners({
            success: function (res) {
              if (response.categories.length > 0) {
                mapper.populate(window.movies, response, res.data.banners, {
                  success: function () {
                    loading.destroy();
                    movies.init();
                    !menu.initialized && menu.init();
                  },
                });
              } else {
                loading.destroy();
                movies.init();
                !menu.initialized && menu.init();
              }
            },
            error: function (error) {
              console.error("banner fetch error", error);
            },
          });
        },
        error: function (error) {
          console.error(error);
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
          case returnHome.id:
            returnHome.keyDown(event);
            break;
          case premiumNeedDialog.id:
            premiumNeedDialog.keyDown(event);
            break;
          case accountDeleteDialog.id:
            accountDeleteDialog.keyDown(event);
            break;
          case logoutModal.id:
            logoutModal.keyDown(event);
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
          case hot.id:
            hot.keyDown(event);
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
          case subscription.id:
            subscription.keyDown(event);
            break;
          case paymentMethod.id:
            paymentMethod.keyDown(event);
            break;
          case connectToTv.id:
            connectToTv.keyDown(event);
            break;
          default:
            console.log("keyboard action screen not defined.");
            break;
        }
      }
    }
  },
};
