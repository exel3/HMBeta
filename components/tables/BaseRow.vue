<template>
  <tr>
    <td>
      <p>{{ table.name }}</p>
    </td>
    <td>
      <p>{{ table.qr.code }}</p>
    </td>
       <td class="tdOptions">
      <BaseButtonTable
        backcolor="transparent"
        bordercolor="#f7fafc"
        imgsrc="print.svg"
        @click="$emit('click:print', localName)"
      />
    </td>
    <td class="tdOptions">
      <BaseButtonTable
        backcolor="#f7fafc"
        bordercolor="#f7fafc"
        imgsrc="edit.svg"
        @click="$emit('click:edit', localName)"
      />
      <BaseButtonTable
        backcolor="#f5365c"
        bordercolor="#f5365c"
        imgsrc="delete.svg"
        @click="$emit('click:delete', table)"
      />
    </td>
  </tr>
</template>
<script>
import BaseButtonTable from '@/components/ui/BaseButtonTable.vue'
export default {
  name: 'BaseRowTables',
  components: {
    BaseButtonTable,
  },
  props: {
    table: {
      type: Object,
      required: true,
    },
    locals: {
      type: Array,
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
</style>