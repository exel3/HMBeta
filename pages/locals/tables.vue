<template lang="">
<Loading v-if="$fetchState.pending" class="fetchState" />
  <p v-else-if="$fetchState.error" class="fetchState">Error al cargar los datos</p>
  <section v-else>
       <article class="newTable">
      <div class="titleCard"><p>Seleccionar</p></div>
      <div class="contentCard">
        <form>
           <div v-if="user.type === 'admin'" class="selectContainer">
          <label for="owner">Dueño</label>
        <select id="owner" class="selectlocal" name="owner"  @change="setOwnerSelected($event.target.value)" >
           <option disabled selected value></option>
          <option
            v-for="owner in owners"
            :key="'dropBox' + owner.id"
            :value="owner.username"
          >
            {{owner.username}}
          </option>
        </select>
          </div>
          <div class="selectContainer">
          <label for="local">Local</label>
        <select id="local" class="selectlocal" name="local"  @change="setLocalSelected($event.target.value)" >
           <option disabled selected value></option>
          <option
            v-for="local in localsFilter"
            :key="'dropBox' + local.id"
            :value="local.name"
          >
            {{local.name}}
          </option>
        </select>
          </div>
        </form>
      </div>
    </article>
    <article class="newTable">
      <div class="titleCard"><p>Agregar nueva mesa</p></div>
      <div class="contentCard">
        <form>
          <div>
          <label for="tablename">Nombre</label>
          <input id="tablename" v-model="newTable.name" type="name" :disabled="loadingMode" autocomplete="off">
          </div>
          <div>
          <label for="qr">QR</label>
          <input id="qr" v-model="newTable.qr" type="text"  :disabled="true" autocomplete="off">
          </div>
        </form>
      </div>
      <div class="containerAddQrBtn">
        <button :disabled="loadingMode" @click.prevent="generateQr">Generar QR</button>
        <button :disabled="loadingMode" @click.prevent="addNewTable">Agregar</button>
      </div>
      <div class="qrContainer">
         <vueQr v-if="newTable.qr !== ''" :logoSrc="getLogoQr()" :logoScale="4" :text="newTable.qr" :size="200" />
        </div>
    </article>
    <article class="localList">
       <div class="titleCard">
         <p>Lista de mesas</p>
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
        <div class="bodyTableContainer">
     <table>
	<thead>
	<tr>
		<th>Nombre</th>
		<th>qr</th>
    <th>Opciones</th>
	</tr>
	</thead>
	<tbody>
<BaseRow v-for="table in tableFilter" 
:key="table.id" 
:table="table"
:locals="locals"
@click="showDeleteModal = true; tableSelected = table"  
@click:delete="showDeleteModal=true; tableSelected=table"
@click:edit="showEditModal=true; tableSelected={...table, localName:$event}"
/>
	</tbody>

</table>
  </div>
    </article>
    <EditModal v-if="showEditModal" :table="tableSelected" @click:cancel="showEditModal=false" @update:table="updateTable($event); showEditModal=false" @cancel:click="showEditModal=false"  />
    <DeleteModal v-if="showDeleteModal" @delete:local="deleteTable" @cancel:delete="showDeleteModal = false"/>
  </section>
