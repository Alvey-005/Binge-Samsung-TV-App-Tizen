window.favourites = {
  id: "favourites-screen",
  data: {
    main: NaN,
  },
  position: 0,
  fromCategory: {
    index: NaN,
    state: false,
  },

  init: function () {
    var favourites_element = document.createElement("div");
    favourites_element.id = favourites.id;

    var poster_items = ``;
    favourites.data.main.lists.forEach((element, index) => {
      if (element.items.length > 0) {
        poster_items += `
      <div class="row">
        <div class="row-title">${element.title}</div>
        <div class="row-content ${element.items[0].display}">`;
        element.items.forEach((item) => {
          poster_items += favourites.createItem(item);
        });
        for (var index = 0; index < 9; index++) {
          poster_items += favourites.createEmptyItem(element.items[0].display);
        }
        poster_items += `</div></div>`;
      }
    });

    favourites_element.innerHTML = `
      <div class="content">
        ${
          favourites.fromCategory.state
            ? `<div class="browse-back"><span></span><p>${favourites.fromCategory.title}</p></div>`
            : ""
        }
        <div class="details full">
          <div class="background">
            <img src="${favourites.data.main.lists[0].items[0].background}">
          </div>
          <div class="info">
            <div class="title resize">${favourites.data.main.lists[0].items[0].title}</div>
            <div class="description resize">${favourites.data.main.lists[0].items[0].description}</div>
            <!--
            <div class="buttons">
              <a class="selected">${translate.go("favourites.banner.play")}</a>
              <a>${translate.go("favourites.banner.info")}</a>
            </div>
            -->
          </div>
        </div>
        <div class="rows">
          ${poster_items}
        </div>
        <div class="logo-fixed">
          <img src="server/img/logo-big.svg"/>
        </div>
      </div>`;

    document.body.appendChild(favourites_element);

    var title = $(".details .info .title")[0];
    title.style.fontSize = title.scrollHeight > title.clientHeight ? "3.5vh" : "5vh";

    var description = $(".details .info .description")[0];
    description.style.fontSize = description.scrollHeight > description.clientHeight ? "2vh" : "2.5vh";

    $(`#${favourites.id} .rows`).slick({
      vertical: true,
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 1.5,
      slidesToScroll: 1,
      speed: 0,
      waitForAnimate: false,
    });

    /***
     * if slide to show is changed, change the css file too
     */
    $(`#${favourites.id} .rows .row-content`).not(".episode").slick({
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 9,
      slidesToScroll: 1,
      speed: 0,
      waitForAnimate: false,
    });

    $(`#${favourites.id} .rows .row-content.episode`).slick({
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 4.5,
      slidesToScroll: 1,
      speed: 0,
      waitForAnimate: false,
    });

    $(`#${favourites.id} .rows`)[0].slick.slickGoTo(0);
    $(`#${favourites.id} .rows .row-content`)[0].slick.slickGoTo(0);

    main.state = favourites.id;
    
    var keyDownEvent = new Event('keydown');
    keyDownEvent.keyCode = tvKey.KEY_DOWN;
    favourites.keyDown(keyDownEvent);
  },

  start: function () {
    loading.init();
    service.getFavourites({
      data: {
        page: 1,
        page_size: -1,
      },
      success: function (response) {
        favourites.data.main = {
          lists: [{
            category_id: null,
            category_type: null,
            title: "My list",
            page_id: 1,
            page_size: -1,
            items: [],
          }],
        };
        favourites.data.main.lists[0].items = mapper.mapItems(response.wish_list.products);
        loading.destroy();
        favourites.init();
      },
      error: function (error) {
        loading.destroy();
        console.log(error);
      },
    });
  },

  destroy: function () {
    favourites.position = 0;
    document.body.removeChild(document.getElementById(favourites.id));
  },

  show_details: function () {
    var item =
      favourites.position > 0
        ? favourites.data.main.lists[favourites.position - 1].items[
            $(".row-content")[favourites.position - 1].slick.currentSlide
          ]
        : favourites.data.main.banner;
    $(".details .background img").attr("src", item.background);

    var titleElements = $(".details .info .title");
    if (titleElements.length > 0) {
      var title = titleElements[0];
      title.innerText = item.title;
      title.style.fontSize =
        title.scrollHeight > title.clientHeight ? "3.5vh" : "5vh";
    }

    var descriptionElements = $(".details .info .description");
    if (descriptionElements.length > 0) {
      var description = descriptionElements[0];
      description.innerText = item.description;
      description.style.fontSize =
        description.scrollHeight > description.clientHeight ? "2vh" : "2.5vh";
    }
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        if (!favourites.fromCategory.state) {
          menu.open();
        } else {
          favourites.destroy();
          browse.init(favourites.fromCategory.index);
        }
        break;
      case tvKey.KEY_NEXT:
        break;
      case tvKey.KEY_UP:
        if (favourites.position > 1) {
          $(".row-content").removeClass("selected");
          favourites.position--;
          $(".rows")[0].slick.slickGoTo(favourites.position - 1);
          $(".row-content")[favourites.position - 1].slick.slickGoTo(
            $(".row-content")[favourites.position - 1].slick.getCurrent()
          );
          $(".row-content")[favourites.position - 1].className =
            $(".row-content")[favourites.position - 1].className + " selected";
        } else {
          // $(".details").addClass("full");
          // favourites.position = 0;
        }
        favourites.show_details();
        break;
      case tvKey.KEY_DOWN:
        if (favourites.position > 0) {
          $(".row-content").removeClass("selected");
          favourites.position =
            favourites.position < favourites.data.main.lists.length
              ? favourites.position + 1
              : favourites.position;
          if (favourites.position <= favourites.data.main.lists.length) {
            $(".rows")[0].slick.slickGoTo(favourites.position - 1);
            $(".row-content")[favourites.position - 1].slick.slickGoTo(
              $(".row-content")[favourites.position - 1].slick.getCurrent()
            );
          }
          $(".row-content")[favourites.position - 1].className =
            $(".row-content")[favourites.position - 1].className + " selected";
        } else {
          $(".details.full").removeClass("full");
          var first_row = $(".row-content")[0];
          $(".rows")[0].slick.slickGoTo(0);
          first_row.slick.slickGoTo(first_row.slick.getCurrent());
          first_row.className = first_row.className + " selected";
          favourites.position++;
        }
        favourites.show_details();
        break;
      case tvKey.KEY_LEFT:
        if (favourites.position > 0) {
          if ($(".row-content")[favourites.position - 1].slick.currentSlide === 0) {
            if (!favourites.fromCategory.state) {
              menu.open();
            } else {
              favourites.destroy();
              browse.init(favourites.fromCategory.index);
            }
          } else {
            $(".row-content")[favourites.position - 1].slick.prev();
            favourites.show_details();
          }
        } else {
          var buttons = $(".details .buttons a");
          var current = buttons.index($(`.details .buttons a.selected`));
          if (current === 0) {
            if (!favourites.fromCategory.state) {
              menu.open();
            } else {
              favourites.destroy();
              browse.init(favourites.fromCategory.index);
            }
          } else {
            buttons.removeClass("selected");
            buttons
              .eq(current > 0 ? current - 1 : current)
              .addClass("selected");
          }
        }
        break;
      case tvKey.KEY_RIGHT:
        if (favourites.position > 0) {
          var currentList = favourites.data.main.lists[favourites.position - 1];
          var currentSlide = $(".row-content")[favourites.position - 1];

          if (currentSlide.slick.currentSlide < currentList.items.length - 1) {
            if (favourites.fromCategory.state && currentList.lazy) {
              if (
                currentList.items.length > 15 &&
                currentSlide.slick.currentSlide > currentList.items.length - 10
              ) {
                currentList.lazy = false;
                loading.start();
                mapper.loadCategoryListAsync(
                  `${favourites.data.main.category},${currentList.id}`,
                  currentList.items.length,
                  20,
                  favourites.position - 1,
                  {
                    success: function (response, index) {
                      favourites.data.main.lists[index].lazy =
                        response.items.length === 20;
                      favourites.addToList(index, mapper.mapItems(response.items));
                      loading.end();
                    },
                    error: function (error) {
                      console.log(error);
                      loading.end();
                    },
                  }
                );
              }
            }
            currentSlide.slick.next();
            favourites.show_details();
          }
        } else {
          var buttons = $(".details .buttons a");
          var current = buttons.index($(`.details .buttons a.selected`));
          buttons.removeClass("selected");
          buttons
            .eq(current < buttons.length - 1 ? current + 1 : current)
            .addClass("selected");
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var item =
          favourites.position > 0
            ? favourites.data.main.lists[favourites.position - 1].items[
                $(".row-content")[favourites.position - 1].slick.currentSlide
              ]
            : favourites.data.main.banner;
        // favourites-screen
        service.contentDetails({
          body: {
            id: item.id,
            content_type: item.content_type,
          },
          success: function (data) {
            home_details.init(item, data, favourites);
          },
        });
        break;
    }
  },

  restart: function () {
    favourites.fromCategory.state = false;
    favourites.fromCategory.index = NaN;
    favourites.data.main = null;
    favourites.start();
  },

  addToList: function (index, newItems) {
    var itemsCount = favourites.data.main.lists[index].items.length;
    var currentSlide = $(".row-content")[favourites.position - 1];
    favourites.data.main.lists[index].items =
      favourites.data.main.lists[index].items.concat(newItems);

    // remove empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickRemove(itemsCount + 8 - index);
    }

    // added new items
    newItems.forEach((element) =>
      currentSlide.slick.slickAdd(favourites.createItem(element))
    );

    // added empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickAdd(favourites.createEmptyItem(newItems[0].display));
    }
  },

  createItem: function (item) {
    var playhead = item.playhead
      ? `<div class="progress" style="width: ${
          (item.playhead * 100) / item.duration
        }%" value="${item.duration - item.playhead}m"></div>`
      : "";
    return `
      <div class="item">
        <div class="poster ${item.display}">
          ${
            item.display !== "serie"
              ? '<img src="' + item.background + '">' + playhead
              : '<img src="' + item.poster + '">'
          }
        </div>
      </div>`;
  },

  createEmptyItem: function (type) {
    return `
      <div class="item">
        <div class="poster ${type}">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
        </div>
      </div>`;
  },
};
