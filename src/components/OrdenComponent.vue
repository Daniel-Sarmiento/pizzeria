<template>
<v-container>
  <v-stepper v-model="e1">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1" editable>Pizza</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2" editable>Método de pago</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="3" editable>Datos de entrega</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <form>
        <v-stepper-content step="1">
            <v-card class="mb-4 p-5"
            color="grey lighten-4"
            height="200px" v-for="(order, index) in orders" v-bind:key="index">
              <h2>{{order.title}} 
                <v-btn icon @click="deleteOrder(order)">
                   <v-icon color="red" >delete_forever</v-icon>
                </v-btn> </h2>
                <v-radio-group v-model="order.tamano" :mandatory="false" row>
                  <v-radio label="chica" value="chica"></v-radio>
                  <v-radio label="mediana" value="mediana"></v-radio>
                  <v-radio label="grande" value="grande"></v-radio>
                </v-radio-group>
                <v-select
                  v-model="order.extra"
                  :items="items"
                  :error-messages="selectErrors"
                  label="Ingrediente extra"
                  required
                ></v-select> 
                <!-- <p>tamano: {{ order.tamano }}, extra: {{ order.extra }}</P> -->
                <h4 v-if="order.pricesExtra[order.extra]">
                  Subtotal: ${{ order.prices[order.tamano] + order.pricesExtra[order.extra]  }}
                </h4>
                <h4 v-if="!order.pricesExtra[order.extra] ">
                  Subtotal: ${{ order.prices[order.tamano]  }}
                </h4>
            </v-card>
            <h2>Total: ${{total}} </h2>

          <v-btn
            color="primary"
            @click="e1 = 2"
          >
            Continuar
          </v-btn>

          <v-btn flat to="/">Cancelar</v-btn>
        </v-stepper-content>

        <v-stepper-content step="2">
          <div class="mb-3 mt-2" ref="card"></div>

            <v-text-field
            v-model="name"
            :error-messages="nameErrors"
            :counter="10"
            label="Nombre"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
          <v-text-field
            v-model="email"
            :error-messages="emailErrors"
            label="E-mail"
            required
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
          >
          </v-text-field>

          <v-text-field 
          v-model="telefono" mask="phone" label="Telefono">
          </v-text-field>
          <v-btn
            color="primary"
            @click="e1 = 3"
          >
            Continuar
          </v-btn>

          <v-btn flat to="/">Cancelar</v-btn>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-text-field
            v-model="direccion"
            label="Direccion"
            prepend-inner-icon="place"
            :error-messages="direccionErrors"
            @change="$v.direccion.$touch()"
            @blur="$v.direccion.$touch()"
            required
          ></v-text-field>
          <v-text-field
            ref="zip"
            v-model="zip"
            label="ZIP / Código Postal"
          ></v-text-field>

          <v-btn
            color="primary"
            @click="finish()"
          >
            Comprar
          </v-btn>
          <!-- @click="e1 = 1" -->
          <v-btn flat to="/">Cancelar</v-btn>
        </v-stepper-content>
      </form>
    </v-stepper-items>
  </v-stepper>
    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
      fixed
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Procesando orden, espere por favor.
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
</v-container>
</template>

