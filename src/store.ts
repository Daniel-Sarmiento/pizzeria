import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    pizzasEnCarrito: Array()
  },
  mutations: {
    incializarPizzasEnCarrito(state){
      console.log(this.pizzasEnCarrito)
      if( localStorage.getItem('pizzas') ){
        let pizzas =  localStorage.getItem('pizzas')
        state.pizzasEnCarrito = JSON.parse(pizzas || '{}')
      }
    },
    agregarPizzaAlCarrito(state, pizza){
      state.pizzasEnCarrito.push(pizza)
      let pizzasStringfy = JSON.stringify(state.pizzasEnCarrito)
      localStorage.setItem( 'pizzas', pizzasStringfy)
    },
    vaciarCarrito(state){
      state.pizzasEnCarrito = Array()
      let pizzasStringfy = JSON.stringify(state.pizzasEnCarrito)
      localStorage.setItem('pizzas', pizzasStringfy)
    },
    updateCarrito(state, idx){
      state.pizzasEnCarrito.splice(idx, 1)
      let pizzasStringfy = JSON.stringify(state.pizzasEnCarrito)
      localStorage.setItem('pizzas', pizzasStringfy)
    }
  },
  actions: {

  },
});
