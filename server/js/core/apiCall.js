window.api = {
  api: {
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
      phone: session.storage.phone,
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
        const allCatResponse = await requestMethod.post(urls.fetchCategory, request.data);
        try {
          if (request.success) {
            request.success(allCatResponse.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("error in api allCategories \n", e);
        }
      },
    });
  },

  contentDetails: async function (request) {
    return session.refresh({
      success: async function (storage) {
        var params = request.body;
        const allCatResponse = await requestMethod.post(urls.fetchProductDetails, params);
        try {
          if (request.success) {
            if (allCatResponse && allCatResponse.data && allCatResponse.data.data) {
              request.success(allCatResponse.data.data);
            }
          }
        } catch (e) {
          request.error ? request.error(e) : console.error(e);
        }
      },
    });
  },

  profileDetails: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const profile = await requestMethod.get(`${urls.profileApi}/${request.id}`);
        try {
          if (request.success) {
            if (profile && profile.data.customer) {
              request.success(profile.data.customer);
            }
          }
        } catch (e) {
          request.error ? request.error(e) : console.error(e);
        }
      },
    });
  },

  // voucher: async function (request) {
  //   return session.refresh({
  //     success: async function (storage) {
  //       const profile = await requestMethod.get(`${urls.profileApi}/${request.id}`);
  //       try {
  //         if (request.success) {
  //           if (profile && profile.data.customer) {
  //             request.success(profile.data.customer);
  //           }
  //         }
  //       } catch (e) {
  //         request.error ? request.error(e) : console.error(e);
  //       }
  //     },
  //   });
  // },

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
        const data = await requestMethod.post(urls.fetchSearchUrl, request.data);
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("error in api search \n", e);
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
          request.error ? request.error(e) : console.error("Error in api add to favourites \n", e);
        }
      },
    });
  },

  deleteFavourite: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.delete(
          `${urls.wishlist}/${request.data.customer_id}/${request.data.product_id}`,
          request.data
        );
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("Error in api add to favourites \n", e);
        }
      },
    });
  },

  getFavourites: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(`${urls.wishlist}/${session.storage.customer.id}`, request.data);
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("Error in api favourites \n", e);
        }
      },
    });
  },

  getSports: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(`${urls.wishlist}/${session.storage.customer.id}`, request.data);
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("Error in api favourites \n", e);
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
