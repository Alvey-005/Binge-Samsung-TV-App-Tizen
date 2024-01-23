window.movies = {
  id: "movies-screen",
  data: {
    main: NaN,
  },
  position: 0,
  fromCategory: {
    index: NaN,
    state: false,
  },

  init: function () {
    var movies_element = document.createElement("div");
    movies_element.id = movies.id;

    var poster_items = ``;
    movies.data.main.lists.forEach((element, index) => {
      if (element.items.length > 0) {
        poster_items += `
        <div class="row">
          <div class="row-title">${element.title}</div>
          <div class="row-content ${element.items[0].display}">`;
        element.items.forEach((item) => {
          poster_items += movies.createItem(item);
        });
        for (var index = 0; index < 9; index++) {
          poster_items += movies.createEmptyItem(element.items[0].display);
        }
        poster_items += `</div></div>`;
      }
    });

    movies_element.innerHTML = `
      <div class="content">
        ${
          movies.fromCategory.state
            ? `<div class="browse-back"><span></span><p>${movies.fromCategory.title}</p></div>`
            : ""
        }
        <div class="details full">
          <div class="background">
            <img src="${movies.data.main.banner.background}">
          </div>
          <div class="info">
            <div class="title resize">${movies.data.main.banner.title}</div>
            <div class="description resize">${movies.data.main.banner.description}</div>
            <!--
            <div class="buttons">
              <a class="selected">${translate.go("movies.banner.play")}</a>
              <a>${translate.go("movies.banner.info")}</a>
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

    document.body.appendChild(movies_element);

    var title = $(".details .info .title")[0];
    title.style.fontSize = title.scrollHeight > title.clientHeight ? "3.5vh" : "5vh";

    var description = $(".details .info .description")[0];
    description.style.fontSize = description.scrollHeight > description.clientHeight ? "2vh" : "2.5vh";

    $(`#${movies.id} .rows`).slick({
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
    $(`#${movies.id} .rows .row-content`).not(".episode").slick({
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 9,
      slidesToScroll: 1,
      speed: 0,
      waitForAnimate: false,
    });

    $(`#${movies.id} .rows .row-content.episode`).slick({
      dots: false,
      arrows: false,
      infinite: false,
      slidesToShow: 4.5,
      slidesToScroll: 1,
      speed: 0,
      waitForAnimate: false,
    });

    $(`#${movies.id} .rows`)[0].slick.slickGoTo(0);
    $(`#${movies.id} .rows .row-content`)[0].slick.slickGoTo(0);

    main.state = movies.id;

    var keyDownEvent = new Event("keydown");
    keyDownEvent.keyCode = tvKey.KEY_DOWN;
    movies.keyDown(keyDownEvent);
  },

  destroy: function () {
    movies.position = 0;
    document.body.removeChild(document.getElementById(movies.id));
  },

  show_details: function () {
    var item =
      movies.position > 0
        ? movies.data.main.lists[movies.position - 1].items[$(".row-content")[movies.position - 1].slick.currentSlide]
        : movies.data.main.banner;
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
      description.innerText = item.description;
      description.style.fontSize = description.scrollHeight > description.clientHeight ? "2vh" : "2.5vh";
    }
  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        if (!movies.fromCategory.state) {
          menu.open();
        } else {
          movies.destroy();
        }
        break;
      case tvKey.KEY_NEXT:
        break;
      case tvKey.KEY_UP:
        if (movies.position > 1) {
          $(".row-content").removeClass("selected");
          movies.position--;
          $(".rows")[0].slick.slickGoTo(movies.position - 1);
          $(".row-content")[movies.position - 1].slick.slickGoTo(
            $(".row-content")[movies.position - 1].slick.getCurrent()
          );
          $(".row-content")[movies.position - 1].className =
            $(".row-content")[movies.position - 1].className + " selected";
        } else {
          // $(".details").addClass("full");
          // movies.position = 0;
        }
        movies.show_details();
        break;
      case tvKey.KEY_DOWN:
        if (movies.position > 0) {
          $(".row-content").removeClass("selected");
          movies.position = movies.position < movies.data.main.lists.length ? movies.position + 1 : movies.position;
          if (movies.position <= movies.data.main.lists.length) {
            $(".rows")[0].slick.slickGoTo(movies.position - 1);
            $(".row-content")[movies.position - 1].slick.slickGoTo(
              $(".row-content")[movies.position - 1].slick.getCurrent()
            );
          }
          $(".row-content")[movies.position - 1].className =
            $(".row-content")[movies.position - 1].className + " selected";
        } else {
          $(".details.full").removeClass("full");
          var first_row = $(".row-content")[0];
          $(".rows")[0].slick.slickGoTo(0);
          first_row.slick.slickGoTo(first_row.slick.getCurrent());
          first_row.className = first_row.className + " selected";
          movies.position++;
        }
        movies.show_details();
        break;
      case tvKey.KEY_LEFT:
        if (movies.position > 0) {
          if ($(".row-content")[movies.position - 1].slick.currentSlide === 0) {
            if (!movies.fromCategory.state) {
              menu.open();
            } else {
              movies.destroy();
            }
          } else {
            $(".row-content")[movies.position - 1].slick.prev();
            movies.show_details();
          }
        } else {
          var buttons = $(".details .buttons a");
          var current = buttons.index($(`.details .buttons a.selected`));
          if (current === 0) {
            if (!movies.fromCategory.state) {
              menu.open();
            } else {
              movies.destroy();
            }
          } else {
            buttons.removeClass("selected");
            buttons.eq(current > 0 ? current - 1 : current).addClass("selected");
          }
        }
        break;
      case tvKey.KEY_RIGHT:
        if (movies.position > 0) {
          var currentList = movies.data.main.lists[movies.position - 1];
          var currentSlide = $(".row-content")[movies.position - 1];

          if (currentSlide.slick.currentSlide < currentList.items.length - 1) {
            if (movies.fromCategory.state && currentList.lazy) {
              if (currentList.items.length > 15 && currentSlide.slick.currentSlide > currentList.items.length - 10) {
                currentList.lazy = false;
                loading.start();
                mapper.loadCategoryListAsync(
                  `${movies.data.main.category},${currentList.id}`,
                  currentList.items.length,
                  20,
                  movies.position - 1,
                  {
                    success: function (response, index) {
                      movies.data.main.lists[index].lazy = response.items.length === 20;
                      movies.addToList(index, mapper.mapItems(response.items));
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
            movies.show_details();
          }
        } else {
          var buttons = $(".details .buttons a");
          var current = buttons.index($(`.details .buttons a.selected`));
          buttons.removeClass("selected");
          buttons.eq(current < buttons.length - 1 ? current + 1 : current).addClass("selected");
        }
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        var item =
          movies.position > 0
            ? movies.data.main.lists[movies.position - 1].items[
                $(".row-content")[movies.position - 1].slick.currentSlide
              ]
            : movies.data.main.banner;
        // movies-screen
        api.contentDetails({
          body: {
            id: item.id,
            content_type: item.content_type,
          },
          success: function (data) {
            home_details.init(item, data, movies);
          },
        });
        break;
    }
  },

  restart: function () {
    movies.fromCategory.state = false;
    movies.fromCategory.index = NaN;
    loading.init();
    movies.data.main = null;
    main.events.movies();
  },

  addToList: function (index, newItems) {
    var itemsCount = movies.data.main.lists[index].items.length;
    var currentSlide = $(".row-content")[movies.position - 1];
    movies.data.main.lists[index].items = movies.data.main.lists[index].items.concat(newItems);

    // remove empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickRemove(itemsCount + 8 - index);
    }

    // added new items
    newItems.forEach((element) => currentSlide.slick.slickAdd(movies.createItem(element)));

    // added empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickAdd(movies.createEmptyItem(newItems[0].display));
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
