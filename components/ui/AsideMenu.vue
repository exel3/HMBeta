<template>
  <aside>
    <div class="containerAside">
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
      title="Usuarios"
      imgsrc="group.svg"
      mainurl="/users/owners/"
      :options="[
        { title: 'Dueños', url: '/users/owners' },
        { title: 'Administradores', url: '/users/admins' },
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
      title="Gestion match"
      imgsrc="match.svg"
      mainurl="/questions/"
      :options="[
        { title: 'Preguntas y respuestas', url: '/questions/' },
        { title: 'Grupos', url: '/clients/' },
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
  methods: {
    async clearSesion() {
      await this.$axios
        .$delete('/api/clearSesion')
        .then((resp) => this.$router.go('/auth'))
        .catch((e) => console.log(e))
    },
  },
}
</script>

<style scoped>
@media (max-width: 1000px) {
  aside {
    width: 0;
  }
  .header {
    opacity: 0;
  }
}
@media (min-width: 1000px) {
  aside {
    width: 15rem;
  }

  .header {
    opacity: 1;
  }
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
  overflow: hidden;
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