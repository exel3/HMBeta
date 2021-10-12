<template>
  <tr>
    <td><BaseInput :value="currentTable.name" :status="status" @input="currentTable.name =  $event" /></td>
    <td><BaseInput :value="currentTable.QR" :status="status" @input="currentTable.QR =  $event" /></td>
    <td class="tdOptions">
      <BaseButtonTable
        v-if="status === true"
        backcolor="#f7fafc"
        bordercolor="#f7fafc"
        imgsrc="edit.svg"
        @click="status = !status"
      />

      <BaseButtonTable
        v-if="status === false"
        backcolor="#5e72e4"
        bordercolor="#5e72e4"
        imgsrc="done.svg"
        @click="
          updateTable()
        "
      />
      <BaseButtonTable
        v-if="status === false"
        backcolor="white"
        bordercolor="#5e72e4"
        imgsrc="cancel.svg"
        @click="
         clickCancel()
        "
      />
      <BaseButtonTable
        backcolor="#f5365c"
        bordercolor="#f5365c"
        imgsrc="delete.svg"
        @click="$emit('click:delete',currentTable)"
      />
    </td>
  </tr>
</template>
<script>
import BaseInput from '@/components/users/BaseInput.vue'
import BaseButtonTable from '@/components/ui/BaseButtonTable.vue'
export default {
  name: 'BaseRowTables',
  components: {
    BaseInput,
    BaseButtonTable,
  },
  props: {
    table: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    status: true,
    currentTable: {},
  }),
  mounted() {
    this.currentTable = this.table
  },
  methods: {
    clickCancel() {
      this.$emit('cancel:click')
       this.status = !status
      this.currentTable = this.table
    },
    updateTable() {
    
     if (this.currentTable.name.length < 1)  {this.$toasted.show(`El nombre de mesa debe contener 1 o mas caracteres`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        }) }
          else if(this.currentTable.QR.length < 8){ this.$toasted.show(`El QR debe contener 8 o mas caracteres`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        }) }

        else {this.$emit('update:table', this.currentTable);this.status = !status}
    }
  }
}
</script>
<style>
.tdOptions {
  display: grid;
  align-items: center;
  justify-content: start;
  grid-auto-flow: column;
  gap: 0 0.5rem
}

td {
  padding: 1rem;
  border-bottom: 1px solid #ebeef5;
  line-height: 1;
  text-align: start;
  white-space: nowrap;
  font-weight: 400;
  font-size: 0.875rem;
  text-transform: none;
  color: #525f7f;
}
.tdOptions img {
  cursor: pointer;
}
</style>