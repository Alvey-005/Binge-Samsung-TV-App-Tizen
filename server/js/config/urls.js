window.urls = {
  // footer content
  fetchTerms: "/api/v3/tc/page",
  fetchFaq: "/api/v3/faq",
  fetchPrivacy: "/api/v3/privacy/page",
  fetchCountry: "/country_check",

  // login
  fetchOtpUrl: "/api/v3/otp/send",
  loginEmailUrl: "/api/v3/oauth/email/login",
  verifyOtpUrl: "/api/v3/otp/verify",
  singleAppLogin: "/api/v3/singleapp/mwAuthToken",
  socialLogin: "api/v3/oauth/verify",
  anonymousLogin: "api/v3/oauth/verify/login/anon",
  refreshToken: "api/v3/oauth/verify/login/anon/ref",
  anonFcmToken: "api/v3/oauth/store/anon/fcm-token",

  // banner
  fetchVodBanner: "/api/v3/banner/vod-home",
  fetchTvBanner: "/api/v3/banner/tv-home",
  fetchMovieBanner: "api/v3/banner/binge-movies",
  avodVodBanner: "/api/v3/banner/vod-home",
  avodTvBanner: "/api/v3/banner/tv-home",
  fetchOriginalsBanner: "api/v3/banner/binge-original",
  fetchSeriesBanner: "api/v3/banner/binge-series",
  fetchSportsBanner: "api/v3/banner/binge-sports",

  // category wise content
  fetchCategory: "/api/v3/page/allCategories",
  fetchCategoryProduct: "/api/v3/page/category/products",
  fetchProductDetails: "/api/v3/page/productDetails",
  fetchSearchUrl: "/api/v3/page/search",
  fetchAutocompleteUrl: "/api/v3/page/autocomplete",
  cineEvent: "/api/v3/cinextream/event",

  // notification
  fetchNotification: "/api/v3/notification",
  deleteNotification: "/api/v3/notification/delete",
  readNotification: "/api/v3/notification/read_by_id",

  // subscription
  fetchPackages: "/api/v3/package/relevant",
  fetchDobOtp: "/api/v3/subscription/dob/otp",
  dobSubscribe: "/api/v3/subscription/dob/verify-otp",
  dobTvodSubscribe: "/api/v3/subscription/dob/tvod/verify-otp",
  fetchSubscription: "/api/v3/subscription/active/phone",
  fetchOperatorType: "/api/v3/customer/operator",
  dobUnsubscribe: "/api/v3/subscription/package/void",
  pgwSubscribe: "/api/v3/subscription/pw/invoice",
  pgwSubscribeSuccess: "/api/v3/subscription/pw/pack",
  pgwTvodSubscribe: "/api/v3/subscription/pw/tvod/invoice",
  fetchActiveTvods: "api/v3/customer/tvod/subscriptions",
  rabitUnsubscribe: "api/v3/subscription/package/tvod/void",
  pgwSSLSubscribe: "api/v3/subscription/ssl/session",
  pgwSSLTvodSubscribe: "api/v3/subscription/ssl/tvod/session",
  onnetoffnet: "api/v3/onnetoffnet",
  nagadDirectPayment: "api/v3/subscription/mfs/nagad/payment/create",
  nagadTvodDirectPayment: "api/v3/subscription/mfs/nagad/tvod/payment/create",
  giftVoucher: "api/v3/subscription/voucher",

  // profile
  profileApi: "/api/v3/customer",
  fetchDistrict: "/api/v3/setting/districts",
  fetchIsp: "/api/v3/setting/isps",
  wishlist: "/api/v3/customer/wishlist",
  rating: "/api/v3/customer/feedback",

  fetchVudrmToken: "/api/v3/vu/token",
  fetchJwtToken: "/api/v3/singleapp/mwAuthToken",
  submitVodWatchTime: "/api/v3/usage/vod",
  fetchUsageHistory: "/api/v3/usage/graphData",
  submitTvWatchTime: "/api/v3/usage/tvChannel",
  closeContent: "/api/v3/usage/closeContent",

  // connect to tv
  connectTv: "/api/v3/connectTv/saveCustomerIdToConnectTV",
  getActivationCode: "tv/connectTv/getActivationCode",
  verifyActivationCode: "tv/connectTv/verify/ActivationCode",

  // logout
  logout: "/api/v3/customer/logout",

  // account remove
  remove: "api/v3/customer/remove",

  //genre
  genre: "genre",
};
