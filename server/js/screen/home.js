window.home = {
  id: "home-screen",
  data: {
    main: NaN,
  },
  position: 0,
  fromCategory: {
    index: NaN,
    state: false,
  },

  init: function () {
    var home_element = document.createElement("div");
    home_element.id = home.id;

    var poster_items = ``;
    if (home.data.main) {
      // console.log('home main', home.data.main.lists.length)
      home.data.main.lists.forEach((element, index) => {
        if (element.items.length > 0) {
          poster_items += `
        <div class="row">
          <div class="row-title">${element.title}</div>
          <div class="row-content">${element.items[0].display}</span>">`;
          element.items.forEach((item, idx) => {
            poster_items += home.createItem(item, idx, index);
          });
          for (var index = 0; index < 9; index++) {
            poster_items += home.createEmptyItem(element.items[0].display);
          }
          poster_items += `</div></div>`;
        }
      });

      home_element.innerHTML = `
    <div class="content">
      ${home.fromCategory.state ? `<div class="browse-back"><span></span><p>${home.fromCategory.title}</p></div>` : ""}
      <div class="details full">
        <div class="background" id="banner">
          <img src="${home.data.main.banner.background}">
        </div>
        <div class="info">
          <div class="title resize">${home.data.main.banner.title}</div>
          <div class="description resize">${
            home.data.main.banner.description
          }</div>
          <!--
          <div class="buttons">
            <a class="selected">${translate.go("home.banner.play")}</a>
            <a>${translate.go("home.banner.info")}</a>
          </div>
          -->
        </div>
      </div>
      <div class="rows">
        ${poster_items}
      </div>
      <!--
      <!--
      <div class="logo-fixed">
        <img src="server/img/logo-big.svg"/>
      </div>
      -->
    </div>`;

      document.body.appendChild(home_element);
      

      const clickEvent = new MouseEvent("click", {
        // bubbles: true,
        // cancelable: true,
        view: window
    });

      const elm = document.getElementById("banner");
      elm.dispatchEvent(clickEvent);

      var title = $(".details .info .title")[0];
      title.style.fontSize = title.scrollHeight > title.clientHeight ? "3.5vh" : "5vh";

      var description = $(".details .info .description")[0];
      description.style.fontSize = description.scrollHeight > description.clientHeight ? "2vh" : "2.5vh";

      $(`#${home.id} .rows`).slick({
        vertical: true,
        dots: false,
        arrows: false,
        infinite: false,
        // mouseWheel: true,
        slidesToShow: home.data.main.lists.length,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });

      // $(`#${home.id} .rows`).on('afterChange', function(event, slick, currentSlide){
      //   // Scroll the page when navigating through the slides
      //   console.log('scrolling', event, slick, currentSlide, document.body.scrollHeight)
      //   window.scrollTo(0, document.body.scrollHeight);
      //   // $('html, body').animate({ scrollTop: $(document).height() }, 'slow');
      // });

      $('.rows').on('click', '.selected', function(event) {
        var item =
          home.position > 0
            ? home.data.main.lists[home.position - 1].items[$(".row-content")[home.position - 1].slick.currentSlide]
            : home.data.main.banner;
            console.log('slick slick 1', item);
            // console.log('pos pos', home.position);
        // home-screen
        api.contentDetails({
          body: {
            id: item.id,
            content_type: item.content_type,
          },
          success: function (data) {
            home_details.init(item, data, home);
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
      $(`#${home.id} .rows .row-content`).not(".episode").slick({
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 5,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });

      $(`#${home.id} .rows .row-content.episode`).slick({
        dots: false,
        arrows: false,
        infinite: false,
        slidesToShow: 4.5,
        slidesToScroll: 1,
        speed: 0,
        waitForAnimate: false,
      });

      $(`#${home.id} .rows`)[0].slick.slickGoTo(0);
      $(`#${home.id} .rows .row-content`)[0].slick.slickGoTo(0);

      main.state = home.id;

      var keyDownEvent = new Event("keydown");
      keyDownEvent.keyCode = tvKey.KEY_DOWN;
      home.keyDown(keyDownEvent);
    } else {
      home_element.innerHTML = `
    <div class="content">
      <div style="height: 100vh; display: flex; justify-content: center; align-items: center">
          <div style="font-size: 4vh;color: red">No Data Available</div>
      </div>
    </div>`;
      document.body.appendChild(home_element);

      main.state = home.id;
    }
  },

  destroy: function () {
    home.position = 0;
    if (document.getElementById(home.id)) {
      document.body.removeChild(document.getElementById(home.id));
    }
  },

  show_details: function () {
    var item =
      home.position > 0
        ? home.data.main.lists[home.position - 1].items[$(".row-content")[home.position - 1].slick.currentSlide]
        : home.data.main.banner;

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

  hover: function(event, colIndex, rowIndex) {
    // console.log('hovering', event);
    var item = home.data.main.lists[rowIndex].items[colIndex];
    console.log('hover item', item);
  },

  click: function (event, colIndex, rowIndex) {
    console.log("ev", event, colIndex, rowIndex, home.position);
    $(".row-content").removeClass("selected");

    $(".rows")[0].slick.slickGoTo(rowIndex);
    $(".row-content")[rowIndex].slick.slickGoTo(
      $(".row-content")[rowIndex].slick.getCurrent()
    );
    $(".row-content")[rowIndex].className =
      $(".row-content")[rowIndex].className + " selected";

    var item = home.data.main.lists[rowIndex].items[colIndex];


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

    console.log('home item', item);

    // home-screen
    // api.contentDetails({
    //   body: {
    //     id: item.id,
    //     content_type: item.content_type,
    //   },
    //   success: function (data) {
    //     console.log('details calling');
    //     home_details.init(item, data, home);
    //   },
    // });

  },

  keyDown: function (event) {
    switch (event.keyCode) {
      case tvKey.KEY_BACK:
      case 27:
        if (!home.fromCategory.state) {
          menu.open();
        } else {
          home.destroy();
        }
        break;
      case tvKey.KEY_NEXT:
        console.log("next");
        break;
      case tvKey.KEY_UP:
        if (home.data.main) {
          if (home.position > 1) {
            $(".row-content").removeClass("selected");
            home.position--;
            $(".rows")[0].slick.slickGoTo(home.position - 1);
            $(".row-content")[home.position - 1].slick.slickGoTo(
              $(".row-content")[home.position - 1].slick.getCurrent()
            );
            $(".row-content")[home.position - 1].className =
              $(".row-content")[home.position - 1].className + " selected";
          } else {
            // $(".details").addClass("full");
            // home.position = 1;
          }
          home.show_details();
        }
        break;
      case tvKey.KEY_DOWN:
        if (home.data.main) {
          if (home.position > 0) {
            $(".row-content").removeClass("selected");
            home.position = home.position < home.data.main.lists.length ? home.position + 1 : home.position;
            if (home.position <= home.data.main.lists.length) {
              $(".rows")[0].slick.slickGoTo(home.position - 1);
              $(".row-content")[home.position - 1].slick.slickGoTo(
                $(".row-content")[home.position - 1].slick.getCurrent()
              );
            }
            $(".row-content")[home.position - 1].className =
              $(".row-content")[home.position - 1].className + " selected";
              // window.addEventListener('scroll', function() {
              //   window.scrollY = 8;
              // })
              window.scrollY = 8;
              console.log(document.scrollY);
          } else {
            $(".details.full").removeClass("full");
            var first_row = $(".row-content")[0];
            $(".rows")[0].slick.slickGoTo(0);
            first_row.slick.slickGoTo(first_row.slick.getCurrent());
            first_row.className = first_row.className + " selected";
            home.position++;
          }
          // window.scrollY = 8;
          home.show_details();
        }
        break;
      case tvKey.KEY_LEFT:
        if (home.data.main) {
          if (home.position > 0) {
            if ($(".row-content")[home.position - 1].slick.currentSlide === 0) {
              if (!home.fromCategory.state) {
                menu.open();
              } else {
                home.destroy();
              }
            } else {
              $(".row-content")[home.position - 1].slick.prev();
              home.show_details();
            }
          } else {
            var buttons = $(".details .buttons a");
            var current = buttons.index($(`.details .buttons a.selected`));
            if (current === 0) {
              if (!home.fromCategory.state) {
                menu.open();
              } else {
                home.destroy();
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
        if (home.data.main) {
          if (home.position > 0) {
            var currentList = home.data.main.lists[home.position - 1];
            var currentSlide = $(".row-content")[home.position - 1];

            if (currentSlide.slick.currentSlide < currentList.items.length - 1) {
              if (home.fromCategory.state && currentList.lazy) {
                if (currentList.items.length > 15 && currentSlide.slick.currentSlide > currentList.items.length - 10) {
                  currentList.lazy = false;
                  loading.start();
                  mapper.loadCategoryListAsync(
                    `${home.data.main.category},${currentList.id}`,
                    currentList.items.length,
                    20,
                    home.position - 1,
                    {
                      success: function (response, index) {
                        home.data.main.lists[index].lazy = response.items.length === 20;
                        home.addToList(index, mapper.mapItems(response.items));
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
              home.show_details();
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
          home.position > 0
            ? home.data.main.lists[home.position - 1].items[$(".row-content")[home.position - 1].slick.currentSlide]
            : home.data.main.banner;
        console.log('pos pos', home.position);
        // home-screen
        api.contentDetails({
          body: {
            id: item.id,
            content_type: item.content_type,
          },
          success: function (data) {
            loginToaster.init();
            home_details.init(item, data, home);
          },
        });
        break;
    }
  },

  restart: function () {
    home.fromCategory.state = false;
    home.fromCategory.index = NaN;
    loading.init();
    home.data.main = null;
    main.events.home();
  },

  addToList: function (index, newItems) {
    var itemsCount = home.data.main.lists[index].items.length;
    var currentSlide = $(".row-content")[home.position - 1];
    home.data.main.lists[index].items = home.data.main.lists[index].items.concat(newItems);

    // remove empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickRemove(itemsCount + 8 - index);
    }

    // added new items
    newItems.forEach((element) => currentSlide.slick.slickAdd(home.createItem(element)));

    // added empty items for prevent move error
    for (var index = 0; index < 9; index++) {
      currentSlide.slick.slickAdd(home.createEmptyItem(newItems[0].display));
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
      <div class="poster ${
        item.display
      }" onclick="home.click(event, '${colIndex}', '${rowIndex}')" onmouseenter="home.hover(event, '${colIndex}', '${rowIndex}')">
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
