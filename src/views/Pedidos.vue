<template>
  <PedidosComponent></PedidosComponent>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import PedidosComponent from '@/components/PedidosComponent.vue';

  @Component({
    components: {
      PedidosComponent
    },
    
  })
  export default class Orden extends Vue {
  }
</script>
