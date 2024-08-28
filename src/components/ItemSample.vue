<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
})
</script>

<template>
    <div>{{ book.name }} - {{ book.author }}</div>
</template>