<template>
  <v-container class="my-2">
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg3 v-for="pizza in pizzas" v-bind:key="pizza.id">    
        <v-card class="ma-2">
          <v-img
            :src="pizza.image"
            height="200px"
          >
          </v-img>
 
          <v-card-title primary-title>
            <div>
              <div class="headline"> {{ pizza.title }}</div>
              <div class="headline"><span class="green--text"> ${{ pizza.prices.mediana }} </span></div>
            </div>
            
          </v-card-title>
          <v-card-actions>
            <v-btn flat color="blue" @click="$store.commit('agregarPizzaAlCarrito', pizza )">Añadir al carrito</v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="pizza.show  = !pizza.show ">
              <v-icon>{{ pizza.show  ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-slide-y-transition>
            <v-card-text v-show="pizza.show">
              {{ pizza.description }} 
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios';
  export default {
    data: () => ({
      show: false,
      pizzas: null,
      user: '',
    }),
    methods: {
      getPizzas(){
        const path = 'https://api-rest-pizzeria.herokuapp.com/api/pizzas';
        axios.get(path).then( (response)=>{
          this.pizzas = response.data.pizzas.map(p=>{
            p.show = false
            return p
          })
            console.log(response.data.pizzas)
          }).catch((err)=>{
            console.log(err)
          })
      }
    },
    computed:{
      total(){
        return 0
      }
    },
    created(){
      this.getPizzas()
      let navigator_info = window.navigator;
      let screen_info = window.screen;
      let uid = navigator_info.mimeTypes.length;
      uid += navigator_info.userAgent.replace(/\D+/g, '');
      uid += navigator_info.plugins.length;
      uid += screen_info.height || '';
      uid += screen_info.width || '';
      uid += screen_info.pixelDepth || '';
      this.user = uid
    }
  }
</script>

<style>

</style>
