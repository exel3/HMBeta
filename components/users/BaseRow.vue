<template>
  <tr>
    <td><BaseInput :value="currentUser.userName" :status="status" @blur="currentUser.userName =  $event.target.value" /></td>
    <td><BaseInput :value="currentUser.password" :status="status" @blur="currentUser.password =  $event.target.value" /></td>
    <td><BaseInput :value="currentUser.email" :status="status" @blur="currentUser.email =  $event.target.value" /></td>
    <td class="tdOptions">
      <BaseButtonTable
        v-if="status === true"
        backcolor="#f7fafc"
        bordercolor="#f7fafc"
        imgsrc="edit.svg"
        @click="status = !status"
      />

      <BaseButtonTable
        v-if="status === false"
        backcolor="#5e72e4"
        bordercolor="#5e72e4"
        imgsrc="done.svg"
        @click="
          status = !status
          $emit('update-user', currentUser)
        "
      />
      <BaseButtonTable
        v-if="status === false"
        backcolor="white"
        bordercolor="#5e72e4"
        imgsrc="cancel.svg"
        @click="
          status = !status
          currentUser = user
        "
      />
      <BaseButtonTable
        backcolor="#f5365c"
        bordercolor="#f5365c"
        imgsrc="delete.svg"
        @click="$emit('click-delete',currentUser)"
      />
    </td>
  </tr>
</template>
<script>
import BaseInput from '@/components/users/BaseInput.vue'
import BaseButtonTable from '@/components/ui/BaseButtonTable.vue'
export default {
  name: 'BaseUser',
  components: {
    BaseInput,
    BaseButtonTable,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    status: true,
    currentUser: {},
  }),
  mounted() {
    this.currentUser = this.user
  },
}
</script>
<style>
.tdOptions {
  display: grid;
  align-items: center;
  justify-content: start;
  grid-auto-flow: column;
  gap: 0 0.5rem
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
.tdOptions img {
  cursor: pointer;
}
</style>