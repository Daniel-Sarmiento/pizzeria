<template>
  <v-container>
      <v-layout column>
          <!--pedido-->
          <v-flex xs12 sm12 md12 lg12 v-for="pedido in pedidos" v-bind:key="pedido._id">
            <h3> 
                <span class="blue--text"> ORDEN ID: </span>{{pedido._id}} 
                <span class="blue--text" v-if="pedido.status==0"> Recibida</span>
                <span class="orange--text" v-if="pedido.status==1"> en Camino</span>
                <span class="green--text" v-if="pedido.status==2"> Entregada</span>
            </h3>
            <h3> 
                <span class="blue--text"> TOTAL: </span>
                <span class="green--text">${{pedido.total}}</span>
            </h3>
              <v-layout row wrap>
                <!--ordenes-->
                <v-flex xs12 sm6 md4 lg4 v-for="orden in pedido.orders" v-bind:key="orden._id">
                    <v-card class="ma-3">
                        <v-img
                            :src="orden._pizza.image"
                            height="200px"
                        >
                        </v-img>
                
                        <v-card-title primary-title>
                            <div>
                              <div class="headline">{{ orden._pizza.title }} </div>
                            
                              <div> 
                                  {{ orden.tamano }}:
                                  <span class="green--text"> ${{ orden._pizza.prices[orden.tamano] }} </span>
                              </div>
                              <div v-if="orden.extra != ''"> 
                                  {{ orden.extra }} extra :
                                  <span class="green--text"> ${{ orden.subTotal - orden._pizza.prices[orden.tamano] }} </span>
                              </div>
                              <div>
                                SUBTOTAL:<span class="green--text"> ${{ orden.subTotal }} </span>
                              </div>
                              
                              </div>
                        </v-card-title>
                    </v-card>
                </v-flex>
              </v-layout>
          </v-flex>
      </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios';
  export default {
    data: () => ({
        pedidos: []
    }),
    methods: {
      getPedidos(){
        let navigator_info = window.navigator;
        let screen_info = window.screen;
        let uid = navigator_info.mimeTypes.length;
        uid += navigator_info.userAgent.replace(/\D+/g, '');
        uid += navigator_info.plugins.length;
        uid += screen_info.height || '';
        uid += screen_info.width || '';
        uid += screen_info.pixelDepth || '';

        const path = 'https://api-rest-pizzeria.herokuapp.com/api/myinvoices';
        axios.post(path, {user: uid}).then( (response)=>{
            this.pedidos = response.data
            console.log(this.pedidos)
          }).catch((err)=>{
            console.log(err)
          })
      }
    },
    computed: {
      binding () {
        const binding = {}

        if (this.$vuetify.breakpoint.mdAndUp) binding.column = true

        return binding
      }
    },
    created(){
      this.getPedidos()
    }
  }
</script>

<style>

</style>