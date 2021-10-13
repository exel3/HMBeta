<template>
  <tr>
    <td>
      <BaseInput
        :value="currentLocal.name"
        :status="status"
        @input="currentLocal.name = $event"
      />
    </td>
    <td>
      <BaseInput
        :value="currentLocal.location_address"
        :status="status"
        @input="currentLocal.location_address = $event"
      />
    </td>
    <td>
      <BaseInput
        :value="currentLocal.location_city_name"
        :status="status"
        @input="currentLocal.location_city_name = $event"
      />
    </td>
    <td>
      <BaseInput
        :value="currentLocal.location_country_name"
        :status="status"
        @input="currentLocal.location_country_name = $event"
      />
    </td>
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
        @click="updateLocal()"
      />
      <BaseButtonTable
        v-if="status === false"
        backcolor="white"
        bordercolor="#5e72e4"
        imgsrc="cancel.svg"
        @click="clickCancel()"
      />
      <BaseButtonTable
        backcolor="#f5365c"
        bordercolor="#f5365c"
        imgsrc="delete.svg"
        @click="$emit('click:delete', currentLocal)"
      />
    </td>
  </tr>
</template>
<script>
import BaseInput from '@/components/users/BaseInput.vue'
import BaseButtonTable from '@/components/ui/BaseButtonTable.vue'
export default {
  name: 'BaseRowLocal',
  components: {
    BaseInput,
    BaseButtonTable,
  },
  props: {
    local: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    status: true,
    currentLocal: {},
  }),
  mounted() {
    this.currentLocal = this.local
  },
  methods: {
    clickCancel() {
      this.$emit('cancel:click')
      this.status = !status
      this.currentLocal = this.local
    },
    updateLocal() {
      if (this.currentLocal.name.length < 8) {
        this.$toasted.show(
          `El nombre de local debe contener 8 o mas caracteres`,
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          }
        )
      } else if (this.currentLocal.location_address.length < 8) {
        this.$toasted.show(`La contraseña debe contener 8 o mas caracteres`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else if (this.currentLocal.location_city_name) {
        this.$toasted.show(`Formato de location_city_name incorrecto`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        this.$emit('update:local', this.currentLocal)
        this.status = !status
      }
    },
  },
}
</script>
<style>
.tdOptions {
  display: grid;
  align-items: center;
  justify-content: start;
  grid-auto-flow: column;
  gap: 0 0.5rem;
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