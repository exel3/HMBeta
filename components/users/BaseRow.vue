<template>
  <tr>
    <td><BaseInput :value="currentUser.username" :status="status" @input="currentUser.username =  $event" /></td>
    <td><BaseInput :value="currentUser.password" :status="status" @input="currentUser.password =  $event" /></td>
    <td><BaseInput :value="currentUser.emailAddress" :status="status" @input="currentUser.emailAddress =  $event" /></td>
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
          updateUser()
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
        @click="$emit('click:delete',currentUser)"
      />
    </td>
  </tr>
</template>
<script>
import BaseInput from '@/components/users/BaseInput.vue'
import BaseButtonTable from '@/components/ui/BaseButtonTable.vue'
export default {
  name: 'BaseUser',
  components: {
    BaseInput,
    BaseButtonTable,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    status: true,
    currentUser: {},
  }),
  mounted() {
    this.currentUser = this.user
  },
  methods: {
    clickCancel() {
      this.$emit('cancel:click')
       this.status = !status
      this.currentUser = this.user
    },
    updateUser() {
      const reemailAddress = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    
     if (this.currentUser.username.length < 8)  {this.$toasted.show(`El nombre de usuario debe contener 8 o mas caracteres`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        }) }
          else if(this.currentUser.password.length < 8){ this.$toasted.show(`La contraseña debe contener 8 o mas caracteres`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        }) }

        else if( !reemailAddress.test(this.currentUser.emailAddress) ){ this.$toasted.show(`Formato de emailAddress incorrecto`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        }) }
        else {this.$emit('update:user', this.currentUser);this.status = !status}
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