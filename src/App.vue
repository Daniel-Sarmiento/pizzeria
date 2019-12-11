<template>
  <v-app>
    <v-toolbar app dark color="primary">
      <v-toolbar-title>
        <router-link to="/">
        <span  class="font-weight-light white--text">UPizzas</span>
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        to="pedidos"
      >
        <span class="">Historial</span>
      </v-btn>
      <v-btn
        flat
        to="orden"
      >
      <v-icon>shopping_cart</v-icon>{{ $store.state.pizzasEnCarrito.length }}
        <!-- <span class="mr-2">Carrito {{ $store.state.pizzasEnCarrito.length }}</span> -->
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
