<!--
<template>
    <div>
      <h1> Order component </h1>
      <div ref="card"></div>
      <button v-on:click="purchase">Pagar</button>
    </div>
</template>
-->
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
              <h2>{{order.title}}</h2>
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
            <!-- <p>Tamaño</p>
            <v-radio-group v-model="tamano" :mandatory="false" row>
              <v-radio label="chica" value="chica"></v-radio>
              <v-radio label="mediana" value="mediana"></v-radio>
              <v-radio label="grande" value="grande"></v-radio>
            </v-radio-group>

            <v-select
              v-model="ingredienteExtra"
              :items="items"
              :error-messages="selectErrors"
              label="Ingrediente extra"
              required
              @change="$v.select.$touch()"
              @blur="$v.select.$touch()"
            ></v-select> -->


          <v-btn
            color="primary"
            @click="e1 = 2"
          >
            Continue
          </v-btn>

          <v-btn flat>Cancel</v-btn>
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
            Continue
          </v-btn>

          <v-btn flat>Cancel</v-btn>
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
            Finish
          </v-btn>
          <!-- @click="e1 = 1" -->

          <v-btn flat>Cancel</v-btn>
        </v-stepper-content>
      </form>
    </v-stepper-items>
  </v-stepper>
  <div>
      <h1> Pago </h1>
      <!-- <div ref="card"></div> -->
      <button v-on:click="purchase">Pagar</button>
    </div>
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
      card = elements.create('card', style);
      card.mount(this.$refs.card);
    },//mounted
    created(){
      this.incializarOrders()
    },
    methods: {
      incializarOrders(){
        if( localStorage.getItem('pizzas') ){
          let pizzas =  localStorage.getItem('pizzas')
          pizzas = JSON.parse(pizzas)
          console.log(pizzas)
          this.orders = pizzas.map( pizza =>{
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
        console.log(this.orders)
      },
      purchase: function () {
        stripe.createToken(card).then(function(result) {
          const path = 'http://localhost:3000/charge';
      
          console.log(result)
          
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
          name: this.name,
          email: this.email,
          phone: this.telefono,
          zip: this.zip,
          address: this.direccion,
          orders: this.orders,
          total: total
        }
        console.log("invoice", invoice)
        stripe.createToken(card).then(function(stripeResult) {
          const path = 'http://localhost:3000/api/invoices';
          invoice.stripe = stripeResult
          
          axios.post(path, invoice).then( (response)=>{
            console.log("redirigir a estadisticas")
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