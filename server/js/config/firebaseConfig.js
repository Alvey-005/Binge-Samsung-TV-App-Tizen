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

    init: function () {
        this.app = firebase.initializeApp(this.appConfig);
        this.auth = firebase.initializeAuth(this.app, {
            persistence: firebase.browserSessionPersistence,
            popupRedirectResolver: firebase.browserPopupRedirectResolver,
        });
        this.firebaseAnonymousSignIn();
    },
    
    firebaseAnonymousSignIn: async function () {
        try {
            const user = await this.auth.currentUser;
            const signInResult = await firebase.signInAnonymously(this.auth);
            console.log("Signed in anonymously:", signInResult.user);
        } catch (error) {
            console.error("Error signing in anonymously:", error);
        }
    }
};