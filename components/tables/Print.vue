<template>
  <div class="editModaltableContainer">
    <div class="editModaltable">
      <p class="titleModal">QR a imprimir</p>
      <div id="printMe" class="qrContainerEdit">
        <!-- <vueQr
          :logoSrc="getLogoQr()"
          :logoScale="4"
          :text="qrs[0].code"
          :size="200"
        />
      -->
      <div class="containerAddNewQrBtn">
      <p>{{qrs[0].name}}</p>
      </div>
       </div>

      <div class="tdOptionstable">
        <BaseButtonEdit
         v-print="'#printMe'"
          backcolor="#5e72e4"
          bordercolor="#5e72e4"
          text="Imprimir"
          color="white"
          @click="printSection()"
        />
        <BaseButtonEdit
          backcolor="white"
          bordercolor="#5e72e4"
          text="Cerrar"
          color="#5e72e4"
          @click="clickCancel()"
        />
      </div>
    </div>
    <div class="background" @click="$emit('click:cancel')"></div>
  </div>
</template>
<script>
// import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import BaseButtonEdit from '@/components/tables/BaseButtonEdit.vue'
import print from 'vue-print-nb'
export default {
  name: 'EditModalTable',
  components: {
    // vueQr,
    BaseButtonEdit
  },
  directives: {
    print   
},
  props: {
    qrs: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
  }),
  methods: {
    clickCancel() {
      this.$emit('cancel:click')
    },
      getLogoQr() {
      return require('@/assets/images/logoBgWhite.jpg')
    },
    printSection() {

    }
  },
}
</script>
<style scoped>
.titleModal {
  font-size: 1.0625rem;
    font-family: inherit;
    font-weight: 600;
    line-height: 1.5;
    color: #32325d;
    display: grid;
    align-items: center;
    justify-content: center;
}
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