window.session = {
  languages: {
    audios: {},
    subtitles: {},
  },
  storage: {
    version: NaN,
    language: NaN,
    quality: "auto",
    id: NaN,
    country: NaN,
    token_type: NaN,
    access_token: NaN,
    jwtToken: NaN,
    expires_in: NaN,
    refresh_token: NaN,
    phone: NaN,
    customer: NaN,
    isAnonymous: NaN,
    cookies: {
      bucket: NaN,
      policy: NaN,
      signature: NaN,
      key_pair_id: NaN,
      expires: NaN,
    },
  },

  init: function (callback) {
    var storage = localStorage.getItem("session");
    if (storage) {
      try {
        storage = JSON.parse(storage);
        session.storage = storage || session.storage;
        if(session.storage.customer){
          api.getCustomerDetails({
            success: function(){
              console.log("Getting customer Data");
            }
          });
        }
      } catch (error) {
        console.error("error parse session.");
      }
    }
    session.update();
  },

  start: function (callback) {
    try {
      session.update();
      callback.success();
    } catch (error) {
      console.error("error from start", error);
      return callback.error(error);
    }
  },

  refresh: function (callback) {
    callback.success(session.storage);
  },

  cookies: function (callback) {
    if (session.isExpired(true)) {
      callback.success(session.update());
    } else {
      callback.success(session.storage);
    }
  },

  // return session token, if expires refresh, if doesn't exist returns undefined
  valid: function (callback) {
    if (session.storage && session.storage.jwtToken) {
      return session.refresh(callback);
    }
    return callback.error();
  },

  isExpired: function (coockie_type) {
    var expire_date = coockie_type ? session.storage.cookies.expires : session.storage.expires_in;
    return !(expire_date && expire_date >= new Date().getTime());
  },

  update: function () {
    localStorage.setItem("session", JSON.stringify(session.storage));
    return session.storage;
  },

  clear: function () {
    session.storage = {
      language: "en-US",
      quality: "auto",
      id: NaN,
      country: NaN,
      token_type: NaN,
      access_token: NaN,
      jwtToken: NaN,
      expires_in: NaN,
      refresh_token: NaN,
      phone: NaN,
      customer: NaN,
      cookies: {
        bucket: NaN,
        policy: NaN,
        signature: NaN,
        key_pair_id: NaN,
        expires: NaN,
      },
    };
    session.update();
  },
};
