<template>
  <div class="editModaltableContainer">
    <div class="editModaltable">
      <label>Nombre de table:</label>
      <BaseInput :valueinput="table.name" @input="newtable.name = $event" />
      <label>QR:</label>
      <BaseInput
        :valueinput="table.qr"
        @input="newtable.qr = $event"
      />
        

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
export default {
  name: 'EditModalTable',
  components: {
    BaseInput,
    BaseButtonEdit,
  },
  props: {
    table: {
      type: Object,
      required: true,
    }
  },
  data: () => ({
    newtable: {},
  }),
  mounted() {
    this.newtable.qr = this.table.qr
    this.newtable.id = this.table.id
    this.newtable.name = this.table.name
    this.newtable.local = this.table.local
    this.newtable.client = this.table.client
    this.newtable.newQr = ''
   
  },
  methods: {
    clickCancel() {
      this.$emit('cancel:click')
    },
      setOwnerSelected(ownerName) {
      this.newtable.clientID = this.owners.find(o => ownerName === o.username).id
    },
    updateEdittable() {
      if (this.newtable.name.length < 1) {
        this.$toasted.show(`El nombre no puede estar vacio`, {
          theme: 'toasted-primary',
          position: 'top-right',
          duration: 5000,
        })
      } else {
        this.$emit('update:table', this.newtable)
      }
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
  top:65px;
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
.selectOwner {
   width: 100%;
  height: 2.5rem;
  padding:0 0.75rem;
  font-weight: 400;
  line-height: 1.5;
  color: #656a6f;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  box-shadow: 0 3px 2px rgb(233 236 239 / 5%);
  box-sizing: border-box;
  margin-top:0.5rem;
}
</style>