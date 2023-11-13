<template>

<div class="">

    <h2>Create new airport location</h2>

    <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
            <input type="text" class="form-control" id="staticEmail">
        </div>
    </div>
    <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Code</label>
        <div class="col-sm-10">
            <input type="text" class="form-control" id="staticEmail">
        </div>
    </div>

    <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Latitude</label>
        <div class="col-sm-10">
            <input type="number" class="form-control" id="staticEmail">
        </div>
    </div>

    <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Longitud</label>
        <div class="col-sm-10">
            <input type="number" class="form-control" id="staticEmail">
        </div>
    </div>

    <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Description</label>
        <div class="col-sm-10">
            <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
    </div>

    <button @click="save" class="btn btn-success">submit</button>

</div>

</template>

<script>
export default {
  data() {
    return {
      titulo: "Título inicial",
      descripcion: "Esta es una descripción inicial.",
      control: false,
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
    }

  },
};
</script>