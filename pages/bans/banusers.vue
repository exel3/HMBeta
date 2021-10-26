<template>
  <Loading v-if="$fetchState.pending" class="fetchState" />
  <section v-else>
    <article class="userList">
      <div class="titleCard"><p>Lista de usuarios baneados</p></div>
      <div class="selectuserCard">
        <div class="searchContainer">
          <div class="inputContainer">
            <img class="searchIcon" src="@/assets/icons/search.svg" />
            <img
              v-if="searchValue != ''"
              class="clearIcon"
              src="@/assets/icons/clearInput.svg"
              @click="
                searchValue = ''
                searchFilter()
              "
            />
            <form @submit.prevent>
              <input
                v-model="searchValue"
                placeholder="Buscar.."
                @keyup.prevent="searchFilter()"
              />
            </form>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Razon</th>
            <th>Desbanear</th>
          </tr>
        </thead>
        <tbody>
          <BaseRow
            v-for="user in tableFilter"
            :key="user.id"
            :user="user"
            @click="
              showBanModal = true
              userSelected = user
            "
          />
        </tbody>
      </table>
    </article>
    <BanModal
      v-if="showBanModal"
      @ban:user="unBanUser"
      @cancel:ban="showBanModal = false"
    />
  </section>
</template>
<script>
import BaseRow from '@/components/bans/banusers/BaseRow.vue'
import BanModal from '~/components/bans/banusers/BanModal.vue'
import Loading from '~/components/ui/Loading.vue'
export default {
  name: 'UsersList',
  components: {
    BaseRow,
    BanModal,
    Loading,
  },
  data: () => ({
    showBanModal: false,
    users: [],
    clientId: '',
    usersCurrent: [],
    tableFilter: [],
    searchValue: '',
  }),
  async fetch() {
    await this.$axios
      .$get('/api/getUser')
      .then((response) => {})
      .catch((e) => {
        this.$toasted.show(`Error recuperando los datos de usuario: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })
      })
    await this.$axios
      .$get(`/api/getAllBans`)
      .then((res) => {
        this.usersCurrent = res.bans
        this.tableFilter = res.bans
      })
      .catch((e) =>
        this.$toasted.show(`Error recuperando los usuarios baneados: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })
      )
  },
  methods: {
    setuserSelected(user) {
      this.userSelected = this.users.find((l) => l.id === user.id)
    },
    searchFilter() {
      this.tableFilter = this.usersCurrent.filter((u) =>
        u.userID.toLowerCase().includes(this.searchValue.toLowerCase())
      )
    },
    async unBanUser() {
      const idUser = this.userSelected.userID
      await this.$axios
        .$delete(`/api/unBanUser/${idUser}`)
        .then((res) => {
          this.tableFilter = this.usersCurrent.filter(
            (u) => u.userID !== idUser
          )
          this.$toasted.show(`Usuario desbaneado`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000,
          })
        })
        .catch((e) =>
          this.$toasted.show(`Error al desbanear usuario: ${e}`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 10000,
          })
        )
      this.showBanModal = false
    },
  },
}
</script>
<style scoped>
@media (max-width: 1000px) {
  section {
    padding: 0 0.1rem;
  }
  td {
    padding: 0.5rem 0.1rem;
    height: 5rem;
  }
  th {
    padding: 0.5rem 0.1rem;
  }
  .selectuserCard {
    display: grid;
    grid-auto-flow: row;
    justify-content: center;
    gap: 1rem 0;
    width: 100%;
    padding: 1rem 0;
  }
  .selectContainer {
    width: 100%;
    display: grid;
    align-items: center;
    justify-content: center;
    grid-auto-flow: column;
  }
  th:nth-child(2) {
    display: none;
  }
  td:nth-child(2) {
    display: none;
  }
}
@media (min-width: 1000px) {
  section {
    padding: 0 5rem;
  }
  td {
    padding: 1rem;
  }

  th {
    padding: 1rem;
  }
  .selectuserCard {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
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
.fetchState {
  position: absolute;
  z-index: 50;
  color: white;
}


table {
  width: 100%;
  border-collapse: collapse;
  padding: 5px;
}

th {
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

.selectuserCard {
  position: relative;
  margin-bottom: 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.selectuserCard label {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.7;
  color: #525f7f;
  text-align: left;
  margin-right: 1rem;
}

.selectuserCard select {
  font-size: 0.875rem;
  cursor: pointer;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  padding: 0 15px;
  line-height: 40px;
  height: 2.5rem;
  width: 15rem;
}

.buttonOption {
  border: 1px solid transparent;
  padding: 0.2rem 0.7rem;
  background-color: #f5365c;
  border-color: #f5365c;
  user-select: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.buttonOption img {
  width: 1rem;
  height: 1rem;
}

.searchContainer {
  height: 100%;
  width: 25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.searchContainer form {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.searchContainer input {
  box-sizing: border-box;
  height: 2.5rem;
  padding: 0 5rem;
  outline: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.searchIcon {
  position: absolute;
  top: 0.55rem;
  left: 1rem;
  z-index: 1;
}
.clearIcon {
  position: absolute;
  top: 0.55rem;
  left: calc(100% - 3rem);
  z-index: 1;
  cursor: pointer;
}

.inputContainer {
  width: 80%;
  position: relative;
  border: none;
  box-sizing: border-box;
}
</style>