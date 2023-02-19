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
          getToken(messaging, { vapidKey: 'BLMVZox38TsNKfO-1Y_fNRWZFMwVN9ut6BD1Qw0HJGL3b6JEmw3Mm7Z8s3iIhlMw7dUzwJjM8GH8AtJ3xgKXJTI' })
              .then((currentToken) => {
                  if (currentToken) {
                      console.log('currentToken: ', currentToken);
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