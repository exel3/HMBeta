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
           <option selected value="Default">Seleccione dueño...</option>
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
        <select v-if="localsFilter" id="local" class="selectlocal" name="local"  @change="setLocalSelected($event.target.value)" >
           <option selected value="Default">Seleccione local...</option>
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
          <input id="tablename" v-model="newTable.name" type="name" :disabled="loadingMode" autocomplete="off" @keyup.enter.prevent="addNewTable">
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
         <QrcodeVue v-if="newTable.qr !== ''" level="H" :value="newTable.qr" :size="180" />
        </div>
    </article>
    <article class="localList">
     <BaseArrowPage v-if="totalPage > 1" :totalpage="totalPage" :currentpage="currentPage" @set:page="changePage($event)" />
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
                  :disabled="tableFilter.length < 1"
                placeholder="Buscar por nombre.."
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
		<th>QR</th>
     <th>Imprimir</th>
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
@click:print="tableSelected={...table, localName:$event}; printQr() "
/>
	</tbody>

</table>
  </div>
    </article>
    <EditModal v-if="showEditModal" :table="tableSelected" @click:cancel="showEditModal=false" @update:table="updateTable($event); showEditModal=false" @cancel:click="showEditModal=false"  />
    <DeleteModal v-if="showDeleteModal" @delete:table="deleteTable" @cancel:delete="showDeleteModal = false"/>
    <Print v-if="showPrint" :qrs="qrsToPrint" @cancel:click="showPrint=false"/>
  </section>
