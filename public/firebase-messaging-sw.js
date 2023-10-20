importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 // Initialize the Firebase app in the service worker by passing the generated config
 const firebaseConfig = {
  apiKey: "AIzaSyDrnxpG6_nsssAq2NO5H19tccLInsHiEG4",
  authDomain: "iclean-59a5b.firebaseapp.com",
  projectId: "iclean-59a5b",
  storageBucket: "iclean-59a5b.appspot.com",
  messagingSenderId: "475804456084",
  appId: "1:475804456084:web:07074e4182be1cb8b35081",
  measurementId: "G-BB4KX8W7VN"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});