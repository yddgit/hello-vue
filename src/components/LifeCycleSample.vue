<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

defineProps({
    state: {
        type: Number,
        required: true
    }
})

// https://cn.vuejs.org/api/composition-api-lifecycle.html

// 在组件完成初始渲染并创建DOM节点后运行
onMounted(() => {
    console.log(`the component is now mounted`)
})
// 钩子应当在组件初始化时被同步注册
setTimeout(() => {
    onMounted(() => {
        console.log(`异步注册时当前组件实例已丢失，这里将不会正常工作`)
    })
})
onUpdated(() => {
    console.log(`the component is updated`)
})
onUnmounted(() => {
    console.log(`the component is now unmounted`)
})
</script>
<template>{{ state }}</template>