</template>
<script>
import DeleteModal from '@/components/tables/DeleteModal.vue'
import EditModal from '@/components/tables/EditModal.vue'
import BaseRow from '@/components/tables/BaseRow.vue'
import Loading from '@/components/ui/Loading.vue'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: '',
  components: {
    DeleteModal,
    EditModal,
    BaseRow,
    Loading,
    vueQr,
  },
  data: () => ({
    user: {},
    locals: [],
    localsFilter: [],
    owners: [],
    ownersWithLocals: [],
    tableSelected: {},
    currentTables: [],
    localSelected: {},
    ownerSelected: {},
    newTable: {
      name: '',
      qr: '',
      id: null,
    },
    showDeleteModal: false,
    showEditModal: false,
    searchValue: '',
    tableFilter: [],
    loadingMode: false,
  }),
  async fetch() {
    await this.$axios
      .$get('/api/getUser')
      .then(async (response) => {
        this.user = response
        this.user.type === 'admin'
          ? await this.$axios
              .$get('/api/getAllClients')
              .then(async (response) => {
                this.owners = response.clients // owners.locals = [id,id]
                await this.$axios
                  .$get('/api/getAllLocals')
                  .then(async (response) => {
                    this.locals = response.locals
                    this.localsFilter = response.locals
                    this.ownersWithLocals = this.owners.map((o) => {
                      const localsArray = this.locals.filter((l) =>
                        o.locals.includes(l.id)
                      )
                      const resp = { ...o, localsArray }
                      return resp
                    })
                    if (response.locals.length > 0) {
                      this.ownerSelected = this.ownersWithLocals[0]
                      this.currentTables = response.locals[0].tables
                      this.tableFilter = response.locals[0].tables
                      this.localSelected = response.locals[0]
                      await this.getAllTablesByClientAndLocal()
                    }
                  })
                  .catch((e) => {
                    this.$toasted.show(`Error al recuperar dueños: ${e}`, {
                      theme: 'toasted-primary',
                      position: 'top-right',
                      duration: 5000,
                    })
                  })
              })
              .catch((e) => {
                this.$toasted.show(`Error al recuperar locales: ${e}`, {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 5000,
                })
              })
          : await this.$axios
              .$get(`/api/getLocalsByClient/${this.user.id}`)
              .then(async (response) => {
                this.locals = response.locals
                this.localsFilter = response.locals
                this.currentTables = response.locals[0].tables
                this.tableFilter = response.locals[0].tables
                await this.getAllTablesByClientAndLocal()
              })
              .catch((e) => {
                this.$toasted.show(`Error al recuperar locales: ${e}`, {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 5000,
                })
              })
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
    async getlocals() {
      this.loadingMode = true
      this.$fetchState.pending = true
      this.currentTables = []
      this.tableFilter = []
      this.user.type === 'admin'
        ? await this.$axios
            .$get('/api/getAllLocals')
            .then((response) => {
              this.currentTables = response.locals
              this.tableFilter = response.locals
              this.loadingMode = false
              this.$fetchState.pending = false
            })
            .catch((e) => {
              this.loadingMode = false
              this.$toasted.show(`Error al recuperar locales: ${e}`, {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 5000,
              })
            })
        : this.$axios
            .$get(`/api/getLocalsByClient/${this.user.id}`)
            .then((response) => {
              this.currentTables = response.locals
              this.localsFilter = this.locals
              this.tableFilter = this.currentTables
              this.loadingMode = false
              this.$fetchState.pending = false
            })
            .catch((e) => {
              this.loadingMode = false
              this.$toasted.show(`Error al recuperar locales: ${e}`, {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 5000,
              })
            })
    },
    generateQr(){
      if(this.newTable.name.length < 1){
               this.$toasted.show(`El nombre de la mesa no puede estar vacio al generar un QR`, {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 5000,
              })
      } else {
      
      this.newTable.qr = uuidv4()}
    },
    getLogoQr() {
      return require('@/assets/images/logoBgBlack.jpg')
    },
    async getAllTablesByClientAndLocal() {
      this.loadingMode = true
      let clientID = ''
      const localID = this.localSelected.id
      if (this.user.type === 'client') {
        clientID = this.user.id
      } else {
        clientID = this.ownerSelected.id
      }

      await this.$axios
        .$get(`/api/getAllTablesByClientAndLocal/${clientID}/${localID}`)
        .then((res) => {
          console.log(res)
          this.currentTables = res.tables
          this.tableFilter = res.tables
          this.loadingMode = false
        })
        .catch((e) => {
          this.loadingMode = false
          this.$toasted.show(
            `Error al recuperar locales: ${JSON.stringify(
              e.response.data.error['Errors List']
            )}`,
            {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000,
            }
          )
        })
    },
    searchFilter() {
      this.tableFilter = this.currentTables.filter(
        (u) =>
          u.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
          u.qr.toLowerCase().includes(this.searchValue.toLowerCase())
      )
    },
    async setLocalSelected(localName) {
      this.localSelected = this.locals.find((o) => localName === o.name)
      this.tableFilter = this.currentTables.filter((t) =>
        this.localSelected.tables.includes(t.id)
      )
      await this.getAllTablesByClientAndLocal()
    },
    async setOwnerSelected(ownerName) {
      this.ownerSelected = this.ownersWithLocals.find(
        (o) => ownerName === o.username
      )
      this.localsFilter = this.locals.filter(
        (l) => l.client === this.ownerSelected.id
      )
      this.localSelected = {}
      this.tableSelected = {}
      this.localsFilter.length > 0 &&
        this.setLocalSelected(this.localsFilter[0].name)
      await this.getAllTablesByClientAndLocal()
    },
    addNewTable() {
      this.user.type === 'client' &&
        (this.localSelected.clientID = this.user.id)
      if (this.newTable.name.length < 1) {
        this.$toasted.show(`Nombre no puede estar vacio`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
        this.loadingMode = false
      } else if (this.newTable.qr.length < 1) {
        this.$toasted.show(`QR no puede estar vacio`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 10000,
        })
        this.loadingMode = false
      } else {
        const name = this.newTable.name
        const qr = this.newTable.qr
        const localID = this.localSelected.id
        const clientID = this.localSelected.client
        const body = {
          name,
          qr,
          clientID,
          localID,
        }
        this.$toasted.show(`Guardando cambios..`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
        this.$axios
          .$post('/api/createNewTable', body)
          .then(async (res) => {
            // this.newTable.id = res.id
            await this.getlocals()
            this.$toasted.show(`Cambios guardados`, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000,
            })
            this.loadingMode = false
          })
          .catch((e) => {
            if (
              JSON.stringify(e.response.data.error['Errors List']) ===
              '{"name error":"name in use"}'
            ) {
              this.$toasted.show(`ERROR: Nombre de mesa en uso`, {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000,
              })
            } else if (
              JSON.stringify(e.response.data.error['Errors List']) ===
              '{"locationAddress error":"locationAddress in use"}'
            ) {
              this.$toasted.show(`ERROR: Email en uso`, {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000,
              })
            } else {
              this.$toasted.show(
                `Error al crear local: ${JSON.stringify(
                  e.response.data.error['Errors List']
                )}`,
                {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 5000,
                }
              )
            }
            this.loadingMode = false
          })
      }
    },
    updateTable(tableC) {
      this.loadingMode = true
      const tableID = tableC.id
      const localID = tableC.local
      const body = { ...tableC, localID }
      this.$axios
        .$put(`/api/updateTable/${tableID}`, body)
        .then((res) => {
          this.$toasted.show(`Cambios guardados`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          })
          const indexT = this.currentTables.findIndex((t) => t.id === tableC.id)
          this.currentTables[indexT].name = tableC.name
          this.currentTables[indexT].qr = tableC.qr
          this.tableFilter = this.currentTables
          this.loadingMode = false
        })
        .catch((e) => {
          if (
            JSON.stringify(e.response.data.error['Errors List']) ===
            '{"name error":"name in use"}'
          ) {
            this.$toasted.show(`ERROR: Nombre de usuario en uso`, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 10000,
            })
          } else if (
            JSON.stringify(e.response.data.error['Errors List']) ===
            '{"locationAddress error":"locationAddress in use"}'
          ) {
            this.$toasted.show(`ERROR: Email en uso`, {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 10000,
            })
          } else {
            this.$toasted.show(
              `Error al actualizar local: ${JSON.stringify(
                e.response.data.error['Errors List']
              )}`,
              {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 5000,
              }
            )
          }
          this.loadingMode = false
        })
    },
    deleteTable() {
      this.loadingMode = true
      const tableID = this.tableSelected.id
      this.$axios
        .$delete(`/api/deleteTable/${tableID}`)
        .then((res) => {
          this.$toasted.show(`Cambios guardados`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          })
          this.currentTables = this.currentTables.filter(
            (u) => u.id !== this.tableSelected.id
          )
          this.showDeleteModal = false
          this.tableFilter = this.currentTables
          this.loadingMode = false
        })
        .catch((e) => {
          this.$toasted.show(
            `Error al borrar mesa: ${JSON.stringify(
              e.response.data.error['Errors List']
            )}`,
            {
              theme: 'toasted-primary',
              position: 'top-right',
              duration: 5000,
            }
          )

          this.loadingMode = false
        })
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
    padding: 0.1rem 0.1rem;
  }
  th {
    padding: 0.5rem 0.1rem;
  }
  .newTable {
    max-height: 30rem;
  }
  .titleCard {
    display: grid;
    grid-auto-flow: row;
    justify-content: center;
    gap: 1rem 0;
  }
  .contentCard form {
    display: grid;
    grid-auto-flow: row;
    align-items: center;
    gap: 1rem 0;
  }
}
@media (min-width: 1000px) {
  section {
    padding: 0 5rem;
  }
  td {
    padding: 0.5rem;
  }
  th {
    padding: 0.5rem;
  }
  .newTable {
   max-height: 30rem;
  }
  .titleCard {
    display: grid;
    grid-auto-flow: column;
    justify-content: space-between;
  }
  .contentCard form {
    display: grid;
    grid-auto-flow: column;
    gap: 0 1rem;
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
}

.qrContainer {
  display: grid;
  align-items: center;
  justify-content: center;
}

.bodyTableContainer {
  overflow-y: scroll;
  width: 100%;
  height: 35rem;
}
.localList {
  height: 40rem;
  overflow: hidden;
}

.titleCard {
  position: relative;
  padding: 1.25rem 1.5rem;
  margin-bottom: 0;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.fetchState {
  position: absolute;
  z-index: 50;
  color: white;
}

.titleCard p {
  font-size: 1.0625rem;
  font-family: inherit;
  font-weight: 600;
  line-height: 1.5;
  color: #32325d;
  display: grid;
  align-items: center;
  justify-content: center;
}

.selectlocal {
  width: 100%;
  height: 2rem;
  padding: 0 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #656a6f;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 3px 2px rgb(233 236 239 / 5%);
  box-sizing: border-box;
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
  color: #656a6f;
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

.contentCard form {
  box-sizing: border-box;
}

.contentCard form div {
  display: grid;
  grid-auto-flow: row;
}
.containerAddQrBtn {
  max-height: 4rem;
  display: grid;
  justify-items: end;
  padding-bottom: 1.25rem;
  padding-right: 1.5rem;
  box-sizing: border-box;
  grid-auto-flow: column;
  justify-content: end;
  gap: 0 1rem;
}

.containerAddQrBtn button {
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
.newTable {
  overflow: hidden;
}
.searchContainer {
  height: 100%;
  width: 20rem;
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
  padding: 0 3rem;
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