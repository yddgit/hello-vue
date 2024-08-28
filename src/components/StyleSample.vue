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
</template>