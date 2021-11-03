<template>
  <tr>
    <td>
      <img class="userImg" :src=" user.picture">
    </td>
    <td>
      <p>{{ user.name}}</p>
    </td>
        <td>
      <p>{{ user.usersCount}}</p>
    </td>
    <td class="tdOptions">
            <BaseButtonTableText
        backcolor="white"
        bordercolor="black"
        color="black"
        text="Cerrar"
        @click="$emit('click:cerrar', user)"
      />
      <BaseButtonTableText
        backcolor="black"
        bordercolor="black"
          color="white"
        text="Ban"
        @click="$emit('click', user)"
      />
 
    </td>
  </tr>
</template>
<script>
import BaseButtonTableText from '@/components/ui/BaseButtonTableText.vue'
export default {
  name: 'BaseRowBanUsers',
  components: {
    BaseButtonTableText,
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
    padding: 0.3rem 1rem;
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
  height: 4rem;
}
.tdOptions img {
  cursor: pointer;
}
td p {
  line-break: anywhere;
}
.tdOptions {
  display: grid;
  gap: 1rem 0;
}
.userImg {
  max-height: 4rem;
}
</style>