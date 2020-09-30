// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: env = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDJm8PM53B6jP0x5D4MPtDg6QQ4BvLYVfY",
    authDomain: "boba-maps-firebase.firebaseapp.com",
    databaseURL: "https://boba-maps-firebase.firebaseio.com",
    projectId: "boba-maps-firebase",
    storageBucket: "boba-maps-firebase.appspot.com",
    messagingSenderId: "418227151279",
    appId: "1:418227151279:web:d4225468cb48d2cd554f5a",
    measurementId: "G-FM963L3ZVB"
  },
  url: 'http://bobamaps.ap-southeast-1.elasticbeanstalk.com',
  photoAPIKey: 'AIzaSyA1nG6Hz_vqvqHoA3s67b8tXEDdpglS0Bs',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