</template>
<script>
import DeleteModal from '@/components/tables/DeleteModal.vue'
import EditModal from '@/components/tables/EditModal.vue'
import BaseRow from '@/components/tables/BaseRow.vue'
import Loading from '@/components/ui/Loading.vue'
import Print from '@/components/tables/Print.vue'
import BaseArrowPage from '@/components/ui/BaseArrowPage.vue'
import QrcodeVue from 'qrcode.vue'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'Tables',
  components: {
    DeleteModal,
    EditModal,
    BaseRow,
    Loading,
    Print,
    BaseArrowPage,
    QrcodeVue,
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
    showPrint: false,
    qrsToPrint: [],
    totalPage: 0,
    currentPage: 1,
    page: 1,
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
                this.owners = response.clients
                await this.$axios
                  .$get('/api/getAllLocals')
                  .then((response) => {
                    this.locals = response.locals
                    this.ownersWithLocals = this.owners.map((o) => {
                      const localsArray = this.locals.filter((l) =>
                        o.locals.includes(l.id)
                      )
                      const resp = { ...o, localsArray }
                      return resp
                    })
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
              .then((response) => {
                this.locals = response.locals
                this.localsFilter = response.locals
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
    printQr() {
      const printObject = {
        code: this.tableSelected.qr.code,
        name: this.tableSelected.name,
      }
      this.qrsToPrint = [printObject]
      this.showPrint = true
    },
    generateQr() {
      if (this.newTable.name.length < 1) {
        this.$toasted.show(
          `Nombre de mesa no puede estar vacio al generar un QR`,
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          }
        )
      } else {
        this.newTable.qr = uuidv4()
      }
    },
    getLogoQr() {
      return require('@/assets/images/logoBgWhite.jpg')
    },
    async changePage(page) {
      this.page = page
      await this.getAllTablesByClientAndLocal()
      this.currentPage = page
    },
    async getAllTablesByClientAndLocal() {
      this.loadingMode = true
      const page = this.page
      let clientID = ''
      const localID = this.localSelected.id
      if (this.user.type === 'client') {
        clientID = this.user.id
      } else {
        clientID = this.ownerSelected.id
      }
      const name = this.searchValue === '' ? null : this.searchValue
      const body = { name }
      await this.$axios
        .$post(
          `/api/getAllTablesByClientAndLocal/${clientID}/${localID}/${page}`,
          body
        )
        .then((res) => {
          this.currentTables = res.tables
          this.tableFilter = res.tables
          this.totalPage = res.totalPage
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
      this.tableFilter.length > 0 &&
        (this.searchValue === '' ? this.changePage(1) : this.changePage(0))
    },
    async setLocalSelected(localName) {
      if (this.user.type === 'admin') {
        if (localName !== 'Default') {
          const ownerLocals = this.locals.filter(
            (l) => l.client === this.ownerSelected.id
          )
          this.localSelected = ownerLocals.find((o) => localName === o.name)
          this.tableFilter = this.currentTables.filter((t) =>
            this.localSelected.tables.includes(t.id)
          )
          await this.getAllTablesByClientAndLocal()
        } else {
          this.tableFilter = []
        }
      } else {
        this.localSelected = this.locals.find((o) => localName === o.name)
        await this.getAllTablesByClientAndLocal()
      }
    },
    setOwnerSelected(ownerName) {
      if (ownerName !== 'Default') {
        this.ownerSelected = this.ownersWithLocals.find(
          (o) => ownerName === o.username
        )
        this.localsFilter = this.locals.filter(
          (l) => l.client === this.ownerSelected.id
        )
        this.localSelected = {}
        this.tableSelected = {}
      } else {
        this.localsFilter = []
      }
      this.tableFilter = []
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
      } else if (Object.keys(this.localSelected).length === 0) {
        this.$toasted.show(`Seleccione un local`, {
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
          .then(async (resTable) => {
            const bodyQr = {
              code: qr,
              tableID: resTable.table.id,
              url: qr,
            }
            await this.$axios
              .$post('/api/createNewQR', bodyQr)
              .then((resQr) => {
                this.$toasted.show(`Codigo QR sincronizado`, {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 5000,
                })
                resTable.table.qr = resQr.qr
                this.tableFilter.push(resTable.table)
                this.newTable.qr = ''
                this.loadingMode = false
              })
              .catch((e) => {
                this.$toasted.show(`Error al sincronizar codigo QR: ${e}`, {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 5000,
                })
              })
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
              '[{"invalid name":"Name is already in use"}]'
            ) {
              this.$toasted.show(`ERROR: Nombre de mesa en uso`, {
                theme: 'toasted-primary',
                position: 'top-right',
                duration: 10000,
              })
            } else {
              this.$toasted.show(
                `Error al crear mesa: ${JSON.stringify(
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
      const qr = tableC.newQr
      const body = { ...tableC, localID }
      this.$axios
        .$put(`/api/updateTable/${tableID}`, body)
        .then(async (res) => {
          this.$toasted.show(`Cambios guardados`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          })

          if (qr !== '') {
            const bodyQR = {
              code: qr,
              tableID,
              url: qr,
            }
            await this.$axios
              .$put(`/api/updateQR/${tableC.qr.id}`, bodyQR)
              .then((resQr) => {
                this.$toasted.show(`Codigo QR sincronizado`, {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 5000,
                })
                const indexT = this.currentTables.findIndex(
                  (t) => t.id === tableC.id
                )
                this.currentTables[indexT].name = tableC.name
                this.currentTables[indexT].qr = resQr.qr
              })
              .catch((e) => {
                this.$toasted.show(`Error al sincronizar codigo QR: ${e}`, {
                  theme: 'toasted-primary',
                  position: 'top-right',
                  duration: 5000,
                })
              })
          } else {
            const indexT = this.currentTables.findIndex(
              (t) => t.id === tableC.id
            )
            this.currentTables[indexT].name = tableC.name
            this.currentTables[indexT].qr = tableC.qr
          }
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
              `Error al actualizar mesa: ${JSON.stringify(
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
    async deleteTable() {
      this.loadingMode = true
      const tableID = this.tableSelected.id
      const idQR = this.tableSelected.qr.id
      this.tableFilter = this.currentTables.filter((t) => t.id !== tableID)
      this.showDeleteModal = false
      await this.$axios
        .$delete(`/api/deleteQR/${idQR}`)
        .then((resQr) => {
          this.$toasted.show(`QR desincronizado`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          })
          this.loadingMode = false
        })
        .catch((e) => {
          this.tableFilter = this.currentTables
          this.$toasted.show(
            `Error al borrar QR: ${JSON.stringify(
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
      await this.$axios
        .$delete(`/api/deleteTable/${tableID}`)
        .then((resTable) => {
          this.$toasted.show(`Cambios guardados`, {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 2000,
          })
        })
        .catch((e) => {
          this.tableFilter = this.currentTables
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
  padding-bottom: 1rem;
}

.bodyTableContainer {
  width: 100%;
}
.localList {
  position: relative;
  min-height: 40rem;
  box-sizing: border-box;
  padding-bottom: 2.5rem;
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