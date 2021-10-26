<template>
  <tr>
    <td>
      <img class="userImg" :src=" user.picture">
    </td>
    <td>
      <p>{{ user.namesAndSurname}}</p>
    </td>
        <td>
      <p>{{ user.email}}</p>
    </td>
    <td class="tdOptions">
      <BaseButtonTable
        backcolor="#f5365c"
        bordercolor="#f5365c"
        imgsrc="block.svg"
        @click="$emit('click:delete', table)"
      />
    </td>
  </tr>
</template>
<script>
import BaseButtonTable from '@/components/ui/BaseButtonTable.vue'
export default {
  name: 'BaseRowBanUsers',
  components: {
    BaseButtonTable,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data:() => ({
    localName: ''
  }),
  mounted() {
    this.setLocalName()
  },
  methods: {
    setLocalName() {
      // this.localName = this.locals.find((l) => l.id === this.table).name
    }
  }

}
</script>
<style>
@media (min-width: 1000px) {
  td {
    padding: 1rem;
  }
}
@media (max-width: 1000px) {
  td {
    padding: 0.1rem 0.5rem;
  }
}
td {
  border-bottom: 1px solid #ebeef5;
  line-height: 1;
  text-align: start;
  font-weight: 400;
  font-size: 0.875rem;
  text-transform: none;
  color: #525f7f;
}
.tdOptions img {
  cursor: pointer;
}
td p {
  line-break: anywhere;
}

.userImg {
  max-height: 4rem;
}
</style>