<script lang="ts" setup>
defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "home" 属性设置首页，其他页面不需要设置，默认为page
  type: 'home',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'default',
    navigationBarTitleText: '%tabbar.home%',
  },
})

const description = ref(
  '基于FastAPI,  SQLAlchemy,  Vue3 & Naiveui,  UniApp的前后端分离权限管理系统',
)
console.log('index/index 首页打印了')

onLoad(() => {
  console.log('测试 uni API 自动引入: onLoad')
})
</script>

<template>
  <view class="bg-white px-4 pt-safe">
    <view class="mt-10">
      <image src="/static/logo.png" alt="" class="mx-auto block h-28 w-28" />
    </view>
    <view class="mt-4 text-center text-4xl text-[#d14328]">
      hohu-admin-app
    </view>
    <view class="mb-8 mt-2 text-center text-2xl">
      多端分离权限管理快速开发框架
    </view>

    <view class="m-auto mb-2 max-w-100 text-justify indent text-4">
      {{ description }}
    </view>
  </view>
</template>
