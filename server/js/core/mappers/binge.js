window.mapper = {
  loaded: 0,

  populate: function (parentStorage, response, banners, callback) {
    var lists = response.categories;

    parentStorage.data.main = {
      banner: {
        id: banners.id ? banners.id : 6132,
        title: banners.name ? banners.name : "Baba Someone's Following Me",
        description: banners.description ? banners.description : "Baba Someone's Following Me",
        director: banners.director ? banners.director : "Shihab Shaheen",
        background: mapper.preventImageErrorTest(
          function () {
            return banners.banner_landscape_image_path
              ? `${baseURL}/${banners.banner_landscape_image_path}`
              : `${baseURL}/uploads/banner/landscape_images/brpSIi8rY2Zu3s9783VaKhes5jqMQhAB5y.jpg`;
          },
          banners.id ? banners.id : 6132
        ),
        // id: 6132,
        // title: "Baba Someone's Following Me",
        // description: "Baba Someone's Following Me",
        // director: "Shihab Shaheen",
        // background: mapper.preventImageErrorTest(function () {
        //   return `${baseURL}/uploads/banner/landscape_images/brpSIi8rY2Zu3s9783VaKhes5jqMQhAB5y.jpg`;
        // }, 6132),
      },
      lists: lists.map((list) => ({
        category_id: list.category_id,
        category_type: list.category_type,
        title: list.name,
        page_id: parentStorage.id === "movies-screen" ? 1 : list.page_id,
        // page_size: list.page_size,
        page_size: parentStorage.id === "movies-screen" ? 8 : -1,
        items: [],
      })),
    };

    mapper.loaded = 0;
    for (var index = 0; index < lists.length; index++) {
      mapper.load(lists[index], index, {
        success: function (test, on) {
          parentStorage.data.main.lists[on].items = mapper.mapItems(test);
          mapper.loaded++;
          if (mapper.loaded === lists.length) {
            parentStorage.data.main.lists = parentStorage.data.main.lists.filter((e) => e.items.length > 0);
            callback.success();
          }
        },
      });
    }
  },

  load: (item, index, callback) => {
    session.refresh({
      success: async function (storage) {
        var params = {
          category_id: item.category_id,
          category_type: item.category_type,
          page: 1,
          page_size: 10000,
        };

        const products = await requestMethod.post(urls.fetchCategoryProduct, params);
        try {
          if (callback.success) {
            callback.success(products.data.data.products, index);
          }
        } catch (e) {
          callback.error && callback.error(e);
        }
      },
    });
  },

  continue: function (response) {
    var item = response.data[0];
    return {
      id: item.panel.id,
      stream: item.panel.streams_link.substr(item.panel.streams_link.indexOf("/videos/") + 8, 9),
      serie: item.panel.episode_metadata.series_title,
      episode: item.panel.title,
      season_number: item.panel.episode_metadata.season_number || 0,
      episode_number: item.panel.episode_metadata.episode_number || 0,
      description: item.panel.description,
      background: mapper.preventImageErrorTest(function () {
        return item.panel.images.thumbnail[0][4].source;
      }, item.panel.id),
      watched: !item.never_watched,
      playhead: Math.round(item.playhead / 60),
      duration: Math.round(item.panel.episode_metadata.duration_ms / 60000),
      played: (item.playhead * 100) / (item.panel.episode_metadata.duration_ms / 1000),
    };
  },

  search: function (response) {
    return mapper.mapItems(response.data);
  },

  history: function (response) {
    return response.data
      .filter((element) => element.panel)
      .map((element) => ({
        id: element.panel.episode_metadata.series_id,
        playhead: element.playhead ? Math.round(element.playhead / 60) : 0,
        duration: Math.round(
          (element.panel ? element.panel.episode_metadata.duration_ms : element.episode_metadata.duration_ms) / 60000
        ),
        title: element.panel ? element.panel.episode_metadata.series_title : element.title,
        description: element.panel.title,
        background: mapper.preventImageErrorTest(function () {
          return element.panel ? element.panel.images.thumbnail[0][4].source : element.images.thumbnail[0][4].source;
        }, element.panel.episode_metadata.series_id),
      }));
  },

  preventImageErrorTest: function (callback, id) {
    try {
      return callback();
    } catch (error) {
      console.error(`error image #${id}`);
      return `https://dummyimage.com/600x400/f48321/fff.png&text=IMAGE+${id}`;
    }
  },

  mapItems: function (items) {
    try {
      return items.map((item) => {
        var playhead = item.playhead ? Math.round(item.playhead / 60) : undefined;
        item = item.panel ? item.panel : item;
        var id = item.id;
        var display = "serie";
        var title = item.name;
        var description = item.description ? item.description : item.artists ? item.artists : "";

        if (item.type === "episode") {
          id = item.episode_metadata.series_id;
          var duration = Math.round(item.episode_metadata.duration_ms / 60000);
          display = "episode";
          title = item.episode_metadata.series_title;
          var background = item.images.thumbnail[0][4].source;
          var poster = undefined;
        } else if (item.type == "movie") {
          var duration = Math.round(item.movie_metadata.duration_ms / 60000);
          display = "episode";
          var background = item.images.thumbnail[0][4].source;
          var poster = undefined;
        } else if (item.content_type == "tv_channel") {
          var background = `${baseURL}/${item.thumb_path}`;
          var poster = `${baseURL}/${item.logo_path}`;
        } else {
          var background = item.image_landscape.includes('http') ? item.image_landscape : `${baseURL}/${item.image_landscape}`;
          var poster;
          if (item.image_landscape) {
            if (item.image_landscape.includes('http')) {
              poster = item.image_landscape;
            } else {
              poster = `${baseURL}/${item.image_landscape}`;
            }
          } else if (item.image_portrait) {
            if (item.image_portrait.includes('http')) {
              poster = item.image_portrait;
            } else {
              poster = `${baseURL}/${item.image_portrait}`;
            }
          } else if (item.image_square) {
            if (item.image_square.includes('http')) {
              poster = item.image_square;
            } else {
              poster = `${baseURL}/${item.image_square}`;
            }
          } else {
            poster = `server/img/poster.png`;
          }
          // var poster = item.image_landscape
          //   ? `${baseURL}/${item.image_landscape}`
          //   : item.image_portrait
          //     ? `${baseURL}/${item.image_portrait}`
          //     : item.image_square
          //       ? `${baseURL}/${item.image_square}`
          //       : `server/img/poster.png`;
        }

        return {
          id,
          display,
          duration,
          playhead,
          background,
          poster,
          title,
          description,
          type: "series",
          ...item,
        };
      });
    } catch (error) {
      console.error("CRITICAL: error on map element.", error);
      return [];
    }
  },
};
