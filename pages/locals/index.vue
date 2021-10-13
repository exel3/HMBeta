<template lang="">
  <section>
    <article class="newlocal">
      <div class="titleCard"><p>Agregar nuevo local</p></div>
      <div class="contentCard">
        <form>
          <div>
          <label for="location_address">Nombre</label>
          <input id="location_address" v-model="newlocal.name" type="location_address" autocomplete="off">
          </div>
          <div>
          <label for="contraseña">Direccion</label>
          <input id="contraseña" v-model="newlocal.location_address" type="text"  autocomplete="off">
          </div>
           <div>
          <label for="usuario">Ciudad</label>
          <input id="usuario"  v-model="newlocal.location_city_name" type="text" name="newlocal" autocomplete="off">
          </div>
           <div>
          <label for="usuario">Pais</label>
          <input id="usuario"  v-model="newlocal.location_country_name" type="text" name="newlocal" autocomplete="off">
          </div>
        </form>
      </div>
      <div class="containerAddBtn">
        <button @click.prevent="addNewlocal()">Agregar</button>
      </div>
    </article>
    <article class="localList">
       <div class="titleCard">
         <p>Lista de locales</p>
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
		<th>Direccion</th>
		<th>Ciudad</th>
    <th>Pais</th>
    <th>Opciones</th>
	</tr>
	</thead>
	<tbody>
<BaseRow v-for="local in localsFilter" 
:key="local.id" 
:local="local"
@click="showDeleteModal = true; localSelected = local" 
@update:local="updatelocal(local)" 
@click:delete="showDeleteModal=true; localSelected=local"
@cancel:click="cancelClick(local)"
/>
	</tbody>
</table>
    </article>
    <DeleteModal v-if="showDeleteModal" @delete:local="deletelocal" @cancel:delete="showDeleteModal = false"/>
  </section>
</template>
<script>
import DeleteModal from '@/components/users/DeleteModal.vue'
import BaseRow from '~/components/locals/BaseRow.vue'
export default {
  name: 'Locals',
  components: {
    DeleteModal,
    BaseRow,
  },
  data: () => ({
    currentlocals: [],
    localSelected: {},
    newlocal: { name: '', location_address: '', location_city_name: '', location_country_name: '',id: null },
    showDeleteModal: false,
    searchValue: '',
    localsFilter: []
  }),
  mounted() {
    this.getlocals()
  },
  methods: {
    cancelClick(local) {
      this.getlocals()
    },
    getlocals() {
      this.currentlocals = [
        {
          name: 'Matria',
          location_address: 'Pellegrini 1000',
          location_city_name: 'Rosario',
          location_country_name: 'Argentina',
          id: 12323,
        },
        {
          name: 'KingBeer',
          location_address: 'Pellegrini 1000',
          location_city_name: 'Rosario',
          location_country_name: 'Argentina',
          id: 134543,
        },
        {
          name: 'Worldbeer',
          location_address: 'Pellegrini 1000',
          location_city_name: 'Rosario',
          location_country_name: 'Argentina',
          id: 34543,
        },
      ]
      this.localsFilter = this.currentlocals
    },
     searchFilter() {
      this.localsFilter = this.currentlocals.filter((u) =>
        u.name.toLowerCase().includes(this.searchValue.toLowerCase()) || u.location_address.toLowerCase().includes(this.searchValue.toLowerCase()) 
      )
    },
    addNewlocal() {
      if (this.newlocal.name.length < 8) {
        this.$toasted.show(
          `El nombre de usuario debe contener 8 o mas caracteres`,
          {
            theme: 'toasted-primary',
            position: 'top-right',
            duration: 5000,
          }
        )
      } else if (this.newlocal.location_city_name.length < 8) {
        this.$toasted.show(`La contraseña debe contener 8 o mas caracteres`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else if (this.newlocal.location_address) {
        this.$toasted.show(`Formato de location_address incorrecto`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        this.newlocal.id = Date.now()
        this.currentlocals.push(this.newlocal)
      }
    },
    updatelocal(localC) {
      // TODO: connection with update local endpoint
    },
    deletelocal() {
      this.currentlocals = this.currentlocals.filter(
        (u) => u.id !== this.localSelected.id
      )
      this.showDeleteModal = false
      this.localsFilter = this.currentlocals
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
    .newlocal {
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
    .newlocal {
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

.localList {
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