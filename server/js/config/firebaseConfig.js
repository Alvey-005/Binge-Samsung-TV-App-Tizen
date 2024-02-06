window.firebaseConfig = {
  app: null,
  auth: null,
  retry: 0,
  appConfig: {
    apiKey: "AIzaSyDKtOJpkYEDnQVKNnyCeyoN1DjajMW7o9g",
    authDomain: "binge-mobile.firebaseapp.com",
    databaseURL: "https://binge-mobile.firebaseio.com",
    projectId: "binge-mobile",
    storageBucket: "binge-mobile.appspot.com",
    messagingSenderId: "84147851202",
    appId: "1:84147851202:web:839afbf7d74575a729505b",
    measurementId: "G-CNNSYHBDMN",
  },

  init: function (callback) {
    if (!session.storage.jwtToken) {
      firebaseConfig.initializeFirebase(function () {
        if (typeof callback === "function") {
          callback();
        }
      });
    } else {
      session.update();
      translate.init();
      main.events.login();
    }
  },

  initializeFirebase: function (callback) {
    firebaseConfig.app = firebase.initializeApp(firebaseConfig.appConfig);
    firebaseConfig.auth = firebase.initializeAuth(firebaseConfig.app, {
      persistence: firebase.browserSessionPersistence,
      popupRedirectResolver: firebase.browserPopupRedirectResolver,
    });
    firebaseConfig.firebaseAnonymousSignIn(callback);
  },

  firebaseAnonymousSignIn: function (callback) {
    firebase
      .signInAnonymously(firebaseConfig.auth)
      .then(function (signInResult) {
        api.handleAnonLogin({
          data: {
            uid: signInResult.user.uid,
            access_token: signInResult.user.accessToken,
          },
          success: function (response) {
            if (response.token) {
              session.storage.jwtToken = response.token;
              session.storage.isAnonymous = true;
              session.update();
              translate.init();
              main.events.login();
            }
          },
          error: function (error) {
            console.error(error);
          },
        });
        if (typeof callback === "function") {
          callback();
        }
      })
      .catch(function (error) {
        firebaseConfig.retry++;
        console.error("Error signing in anonymously:", error);
        if (firebaseConfig.retry > 3) {
          session.update();
          translate.init();
          main.events.login();
        } else {
          firebaseConfig.firebaseAnonymousSignIn(callback);
        }
        if (typeof callback === "function") {
          callback();
        }
      });
  },
};
