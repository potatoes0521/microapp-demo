<template>
  <div class="page-wrapper">
    <div>这是child3的page2</div>
    <button @click="$router.push('/2-1')">跳转到 2-1</button>
  </div>
</template>
<script>
export default defineComponent({
setup() {

return {
};
},
});
</script>
<style scoped lang="scss"></style>
