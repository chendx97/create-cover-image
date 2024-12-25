<script setup lang="ts">
import IconGithub from "./icons/IconGithub.vue";
import IconJuejin from "./icons/IconJuejin.vue";

function handleOpenLink(link: string) {
  window.open(link);
}
</script>

<template>
  <div class="my-header">
    <div class="header-left">
      <div class="logo">
        <img src="../assets/logo.png" width="100%" height="100%" alt="logo" />
      </div>
      <div class="pro-name">封面图生成器</div>
    </div>
    <div class="header-right">
      <el-link href="" :underline="false">博客</el-link>
      <icon-github class="icon-link" @click="handleOpenLink('')" />
      <icon-juejin class="icon-link" @click="handleOpenLink('')" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.my-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 #0000001a;

  .header-left {
    .logo {
      display: inline-block;
      width: 25px;
      height: 25px;
      vertical-align: middle;
    }

    .pro-name {
      display: inline-block;
      margin-left: 5px;
      vertical-align: middle;
      font-size: 20px;
      font-family: cursive;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    column-gap: 20px;

    .icon-link {
      width: 20px;
      height: 20px;
      cursor: pointer;

      &:hover {
        opacity: 0.5;
      }
    }
  }
}
</style>