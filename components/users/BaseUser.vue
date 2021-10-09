<template>
<tr>
		<td><BaseInputUsers :value="user.userName" :status="status"/></td>
		<td> <BaseInputUsers :value="user.password" :status="status"/></td>
		<td><BaseInputUsers :value="user.email" :status="status"/></td>
		<td class="tdOptions"><img src="@/assets/icons/edit.svg" @click="status=!status"><img src="@/assets/icons/delete.svg" @click="$emit('click')"></td>
</tr>
</template>
<script>
import BaseInputUsers from '@/components/users/BaseInput.vue'
export default {
  name: 'BaseUser',
	components: {
		BaseInputUsers
	},
	props: {
		user:{
			type: Object,
			required: true,
		}
},
data: () => ({
	status: true
})
}
</script>
<style>
  .tdOptions {
  display: grid;
  align-items: center;
  justify-content: start;
  grid-auto-flow: column;
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