// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/6.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.1/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
var config = {
  messagingSenderId: 'AAAAYWBH4a8:APA91bFuE9zoDNfqTEIa-MmtCK_T73cDbNqcQm08w-7NVHVwjBeJ5NjPV0vHVv4XASNMbTQ7ZgREDDCDbLQviAJr6n2O7KgRYmM8pjzQqh5T48iMrwRGqxsFK-UE09jF3UxxzMHpC23Y'
};
// Retrieve an instance of Firebase Data Messaging so that it can handle background messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});