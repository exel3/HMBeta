<template lang="">
  <section>
    <article class="newTable">
      <div class="titleCard"><p>Agregar nueva mesa</p></div>
      <div class="contentCard">
        <form>
           <div>
          <label for="tablename">Nombre</label>
          <input id="tablename"  v-model="newTable.name" type="text" name="newTable" autocomplete="off">
          </div>
            <div>
          <label for="QR">QR</label>
          <input id="QR" v-model="newTable.QR" type="text"  autocomplete="off">
          </div>
        </form>
      </div>
      <div class="containerAddBtn">
        <button @click.prevent="addnewTable()">Agregar</button>
      </div>
    </article>
    <article class="tableList">
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
     <table>
	<thead>
	<tr>
		<th>Nombre</th>
		<th>QR</th>
    <th>Opciones</th>
	</tr>
	</thead>
	<tbody>
<BaseRow v-for="table in tableFilter" 
:key="table.id" 
:table="table"
@click="showDeleteModal = true; tableSelected = table" 
@update:table="updatetable(table)" 
@click:delete="showDeleteModal=true; tableSelected=table"
@cancel:click="cancelClick(table)"
/>
	</tbody>
</table>
    </article>
    <DeleteModal v-if="showDeleteModal" @delete:table="deletetable" @cancel:delete="showDeleteModal = false"/>
  </section>
</template>
<script>
import DeleteModal from '@/components/tables/DeleteModalTables.vue'
import BaseRow from '~/components/tables/BaseRowTables.vue'
export default {
  name: 'Tables',
  components: {
    DeleteModal,
    BaseRow,
  },
  data: () => ({
    currentTable: [],
    tableSelected: {},
    newTable: { name: '', email: '', QR: '', id: null },
    showDeleteModal: false,
    searchValue: '',
    tableFilter: []
  }),
  mounted() {
    this.gettables()
  },
  methods: {
    cancelClick(table) {
      this.gettables()
    },
    gettables() {
      this.currentTable = [
        {
          name: 'Mesa 1',
          QR: '65465465465',
          id: 12323,
        },
        {
          name: 'Mesa 2',
          QR: '65465465465',
          id: 56411,
        },
        {
          name: 'Mesa 3',
         QR: '65465465465',
          id: 45654789,
        },
          {
          name: 'Mesa 4',
         QR: '65465465465',
          id: 333344,
        },
          {
          name: 'Mesa 5',
         QR: '65465465465',
          id: 890955,
        },
          {
          name: 'Mesa 6',
         QR: '65465465465',
          id: 324678,
        },
          {
          name: 'Mesa 7',
         QR: '65465465465',
          id: 4545,
        },
          {
          name: 'Mesa 8',
         QR: '65465465465',
          id: 8765,
        },
          {
          name: 'Mesa 9',
         QR: '65465465465',
          id: 1233213,
        },
          {
          name: 'Mesa 10',
         QR: '65465465465',
          id: 345423,
        },
      ]
      this.tableFilter = this.currentTable
    },
     searchFilter() {
      this.tableFilter = this.currentTable.filter((u) =>
        u.name.toLowerCase().includes(this.searchValue.toLowerCase()) 
      )
    },
    addnewTable() {
      if (this.newTable.name.length < 1) {
        this.$toasted.show(
          `El nombre de mesa debe contener 1 o mas caracteres`,
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          }
        )
      } else if (this.newTable.QR.length < 8) {
        this.$toasted.show(`El QR debe contener 8 o mas caracteres`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        this.newTable.id = Date.now()
        this.currentTable.push(this.newTable)
      }
    },
    updatetable(tableC) {
      // TODO: connection with update table endpoint
    },
    deletetable() {
      this.currentTable = this.currentTable.filter(
        (u) => u.id !== this.tableSelected.id
      )
      this.showDeleteModal = false
      this.tableFilter = this.currentTable
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
  }
  th {
    padding: 0.5rem 0.1rem;
  }
    .newTable {
  max-height: 25rem;
}
  .titleCard {
  display: grid;
  grid-auto-flow: row;
  justify-content: center;
  gap: 1rem 0;
  }
    .contentCard form {
    display:grid;
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
    padding: 1rem;
  }

  th {
    padding: 1rem;
  }
    .newTable {
  max-height: 15rem;
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
  overflow: hidden;
}

.tableList {
  min-height: 40rem;
}

.titleCard {
  position: relative;
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
  display: grid;
  align-items: center;
  justify-content: center;
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

.contentCard form {
  box-sizing: border-box;
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