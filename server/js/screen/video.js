window.video = {
    id: 'video-screen',
    previous: null,
    episode: null,
    next: {
        shown: false,
        state: false,
        time: 60,
        episode: null,
    },
    option: false,
    options: [
        {
            icon: 'fa-solid fa-play',
            action: 'playPause',
            // param: true,
        },
        {
            icon: 'fa-solid fa-forward-step',
            action: 'nextEpisode',
            param: true,
        },
        {
            icon: 'fa-solid fa-message',
            action: 'openLanguages',
        },
        {
            icon: 'toggle-aspect fa-solid fa-expand',
            action: 'toggleAspectRatio',
        },
    ],
    aspects: ['expand', 'compress', 'crop-simple'],
    aspect: 0,
    subtitles: [],
    subtitle: null,
    audios: [],
    audio: null,
    intro: null,
    appScreen: NaN,
  streams: [],
    timers: {
        history: {
            object: null,
            duration: 30000,
        },
        next: null,
        osd: {
            object: null,
            duration: 4000,
        },
    },
    settings: {
        open: false,
        selected: false,
    },

  toggleAspectRatio: function () {
    video.aspect = video.aspect < video.aspects.length - 1 ? video.aspect + 1 : 0;
    document.getElementById("bingeTizen").className = video.aspects[video.aspect];
    $(".toggle-aspect")[0].className = `toggle-aspect fa-solid fa-${video.aspects[video.aspect]} selected`;
  },

  openLanguages: function () {
    video.hideOSD();
    video.settings.open = true;
    player.pause();
    $("#osd-icon").hide();
    $(".player-settings").hide();
    video.setAudios();
    video.setSubtitles();
    $(".settings-slide").addClass("open");
  },

    getSettings: function () {
        return video.options.map((element) => `<i class="${element.icon}" onclick="video.optionClickHandler(event, '${element.action}')"></i>`).join('');
    },

  init: function (item, screen) {
    video.appScreen = screen;
    var video_element = document.createElement("div");
    video_element.id = video.id;

        video_element.innerHTML = `
    <div class="content" onmousemove="video.mouseHandler(event)">
      <img id="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">
      <video id="bingeTizen" class="video-js" >
    </video>
          <div class="osd" id="osd">
        <div class="player-settings">
          ${video.getSettings()}
        </div>
        <div class="details">
          <div id="title">${item.name}</div>
          <div id="subtitle">
            ${item.artists}
          </div>
        </div>
        <div class="progress">
          <div id="time">00:00:00</div>
          <div class="bar" id="progress_bar" onclick="video.progressBarController(event)")">
            <div id="played">
              <div class="preview">
                <img id="preview">
              </div>
            </div>
          </div>
          <div id="total">00:00:00</div>
        </div>
      </div>
      <div id="osd-icon" class="icon-status">
        <div class="icon"></div>
        <div id="osd-icon-data" class="percent"></div>
      </div>
      <div class="next-episode">
        <div class="next-episode-image">
          <img id="next-episode-image">
          <div id="next-episode-count">${video.next.time}</div>
        </div>
      </div>

      <div id="skip-intro">
        <i class="fa-solid fa-forward"></i>
        ${translate.go("video.skip")}
      </div>

      <div class="settings-slide">
        <div id="languages-content">
          <div class="title">${translate.go("video.languages.audios")}</div>
          <ul id="audios"></ul>
          <div class="title">${translate.go("video.languages.subtitles")}</div>
          <ul id="subtitles"></ul>
        </div>
      </div>
    </div>`;
    document.body.appendChild(video_element);
    player.config(video.setPlayingTime, video.end);
    $(`#${video.appScreen.id}`).hide();
    video.previous = main.state;
    main.state = video.id;
    if (item && item.related_product[0]) {
      video.next.episode = item.related_product[0];
    }
    video.play(item);
    video.intro = {
      start: 10,
      end: 50,
    };
    video.intro = {
      start: item.intro_start_time,
      end: item.intro_end_time,
    };
  },

  destroy: function () {
    console.log("destroy is calling");
    video.hideOSD();
    player.pause();
    requestMethod.get(urls.closeContent);
    // player.stop();
    clearTimeout(video.timers.osd.object);
    clearInterval(video.timers.next);
    clearInterval(video.timers.history.object);
    main.state = video.previous;
    document.body.removeChild(document.getElementById(video.id));
    $(`#${video.appScreen.id}`).show();
    video.next.episode = null;
    video.next.status = false;
    video.next.shown = false;
    video.episode = null;
    video.data = null;
    video.streams = [];
    // player.plugin.dispose();
    player.stop();
    player.plugin = NaN;
    player.video = NaN;
    player.state = -1;
  },

    mouseHandler: function(event) {
        // console.log('inside mouse handler', event);
        video.showOSD();
    },

    progressBarController: function(event) {
        console.log('progress event', event);
        var progressBarClickable = document.getElementById('progress_bar');
        var clickPosition = event.clientX - progressBarClickable.getBoundingClientRect().left;
        var percentage = (clickPosition / progressBarClickable.offsetWidth) * 100;
        var duration = player.getDuration();
        var newTime = (percentage / 100) * duration;
        player.getVideo().currentTime = newTime;
        console.log('pos', newTime);
    },

    optionClickHandler: function(event, action) {
        // console.log('options ev', event, action);
        switch(action) {
            case 'playPause':
                // console.log('playpause');
                player.playPause();
                break;
            case 'nextEpisode':
                // console.log('playnxt');
                video[video.options[1].action](video.options[1].param);
                break;
            case 'openLanguages':
                // console.log('open lang');
                video[video.options[2].action](video.options[2].param);
                break;
        }
    },

  keyDown: function (event) {
    var osd = true;
    switch (event.keyCode) {
      case tvKey.KEY_STOP:
      case tvKey.KEY_BACK:
      case 27:
        if (video.settings.open) {
          osd = false;
          video.settings.open = false;
          $(".settings-slide").removeClass("open");
          $("#osd-icon").show();
          video.settings.selected = false;
          $(".player-settings").removeClass("selected");
          $(".player-settings").show();
          player.resume();
        } else {
          if (video.next.status) {
            video.stopNext();
          } else {
            video.destroy();
          }
        }
        break;
      case tvKey.KEY_PLAY:
        !video.settings.open && player.resume();
        break;
      case tvKey.KEY_PAUSE:
        !video.settings.open && player.pause();
        break;
      case tvKey.KEY_PLAY_PAUSE:
        !video.settings.open && player.playPause();
        break;
      case tvKey.KEY_ENTER:
      case tvKey.KEY_PANEL_ENTER:
        if (video.settings.open) {
          osd = false;
          var selected = $("#languages-content .option.selected");
          var isAudio = selected.parent().attr("id") === "audios";
          var active = selected.parent().children(".option.active");

          if (active[0] !== selected[0]) {
            var options = selected.parent().children(".option");

            options.removeClass("active");
            selected.addClass("active");

            isAudio ? video.changeAudio(options.index(selected[0])) : video.changeSubtitle(options.index(selected[0]));
          }
        }
        if (video.intro && video.intro.state) {
          osd = false;
          player.forwardTo(video.intro.end);
        } else {
          if (video.next.status) {
            clearInterval(video.timers.next);
            video.playNext();
          } else {
            if (document.getElementById("osd").style.opacity == 1) {
              if (!video.option) {
                player.playPause();
              } else {
                var selected = $(".player-settings i").index($(".player-settings i.selected"));
                video[video.options[selected].action](video.options[selected].param);
              }
            }
          }
        }
        break;
      case tvKey.KEY_PREVIOUS:
      case tvKey.KEY_LEFT:
        if (video.option) {
          var options = $(".player-settings i");
          var selected = options.index($(".player-settings i.selected"));
          options.removeClass("selected");
          options.eq(selected > 0 ? selected - 1 : selected).addClass("selected");
        } else {
          !video.settings.open && player.rewind(video.setPlayingTime);
        }
        break;
      case tvKey.KEY_RIGHT:
      case tvKey.KEY_NEXT:
        if (video.option) {
          var options = $(".player-settings i");
          var selected = options.index($(".player-settings i.selected"));
          options.removeClass("selected");
          options.eq(selected < video.options.length - 1 ? selected + 1 : selected).addClass("selected");
        } else {
          !video.settings.open && player.forward(video.setPlayingTime);
        }
        break;
      case tvKey.KEY_UP:
        if (video.settings.open) {
          var options = $("#languages-content .option");
          var current = options.index($("#languages-content .option.selected"));

          options.removeClass("selected");

          var newCurrent = current > 0 ? current - 1 : current;
          options.eq(newCurrent).addClass("selected");

          var listSelected = $("#languages-content .option.selected").parent();

          var marginTop = 0;
          var max = listSelected.attr("id") === "audios" ? 4 : 3;
          var currentInList = listSelected.children().index($("#languages-content .option.selected"));
          if (listSelected.children().length > max && currentInList > max - 1) {
            if (currentInList > listSelected.children().length - (max - 1)) {
              marginTop = -((listSelected.children().length - max) * 82);
            } else {
              marginTop = -((currentInList - (max - 1)) * 82);
            }
          }

          listSelected.children().first()[0].style.marginTop = `${marginTop}px`;
        } else {
          if (document.getElementById("osd").style.opacity == 1 && !video.option) {
            $(".player-settings").children().first().addClass("selected");
            video.option = true;
          }
        }
        break;
      case tvKey.KEY_DOWN:
        if (video.settings.open) {
          var options = $("#languages-content .option");
          var current = options.index($("#languages-content .option.selected"));

          options.removeClass("selected");

          var newCurrent = current < options.length - 1 ? current + 1 : current;
          options.eq(newCurrent).addClass("selected");

          var listSelected = $("#languages-content .option.selected").parent();

          var marginTop = 0;
          var max = listSelected.attr("id") === "audios" ? 4 : 3;
          var currentInList = listSelected.children().index($("#languages-content .option.selected"));
          if (listSelected.children().length > max && currentInList > max - 1) {
            if (currentInList > listSelected.children().length - (max - 1)) {
              marginTop = -((listSelected.children().length - max) * 82);
            } else {
              marginTop = -((currentInList - (max - 1)) * 82);
            }
          }

          listSelected.children().first()[0].style.marginTop = `${marginTop}px`;
        } else {
          video.option = false;
          $(".player-settings").children().removeClass("selected");
        }
        break;
    }
    event.keyCode !== tvKey.KEY_STOP &&
      event.keyCode !== tvKey.KEY_BACK &&
      event.keyCode !== 27 &&
      !video.settings.open &&
      osd &&
      video.showOSD();
  },

  end: function () {
    if (video.next.status) {
      video.playNext();
    } else {
      video.destroy();
    }
  },
  userCanWatchContent: function (contentDetails) {
    const customer = session.storage.customer;
    const is_content_premimum =
      contentDetails.free_or_premium === 2 || (contentDetails.tvod_ids && contentDetails.tvod_ids.length > 0);
    contentDetails.tvod_details && contentDetails.tvod_details.length > 0;
    // const is_content_tvod : boolean = contentDetails.tvod_ids.length > 0 || contentDetails.tvod_details.length > 0;
    const content_modality_type =
      contentDetails.tvod_details && contentDetails.tvod_details.length > 0
        ? contentDetails.tvod_details[0].tvod_type
        : "svod";
    const userPremium = customer && customer.status_id === 2;
    // const [userCanWatch, setUserCanWatch] = useState<boolean>(false);
    let userCanWatch = false;
    const tvodIds = customer && customer.tvod_ids;
    const tvodProducts =
      contentDetails && contentDetails.content_type === "vod"
        ? customer && customer.tvod_products
        : customer && customer.tvod_tv_channels;
    var match;
    if (contentDetails && contentDetails.tvod_ids) {
      var found = false;
      for (var i = 0; i < contentDetails.tvod_ids.length; i++) {
        var el = contentDetails.tvod_ids[i];
        if (tvodIds && tvodIds.indexOf(el) !== -1) {
          found = true;
          match = el;
          break;
        }
      }

      if (!found && tvodProducts) {
        for (var j = 0; j < tvodProducts.length; j++) {
          var str = tvodProducts[j];
          if (str === contentDetails.id) {
            match = str;
            break;
          }
        }
      }
    }
    if (content_modality_type === "tvod-2" && !!customer && match) {
      content_modality_type !== "tvod-2";
      userCanWatch = true;
    } else if (is_content_premimum && userPremium && content_modality_type !== "tvod-2") {
      userCanWatch = true;
      console.log("user can watch svod");
    } else if (content_modality_type === "tvod-1" && !!(userPremium || match)) {
      userCanWatch = true;
      console.log("user can watch tvod-1");
    } else if (!is_content_premimum && content_modality_type === "svod") {
      userCanWatch = true;
      console.log("user can watch free");
    } else {
      userCanWatch = false;
    }
    return userCanWatch;
  },

  play: function (item, noplay) {
    if (!item.hls_url) {
      video.destroy();
      return;
    }
    if (!video.userCanWatchContent(item)) {
      video.destroy();
      premiumNeedDialog.init();
      return;
    }
    video.episode = item.id;
    api.video({
      data: {
        id: item.stream,
      },
      success: function (data) {
        try {
          player.play(item.hls_url, 0, noplay);
        } catch (error) {
          console.log(error);
        }
      },
      error: function (error) {
        video.stopNext();
        video.next.shown = false;
        console.log(error);
      },
    });
  },

  showSkip: function (time) {
    if (time > video.intro.end) {
      video.intro.state = false;
      $("#skip-intro").hide();
    } else {
      if (!video.intro.state && time > video.intro.start && time < video.intro.end) {
        video.intro.state = true;
        $("#skip-intro").show();
      }
    }
  },

  setAudios: function () {
    $("#audios li").remove();
    var audios = "";
    video.audios.forEach((element, index) => {
      audios += `<li class="option${element.name === video.audio ? " active selected" : ""}">${
        session.languages.audios[element.name]
      }</li>`;
    });

    document.getElementById("audios").innerHTML = audios;
  },

  changeAudio: function (index) {
    video.play(
      {
        id: video.episode,
        stream: video.audios[index].id,
        playhead: player.getPlayed() / 60,
        duration: player.getDuration(),
      },
      true
    );
    video.setSubtitles();
  },

  setSubtitles: function () {
    $("#subtitles").html("");
    var subtitles = "";
    video.subtitles.forEach((element) => {
      subtitles += `<li class="option${element.name === video.subtitle ? " active" : ""}">${
        session.languages.subtitles[element.name]
      }</li>`;
    });

    document.getElementById("subtitles").innerHTML = subtitles;
  },

  changeSubtitle: function (index) {
    player.play(video.streams[video.subtitles[index].name].url, player.getPlayed() / 60, true);
  },

  stopNext: function () {
    clearInterval(video.timers.next);
    video.next.status = false;
    video.next.episode = null;
    document.getElementById("next-episode-count").innerText = video.next.time;
    $(".next-episode").hide();
  },

  playNext: async function () {
    // video.init(video.next.episode);
    let nextEpisode = NaN;
    await api.contentDetails({
      body: {
        id: video.next.episode.id,
        content_type: video.next.episode.content_type,
      },
      success: function (res) {
        nextEpisode = res;
        if (!video.userCanWatchContent(res)) {
          video.destroy();
          premiumNeedDialog.init();
          return;
        }
        player.plugin.src({
          src: video.next.episode.hls_url,
          type: "application/x-mpegURL", // Use 'application/vnd.apple.mpegurl' for Safari
        });
        $(".osd #title").text(res.name);
        $(".osd #subtitle").text(`${res.artists}`);
        video.next.episode = res.related_product[0];
      },
    });
  },

  nextEpisode: function (instant) {
    video.next.shown = true;
    try {
      video.playNext();
    } catch (error) {
      console.log(error);
    }
  },

  showOSD: function () {
    clearTimeout(video.timers.osd.object);
    var osd = document.getElementById("osd");
    osd.style.opacity = 1;
    video.timers.osd.object = setTimeout(() => {
      video.hideOSD();
    }, video.timers.osd.duration);
  },

  hideOSD: function () {
    video.option = false;
    $(".player-settings").children().removeClass("selected");
    video.timers.osd.object = null;
    var osd = document.getElementById("osd");
    osd.style.opacity = 0;
  },

  showBTN: function (state, data) {
    var button = document.getElementById("osd-icon");
    if (button) {
      button.style.opacity = 1;
      button.className = `icon-status ${state}`;
    }
  },

  hideBTN: function () {
    var button = document.getElementById("osd-icon");
    button.style.opacity = 0;
  },

  setPlayingTime: async function () {
    var time = player.getPlayed() + player.values.forward_rewind;
    time = time < 0 ? 0 : time;
    var totalTime = player.getDuration();
    var timePercent = (100 * time) / totalTime;

    video.intro && video.showSkip(time);

    if (!video.next.shown && player.state === player.states.PLAYING && time >= totalTime - (video.next.time + 2)) {
      video.nextEpisode();
    }

    var totalSeconds = Math.floor(totalTime % 60);
    var totalMinutes = Math.floor((totalTime % 3600) / 60);
    var totalHours = Math.floor(totalTime / 3600);
    totalHours = totalHours < 10 ? "0" + totalHours : totalHours;
    totalMinutes = totalMinutes < 10 ? "0" + totalMinutes : totalMinutes;
    totalSeconds = totalSeconds < 10 ? "0" + totalSeconds : totalSeconds;

    var timeSeconds = Math.floor(time % 60);
    var timeMinutes = Math.floor((time % 3600) / 60);
    var timeHours = Math.floor(time / 3600);
    timeHours = timeHours < 10 ? "0" + timeHours : timeHours;
    timeMinutes = timeMinutes < 10 ? "0" + timeMinutes : timeMinutes;
    timeSeconds = timeSeconds < 10 ? "0" + timeSeconds : timeSeconds;

    document.getElementById("time").innerText = `${timeHours ? timeHours : "00"}:${
      timeMinutes ? timeMinutes : "00"
    }:${timeSeconds ? timeSeconds : "00"}`;
    document.getElementById("total").innerText = `${totalHours ? totalHours : "00"}:${
      totalMinutes ? totalMinutes : "00"
    }:${totalSeconds ? totalSeconds : "00"}`;
    document.getElementById("played").style.width = timePercent + "%";
  },
};
