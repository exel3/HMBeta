<template>
  <aside>
    <div class="containerAside">
      <div class="header">
        <img />
        <p>HappyMatch</p>
      </div>
    </div>
    <ItemAsideMenu
      title="Cuentas"
      :options="[
        { title: 'Dueños', url: '/users/owners' },
        { title: 'Administradores', url: '/users/admins' },
      ]"
    />
    <ItemAsideMenu
      title="Locales"
      :options="[
        { title: 'Bares', url: '/locals/' },
        { title: 'Mesas', url: '/tables' },
      ]"
    />
    <div class="row titleRow" @click="clearSesion()">
      <nuxt-link to="/auth"
        ><img src="@/assets/icons/closeSesion.svg" />
        <p>Cerrar Sesion</p></nuxt-link
      >
    </div>
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
        .then((resp) => console.log(resp))
        .catch((e) => console.log(e))
    },
  },
}
</script>

<style scoped>
aside {
  top: 0;
  position: fixed;
  height: 100%;
  background: white;
  z-index: 99;
  padding: 1rem 0;
  border-width: 0 1px 0 0;
  width: 15rem;
  color:rgba(0,0,0,.6);
  border-color:rgba(0,0,0,.05);
}

.containerAside {
  display: grid;
  align-items: start;
}

.header {
  font-size: 1.5rem;
  color:rgb(65 184 131);
  font-weight: bold;
  display: grid;
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
  padding: .675rem 1.5rem;
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