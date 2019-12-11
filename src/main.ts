import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import Vuelidate from 'vuelidate';
import firebase from 'firebase';

Vue.config.productionTip = false;

Vue.use(Vuelidate)

const config = {
  apiKey: "AIzaSyARj-4PaEgkipQO6UwgXMlm2i9CwZaF_RU",
  authDomain: "pizzeria-9465a.firebaseapp.com",
  databaseURL: "https://pizzeria-9465a.firebaseio.com",
  projectId: "pizzeria-9465a",
  storageBucket: "",
  messagingSenderId: "165699184248",
  appId: "1:165699184248:web:2ca0c67b205ef71e"
}


firebase.initializeApp(config);

const messaging = firebase.messaging()
messaging.usePublicVapidKey('BKZeb26Th07DK3FJwOl9QAPuSGKgzeBtLbze0QNUEMSN8whSG1cHZKK701p0ra6Nit2QcvNHNepgUzraDX6Tc-g')

messaging.requestPermission().then( () => {
  //Get Token
  messaging.getToken().then( (token)=>{
    console.log(token)
    localStorage.setItem('tokenFirebase', token || '')
  })
}).catch( (err) => {
  console.log(err)
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
