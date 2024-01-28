window.series = {
  id: "series-screen",
  data: {
    main: NaN,
  },
  position: 0,
  fromCategory: {
    index: NaN,
    state: false,
  },

  init: function () {
    var series_element = document.createElement("div");
    series_element.id = series.id;

    var poster_items = ``;
    if (series.data.main) {
      series.data.main.lists.forEach((element, index) => {
        if (element.items.length > 0) {
          poster_items += `
              <div class="row">
                <div class="row-title">${element.title}</div>
                <div class="row-content ${element.items[0].display}">`;
          element.items.forEach((item, idx) => {
            poster_items += series.createItem(item, idx, index);
          });
          for (var index = 0; index < 9; index++) {
            poster_items += series.createEmptyItem(element.items[0].display);
          }
          poster_items += `</div></div>`;
        }
      });

      series_element.innerHTML = `
            <div class="content">
              ${
                series.fromCategory.state
                  ? `<div class="browse-back"><span></span><p>${series.fromCategory.title}</p></div>`
                  : ""
              }
              <div class="details full">
                <div class="background">
                  <img src="${series.data.main.banner.background}">
                </div>
                <div class="info">
                  <div class="title resize">${series.data.main.banner.title}</div>
                  <div class="description resize">${series.data.main.banner.description}</div>
                  <!--
                  <div class="buttons">
                    <a class="selected">${translate.go("series.banner.play")}</a>
                    <a>${translate.go("series.banner.info")}</a>
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

      document.body.appendChild(series_element);

      var title = $(".details .info .title")[0];
      title.style.fontSize = title.scrollHeight > title.clientHeight ? "3.5vh" : "5vh";

      var description = $(".details .info .description")[0];
      description.style.fontSize = description.scrollHeight > description.clientHeight ? "2vh" : "2.5vh";

      $(`#${series.id} .rows`).slick({
        vertical: true,
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: series.data.main.lists.length,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });

      $('.rows').on('click', '.selected', function(event) {
        var item =
          series.position > 0
            ? series.data.main.lists[series.position - 1].items[
                $(".row-content")[series.position - 1].slick.currentSlide
              ]
            : series.data.main.banner;
            
        api.contentDetails({
          body: {
            id: item.id,
            content_type: item.content_type,
          },
          success: function (data) {
            home_details.init(item, data, series);
          },
        });
        // if ($(this).hasClass('slick-current')) {
        //     // Access element data or structure to retrieve colIndex and rowIndex
        //     // var colIndex = /* ... */;
        //     // var rowIndex = /* ... */;
        //     console.log('slick slick');
        //     home.click(event, colIndex, rowIndex);
        // }
      });
  
      /***
       * if slide to show is changed, change the css file too
       */
      $(`#${series.id} .rows .row-content`).not(".episode").slick({
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });

      $(`#${series.id} .rows .row-content.episode`).slick({
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 4.5,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });

      $(`#${series.id} .rows`)[0].slick.slickGoTo(0);
      $(`#${series.id} .rows .row-content`)[0].slick.slickGoTo(0);

      main.state = series.id;

      var keyDownEvent = new Event("keydown");
      keyDownEvent.keyCode = tvKey.KEY_DOWN;
      series.keyDown(keyDownEvent);
    } else {
      series_element.innerHTML = `
      <div class="content">
        <div style="height: 100vh; display: flex; justify-content: center; align-items: center">
            <div style="font-size: 4vh;color: red">No Data Available</div>
        </div>
      </div>`;
      document.body.appendChild(series_element);
      main.state = series.id;
    }
  },

  destroy: function () {
    series.position = 0;
    document.body.removeChild(document.getElementById(series.id));
  },

  show_details: function () {
    var item =
      series.position > 0
        ? series.data.main.lists[series.position - 1].items[$(".row-content")[series.position - 1].slick.currentSlide]
        : series.data.main.banner;
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
        if (!series.fromCategory.state) {
          menu.open();
        } else {
          series.destroy();
        }
        break;
      case tvKey.KEY_NEXT:
        break;
      case tvKey.KEY_UP:
        if (series.data.main) {
          if (series.position > 1) {
            $(".row-content").removeClass("selected");
            series.position--;
            $(".rows")[0].slick.slickGoTo(series.position - 1);
            $(".row-content")[series.position - 1].slick.slickGoTo(
              $(".row-content")[series.position - 1].slick.getCurrent()
            );
            $(".row-content")[series.position - 1].className =
              $(".row-content")[series.position - 1].className + " selected";
          } else {
            // $(".details").addClass("full");
            // series.position = 0;
          }
          series.show_details();
        }
        break;
      case tvKey.KEY_DOWN:
        if (series.data.main) {
          if (series.position > 0) {
            $(".row-content").removeClass("selected");
            series.position = series.position < series.data.main.lists.length ? series.position + 1 : series.position;
            if (series.position <= series.data.main.lists.length) {
              $(".rows")[0].slick.slickGoTo(series.position - 1);
              $(".row-content")[series.position - 1].slick.slickGoTo(
                $(".row-content")[series.position - 1].slick.getCurrent()
              );
            }
            $(".row-content")[series.position - 1].className =
              $(".row-content")[series.position - 1].className + " selected";
          } else {
            $(".details.full").removeClass("full");
            var first_row = $(".row-content")[0];
            $(".rows")[0].slick.slickGoTo(0);
            first_row.slick.slickGoTo(first_row.slick.getCurrent());
            first_row.className = first_row.className + " selected";
            series.position++;
          }
          series.show_details();
        }
        break;
      case tvKey.KEY_LEFT:
        if (series.data.main) {
          if (series.position > 0) {
            if ($(".row-content")[series.position - 1].slick.currentSlide === 0) {
              if (!series.fromCategory.state) {
                menu.open();
              } else {
                series.destroy();
              }
            } else {
              $(".row-content")[series.position - 1].slick.prev();
              series.show_details();
            }
          } else {
            var buttons = $(".details .buttons a");
            var current = buttons.index($(`.details .buttons a.selected`));
            if (current === 0) {
              if (!series.fromCategory.state) {
                menu.open();
              } else {
                series.destroy();
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
        if (series.data.main) {
          if (series.position > 0) {
            var currentList = series.data.main.lists[series.position - 1];
            var currentSlide = $(".row-content")[series.position - 1];

            if (currentSlide.slick.currentSlide < currentList.items.length - 1) {
              if (series.fromCategory.state && currentList.lazy) {
                if (currentList.items.length > 15 && currentSlide.slick.currentSlide > currentList.items.length - 10) {
                  currentList.lazy = false;
                  loading.start();
                  mapper.loadCategoryListAsync(
                    `${series.data.main.category},${currentList.id}`,
                    currentList.items.length,
                    20,
                    series.position - 1,
                    {
                      success: function (response, index) {
                        series.data.main.lists[index].lazy = response.items.length === 20;
                        series.addToList(index, mapper.mapItems(response.items));
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
              series.show_details();
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
        var item =
          series.position > 0
            ? series.data.main.lists[series.position - 1].items[
                $(".row-content")[series.position - 1].slick.currentSlide
              ]
            : series.data.main.banner;
        // series-screen
        api.contentDetails({
          body: {
            id: item.id,
            content_type: item.content_type,
          },
          success: function (data) {
            home_details.init(item, data, series);
          },
        });
        break;
    }
  },

  start: function () {
    this.restart();
    api.allCategories({
      data: {
        page: "tizen-series",
      },
      success: function (response) {
        api.seriesBanners({
          success: function (res) {
            if (response.categories.length > 0) {
              mapper.populate(window.series, response, res.data.banners, {
                success: function () {
                  loading.destroy();
                  series.init();
                  !menu.initialized && menu.init();
                },
              });
            } else {
              loading.destroy();
              series.init();
              !menu.initialized && menu.init();
            }
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

  restart: function () {
    series.fromCategory.state = false;
    series.fromCategory.index = NaN;
    loading.init();
    series.data.main = null;
    // main.events.series();
  },

  addToList: function (index, newItems) {
    var itemsCount = series.data.main.lists[index].items.length;
    var currentSlide = $(".row-content")[series.position - 1];
    series.data.main.lists[index].items = series.data.main.lists[index].items.concat(newItems);

    // remove empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickRemove(itemsCount + 8 - index);
    }

    // added new items
    newItems.forEach((element) => currentSlide.slick.slickAdd(series.createItem(element)));

    // added empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickAdd(series.createEmptyItem(newItems[0].display));
    }
  },

  createItem: function (item, colIndex, rowIndex) {
    var playhead = item.playhead
      ? `<div class="progress" style="width: ${
          (item.playhead * 100) / item.duration
        }%" value="${item.duration - item.playhead}m"></div>`
      : "";
    return `
          <div class="item">
            <div class="poster ${item.display}" onclick="series.click(event, '${colIndex}', '${rowIndex}')">
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

  click: function (event, colIndex, rowIndex) {
    // console.log("ev", event, colIndex, rowIndex);
    $(".row-content").removeClass("selected");

    $(".rows")[0].slick.slickGoTo(rowIndex);
    $(".row-content")[rowIndex].slick.slickGoTo(
      $(".row-content")[rowIndex].slick.getCurrent()
    );
    $(".row-content")[rowIndex].className =
      $(".row-content")[rowIndex].className + " selected";

    // var item =
    //   home.position > 0
    //     ? home.data.main.lists[home.position - 1].items[
    //         $(".row-content")[home.position - 1].slick.currentSlide
    //       ]
    //     : home.data.main.banner;
    var item = series.data.main.lists[rowIndex].items[colIndex];

    $(".row-content").slick("slickGoTo", colIndex);

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
    
    // home-screen
    // api.contentDetails({
    //   body: {
    //     id: item.id,
    //     content_type: item.content_type,
    //   },
    //   success: function (data) {
    //     home_details.init(item, data, series);
    //   },
    // });
  },
};
