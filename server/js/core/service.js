window.service = {
  api: {
    url: "https://www.crunchyroll.com",
    bingeStageUrl: "https://ss-staging.binge.buzz",
    bingeProdUrl: "https://web-api.binge.buzz",
    auth: "Basic aHJobzlxM2F3dnNrMjJ1LXRzNWE6cHROOURteXRBU2Z6QjZvbXVsSzh6cUxzYTczVE1TY1k="
  },

  token: function (request) {
    var headers = new Headers();
    headers.append("Authorization", service.api.auth);
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    var params = service.format({
      username: request.data.username,
      password: request.data.password,
      grant_type: "password",
      scope: "offline_access",
    });

    fetch(`${service.api.url}/auth/v1/token`, {
      method: "POST",
      headers: headers,
      body: params,
    })
      .then((response) => response.json())
      .then((json) => request.success && request.success(json))
      .catch((error) => {
        console.log(error);
        request.error && request.error(error);
      });
  },

  refresh: function (request) {
    var headers = new Headers();
    headers.append("Authorization", service.api.auth);
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    var params = service.format({
      refresh_token: session.storage.refresh_token,
      grant_type: "refresh_token",
      scope: "offline_access",
    });

    fetch(`${service.api.url}/auth/v1/token`, {
      method: "POST",
      headers: headers,
      body: params,
    })
      .then((response) => response.json())
      .then((json) => request.success(json))
      .catch((error) => request.error(error));
  },

  profile: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(`${service.api.url}/accounts/v1/me/profile`, {
          headers: headers,
        })
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  setProfile: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/json");

        fetch(`${service.api.url}/accounts/v1/me/profile`, {
          method: "PATCH",
          headers: headers,
          body: JSON.stringify(request.data),
        })
          .then((response) => null)
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  cookies: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(`${service.api.url}/index/v2`, {
          headers: headers,
        })
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  home: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/content/v2/discover/${storage.id}/home_feed?start=0&n=100&preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  continue: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/content/v2/discover/up_next/${request.data.ids}?locale=${storage.language}&preferred_audio_language=${storage.account.audio}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  playheads: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/content/v2/${storage.id}/playheads?content_ids=${request.data.ids}&preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  seasons: function (request) {
    return session.cookies({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/cms/v2${storage.cookies.bucket}/seasons?series_id=${request.data.id}&preferred_audio_language=${storage.account.audio}&locale=${storage.language}&Signature=${storage.cookies.signature}&Policy=${storage.cookies.policy}&Key-Pair-Id=${storage.cookies.key_pair_id}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
      error: function (error) {
        request.error(error);
      },
    });
  },

  episodes: function (request) {
    return session.cookies({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/cms/v2${storage.cookies.bucket}/episodes?season_id=${request.data.id}&preferred_audio_language=${storage.account.audio}&locale=${storage.language}&Signature=${storage.cookies.signature}&Policy=${storage.cookies.policy}&Key-Pair-Id=${storage.cookies.key_pair_id}`,
          // `https://web-api-staging.binge.buzz/api/v3/page/category/products`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
      error: function (error) {
        request.error(error);
      },
    });
  },

  video: function (request) {
    return session.cookies({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(
          `${service.api.url}/cms/v2${storage.cookies.bucket}/videos/${request.data.id}/streams?Signature=${storage.cookies.signature}&Policy=${storage.cookies.policy}&Key-Pair-Id=${storage.cookies.key_pair_id}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
      error: function (error) {
        request.error(error);
      },
    });
  },

  search: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        fetch(
          `${service.api.url}/content/v2/discover/search?q=${request.data.query}&type=series,movie_listing&n=100&locale=${storage.language}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  history: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        fetch(
          `${service.api.url}/content/v2/${storage.id}/watch-history?page_size=100&preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  setHistory: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/json");
        fetch(
          `${service.api.url}/content/v2/${storage.id}/playheads?preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
          {
            method: "POST",
            headers: headers,
            body: JSON.stringify(request.data),
          }
        )
          .then((response) => response.text())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  languages: function (request) {
    fetch(
      `https://static.crunchyroll.com/config/i18n/v3/${request.data.type === "subtitle"
        ? "timed_text_languages.json"
        : "audio_languages.json"
      }`
    )
      .then((response) => response.json())
      .then((json) => request.success(json))
      .catch((error) => request.error(error));
  },

  intro: function (request) {
    fetch(
      `https://static.crunchyroll.com/datalab-intro-v2/${request.data.id}.json`
    )
      .then((response) => response.json())
      .then((json) => request.success(json))
      .catch((error) => request.error(error));
  },

  categories: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        fetch(
          `${service.api.url}/content/v1/tenant_categories?include_subcategories=true&locale=${storage.language}`,
          // `https://web-api-staging.binge.buzz/api/v3/page/allCategories`,
          {
            headers: headers,
          }
        )
          .then((response) => response.json())
          .then((json) => request.success(json))
          .catch((error) => request.error(error));
      },
    });
  },

  format: function (params) {
    return Object.keys(params)
      .map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
      })
      .join("&");
  },

  // Binge

  login: function (request) {
    var params = `phone: ${request.data.phone}`;

    console.log("params", params);
    console.log("service phone", request.data.phone);

    requestMethod.get(`${urls.fetchOtpUrl}/${request.data.phone}`)
      .then((res) => res.data && res.data.is_success && request.success())
      .catch((error) => {
        console.log(error);
        request.error && request.error(error);
      });
  },

  verify: async function (request) {
    var params = {
      phone: session.storage.account.phone,
      otp: request.data.otp,
    };
    console.log('otp  body', session.storage.account.phone);
    const verifyResponse = await requestMethod.post(urls.verifyOtpUrl, params);
    console.log('verify', verifyResponse);
    if (verifyResponse.data && verifyResponse.data.is_success) {
      session.storage.jwtToken = verifyResponse.data.token;
      session.storage.customer = verifyResponse.data.customer;
      request.success();
    }
  },

  allCategories: async function (request) {
    return session.refresh({
      success: async function (storage) {
        var params = { page: "web-home-vod" };
        const allCatResponse = await requestMethod.post(urls.fetchCategory, params);
        console.log('All Categories', allCatResponse);
        try {
          if (request.success) {
            request.success(allCatResponse.data);
          }
        } catch (e) {
          request.error && request.error(e);
        }
      },
    });
  },

  banners: function (request) {
    return session.refresh({
      success: async function (storage) {
        const banners = await requestMethod.get(urls.fetchVodBanner);
        console.log('service banners', banners);
        try {
          if (request.success) {
            request.success(banners);
          }
        } catch (e) {
          request.error && request.error(e);
        }
      },
    });
  },

  formatBinge: function (params) {
    return Object.keys(params)
      .map(function (k) {
        return encodeURIComponent(k) + ":" + encodeURIComponent(params[k]);
      })
      .join("&");
  },
};
