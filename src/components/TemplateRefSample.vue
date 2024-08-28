<script setup>
import { ref, onMounted, watchEffect } from 'vue'

// 声明一个同名的ref
const input = ref(null)
onMounted(() => input.value.focus())
// 只有组件挂载后才能访问模板引用, 如果要侦听模板引用的变化, 需要确保考虑到其值为null的情况
watchEffect(() => {
    if(input.value) {
        input.value.focus()
    } else {
        // 此时还未挂载, 或此元素已经被卸载
    }
})

// v-for中使用模板引用时, ref是一个数组, 元素挂载后将是整个列表的所有元素, 但ref数组并不保证与源数组的顺序相同
const list = ref(['Tom', 'Jerry', 'Jack', 'Jim'])
const itemRefs = ref([])
onMounted(() => console.log(itemRefs.value))

// 函数模板引用
const inputRef = ref(null)
onMounted(() => inputRef.value.value = 'new text value')

// 父组件通过模板引用获取到了该组件的实例时, 得到的实例类型为: { a: number, b: number }
const a = 1
const b = ref(2)
// 像defineExpose这样的编译器不需要import
defineExpose({
    a, b
})
</script>

<template>
    <input ref="input"/>
    <ul>
        <li v-for="item in list" ref="itemRefs" :key="item">{{ item }}</li>
    </ul>
    <!-- ref函数会收到元素引用作为其第一个参数, 元素卸载时也会被调用(此时el参数会是null) -->
    <input :ref="(el) => inputRef = el" value="old text value"/>
</template>