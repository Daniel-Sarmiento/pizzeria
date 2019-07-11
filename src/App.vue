<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title>
        <router-link to="/">
        <span  class="font-weight-light">UPizzas</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        to="pedidos"
      >
        <span class="mr-2">Historial</span>
      </v-btn>
      <v-btn
        flat
        to="orden"
      >
        <span class="mr-2">Carrito {{ $store.state.pizzasEnCarrito.length }}</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  
  name: 'App',
  data () {
    return {
      //
    }
  },
  created(){
    this.$store.commit('incializarPizzasEnCarrito')
  }
}
</script>
