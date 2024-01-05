<template>

<div class="">

    <h2>Create new airport location</h2>

    <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
            <input v-model="form.name" type="text" class="form-control" id="staticEmail">
        </div>
    </div>
    <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Code</label>
        <div class="col-sm-10">
            <input v-model="form.code" type="text" class="form-control" id="staticEmail">
        </div>
    </div>

    <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Latitude</label>
        <div class="col-sm-10">
            <input v-model="form.latitude" type="number" class="form-control" id="staticEmail">
        </div>
    </div>

    <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Longitud</label>
        <div class="col-sm-10">
            <input v-model="form.longitud" type="number" class="form-control" id="staticEmail">
        </div>
    </div>

    <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
            <textarea v-model="form.Description" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
    </div>

    <button @click="save" class="btn btn-success">submit</button>

</div>

</template>

<script>

import axios from 'axios';

export default {
  data() {
    return {
      titulo: "Título inicial",
      descripcion: "Esta es una descripción inicial.",
      control: false,

      form: {},
    };
  },

  mounted(){
    this.control = true;
  },

  methods: {

    cambiarTitulo() {
      this.titulo = "Nuevo Título";
    },


    save(){
        console.log('save method')
        console.log("Form data ",this.form)

        // Hacer una petición POST con datos en formato JSON
        axios.post('http://127.0.0.1:3000/airport_locations', this.form, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('Error en la petición:', error);
          });
    },

  },
};
</script>