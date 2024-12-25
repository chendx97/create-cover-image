<script lang="ts" setup>
import Giscus from '@giscus/vue';
</script>

<template>
  <div class="my-comment">
    <Giscus id="comments" repo="chendx97/comment-cover-image" repoId="R_kgDONiJYmw" category="Announcements"
      categoryId="DIC_kwDONiJYm84Clgo2" mapping="pathname" term="Welcome to component!" inputPosition="top"
      theme="light" lang="zh-CN" loading="lazy" />
  </div>
</template>

<style lang="less" scoped>
.my-comment {
  max-width: 1300px;
  margin: 50px auto;
}
</style>