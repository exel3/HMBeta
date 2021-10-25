<template>
  <div class="editModaltableContainer">
    <div class="editModaltable">
      <label>Nombre de table:</label>
      <BaseInput :valueinput="tableEdited.name" @input="tableEdited.name = $event" />
      <label>QR:</label>
      <BaseInput v-if="tableEdited.newQr === ''" :valueinput="tableEdited.qr.code" :disabled="true" />
       <BaseInput v-else :valueinput="tableEdited.newQr" :disabled="true" />
      <div v-if="tableEdited.qr !== ''" class="qrContainerEdit">
        <QrcodeVue
          v-if="tableEdited.newQr === ''"
          :value="tableEdited.qr.code"
          :size="200"
          level="H"
        />
           <QrcodeVue
          v-else
          :value="tableEdited.newQr"
          :size="200"
          level="H"
        />
      </div>
      <div class="containerAddNewQrBtn">
        <button @click.prevent="generateNewQR">
          Generar nuevo QR
        </button>
      </div>

      <div class="tdOptionstable">
        <BaseButtonEdit
          backcolor="#5e72e4"
          bordercolor="#5e72e4"
          text="Confirmar"
          color="white"
          @click="updateEdittable()"
        />
        <BaseButtonEdit
          backcolor="white"
          bordercolor="#5e72e4"
          text="Cancelar"
          color="#5e72e4"
          @click="clickCancel()"
        />
      </div>
    </div>
    <div class="background" @click="$emit('click:cancel')"></div>
  </div>
</template>
<script>
import BaseInput from '@/components/tables/BaseInput.vue'
import BaseButtonEdit from '@/components/tables/BaseButtonEdit.vue'
import QrcodeVue from 'qrcode.vue'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'EditModalTable',
  components: {
    BaseInput,
    BaseButtonEdit,
    QrcodeVue,
  },
  props: {
    table: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    tableEdited: {
      qr: '',
      id: '',
      name: '',
      newQr: '',
      local: '',
    },
  }),
  created() {
    this.tableEdited.qr = this.table.qr
    this.tableEdited.id = this.table.id
    this.tableEdited.name = this.table.name
    this.tableEdited.local = this.table.local
    this.tableEdited.newQr = ''
  },
  methods: {
    clickCancel() {
      this.$emit('cancel:click')
    },
    getLogoQr() {
      return require('@/assets/images/logoBgWhite.jpg')
    },
    setOwnerSelected(ownerName) {
      this.tableEdited.clientID = this.owners.find(
        (o) => ownerName === o.username
      ).id
    },
    updateEdittable() {
      if (this.tableEdited.name.length < 1) {
        this.$toasted.show(`El nombre no puede estar vacio`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        this.$emit('update:table', this.tableEdited)
      }
    },
    generateNewQR() {
      this.tableEdited.newQr = ''
      this.tableEdited.newQr = uuidv4()
    },
  },
}
</script>
<style scoped>
.editModaltableContainer {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 2;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  box-sizing: border-box;
  overflow: hidden;
  top: 65px;
  left: 0;
}
.editModaltable {
  position: absolute;
  box-sizing: border-box;
  top: 0;
  right: 0;
  height: 100%;
  width: 20rem;
  background: white;
  animation: move 0.5s ease;
  box-shadow: 0 0 2rem 0 rgb(136 152 170 / 15%);
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 2rem;
}
.background {
  width: 100%;
  height: 100%;
}
@keyframes move {
  0% {
    transform: translate(15rem);
  }
  100% {
    transform: translate(0);
  }
}

.tdOptionstable {
  display: grid;
  grid-auto-flow: row;
  gap: 1rem;
  position: absolute;
  bottom: 5rem;
  width: calc(100% - 2rem);
}

.qrContainerEdit {
  display: grid;
  align-items: center;
  justify-content: center;
}

.containerAddNewQrBtn {
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

.containerAddNewQrBtn button {
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
</style>