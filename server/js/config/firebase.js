import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js'
import { initializeAuth, signInAnonymously, browserPopupRedirectResolver, browserSessionPersistence } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyDKtOJpkYEDnQVKNnyCeyoN1DjajMW7o9g",
    authDomain: "binge-mobile.firebaseapp.com",
    databaseURL: "https://binge-mobile.firebaseio.com",
    projectId: "binge-mobile",
    storageBucket: "binge-mobile.appspot.com",
    messagingSenderId: "84147851202",
    appId: "1:84147851202:web:839afbf7d74575a729505b",
    measurementId: "G-CNNSYHBDMN",
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
    persistence: browserSessionPersistence,
    popupRedirectResolver: browserPopupRedirectResolver,
});

const user = await auth.currentUser;
const signInResult = await signInAnonymously(auth);
console.log("Signed in anonymously:", signInResult.user);
session.storage.jwtToken = signInResult.user.accessToken;