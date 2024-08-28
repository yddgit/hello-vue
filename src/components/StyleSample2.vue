<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
    <p class="foo bar">{{ text }}</p>
    <span :class="$attrs.class">This is child component</span>
</template>