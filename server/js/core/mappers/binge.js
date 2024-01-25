window.mapper = {
  loaded: 0,
  loadedSubcategories: 0,

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
              ? `${api.api.bingeStageUrl}/${banners.banner_landscape_image_path}`
              : `${api.api.bingeStageUrl}/uploads/banner/landscape_images/brpSIi8rY2Zu3s9783VaKhes5jqMQhAB5y.jpg`;
          },
          banners.id ? banners.id : 6132
        ),
        // id: 6132,
        // title: "Baba Someone's Following Me",
        // description: "Baba Someone's Following Me",
        // director: "Shihab Shaheen",
        // background: mapper.preventImageErrorTest(function () {
        //   return `${api.api.bingeStageUrl}/uploads/banner/landscape_images/brpSIi8rY2Zu3s9783VaKhes5jqMQhAB5y.jpg`;
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
      console.log(`error image #${id}`);
      return `https://dummyimage.com/600x400/f48321/fff.png&text=IMAGE+${id}`;
    }
  },

  listByCategories: function (id, subcategories, callback) {
    parentStorage.data.main = {
      category: subcategories[0].parent_category,
      banner: {
        id: "",
        title: "",
        description: "",
        background: "",
      },
      lists: subcategories.map((subcategory) => ({
        lazy: true,
        id: subcategory.tenant_category,
        title: subcategory.localization.description,
        items: [],
      })),
    };

    mapper.loadedSubcategories = 0;
    for (var index = 0; index < subcategories.length; index++) {
      mapper.loadCategoryListAsync(`${id},${subcategories[index].tenant_category}`, 0, 20, index, {
        success: function (response, listPosition) {
          parentStorage.data.main.lists[listPosition].items = mapper.mapItems(response.items);
          mapper.loadedSubcategories++;
          if (mapper.loadedSubcategories === subcategories.length) {
            parentStorage.data.main.lists = parentStorage.data.main.lists.filter((e) => e.items.length > 0);
            parentStorage.data.main.banner = parentStorage.data.main.lists[listPosition].items[0];
            callback.success();
          }
        },
        error: function (error) {
          console.log("fail on load subcategorie list.", error);
        },
      });
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
        var description = item.description
          ? item.description
          : item.artists
          // "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

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
          var background = `${api.api.bingeStageUrl}/${item.thumb_path}`;
          var poster = `${api.api.bingeStageUrl}/${item.logo_path}`;
        } else {
          var background = `${api.api.bingeStageUrl}/${item.image_landscape}`;
          // var poster = item.image_portrait
          //   ? `${api.api.bingeStageUrl}/${item.image_portrait}`
          //   : item.image_square
          //     ? `${api.api.bingeStageUrl}/${item.image_square}`
          //     : `https://dummyimage.com/600x400/f48321/fff.png&text=IMAGE+${item.id}`;
          var poster = item.image_landscape
            ? `${api.api.bingeStageUrl}/${item.image_landscape}`
            : `https://dummyimage.com/600x400/f48321/fff.png&text=IMAGE+${item.id}`;
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
      console.log("CRITICAL: error on map element.", error);
      return [];
    }
  },

  loadCategoryListAsync: function (categories, offset, size, index, callback) {
    session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        return fetch(`${api.api.url}/content/v1/browse?categories=${categories}&n=${size}&start=${offset}`, {
          headers: headers,
        })
          .then((response) => response.json())
          .then((json) => callback.success(json, index))
          .catch((error) => {
            callback.error(error);
          });
      },
    });
  },
};
