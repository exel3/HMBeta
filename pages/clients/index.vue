<template>
  <section>
    <article class="userList">
      <div class="titleCard"><p>Lista de grupos</p></div>
      <div class="selectLocalCard">
        <div>
        <label for="locals">Local</label>
        <select id="locals" name="cars">
          <option
            v-for="local in locals"
            :key="'dropBox' + local.id"
            :value="local"
          >
            {{ local.name }}
          </option>
        </select>
        </div>
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
            <th>Nombre mesa</th>
            <th>Usuario principal</th>
            <th>Reportes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="group in tableFilter" :key="group.id">
            <td>{{ group.name }}</td>
            <td>{{ group.userMainId }}</td>
            <td>{{ group.reports ? group.reports : '0' }}</td>
            <td class="tdOptions">
              <div
                class="buttonOption"
                @click="
                  showDeleteModal = true
                  userSelected = user
                "
              >
                <img src="@/assets/icons/block.svg" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </article>
  </section>
</template>
<script>
export default {
  name: 'IndexGroupTables',
  data: () => ({
    locals: [],
    clientId: '',
    localSelected: {},
    tableFilter: [],
    searchValue: ''
  }),
  async fetch() {
    await this.$axios
      .$get('/api/getUser')
      .then((response) => {
        this.locals = response.locals
        this.clientId = response.id
      })
      .catch((e) => {
         this.$toasted.show(`Error recuperando los datos de usuario: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })
      })

    this.locals.length > 0 &&
      (await this.$axios
        .$get(`/api/getGroupTables/${this.locals[0].id}`)
        .then((res) => {
          this.locals[0].tables = res.groupTables
          this.localSelected.tables = res.groupTables
          this.tableFilter = res.groupTables
        })
        .catch((e) =>  this.$toasted.show(`Error recuperando las groupTables: ${e}`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })))

    await this.setLocalSelected(this.locals[0])
  },
  methods: {
    setLocalSelected(local) {
      this.localSelected = this.locals.find((l) => l.id === local.id)
    },
    searchFilter() {
      this.tableFilter = this.localSelected.tables.filter((t) =>
        t.name.toLowerCase().includes(this.searchValue.toLowerCase())
      )
    },
  },
}
</script>
<style scoped>
section {
  position: relative;
  background: var(--background-color);
  display: grid;
  grid-auto-flow: row;
  gap: 2rem 0;
  margin-top: 4rem;
  box-sizing: border-box;
  padding: 0 5rem;
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

.selectLocalCard {
  position: relative;
  padding: 1.25rem 1.5rem;
  margin-bottom: 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
}
.selectLocalCard label {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.7;
  color: #525f7f;
  text-align: left;
  margin-right: 1rem;
}

.selectLocalCard select {
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
  top:0.55rem;
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