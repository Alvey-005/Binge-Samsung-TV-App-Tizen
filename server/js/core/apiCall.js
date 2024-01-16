window.api = {
  api: {
    url: "https://www.crunchyroll.com",
    bingeStageUrl: "https://web-api.binge.buzz",
    imageStageURl: "https://web-api-staging.binge.buzz",
    bingeProdUrl: "https://web-api.binge.buzz",
    auth: "Basic aHJobzlxM2F3dnNrMjJ1LXRzNWE6cHROOURteXRBU2Z6QjZvbXVsSzh6cUxzYTczVE1TY1k=",
  },

  refresh: function (request) {
    try {
      if (request.success) {
        request.success();
      }
    } catch (e) {
      if (request.error) {
        request.error(e);
      } else {
        console.error("error in refresh", e);
      }
    }
  },

  profile: function (request) {
    return session.refresh({
      success: function (storage) {
        var headers = new Headers();
        headers.append("Authorization", `Bearer ${storage.access_token}`);
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        fetch(`${api.api.url}/accounts/v1/me/profile`, {
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

        fetch(`${api.api.url}/accounts/v1/me/profile`, {
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

        fetch(`${api.api.url}/index/v2`, {
          headers: headers,
        })
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
          `${api.api.url}/content/v2/discover/up_next/${request.data.ids}?locale=${storage.language}&preferred_audio_language=${storage.account.audio}`,
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
          `${api.api.url}/content/v2/${storage.id}/playheads?content_ids=${request.data.ids}&preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
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
          `${api.api.url}/cms/v2${storage.cookies.bucket}/seasons?series_id=${request.data.id}&preferred_audio_language=${storage.account.audio}&locale=${storage.language}&Signature=${storage.cookies.signature}&Policy=${storage.cookies.policy}&Key-Pair-Id=${storage.cookies.key_pair_id}`,
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
          `${api.api.url}/cms/v2${storage.cookies.bucket}/episodes?season_id=${request.data.id}&preferred_audio_language=${storage.account.audio}&locale=${storage.language}&Signature=${storage.cookies.signature}&Policy=${storage.cookies.policy}&Key-Pair-Id=${storage.cookies.key_pair_id}`,
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
        try {
          request.success();
        } catch (e) {
          console.error("error in video api", e);
        }
      },
      error: function (error) {
        request.error(error);
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
          `${api.api.url}/content/v2/${storage.id}/watch-history?page_size=100&preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
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
          `${api.api.url}/content/v2/${storage.id}/playheads?preferred_audio_language=${storage.account.audio}&locale=${storage.language}`,
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
          `${api.api.url}/content/v1/tenant_categories?include_subcategories=true&locale=${storage.language}`,
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
    requestMethod
      .get(`${urls.fetchOtpUrl}/${request.data.phone}`)
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
    const verifyResponse = await requestMethod.post(urls.verifyOtpUrl, params);
    if (verifyResponse.data && verifyResponse.data.is_success) {
      session.storage.jwtToken = verifyResponse.data.token;
      session.storage.customer = verifyResponse.data.customer;
      session.update();
      request.success();
    }
  },

  allCategories: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const allCatResponse = await requestMethod.post(
          urls.fetchCategory,
          request.data
        );
        try {
          if (request.success) {
            request.success(allCatResponse.data);
          }
        } catch (e) {
          request.error
            ? request.error(e)
            : console.error("error in api allCategories \n", e);
        }
      },
    });
  },

  contentDetails: async function (request) {
    return session.refresh({
      success: async function (storage) {
        var params = request.body;
        const allCatResponse = await requestMethod.post(
          urls.fetchProductDetails,
          params
        );
        try {
          if (request.success) {
            if (allCatResponse && allCatResponse.data && allCatResponse.data.data) {
              request.success(allCatResponse.data.data);
            }          }
        } catch (e) {
          request.error ? request.error(e) : console.error(e);
        }
      },
    });
  },

  banners: function (request) {
    return session.refresh({
      success: async function (storage) {
        const banners = await requestMethod.get(urls.fetchVodBanner);
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

  search: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(
          urls.fetchSearchUrl,
          request.data
        );
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error
            ? request.error(e)
            : console.error("error in api search \n", e);
        }
      },
    });
  },

  movieBanners: function (request) {
    return session.refresh({
      success: async function (storage) {
        const banners = await requestMethod.get(urls.fetchMovieBanner);
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

  sportsBanners: function (request) {
    return session.refresh({
      success: async function (storage) {
        const banners = await requestMethod.get(urls.fetchSportsBanner);
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

  seriesBanners: function (request) {
    return session.refresh({
      success: async function (storage) {
        const banners = await requestMethod.get(urls.fetchSeriesBanner);
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

  addToFavourites: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(urls.wishlist, request.data);
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error
            ? request.error(e)
            : console.error("Error in api add to favourites \n", e);
        }
      },
    });
  },

  getFavourites: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(
          `${urls.wishlist}/${session.storage.customer.id}`,
          request.data
        );
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error
            ? request.error(e)
            : console.error("Error in api favourites \n", e);
        }
      },
    });
  },

  getSports: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(
          `${urls.wishlist}/${session.storage.customer.id}`,
          request.data
        );
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error
            ? request.error(e)
            : console.error("Error in api favourites \n", e);
        }
      },
    });
  },
  getFavourites: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(
          `${urls.wishlist}/${session.storage.customer.id}`,
          request.data
        );
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error
            ? request.error(e)
            : console.error("Error in api favourites \n", e);
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