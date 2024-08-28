<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref(':-)')
const answerImage = ref('')

watch(question, async (newQuestion, oldQuestion) => {
    if(newQuestion.includes('?')) {
        answer.value = 'Thinking...'
        try {
            const res = await fetch('https://yesno.wtf/api')
            const json = await res.json()
            answer.value = json.answer
            answerImage.value = json.image
        } catch(error) {
            answer.value = 'Error! Could not reach the API. ' + error
        }
    }
})
</script>
<template>
    <p>Ask a yes/no question: <input v-model="question"/></p>
    <p>{{ answer }}<br/><img :src="answerImage" style="height:200px"/></p>
</template>