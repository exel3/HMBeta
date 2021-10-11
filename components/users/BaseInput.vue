<template>
  <input :value="value" :class="inputBase"  :disabled="status" @input="$emit('input', $event.target.value); getBorderColor($event.target.value)">
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
    inputBase:'inputBase',
  }),
  methods:{
    getBorderColor(currentValue){
     currentValue===''? this.inputBase ='inputBaseAlert' :   this.inputBase = 'inputBase'}
  }
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
.inputBaseAlert {
    color: black;
      border: red;
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