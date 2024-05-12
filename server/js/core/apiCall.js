window.api = {
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
        console.error(error);
        request.error && request.error(error);
      });
  },

  loginWithEmail: async function (request) {
    const params = {
      email: request.data.email,
      password: request.data.password,
    };
    const response = await requestMethod.post(`${urls.loginEmailUrl}`, params);
    if (response.data && response.data.is_success) {
      session.storage.customer = response.data.customer;
      session.storage.email = response.data.customer.email;
      session.storage.jwtToken = response.data.token;
      session.storage.isAnonymous = false;
      session.update();
      request.success();
    } else {
      request.error();
    }
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
      api.getCustomerDetails({
        success: function () {},
      });
      session.storage.isAnonymous = false;
      session.update();
      request.success();
    } else {
      console.error("OTP verification error");
      request.error();
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

  fetchTermsConditions: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const termsAndConditions = await requestMethod.get(urls.fetchTerms);
        try {
          if (request.success) {
            request.success(termsAndConditions.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("error in api allCategories \n", e);
        }
      },
    });
  },

  fetchFAQ: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const faqs = await requestMethod.get(urls.fetchFaq);
        try {
          if (request.success) {
            request.success(faqs.data.faqs);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("error in api allCategories \n", e);
        }
      },
    });
  },

  fetchPrivacy: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const privacyContent = await requestMethod.get(urls.fetchPrivacy);
        try {
          if (request.success) {
            request.success(privacyContent.data);
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

  voucherRedeem: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const params = request.data;
        const voucherConfirmation = await requestMethod.post(`${urls.giftVoucher}`, params);
        try {
          if (request.success) {
            request.success(voucherConfirmation.data.message);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error(e);
        }
      },
    });
  },

  removeAccount: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const accountRemoval = await requestMethod.post(`${urls.remove}/${request.data.id}`);
        try {
          if (request.success) {
            request.success();
          }
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

  getHot: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(urls.fetchCategoryProduct, request.data);
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

  getPGWLink: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(urls.pgwSSLSubscribe, request.data);
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("Error in fetching session ssl api \n", e);
        }
      },
    });
  },

  getNagadLink: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(urls.nagadDirectPayment, request.data);
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

  getSubscription: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.get(urls.fetchPackages);
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("Error in api  fetching subscription \n", e);
        }
      },
    });
  },

  handleAnonLogin: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(urls.anonymousLogin, request.data);
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("Error in api anonymous login \n", e);
        }
      },
    });
  },

  getCustomerDetails: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.get(`${urls.profileApi}/${session.storage.customer.id}`);
        if (data.data.is_success) {
          session.storage.customer = data.data.customer;
          session.update();
        }
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("Error in user data fetch api \n", e);
        }
      },
    });
  },

  getActivationCode: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.get(urls.getActivationCode);
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("Error in activation code api \n", e);
        }
      },
    });
  },

  verifyActivationCode: async function (request) {
    return session.refresh({
      success: async function (storage) {
        const data = await requestMethod.post(urls.verifyActivationCode, request.data);
        try {
          if (request.success) {
            request.success(data.data);
          }
        } catch (e) {
          request.error ? request.error(e) : console.error("Error in activation code api \n", e);
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
