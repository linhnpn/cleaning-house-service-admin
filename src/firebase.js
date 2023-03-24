import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBI53_ZJhDHN9uPXEmpZrN4fITeD0NCvR8",
    authDomain: "cleaninghouseservice-23aa3.firebaseapp.com",
    projectId: "cleaninghouseservice-23aa3",
    storageBucket: "cleaninghouseservice-23aa3.appspot.com",
    messagingSenderId: "201459656752",
    appId: "1:201459656752:web:653ea1497c5fd24d7fa5f5",
    measurementId: "G-6PESFER3SW"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
          console.log('Notification permission granted.');
          const messaging = getMessaging(app);
          getToken(messaging, { vapidKey: 'BPBNRzwTLvHhX7ZxiXE8pZf2BTM4K-aFA_oxEnsEXURpoi3Z8YXv1TNaQ5iVp6evKHnBufGGdGwWbyW_BRgWs8o' })
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