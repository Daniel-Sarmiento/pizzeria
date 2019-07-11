import Vue from 'vue';
import './plugins/vuetify'
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import Vuelidate from 'vuelidate';
//import firebase from 'firebase';

Vue.config.productionTip = false;

Vue.use(Vuelidate)

const config = {
  
}

/*
firebase.initializeApp(config);

const messaging = firebase.messaging()
messaging.usePublicVapiKey('')

messaging.requestPermission().then( () => {
  //Get Token
  messaging.getToken().then( (token)=>{
    console.log(token)
  })
}).catch( (err) => {
  console.log(err)
})
*/
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
