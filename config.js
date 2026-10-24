/**
 * Website settings. This file is published as-is next to index.html, so it can be edited on
 * GitHub without rebuilding the app.
 *
 * apiUrl: the Apps Script web app URL (Deploy → Manage deployments → Web app URL), ending in /exec.
 * firebase, vapidKey: push notifications on phones and computers (Firebase console → Project settings →
 *   General → Your apps → Web app → firebaseConfig, and Cloud Messaging → Web Push certificates →
 *   Key pair). Both are public, not passwords. Leave firebase empty to hide "Turn on notifications".
 *   The server also needs the service account (Script property FCM_SERVICE_ACCOUNT, see DEPLOY.md).
 */
window.TGA_CONFIG = {
  apiUrl: 'https://script.google.com/macros/s/AKfycbx_J1Fb6FOxuAvAtzzT5C_pElGzIV0RUyxADGfPOMHTjXKNxea3n1XgbNDn6eL-Opog/exec',
  appName: 'The Gambia Academy',
  googleClientId: '985953295183-9phpbs5vl22pn8hit8b5kh0d5ijo1lme.apps.googleusercontent.com',
  liveSeconds: 15,
  firebase: {
    apiKey: 'AIzaSyAlxp2zEh_KfzBopNEjGi7RwQakC1tZ1eE',
    authDomain: 'jangafrika-13cc2.firebaseapp.com',
    projectId: 'jangafrika-13cc2',
    storageBucket: 'jangafrika-13cc2.firebasestorage.app',
    messagingSenderId: '1045761535833',
    appId: '1:1045761535833:web:9c0677c8305269889ee648'
  },
  vapidKey: 'BMqHM6Pn8Bbm-ZuloibGiPSjzqLWEIZTJONx0LTg0Jtz7g8SJTcOFZzVi5dx0tUYTkTabUFCNPJLvGcrUszXrq0'
};
