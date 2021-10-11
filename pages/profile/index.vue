<template lang="">
  <section>
    <article class="newUser">
      <div class="titleCard"><p>Tus datos</p></div>
      <div class="contentCard">
        <form>
          <div>
          <label for="email">Email</label>
          <input id="email" v-model="newUser.email" type="email" autocomplete="off">
          </div>
          <div>
          <label for="contraseña">Contraseña</label>
          <input id="contraseña" v-model="newUser.password" type="text"  autocomplete="off">
          </div>
           <div>
          <label for="usuario">Usuario</label>
          <input id="usuario"  v-model="newUser.userName" type="text" name="newUser" autocomplete="off">
          </div>
        </form>
      </div>
      <div class="containerAddBtn">
        <button @click.prevent="updateProfile()">Editar</button>
      </div>
    </article>
    <DeleteModal v-if="showDeleteModal" @delete-user="deleteUser" @cancel-delete="showDeleteModal = false"/>
  </section>
</template>
<script>
import DeleteModal from '@/components/users/DeleteModal.vue'
export default {
  name: 'Profile',
  components: {
    DeleteModal
  },
  data: () => ({
    currentUsers: [],
    userSelected: {},
    newUser: { userName: '', email: '', password: '', id: null },
    showDeleteModal: false,
  }),
  mounted() {
    this.getUsers()
  },
  methods: {
    getUsers() {
    
         this.$axios
        .$get('/api/getUser')
        .then((response) => {
          this.client = response
             console.log(this.client)
             this.newUser.userName = this.client.username
             this.client.email? this.newUser.email = this.client.email : this.newUser.email = 'Email no registrado'
        })
        .catch((e) => {
          this.$toasted.show(`Error recuperando los datos de usuario: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })
        })
     
    },
    updateProfile() {
        const reEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (this.newUser.userName.length < 8) {
        this.$toasted.show(
          `El nombre de usuario debe contener 8 o mas caracteres`,
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          }
        )
      } else if (this.newUser.password.length < 8) {
        this.$toasted.show(`La contraseña debe contener 8 o mas caracteres`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else if (!reEmail.test(this.newUser.email)) {
        this.$toasted.show(`Formato de email incorrecto`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        this.newUser.id = Date.now()
        this.currentUsers.push(this.newUser)
      }
    },
  },
}
</script>
<style scoped>
@media (max-width: 1000px) {
  section {
    padding: 0 0.1rem;
  }
  .contentCard form {
  display: grid;
  grid-auto-flow: row;
  box-sizing: border-box;
  gap: 0 1rem;
}
.newUser {
  max-height: 20rem;
}
}
@media (min-width: 1000px) {
  section {
    padding: 0 5rem;
  }
  .contentCard form {
  display: grid;
  grid-auto-flow: column;
  box-sizing: border-box;
  gap: 0 1rem;
}
.newUser {
  max-height: 15rem;
}
}

section {
  position: relative;
  background: var(--background-color);
  display: grid;
  grid-auto-flow: row;
  gap: 2rem 0;
  margin-top: 4rem;
  box-sizing: border-box;
  height: 83vh;
}

article {
  background: white;
  border: 0;
  box-sizing: border-box;
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
  border-radius: 0.375rem;
  z-index: 2;
    overflow: hidden;
}



.userList {
  min-height: 40rem;
}

.titleCard {
  padding: 1.25rem 1.5rem;
  margin-bottom: 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.titleCard p {
  font-size: 1.0625rem;
  font-family: inherit;
  font-weight: 600;
  line-height: 1.5;
  color: #32325d;
}

label {
  color: #525f7f;
  font-size: 0.875rem;
  font-weight: 600;
}

input {
  width: 100%;
  height: 2rem;
  padding: 0.625rem 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #8898aa;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 3px 2px rgb(233 236 239 / 5%);
  box-sizing: border-box;
}

.contentCard {
  position: relative;
  box-sizing: border-box;
  padding: 1rem;
}



.contentCard form div {
  display: grid;
  grid-auto-flow: row;
}
.containerAddBtn {
  max-height: 4rem;
  display: grid;
  justify-items: end;
  padding-bottom: 1.25rem;
  padding-right: 1.5rem;
  box-sizing: border-box;
}

.containerAddBtn button {
  width: 8rem;
  height: 2rem;
  border: none;
  text-transform: none;
  transition: all 0.15s ease;
  letter-spacing: 0.025em;
  font-size: 0.875rem;
  will-change: transform;
  color: #fff;
  background-color: #5e72e4;
  border-color: #5e72e4;
  box-shadow: 0 4px 6px rgb(50 50 93 / 11%), 0 1px 3px rgb(0 0 0 / 8%);
  cursor: pointer;
}

table {
  width: 100%;
  border-collapse: collapse;
  padding: 5px;
}

th {
  padding: 1rem;
  background: #f6f9fc;
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
  color: #8898aa;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: start;
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
.tdOptions {
  display: grid;
  align-items: center;
  justify-content: start;
  grid-auto-flow: column;
}

.tdOptions img {
  cursor: pointer;
}
</style>