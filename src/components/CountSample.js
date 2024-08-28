import { ref } from 'vue'

export default {
    props: ['title'],
    emits: ['updated'],
    setup(props, ctx) {
        console.log(`CountSample title is ${props.title}`)
        const count = ref(0)
        ctx.emit('updated', 0)
        return { count, props }
    },
    template: `
        {{ props.title }}<button @click="() => { count++; $emit('updated', count); }">
            You clicked {{ count }} times.
        </button>
    `
    // 或者 template: '#my-template-element'
}