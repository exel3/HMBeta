<template>
  <tr>
    <td>
      <BaseInput
        :valueinput="user.username"
        :status="status"
        @input="$emit('input:username', $event)"
      />
    </td>
    <td>
      <BaseInput
        placeholder="No visible"
        :status="status"
       @input="$emit('input:password', $event)"
      />
    </td>
    <td>
      <BaseInput
        :valueinput="user.emailAddress"
        :status="status"
     @input="$emit('input:emailAddress', $event)"
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
        @click="updateUser()"
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
        @click="$emit('click:delete', user)"
      />
    </td>
  </tr>
</template>
<script>
import BaseInput from '@/components/users/BaseInput.vue'
import BaseButtonTable from '@/components/ui/BaseButtonTable.vue'
export default {
  name: 'BaseRow',
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
  }),
  methods: {
    clickCancel() {
      this.$emit('cancel:click')
      this.status = !status
    },
    updateUser() {
      const regEmailAddress =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const regUser = /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
      const regPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}/

      if (!regUser.test(this.user.username)) {
        this.$toasted.show(
          `El nombre de usuario debe contener entre 5 y 10 caracteres`,
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          }
        )
      } else if (!regPassword.test(this.user.password)) {
        this.$toasted.show(
          `La contraseña debe contener mínimo 8 y máximo 16 caracteres, al menos una letra mayúscula, una letra minúscula, un número y un carácter especial`,
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000,
          }
        )
      } else if (!regEmailAddress.test(this.user.emailAddress)) {
        this.$toasted.show(`Formato de email incorrecto`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        this.$emit('update:user', this.user)
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