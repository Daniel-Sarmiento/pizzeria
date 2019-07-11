import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pizzasEnCarrito: []
  },
  mutations: {
    incializarPizzasEnCarrito(state){
      if( localStorage.getItem('pizzas') ){
        let pizzas =  localStorage.getItem('pizzas')
        state.pizzasEnCarrito = JSON.parse(pizzas)
      }
    },
    agregarPizzaAlCarrito(state, pizza){
      state.pizzasEnCarrito.push(pizza)
      let pizzasStringfy = JSON.stringify(state.pizzasEnCarrito)
      localStorage.setItem( 'pizzas', pizzasStringfy)
    }
  },
  actions: {

  },
});
