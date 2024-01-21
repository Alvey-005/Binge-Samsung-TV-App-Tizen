window.firebaseConfig = {
    app: null,
    auth: null,
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
        console.log("firebase init");
        if (!session.storage.jwtToken) {
            console.log("token not found");
            firebaseConfig.initializeFirebase(function () {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        } 
        else {
            console.log("token found");
        }
    },

    initializeFirebase: function (callback) {
        console.log("firebase initialize");
        firebaseConfig.app = firebase.initializeApp(firebaseConfig.appConfig);
        firebaseConfig.auth = firebase.initializeAuth(firebaseConfig.app, {
            persistence: firebase.browserSessionPersistence,
            popupRedirectResolver: firebase.browserPopupRedirectResolver,
        });
        firebaseConfig.firebaseAnonymousSignIn(callback);
    },
    
    firebaseAnonymousSignIn: function (callback) {
        console.log("firebase anonymous sign in");
        firebase.signInAnonymously(firebaseConfig.auth)
        .then(function (signInResult) {
        console.log("Signed in anonymously:", signInResult.user);
            api.handleAnonLogin({
                data: {
                    uid: signInResult.user.uid,
                    access_token: signInResult.user.accessToken,
                },
                success: function (response) {
                    if (response.token) {
                        console.log("api call: token found");
                        session.storage.jwtToken = response.token;
                        session.update();
                        main.events.login();
                    }
                },
                error: function (error) {
                    console.log(error);
                },
            });
            if (typeof callback === 'function') {
                callback();
            }
        })
        .catch(function (error) {
            console.error("Error signing in anonymously:", error);
            if (typeof callback === 'function') {
                callback();
            }
        });
    },
};