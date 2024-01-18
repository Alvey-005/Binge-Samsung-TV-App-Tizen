// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
// import { initializeAuth, signInAnonymously, browserPopupRedirectResolver, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'

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
        console.log("firebase init", window);
        this.app = initializeApp(this.appConfig);
        this.auth = initializeAuth(this.app, {
            persistence: browserSessionPersistence,
            popupRedirectResolver: browserPopupRedirectResolver,
        });
        this.firebaseAnonymousSignIn();
    },
    
    firebaseAnonymousSignIn: async function () {
        try {
            const user = await this.auth.currentUser;
            const signInResult = await signInAnonymously(this.auth);
            console.log("Signed in anonymously:", signInResult.user);
        } catch (error) {
            console.error("Error signing in anonymously:", error);
        }
    }
};