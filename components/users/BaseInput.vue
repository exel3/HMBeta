<template>
  <input class="inputBase" :value="value" :disabled="status">
</template>
<script>
export default {
  name: 'BaseInputUsers',
  props: {
    value: {
      type: String,
      required: true
    },
  status: {
    type:Boolean,
    required:true
  }
  },
  data: () => ({

  })
}
</script>
<style scoped>
.inputBase {
  color: black;
      border: none;
      background: transparent;
      height: 100%;
      width: 100%;
}
.inputBase:enabled {
   border: 1px solid #dee2e6;
}
  .inputBase:disabled {
  border: none;
  }
</style>