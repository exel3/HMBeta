<template>
  <aside :class="show ? 'asideResponsive' : 'asideDefault'">
    <div class="containerAside">
      <div v-if="show" class="closeMenu" @click="$emit('click:responsive')">
        <img src="@/assets/icons/closeMenu.svg" />
      </div>
      <div
        v-if="show"
        class="backgroundResponsive"
        @click="$emit('click:responsive')"
      ></div>
      <div class="header">
        <img />
        <p>HappyMatch</p>
      </div>
    </div>
    <ItemAsideMenu
      title="Perfil"
      imgsrc="profile.svg"
      mainurl="/profile"
      :options="[{ title: 'Editar perfil', url: '/profile' }]"
    />
    <ItemAsideMenu
      v-if="user.type === 'admin' && user.isMain"
      title="Cuentas"
      imgsrc="group.svg"
      mainurl="/users/owners/"
      :options="[
        { title: 'Dueños', url: '/users/owners' },
        { title: 'Administradores', url: '/users/admins' },
      ]"
    />
        <ItemAsideMenu
      v-if="user.type === 'admin' && !user.isMain"
      title="Cuentas"
      imgsrc="group.svg"
      mainurl="/users/owners/"
      :options="[
        { title: 'Dueños', url: '/users/owners' }
      ]"
    />
    <ItemAsideMenu
      title="Locales"
      imgsrc="locals.svg"
      mainurl="/locals/"
      :options="[
        { title: 'Bares', url: '/locals' },
        { title: 'Mesas', url: '/locals/tables' },
      ]"
    />
    <ItemAsideMenu
      v-if="
        user.type === 'admin' ||
        (user.permissionForQuestions && user.permissionForQuestions === true)
      "
      title="Gestion preguntas"
      imgsrc="match.svg"
      mainurl="/questions/"
      :options="
        user.type === 'admin'
          ? [
              { title: 'Preguntas globales', url: '/questions/global' },
              { title: 'Preguntas locales', url: '/questions/' },
            ]
          : [{ title: 'Preguntas locales', url: '/questions/' }]
      "
    />
    <ItemAsideMenu
      v-if="user.type === 'client'"
      title="Usuarios y bans"
      imgsrc="bans.svg"
      mainurl="/bans/groups"
      :options="[
        { title: 'Grupos', url: '/bans/groups' },
        { title: 'Grupos baneados', url: '/bans/bangroups' },
      ]"
    />
    <ItemAsideMenu
      v-if="user.type === 'admin'"
      title="Usuarios y baneos"
      imgsrc="bans.svg"
      mainurl="/bans/users/"
      :options="[
        { title: 'Usuarios', url: '/bans/users' },
        { title: 'Cuentas baneadas', url: '/bans/banusers' },
      ]"
    />
    <ItemAsideMenu
      title="Cerrar sesion"
      imgsrc="logout.svg"
      mainurl="/auth"
      :options="[]"
      @click="clearSesion()"
    />
  </aside>
</template>

<script>
import ItemAsideMenu from './ItemAsideMenu.vue'
export default {
  name: 'AsideMenu',
  components: { ItemAsideMenu },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    user: {},
  }),
  async fetch() {
    await this.$axios
      .$get('/api/getUser')
      .then((response) => {
        this.user = response
      })
      .catch((e) => {
        this.$toasted.show(`Error al recuperar el tipo de usuario: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      })
  },
  methods: {
    async clearSesion() {
      await this.$axios
        .$delete('/api/clearSesion')
        .then((resp) => this.$router.go('/auth'))
        .catch((e) =>
          this.$toasted.show(`Error al cerrar sesion: ${e}`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          })
        )
    },
  },
}
</script>

<style scoped>
@media (max-width: 1000px) {
  .asideDefault {
    width: 0;
  }
  .header {
    opacity: 0;
  }
}
@media (min-width: 1000px) {
  .asideDefault {
    width: 15rem;
  }

  .header {
    opacity: 1;
  }
}
.asideDefault {
  overflow: hidden;
}

.closeMenu {
  position: absolute;
  right: 1rem;
  cursor: pointer;
  user-select: none;
  z-index: 50;
}

.backgroundResponsive {
  position: absolute;
  right: calc(15rem - 100vw);
  width: calc(100vw - 15rem);
  top: 0;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
}

.asideResponsive {
  width: 15rem;
  z-index: 101;
}

aside {
  top: 0;
  position: fixed;
  height: 100%;
  background: white;
  z-index: 99;
  padding: 1rem 0;
  border-width: 0 1px 0 0;
  color: rgba(0, 0, 0, 0.6);
  border-color: rgba(0, 0, 0, 0.05);
}

.containerAside {
  display: grid;
  align-items: start;
}

.header {
  display: grid;
  font-size: 1.5rem;
  color: rgb(65 184 131);
  font-weight: bold;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
}
.titleRow {
  width: 100%;
  height: 2rem;
}

.row {
  display: grid;
  align-items: center;
  justify-content: start;
  grid-auto-flow: column;
  cursor: pointer;
  box-sizing: border-box;
  padding: 0.675rem 1.5rem;
}

.row a {
  text-decoration: none;
  width: 100%;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-auto-flow: column;
  cursor: pointer;
  box-sizing: border-box;
}
</style>