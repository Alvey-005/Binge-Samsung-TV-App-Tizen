window.hot = {
  id: "hot-screen",
  available: false,
  data: {
    main: NaN,
  },
  position: 0,
  fromCategory: {
    index: NaN,
    state: false,
  },

  init: function () {
    var hot_element = document.createElement("div");
    hot_element.id = hot.id;

    var poster_items = ``;
    if (hot.available) {
      hot.data.main.lists.forEach((element, index) => {
        if (element.items.length > 0) {
          poster_items += `
          <div class="row">
            <div class="row-title">${element.title}</div>
            <div class="row-content ${element.items[0].display}">`;
          element.items.forEach((item) => {
            poster_items += hot.createItem(item);
          });
          for (var index = 0; index < 9; index++) {
            poster_items += hot.createEmptyItem(element.items[0].display);
          }
          poster_items += `</div></div>`;
        }
      });
      hot_element.innerHTML = `
            <div class="content">
              ${
                hot.fromCategory.state
                  ? `<div class="browse-back"><span></span><p>${hot.fromCategory.title}</p></div>`
                  : ""
              }
              <div class="details full">
                <div class="background">
                  <img src="${hot.data.main.lists[0].items[0].background}">
                </div>
                <div class="info">
                  <div class="title resize">${hot.data.main.lists[0].items[0].title}</div>
                  <div class="description resize">${hot.data.main.lists[0].items[0].description}</div>
                  <!--
                  <div class="buttons">
                    <a class="selected">${translate.go("hot.banner.play")}</a>
                    <a>${translate.go("hot.banner.info")}</a>
                  </div>
                  -->
                </div>
              </div>
              <div class="rows">
                ${poster_items}
              </div>
              <!--
              <div class="logo-fixed">
                <img src="server/img/logo-big.svg"/>
              </div>
              -->
          </div>`;

      document.body.appendChild(hot_element);

      var title = $(".details .info .title")[0];
      title.style.fontSize = title.scrollHeight > title.clientHeight ? "3.5vh" : "5vh";

      var description = $(".details .info .description")[0];
      description.style.fontSize = description.scrollHeight > description.clientHeight ? "2vh" : "2.5vh";

      $(`#${hot.id} .rows`).slick({
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
      $(`#${hot.id} .rows .row-content`).not(".episode").slick({
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });

      $(`#${hot.id} .rows .row-content.episode`).slick({
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 4.5,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });

      $(`#${hot.id} .rows`)[0].slick.slickGoTo(0);
      $(`#${hot.id} .rows .row-content`)[0].slick.slickGoTo(0);

      main.state = hot.id;

      var keyDownEvent = new Event("keydown");
      keyDownEvent.keyCode = tvKey.KEY_DOWN;
      hot.keyDown(keyDownEvent);
    } else {
      hot_element.innerHTML = `
        <div class="content">
          <div style="height: 100vh; display: flex; justify-content: center; align-items: center">
              <div class="title resize" style="color: red;font-size: 4vh;font-weight: bold">No Data Available</div>
          </div>
        </div>`;

      document.body.appendChild(hot_element);
      main.state = hot.id;
    }
  },

  start: function () {
    loading.init();
    api.getHot({
      data: {
        category_id: 449,
        category_type: "vod",
        category_slug: "hot-new",
        page: 1,
        page_size: -1,
      },
      success: function (response) {
        hot.data.main = {
          lists: [
            {
              category_id: null,
              category_type: null,
              title: "Hot & New",
              page_id: 1,
              page_size: -1,
              items: [],
            },
          ],
        };
        if (response.data.total > 0) {
          hot.available = true;
          hot.data.main.lists[0].items = mapper.mapItems(response.data.products);
        } else {
          hot.available = false;
        }
        loading.destroy();
        hot.init();
      },
      error: function (error) {
        loading.destroy();
        console.error(error);
      },
    });
  },

  destroy: function () {
    hot.position = 0;
    if (document.getElementById(hot.id)) {
      document.body.removeChild(document.getElementById(hot.id));
    }
  },

  show_details: function () {
    var item =
      hot.position > 0
        ? hot.data.main.lists[hot.position - 1].items[$(".row-content")[hot.position - 1].slick.currentSlide]
        : hot.data.main.banner;
    $(".details .background img").attr("src", item.background);

    var titleElements = $(".details .info .title");
    if (titleElements.length > 0) {
      var title = titleElements[0];
      title.innerText = item.title;
      title.style.fontSize = title.scrollHeight > title.clientHeight ? "3.5vh" : "5vh";
    }

    var descriptionElements = $(".details .info .description");
    if (descriptionElements.length > 0) {
      var description = descriptionElements[0];
      description.innerHTML = item.description;
      description.style.fontSize = description.scrollHeight > description.clientHeight ? "2vh" : "2.5vh";
    }
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        if (!hot.fromCategory.state) {
          menu.open();
        } else {
          hot.destroy();
        }
        break;
      case tvKey.KEY_NEXT:
        break;
      case tvKey.KEY_UP:
        if (hot.available) {
          if (hot.position > 1) {
            $(".row-content").removeClass("selected");
            hot.position--;
            $(".rows")[0].slick.slickGoTo(hot.position - 1);
            $(".row-content")[hot.position - 1].slick.slickGoTo($(".row-content")[hot.position - 1].slick.getCurrent());
            $(".row-content")[hot.position - 1].className = $(".row-content")[hot.position - 1].className + " selected";
          } else {
            // $(".details").addClass("full");
            // hot.position = 0;
          }
          hot.show_details();
        }
        break;
      case tvKey.KEY_DOWN:
        if (hot.available) {
          if (hot.position > 0) {
            $(".row-content").removeClass("selected");
            hot.position = hot.position < hot.data.main.lists.length ? hot.position + 1 : hot.position;
            if (hot.position <= hot.data.main.lists.length) {
              $(".rows")[0].slick.slickGoTo(hot.position - 1);
              $(".row-content")[hot.position - 1].slick.slickGoTo(
                $(".row-content")[hot.position - 1].slick.getCurrent()
              );
            }
            $(".row-content")[hot.position - 1].className = $(".row-content")[hot.position - 1].className + " selected";
          } else {
            $(".details.full").removeClass("full");
            var first_row = $(".row-content")[0];
            $(".rows")[0].slick.slickGoTo(0);
            first_row.slick.slickGoTo(first_row.slick.getCurrent());
            first_row.className = first_row.className + " selected";
            hot.position++;
          }
          hot.show_details();
        }
        break;
      case tvKey.KEY_LEFT:
        if (hot.available) {
          if (hot.position > 0) {
            if ($(".row-content")[hot.position - 1].slick.currentSlide === 0) {
              if (!hot.fromCategory.state) {
                menu.open();
              } else {
                hot.destroy();
              }
            } else {
              $(".row-content")[hot.position - 1].slick.prev();
              hot.show_details();
            }
          } else {
            var buttons = $(".details .buttons a");
            var current = buttons.index($(`.details .buttons a.selected`));
            if (current === 0) {
              if (!hot.fromCategory.state) {
                menu.open();
              } else {
                hot.destroy();
              }
            } else {
              buttons.removeClass("selected");
              buttons.eq(current > 0 ? current - 1 : current).addClass("selected");
            }
          }
        } else {
          menu.open();
        }
        break;
      case tvKey.KEY_RIGHT:
        if (hot.available) {
          if (hot.position > 0) {
            var currentList = hot.data.main.lists[hot.position - 1];
            var currentSlide = $(".row-content")[hot.position - 1];

            if (currentSlide.slick.currentSlide < currentList.items.length - 1) {
              if (hot.fromCategory.state && currentList.lazy) {
                if (currentList.items.length > 15 && currentSlide.slick.currentSlide > currentList.items.length - 10) {
                  currentList.lazy = false;
                }
              }
              currentSlide.slick.next();
              hot.show_details();
            }
          } else {
            var buttons = $(".details .buttons a");
            var current = buttons.index($(`.details .buttons a.selected`));
            buttons.removeClass("selected");
            buttons.eq(current < buttons.length - 1 ? current + 1 : current).addClass("selected");
          }
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        loading.start();
        var item =
          hot.position > 0
            ? hot.data.main.lists[hot.position - 1].items[$(".row-content")[hot.position - 1].slick.currentSlide]
            : hot.data.main.banner;
        // hot-screen
        api.contentDetails({
          body: {
            id: item.id,
            content_type: item.content_type,
          },
          success: function (data) {
            home_details.init(item, data, hot);
          },
        });
        break;
    }
  },

  restart: function () {
    hot.fromCategory.state = false;
    hot.fromCategory.index = NaN;
    hot.data.main = null;
    hot.start();
  },

  addToList: function (index, newItems) {
    var itemsCount = hot.data.main.lists[index].items.length;
    var currentSlide = $(".row-content")[hot.position - 1];
    hot.data.main.lists[index].items = hot.data.main.lists[index].items.concat(newItems);

    // remove empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickRemove(itemsCount + 8 - index);
    }

    // added new items
    newItems.forEach((element) => currentSlide.slick.slickAdd(hot.createItem(element)));

    // added empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickAdd(hot.createEmptyItem(newItems[0].display));
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
