import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDrnxpG6_nsssAq2NO5H19tccLInsHiEG4",
    authDomain: "iclean-59a5b.firebaseapp.com",
    projectId: "iclean-59a5b",
    storageBucket: "iclean-59a5b.appspot.com",
    messagingSenderId: "475804456084",
    appId: "1:475804456084:web:07074e4182be1cb8b35081",
    measurementId: "G-BB4KX8W7VN"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
          console.log('Notification permission granted.');
          const messaging = getMessaging(app);
          getToken(messaging, { vapidKey: 'BKKMuxxdK363l0nWfji6v1gjfK6PF-oUKtNSDhsN0wBtiQRnY1729g6KuK0082pSmFGXjaMGu7VoRoxaSlwRlcg' })
              .then((currentToken) => {
                  if (currentToken) {
                      console.log('currentToken: ', currentToken);
                      localStorage.setItem('FcmToken', currentToken);
                      console.log('firebase');
                  } else {
                      console.log('cant not get token');
                  }
              });
      } else {
          console.log('Do not have permission');
      }
  });
}

requestPermission();

export const storage = getStorage(app);
export default app;