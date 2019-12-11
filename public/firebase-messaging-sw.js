importScripts('https://www.gstatic.com/firebasejs/6.2.4/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/6.2.4/firebase-messaging.js')


firebase.initializeApp({
    'messagingSenderId': '165699184248' //config de main.ts
})

const messaging = firebase.messaging();