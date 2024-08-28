<script setup>
// defineProps声明属性, 会返回一个对象, 包含传递给组件的所有prop
const props = defineProps(['title'])
console.log(props.title)

// defineEmits声明要抛出的事件, 还可以对事件参数进行验证
// 同时让vue避免将它们作为原生事件监听器隐式的应用于子组件的根元素
// defineEmits返回一个等同于$emit方法的函数, 可用于代码中抛出事件, 因为此处无法直接访问$emit
const emit = defineEmits(['enlarge-text', 'shrink-text'])
emit('shrink-text') // 手动触发shrink-text事件

</script>
<template>
    <div class="blog-post">
        <h4>{{ title }}</h4>
        <!-- 调用$emit方法传入事件名称来抛出一个事件 -->
        <button @click="$emit('enlarge-text')">Enlarge text</button>
        <button @click="$emit('shrink-text')">Shrink text</button>
    </div>
</template>