<script>
  import axios from 'axios';
  import { Component, Vue } from 'vue-property-decorator';
  import { validationMixin } from 'vuelidate';
  import { required, maxLength, email } from 'vuelidate/lib/validators';

  let stripe = Stripe(`pk_test_OYuXFtpppcRx1rTc7ifegyhh00hbhxY1oA`),
    elements = stripe.elements(),
    card = undefined;
  
  let style = {
    base: {
      border: '1px solid #D8D8D8',
      borderRadius: '4px',
      color: "#000",
    },

  invalid: {
    // All of the error styles go inside of here.
  }

};

  export default {
    data: () => ({
      dialog: false,
      orders: [],
      e1: 0,
      name: '',
      email: '',
      direccion: '',
      zip: '',
      telefono: '',
      items: [
        'queso',
        'salsa',
      ]
    }),//data
    mounted: function () {
      stripe = Stripe(`pk_test_OYuXFtpppcRx1rTc7ifegyhh00hbhxY1oA`),
      elements = stripe.elements(),
      card = undefined;
      card = elements.create('card', style);
      card.mount(this.$refs.card);
    },//mounted
    created(){
      this.incializarOrders();
    },
    methods: {
      deleteOrder(order){
        let idx = this.orders.indexOf(order);
        if(idx != -1){
            this.orders.splice(idx, 1)
            this.$store.commit('updateCarrito', idx)
        }
      },
      incializarStripe(){
        this.stripe = Stripe(`pk_test_OYuXFtpppcRx1rTc7ifegyhh00hbhxY1oA`)
        this.elements = this.stripe.elements()
        this.card = undefined;
      },
      incializarOrders(){
        if( localStorage.getItem('pizzas') ){
          let pizzas =  localStorage.getItem('pizzas')
          pizzas = JSON.parse(pizzas)
          console.log("local",pizzas)
          this.orders = pizzas.map( pizza =>{
            console.log("map", pizza)
            return { 
            _pizza: pizza._id,
            title: pizza.title,
            prices: pizza.prices,
            tamano:'mediana',
            extra: '',
            subTotal: '',
            pricesExtra: {
              salsa: 50,
              queso: 100
            }
            }
          })
        }
        console.log("this orders",this.orders)
      },
      purchase: function () {
        stripe.createToken(card).then(function(result) {
          const path = 'http://localhost:3000/charge';
          
          axios.post(path, result).then( (response)=>{
            console.log(response)
          }).catch((err)=>{
            console.log(err)
          })

        });
      },
      submit () {
        this.$v.$touch()
      },
      finish(){
        this.dialog = true;
        let tokenFirebase = localStorage.getItem('tokenFirebase');
        let navigator_info = window.navigator;
        let screen_info = window.screen;
        let uid = navigator_info.mimeTypes.length;
        uid += navigator_info.userAgent.replace(/\D+/g, '');
        uid += navigator_info.plugins.length;
        uid += screen_info.height || '';
        uid += screen_info.width || '';
        uid += screen_info.pixelDepth || '';
        console.log(uid);

        let total = 0
        this.orders.map(order=>{
          order.subTotal = order.prices[order.tamano]
          if(order.extra)
            order.subTotal += order.pricesExtra[order.extra]

          total += order.subTotal
          delete order.prices
          delete order.pricesExtra
          delete order.title

        })
        
        let invoice = {
          user: uid,
          tokenFirebase: tokenFirebase,
          name: this.name,
          email: this.email,
          phone: this.telefono,
          zip: this.zip,
          address: this.direccion,
          orders: this.orders,
          total: total
        }
        console.log("invoice", invoice)
        stripe.createToken(card).then((stripeResult) => {
          const path = 'https://api-rest-pizzeria.herokuapp.com/api/invoices';
          invoice.stripe = stripeResult

          axios.post(path, invoice).then( (response)=>{
            this.dialog = false;
            this.$router.push('pedidos')
            this.$store.commit('vaciarCarrito')
          }).catch((err)=>{
            console.log(err)
          })

        });
      }
    },//methods
    computed: {
      total(){
        let total = 0
        this.orders.forEach(order=>{
          if(order.prices[order.tamano])
            total += order.prices[order.tamano]
          if(order.pricesExtra[order.extra])
            total += order.pricesExtra[order.extra]
        })
        return total
      },
      checkboxErrors () {
        const errors = []
        if (!this.$v.checkbox.$dirty) return errors
        !this.$v.checkbox.checked && errors.push('You must agree to continue!')
        return errors
      },
      selectErrors () {
        const errors = []
        if (!this.$v.ingredienteExtra.$dirty) return errors
        !this.$v.ingredienteExtra.required && errors.push('Item is required')
        return errors
      },
      nameErrors () {
        const errors = []
        if (!this.$v.name.$dirty) return errors
        !this.$v.name.maxLength && errors.push('Name must be at most 10 characters long')
        !this.$v.name.required && errors.push('Name is required.')
        return errors
      },
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.email && errors.push('Must be valid e-mail')
        !this.$v.email.required && errors.push('E-mail is required')
        return errors
      },
      direccionErrors(){
        const errors = []
        if (!this.$v.direccion.$dirty) return errors
        !this.$v.direccion.required && errors.push('Dirección is required')
        return errors
      }
    },//computed
    mixins: [validationMixin],
    validations: {
      name: { required, maxLength: maxLength(30) },
      email: { required, email },
      ingredienteExtra: { required },
      direccion: { required },
      
    },//validations
  }
</script>