<template>
  <div class="editModalContainer">
    <div class="editModal">
      <label>Nombre de usuario:</label>
      <BaseInput
        :valueinput="user.username"
        @input="newUser.username = $event"
      />
       <label>Password:</label>
      <BaseInput
        placeholder="No visible"
     @input="newUser.password = $event"
      />
         <label>Correo electronico:</label>
      <BaseInput
        :valueinput="user.emailAddress"
       @input="newUser.emailAddress = $event"
      />

      <div class="tdOptions">
        <BaseButtonEdit
          backcolor="#f7fafc"
          bordercolor="#f7fafc"
          text="edit.svg"
          @click="
            $emit('click:edit')
          "
        />

        <BaseButtonEdit
          backcolor="#5e72e4"
          bordercolor="#5e72e4"
          text="Confirmar"
          color="white"
          @click="updateUser()"
        />
        <BaseButtonEdit
          backcolor="white"
          bordercolor="#5e72e4"
          text="Cancelar"
            color="#5e72e4"
          @click="clickCancel()"
        />
      </div>
    </div>
    <div class="background" @click="$emit('click:cancel')"></div>
  </div>
</template>
<script>
import BaseInput from '@/components/users/BaseInput.vue'
import BaseButtonEdit from '@/components/users/BaseButtonEdit.vue'
export default {
  name: 'EditModal',
  components: {
    BaseInput,
    BaseButtonEdit,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
        newUser: {}
  }),  
  mounted() {
   const {username, password, emailAddress, id, locals} =  this.user
   this.newUser = {username,password,emailAddress,id, locals}
  }, 
    methods: {
    clickCancel() {
      this.$emit('cancel:click')
    },
    updateUser() {
      const regEmailAddress =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      const regUser = /^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
      const regPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}/

      if (!regUser.test(this.newUser.username)) {
        this.$toasted.show(
          `El nombre de usuario debe contener entre 5 y 10 caracteres`,
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          }
        )
      } else if (!regPassword.test(this.newUser.password)) {
        this.$toasted.show(
          `La contraseña debe contener mínimo 8 y máximo 16 caracteres, al menos una letra mayúscula, una letra minúscula, un número y un carácter especial`,
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000,
          }
        )
      } else if (!regEmailAddress.test(this.newUser.emailAddress)) {
        this.$toasted.show(`Formato de email incorrecto`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        this.$emit('update:user', this.newUser)
      }
    },
  },
}
</script>
<style scoped>
.editModalContainer {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 2;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  box-sizing: border-box;
  overflow: hidden;
}
.editModal {
  position: absolute;
    box-sizing: border-box;
  top: 0;
  right: 0;
  height: 100%;
  width: 20rem;
  background: white;
  animation: move 0.5s ease;
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
  padding: 1rem;
  display:flex;
  flex-direction: column;
  gap:1rem;
  padding-top:2rem;
}
.background {
  width: 100%;
  height: 100%;
}
@keyframes move {
  0% {
    transform: translate(15rem);
  }
  100% {
    transform: translate(0);
  }
}

.tdOptions {
  display: grid;
  grid-auto-flow: row;
  gap: 1rem;
  margin-top: 5rem;
}
</style>