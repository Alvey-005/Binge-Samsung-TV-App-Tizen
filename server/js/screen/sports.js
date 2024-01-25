window.sports = {
  id: "sports-screen",
  data: {
    main: NaN,
  },
  position: 0,
  fromCategory: {
    index: NaN,
    state: false,
  },

  init: function () {
    var sports_element = document.createElement("div");
    sports_element.id = sports.id;

    var poster_items = ``;
    if(sports.data.main){
      sports.data.main.lists.forEach((element, index) => {
        if (element.items.length > 0) {
          poster_items += `
            <div class="row">
              <div class="row-title">${element.title}</div>
              <div class="row-content ${element.items[0].display}">`;
          element.items.forEach((item, idx) => {
            poster_items += sports.createItem(item, idx, index);
          });
          for (var index = 0; index < 9; index++) {
            poster_items += sports.createEmptyItem(element.items[0].display);
          }
          poster_items += `</div></div>`;
        }
      });
  
      sports_element.innerHTML = `
          <div class="content">
            ${
              sports.fromCategory.state
                ? `<div class="browse-back"><span></span><p>${sports.fromCategory.title}</p></div>`
                : ""
            }
            <div class="details full">
              <div class="background">
                <img src="${sports.data.main.banner.background}">
              </div>
              <div class="info">
                <div class="title resize">${sports.data.main.banner.title}</div>
                <div class="description resize">${sports.data.main.banner.description}</div>
                <!--
                <div class="buttons">
                  <a class="selected">${translate.go("sports.banner.play")}</a>
                  <a>${translate.go("sports.banner.info")}</a>
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
  
      document.body.appendChild(sports_element);
  
      var title = $(".details .info .title")[0];
      title.style.fontSize = title.scrollHeight > title.clientHeight ? "3.5vh" : "5vh";
  
      var description = $(".details .info .description")[0];
      description.style.fontSize = description.scrollHeight > description.clientHeight ? "2vh" : "2.5vh";
  
      $(`#${sports.id} .rows`).slick({
        vertical: true,
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: sports.data.main.lists.length,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });

      $('.rows').on('click', '.selected', function(event) {
        var item =
          sports.position > 0
            ? sports.data.main.lists[sports.position - 1].items[
                $(".row-content")[sports.position - 1].slick.currentSlide
              ]
            : sports.data.main.banner;
            
        api.contentDetails({
          body: {
            id: item.id,
            content_type: item.content_type,
          },
          success: function (data) {
            home_details.init(item, data, sports);
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
      $(`#${sports.id} .rows .row-content`).not(".episode").slick({
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });
  
      $(`#${sports.id} .rows .row-content.episode`).slick({
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 4.5,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });
  
      $(`#${sports.id} .rows`)[0].slick.slickGoTo(0);
      $(`#${sports.id} .rows .row-content`)[0].slick.slickGoTo(0);
  
      main.state = sports.id;
  
      var keyDownEvent = new Event("keydown");
      keyDownEvent.keyCode = tvKey.KEY_DOWN;
      sports.keyDown(keyDownEvent);
    }else{
      sports_element.innerHTML = `
      <div class="content">
        <div style="height: 100vh; display: flex; justify-content: center; align-items: center">
            <div style="font-size: 4vh;color: red">No Data Available</div>
        </div>
      </div>`;
      document.body.appendChild(sports_element);

      main.state = sports.id;
    }
  },

  destroy: function () {
    sports.position = 0;
    document.body.removeChild(document.getElementById(sports.id));
  },

  show_details: function () {
    var item =
      sports.position > 0
        ? sports.data.main.lists[sports.position - 1].items[$(".row-content")[sports.position - 1].slick.currentSlide]
        : sports.data.main.banner;
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
        if (!sports.fromCategory.state) {
          menu.open();
        } else {
          sports.destroy();
        }
        break;
      case tvKey.KEY_NEXT:
        break;
      case tvKey.KEY_UP:
        if (sports.data.main) {
          if (sports.position > 1) {
            $(".row-content").removeClass("selected");
            sports.position--;
            $(".rows")[0].slick.slickGoTo(sports.position - 1);
            $(".row-content")[sports.position - 1].slick.slickGoTo(
              $(".row-content")[sports.position - 1].slick.getCurrent()
            );
            $(".row-content")[sports.position - 1].className =
              $(".row-content")[sports.position - 1].className + " selected";
          } else {
            // $(".details").addClass("full");
            // sports.position = 0;
          }
          sports.show_details();
        }
        break;
      case tvKey.KEY_DOWN:
        if(sports.data.main){
          if (sports.position > 0) {
            $(".row-content").removeClass("selected");
            sports.position = sports.position < sports.data.main.lists.length ? sports.position + 1 : sports.position;
            if (sports.position <= sports.data.main.lists.length) {
              $(".rows")[0].slick.slickGoTo(sports.position - 1);
              $(".row-content")[sports.position - 1].slick.slickGoTo(
                $(".row-content")[sports.position - 1].slick.getCurrent()
              );
            }
            $(".row-content")[sports.position - 1].className =
              $(".row-content")[sports.position - 1].className + " selected";
          } else {
            $(".details.full").removeClass("full");
            var first_row = $(".row-content")[0];
            $(".rows")[0].slick.slickGoTo(0);
            first_row.slick.slickGoTo(first_row.slick.getCurrent());
            first_row.className = first_row.className + " selected";
            sports.position++;
          }
          sports.show_details();
        }
        break;
      case tvKey.KEY_LEFT:
        if (sports.data.main) {
          if (sports.position > 0) {
            if ($(".row-content")[sports.position - 1].slick.currentSlide === 0) {
              if (!sports.fromCategory.state) {
                menu.open();
              } else {
                sports.destroy();
              }
            } else {
              $(".row-content")[sports.position - 1].slick.prev();
              sports.show_details();
            }
          } else {
            var buttons = $(".details .buttons a");
            var current = buttons.index($(`.details .buttons a.selected`));
            if (current === 0) {
              if (!sports.fromCategory.state) {
                menu.open();
              } else {
                sports.destroy();
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
        if(sports.data.main){
          if (sports.position > 0) {
            var currentList = sports.data.main.lists[sports.position - 1];
            var currentSlide = $(".row-content")[sports.position - 1];

            if (currentSlide.slick.currentSlide < currentList.items.length - 1) {
              if (sports.fromCategory.state && currentList.lazy) {
                if (currentList.items.length > 15 && currentSlide.slick.currentSlide > currentList.items.length - 10) {
                  currentList.lazy = false;
                  loading.start();
                  mapper.loadCategoryListAsync(
                    `${sports.data.main.category},${currentList.id}`,
                    currentList.items.length,
                    20,
                    sports.position - 1,
                    {
                      success: function (response, index) {
                        sports.data.main.lists[index].lazy = response.items.length === 20;
                        sports.addToList(index, mapper.mapItems(response.items));
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
              sports.show_details();
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
          sports.position > 0
            ? sports.data.main.lists[sports.position - 1].items[
                $(".row-content")[sports.position - 1].slick.currentSlide
              ]
            : sports.data.main.banner;
        // sports-screen
        api.contentDetails({
          body: {
            id: item.id,
            content_type: item.content_type,
          },
          success: function (data) {
            home_details.init(item, data, sports);
          },
        });
        break;
    }
  },

  start: function () {
    this.restart();
    api.allCategories({
      data: {
        page: "tizen-sports",
      },
      success: function (response) {
        api.sportsBanners({
          success: function (res) {
            if (response.categories.length > 0) {
              mapper.populate(window.sports, response, res.data.banners, {
                success: function () {
                  loading.destroy();
                  sports.init();
                  !menu.initialized && menu.init();
                },
              });
            } else {
              loading.destroy();
              sports.init();
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
    sports.fromCategory.state = false;
    sports.fromCategory.index = NaN;
    loading.init();
    sports.data.main = null;
    // main.events.sports();
  },

  addToList: function (index, newItems) {
    var itemsCount = sports.data.main.lists[index].items.length;
    var currentSlide = $(".row-content")[sports.position - 1];
    sports.data.main.lists[index].items = sports.data.main.lists[index].items.concat(newItems);

    // remove empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickRemove(itemsCount + 8 - index);
    }

    // added new items
    newItems.forEach((element) => currentSlide.slick.slickAdd(sports.createItem(element)));

    // added empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickAdd(sports.createEmptyItem(newItems[0].display));
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
          <div class="poster ${item.display}" onclick="sports.click(event, '${colIndex}', '${rowIndex}')">
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
    var item = sports.data.main.lists[rowIndex].items[colIndex];

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
    //     home_details.init(item, data, sports);
    //   },
    // });
  },
};
