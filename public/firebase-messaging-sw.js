 // Scripts for firebase and firebase messaging
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 // Initialize the Firebase app in the service worker by passing the generated config
 const firebaseConfig = {
    apiKey: "AIzaSyBI53_ZJhDHN9uPXEmpZrN4fITeD0NCvR8",
  authDomain: "cleaninghouseservice-23aa3.firebaseapp.com",
  projectId: "cleaninghouseservice-23aa3",
  storageBucket: "cleaninghouseservice-23aa3.appspot.com",
  messagingSenderId: "201459656752",
  appId: "1:201459656752:web:653ea1497c5fd24d7fa5f5",
  measurementId: "G-6PESFER3SW"
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