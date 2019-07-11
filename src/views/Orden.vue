<template>
  <OrdenComponent></OrdenComponent>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import OrdenComponent from '@/components/OrdenComponent.vue';

  @Component({
    components: {
      OrdenComponent
    },
    
  })
  export default class Orden extends Vue {
  }
</script>
