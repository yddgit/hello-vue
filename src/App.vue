<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import StyleSample from './components/StyleSample.vue'
import StyleSample2 from './components/StyleSample2.vue'
import ItemSample from './components/ItemSample.vue'
import LifeCycleSample from './components/LifeCycleSample.vue'
import WatchSample from './components/WatchSample.vue'
import TemplateRefSample from './components/TemplateRefSample.vue'
import CountSample from './components/CountSample.vue'
import CountSample2 from './components/CountSample'
import BlogSample from './components/BlogSample.vue'
import AlertBoxSample from './components/AlertBoxSample.vue'
import HomeTab from './components/tabs/Home.vue'
import PostsTab from './components/tabs/Posts.vue'
import ArchiveTab from './components/tabs/Archive.vue'
import { reactive, nextTick, ref, computed, watch, watchEffect, watchPostEffect, onMounted } from 'vue'

// 模板语法

const message = 'Hello Vue'
const rawHtml = '<a href="#">Link</a>'
const targetLink = 'https://www.baidu.com'
const isButtonDisabled1 = true
const isButtonDisabled2 = ''
const isButtonDisabled3 = false
const attrs = {
  id: 'multi-attrs',
  style: 'color:red;',
}
const number = 100
const ok = false
const id = 'item'
const formatDate = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
const seen = 'permit'
const onClick = () => alert('Clicked!')
const attrName = 'href'
const eventName = 'click'
const onSubmit = () => alert('Submitted!')

// 响应式基础

// 单文件组件中使用<script setup>来简单化代码
const state = reactive({ count: 0 })
const increment = () => {
  state.count++
  // 若要等待一个状态改变后的DOM更新完成，可以使用nextTick()
  nextTick(() => {
    console.log('DOM has been updated to: ', document.getElementById('btn-1').innerHTML)
  })
}
// 如果要在组件模板中使用响应式状态，需要在setup()函数中定义并返回
/*
export default {
  // setup是一个专门用于组合式API的特殊钩子函数
  setup() {
    const state = reactive({ count: 0 })
    // 也可以在同一作用域下定义响应式状态的函数，并将其作为方法和状态一起暴露出去
    // 暴露的方法通常会被作为事件监听器
    function increment() {
      state.count++
    }
    // 暴露state到模板
    return {
      state,
      increment,
    }
  }
}
*/

// 深层响应性
const deep = reactive({
  nested: {
    count: 0
  },
  arr: ['foo', 'bar']
})
const mutateDeeply = () => {
  // 以下都会按照期望工作
  deep.nested.count++
  deep.arr.push('baz')
}

// reactive()返回的是原始对象的Proxy，它和原始对象不相等，更改原始对象不会触发更新，所以最佳实践是：仅使用声明对象的代理版本
// 对同一个原始对象调用reactive()会总是返回同样的代理对象
const raw = { name: 'object' }
const proxy = reactive(raw)
console.log(reactive(raw) === proxy) // true
// 对一个已存在的代理对象调用reactive()会返回其本身
console.log(reactive(proxy) === proxy) // true
// 响应式对象内的嵌套对象依然是代理
const proxyObj = reactive({})
const rawObj = {}
proxyObj.nested = rawObj
console.log(proxyObj.nested === rawObj) // false

// reactive()的限制
// 1. 仅对对象类型有效，对string/number/boolean这样的原始类型无效
// 2. 不能随意替换一个响应式对象，这会导致对初始引用的响应性连接丢失。同时意味着，将响应式对象的属性赋值或解构至本地变量，或将该属性传入一个函数时，会失去响应性
let counter = reactive({ count: 0 })
counter = reactive({ count: 1 }) // 上面引用{ count: 0 }将不再被追踪（响应性连接已丢失）
let n = counter.count // n是一个局部变量，同counter.count，失去响应性连接
n++ // 不影响原始的counter
let { count } = counter // count也和counter.count失去了响应性连接
count++ // 不会影响原始的counter
const someFunction = (count) => { count++ }
someFunction(counter.count) // 该函数接收一个普通数字，并且无法跟踪counter.count的变化

// 用ref()定义响应式变量：解决JavaScript没有可以作用于所有值类型的“引用”机制的问题
const countRef = ref(0)
console.log(countRef) // { value: 0 }
console.log(countRef.value) // 0
countRef.value++
console.log(countRef.value) // 1
const incrementRef = () => countRef.value++
// ref的value属性也是响应式的，当值为对象类型时，会用ractive()自动转换它的value
const objRef = ref({ count: 0 })
objRef.value = { count: 1 } // 这是响应式的替换
// ref被传递给函数或是从一般对象上解构时，不会丢失响应性
const test = {
  foo: ref(1),
  bar: ref(2),
}
const someFunction2 = (count) => { count.value++ }
someFunction2(test.foo)
console.log(test.foo.value) // 2
const { foo, bar } = test // 仍然是响应式的
console.log(foo.value, bar.value) // 2 2

// ref在模板中作为顶层属性被访问时，会自动解包，无需.value

// 当ref被嵌套在一个响应式对象中作为属性被访问或更改时，会自动解包，表现得和一般属性一样
const refProp = ref(0)
const stateContainsRefProp = reactive({
  count: refProp
})
console.log(stateContainsRefProp.count) // 0
stateContainsRefProp.count = 1
console.log(stateContainsRefProp.count) // 1
// 如果将一个新的ref赋值给一个关联了已有ref的属性，那么它会替换掉旧的ref
const otherRef = ref(2)
stateContainsRefProp.count = otherRef
console.log(stateContainsRefProp.count) // 2
// 原始ref和stateContainsRefProp.count已失去联系
console.log(refProp.value) // 1
// 需要注意浅层响应对象的属性不会解包

// 当ref作为响应式数组或Map这种原生集合类型的元素被访问时，不会进行解包
const books = reactive([ref('Vue 3 Guide')])
console.log(books[0].value) // 这里需要.value
const map = reactive(new Map([['count', ref(0)]]))
console.log(map.get('count').value) // 这里需要.value

// 计算属性
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
// computed接收一个getter函数，返回一个计算属性ref(和其他一般ref类似)
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
// 定义一个函数也可以实现和computed相同的效果，但不同之处在于：
// computed会基于响应式依赖被缓存(依赖不变不会执行)，相比之下函数调用总是会在渲染时执行
const calculateBooksMessage = () => {
  return author.books.length > 0 ? 'Yes' : 'No'
}
// 计算属性默认是只读的，除非在创建时同时提供getter和setter
const firstName = ref('John')
const lastName = ref('Doe')
const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
fullName.value = 'Joe Biden'
console.log(`${firstName.value} ${lastName.value}`)
// 计算属性最佳实践：Getter不应有副作用(可以用监听器来实现), 避免直接修改计算属性值

// class绑定
const isActive = ref(true)
const hasError = ref(false)
const classObj = reactive({
  active: true,
  'text-danger': true
})
const error = ref(null)
const classComputed = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
const activeClass = ref('active')
const errorClass = ref('active')

// style绑定
const activeColor = ref('red')
const fontSize = ref(30)
const styleObj = reactive({
  color: 'red',
  fontSize: '13px',
  'background-color': '#cccccc',
})

// 如果使用了浏览器特殊前缀的CSS, Vue会自动加上相应前缀
// Vue是在运行时检查该属性是否支持在当前浏览器中使用
// 如果浏览器不支持某个属性，Vue会尝试加上各个浏览器特殊前缀，以找到哪一个是被支持的

// 条件渲染
const condition = reactive({
  awesome: true,
  type: 'A',
  show: true,
  display: true,
})
// 列表渲染
const parentMessage = ref('Parent')
const items = ref([
  { message: 'Foo', children: [ {message: 'C1'}, {message: 'C2'} ] },
  { message: 'Bar', children: [ {message: 'C3'}, {message: 'C4'} ] },
])
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10',
})
const array = reactive([
  1, 2, 3
])
const numbers = ref([1, 3, 2, 5, 4])
const evenNumbers = computed(() => {
  return numbers.value.filter(n => n%2 === 0)
})
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])
const even = (numbers) => {
  return numbers.filter(number => number % 2 === 0)
}
const sortedNumbers = computed(() => {
  return [...numbers.value].sort()
})

// 事件监听
const inlineCount = ref(0)
const name = ref('Vue.js')
const greet = (event) => {
  alert(`Hello ${name.value}`)
  if(event) {
    // 方法事件会自动接收原生DOM事件并触发执行
    alert(event.target.tagName)
  }
}
const say = (message) => {
  alert(message)
}
const warn = (message, event) => {
  if(event) {
    console.log(event.target.tagName)
    event.preventDefault()
  }
  alert(message)
}
const doThis = () => alert('Do something')

// 表单输入绑定
const text = ref('')
const paragraph = ref('')
const checked = ref(false)
const checkedNames = ref([])
const picked = ref('')
const selected = ref('')
const selectedMultiple = ref([])
const selectedValue = ref('A')
const options = ref([
  { text: 'One', value: 'A' },
  { text: 'Two', value: 'B' },
  { text: 'Three', value: 'C' },
])
const toggle = ref('yes')
const choosen = ref('Off')
const trueValue = 'On'
const falseValue = 'Off'
const pick = ref('')
const firstValue = 'first'
const secondValue = 'second'
const selectedObj = ref({})
const lazyMessage = ref('')
const age = ref(10)
const trimedMessage = ref('')

// 生命周期钩子
const lifeCycleState = ref(0)

// 侦听器

const [x, y] = [ref(0), ref(0)]
// 单个ref
watch(x, (newX) => console.log(`x is ${newX}`))
// getter函数
watch(
  () => x.value + y.value,
  (sum) => console.log(`sum of x + y is: ${sum}`)
)
// 多个来源组成的数组
watch([x, ()=> y.value], ([newX, newY]) => console.log(`x is ${newX} and y is ${newY}`))

// 不能直接侦听响应式对象的属性值, 如:
const stateObj = reactive({ count: 0 })
// !!!错误!!!, 因为watch()得到的参数是一个number(会得到一个 Vue warning)
watch(stateObj.count, (count) => {
  console.log(`count is ${count}(not work)`)
})
// 需要用该属性的getter函数
watch(
  () => stateObj.count,
  (count) => console.log(`count is ${count}(works)`)
)

// 深层侦听(谨慎使用, 开销很大)

// 直接给watch()传入一个响应式对象，会隐式的创建一个深层侦听器(在所有嵌套的变更时都会被触发)
watch(stateObj, (newValue, oldValue) => {
  // newValue和oldValue是相等的
  console.log(`${newValue === oldValue} ${newValue.count}`)
})
// 而返回响应式对象的getter函数，只有在返回不同的对象时，才会触发回调
const stateObject = reactive({
  book: {
    name: 'Yes or No',
    author: 'Someone',
    publishedAt: '2012-10-12'
  }
})
watch(
  () => stateObject.book,
  (newValue, oldValue) => {
    // 仅当stateObject.book被替换时触发
    console.log(newValue === oldValue, `book property is replaced`)
  }
)
// 也可以添加deep选项强制转成深层侦听器
watch(
  () => stateObject.book,
  (newValue, oldValue) => {
    // 除非book被替换, 否则newValue和oldValue是相等的
    console.log(newValue === oldValue, newValue)
  },
  { deep: true }
)
// 即时回调的侦听器
const source = ref(1)
watch(source, (newValue, oldValue)=> {
  //立即执行, 且当source改变时再次执行
  console.log(`value is ${newValue}`)
}, { immediate: true })

const toolId = ref(1)
const data = ref(null)
// 如下: 当toolId变化时加载一个远程资源
// watch(toolId, async() => {
//   const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${toolId.value}`)
//   data.value = await response.json()
// }, { immediate: true })
// 可以用watchEffect来简化: 这种情况回调会立即执行(不用指定immediate:true), 自动跟踪toolId.value作为依赖
watchEffect(async () => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${toolId.value}`)
  data.value = await response.json()
})
// 对于有多个依赖的侦听器来说, watchEffect可以消除手动维护依赖列表的负担
// 如果只侦听一个数据结构中的几个属性, watchEffect也会更有效, 因为它只跟踪回调中被使用到的属性(而不是递归跟踪所有属性)

// watch能精确控制回调触发时机
// watchEffect自动追踪, 但响应性依赖关系不那么明确

// 默认侦听器回调会在Vue组件更新之前被调用, 所以侦听器中访问的DOM是更新之前的状态
// 如果想访问更新之后的DOM, 需要指明flush: 'post'选项
// 后置刷新的watchEffect()有一个方便的别名: watchPostEffect()
const unwatch = watch(source, ()=>console.log(`watch post updated: ${source.value}`), { flush: 'post'})
const unwatchEffect = watchEffect(()=>console.log(`watchEffect post updated: ${source.value}`), { flush: 'post'})
const unwatchPostEffect = watchPostEffect(()=>console.log(`watchPostEffect post updated: ${source.value}`))

// 同步创建的侦听器会自动绑定到宿主组件实例上, 会在宿主组件卸载时自动停止
// 如果是异步创建的侦听器, 则必须手动停止它, 防止内存泄露
const removeWatch = () => {
  // 调用watch/watchEffect/watchPostEffect返回的函数
  unwatch()
  unwatchEffect()
  unwatchPostEffect()
}

// 父组件通过模板引用获取该组件的实例, ref会自动解包
const childRef = ref(null)
onMounted(() => console.log('Child instance: ', childRef.value))

const posts = ref([
  { id: 1, title: 'My Journey with Vue' },
  { id: 2, title: 'Blogging with Vue' },
  { id: 3, title: 'Why Vue is so fun' },
])
const postFontSize = ref(1)
const onUpdated = (crruentValue) => console.log(`Counter updated: ${crruentValue}`)

// 动态组件
const currentTab = ref('HomeTab')
const tabs = {  HomeTab, PostsTab, ArchiveTab }
</script>

<template>
  <!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->
  <div class="wrapper">
    <HelloWorld msg="模板语法" />
    <ul>
      <li>文本插值: <span>{{ message }}</span></li>
      <li>原始文本: {{ rawHtml }}</li>
      <!-- v-html指令：span的内容将会被替换为rawHtml属性的值 -->
      <li>原始HTML: <span v-html="rawHtml"></span></li>
      <li>Attribute绑定: <br/>
        <!-- v-bind指令：如果绑定的值是null或undefined则会将该attribute从渲染的元素上移除 -->
        <a target="_blank" v-bind:href="targetLink">动态属性</a><br/>
        <a target="_blank" :href="targetLink">简写语法</a> <br/>
        <!-- 对于布尔型属性，当绑定的值为true或空字符串时元素会包含这个disabled属性；当绑定的值为false时attribute将被忽略 -->
        <button :disabled="isButtonDisabled1">布尔型Attribute:true</button><br/>
        <button :disabled="isButtonDisabled2">布尔型Attribute:空字符串</button><br/>
        <button :disabled="isButtonDisabled3">布尔型Attribute:false</button><br/>
        <!-- 对于布尔型属性，Vue以上行为的原因在于：Vue以HTML的方式来使用布尔型属性，如下示例 -->
        <button disabled="">布尔型Attribute:HTML</button><br/>
        <button disabled="0">布尔型Attribute:HTML</button><br/>
        <!-- 通过不带参数的v-bind将多个属性绑定到单个元素上 -->
        <span v-bind="attrs">绑定多个属性值</span>
      </li>
      <li>使用JavaScript表达式: <br/>
        <!-- JavaScript可以用在：文件插值和任何Vue指令attribute值中 -->
        <!-- 仅支持单一表达式，即是否可以合法的写在return后面 -->
        <!-- 以当前组件实例为作用域解析执行 -->
        <!-- 仅能够访问到有限的全局对象列表: https://github.com/vuejs/core/blob/main/packages/shared/src/globalsWhitelist.ts#L3 -->
        <!-- 可以 app.config.globalProperties 通过显式的添加自己的属性，供所有的Vue表达式使用 -->
        {{ number + 1 }}<br/>
        {{ ok ? 'YES' : 'NO' }}<br/>
        {{ message.split('').reverse().join('') }}<br/>
        <div :id="`list-${id}`">调用函数：{{ formatDate(new Date()) }}</div>
        Base URL: {{ baseUrl }}
      </li>
      <li>指令Directives: <br/>
        <!-- 内置指令: https://cn.vuejs.org/api/built-in-directives.html -->
        <code>v-</code>前缀的特殊attribute, 如: v-html, v-bind<br/>
        <!-- 指令的期望值是一个JavaScript表达式(v-for, v-on和v-slot除外)，指令的任务是在其表达式的值变化时响应式的更新DOM -->
        <span v-if="seen">Now you see me</span><br/>
        <!-- 某些指令需要一个参数，在指令名后通过一个冒号隔开做标识，如: v-bind, v-on -->
        <a v-bind:href="targetLink">带参数的指令v-bind</a><br/>
        <a v-on:click="onClick">带参数的指令v-on</a><br/>
        <a @click="onClick">带参数的指令v-on(简写)</a><br/><!-- 简写 -->
        <!-- 动态参数，使用方括号。动态表达式的值应当是一个字符串或null，null表示显式移除该绑定，其他值会触发警告 -->
        <a v-bind:[attrName]="targetLink">[动态参数]</a><br/>
        <a :[attrName]="targetLink">[动态参数(简写)]</a><br/>
        <a v-on:[eventName]="onClick">动态事件</a><br/>
        <a @[eventName]="onClick">动态事件(简写)</a><br/>
        <!-- 动态参数有一些语法限制，如空格和引号，在HTML attribute中都是不合法的，如果很复杂，推荐使用计算属性 -->
        <!-- <a :['foo' + bar]="value"></a><br/> -->
        <!-- 当使用DOM内嵌模板时，需要避免在名称中使用大写字母，因为浏览器会强制将其转换为小写。单文件组件内的模板不受些限制 -->
        <a href="/directive-param.html">动态参数名避免用大写字母</a><br/>
        <!-- 修饰符是以点开头的特殊后缀，表明指令需要以一些特殊的方式被绑定 -->
        <!-- 如下: .prevent修饰符会告知v-on指令对触发的事件调用event.preventDefault() -->
        <form @submit.prevent="onSubmit">
          <button>修饰符Modifiers</button>
        </form>
      </li>
    </ul>
  </div>
  <!-- <TheWelcome /> -->
  <div class="wrapper">
    <HelloWorld msg="响应式基础"/>
    <ul>
      <li>
        声明响应式状态: <button id="btn-1" @click="increment">{{ state.count }}</button><br/>
        深层响应性: <button id="btn-2" @click="mutateDeeply">{{ deep.nested.count }}</button> {{ deep.arr.join(', ') }}<br/>
        ref在模板中的解包: <button @click="incrementRef">{{ countRef }} <!-- 无需.value --></button><br/>
        ref的非顶层属性不会自动解包: {{ test.foo + 1 }}<br/>
        将ref非顶层属性改成顶层属性即可自动解包: {{ foo + 1 }}<br/>
        ref非顶层属性若只是一个文件插值(无运算)也将被解包: {{ test.foo }}
      </li>
      <li>
        计算属性用来描述依赖响应式状态的复杂逻辑: Has published books - {{ publishedBooksMessage }}
      </li>
      <li>
        class和style的绑定:<br/>
        <div class="static" :class="{ active: isActive, 'text-danger': hasError }">基于数据属性的真假值决定是否添加class, 可以和一般的class共存</div>
        <div :class="classObj">直接绑定一个对象</div>
        <div :class="classComputed">绑定一个计算属性(常见)</div>
        <div :class="[activeClass, errorClass]">绑定数组</div>
        <div :class="[isActive ? activeClass : '', errorClass]">绑定数组(使用表达式)</div>
        <div :class="[{active: isActive}, errorClass]">绑定数组(嵌套对象)</div>
        <div><StyleSample class="red" text="给子组件添加class"/></div>
        <div><StyleSample :class="{ active: isActive }" text="给子组件绑定class"/></div>
        <div><StyleSample2 class="green" text="子组件有多个根元素需要指定哪个根元素来接收这个class: "/></div>
        <div :style="{ color: activeColor, fontSize: `${fontSize}px`, 'background-color': '#ffcc00' }">Style绑定</div>
        <div :style="styleObj">绑定样式对象</div>
        <div :style="[{color: 'red'}, {color: 'blue'}]">绑定样式对象数组(会合并后渲染)</div>
        <div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex']}">一个样式属性可以提供多个不同前缀的值, 数组仅会渲染浏览器支持的最后一个值</div>
      </li>
    </ul>
  </div>
  <div class="wrapper">
    <HelloWorld msg="基础"/>
    <ul>
      <li>
        <div>条件渲染: 
          <h1 v-if="condition.awesome" @click="()=>condition.awesome=false" :title="'Click to hide this awesome message'">Vue is awesome!</h1>
          <!-- v-else元素必须跟在一个v-if或v-else-if元素后面，否则不会被识别 -->
          <h1 v-else @click="()=>condition.awesome=true" :title="'Click to show awesome message'">Awesome message gone😢</h1>
          <div v-if="condition.type === 'A'">A</div>
          <div v-else-if="condition.type === 'B'">B</div>
          <!-- v-else-if元素必须跟在一个v-if或v-else-if元素后面 -->
          <div v-else-if="condition.type === 'C'">C</div>
          <div v-else>Not A/B/C</div>
          <div>
            <span @click="()=>condition.show=!condition.show">使用&lt;template&gt;来包装元素实现不止一个元素的条件渲染: </span>
            <template v-if="condition.show">
              <span>P1</span> <span>P2</span>
            </template>
            <!-- v-else和v-else-if也可以在template上使用 -->
          </div>
          <div><span @click="()=>condition.display=!condition.display">v-show</span>: <span v-show="condition.display">在DOM渲染时保留该元素, 仅切换display属性, 不支持在template上使用, 不能和v-else搭配使用</span></div>
          <!-- v-if有更高的切换开销, v-show有更高的初始渲染开销 -->
          <!-- 如果需要频繁切换, 使用v-show较好 -->
          <!-- 如果在运行时绑定条件很少改变, 使用v-if较好 -->
          <!-- v-if和v-for不推荐同时使用于一个元素上, v-if会首先被执行: https://cn.vuejs.org/style-guide/rules-essential.html#avoid-v-if-with-v-for -->
        </div>
      </li>
      <li>
        <div>列表渲染:
          <ol>
            <li v-for="(item, index) in items" :key="index+1">
              {{ parentMessage }} - {{ index }} - {{ item.message }}
            </li>
          </ol>
          也可以使用解构
          <ol>
            <li v-for="({ message }, index) in items" :key="index+1">
              {{ parentMessage }} - {{ index }} - {{ message }}
            </li>
          </ol>
          嵌套v-for(也可以用of替代in)
          <ol>
            <li v-for="({ message, children }, index) of items" :key="index+1">
              <span v-for="(child, subIndex) of children" :key="subIndex+1">{{ parentMessage }} - {{ index }} - {{ message }}: {{ child.message }}<br/></span>
            </li>
          </ol>
          遍历对象(Object.keys()的顺序)
          <ol>
            <li v-for="(value, key, index) in myObject" :key="key">{{ index }}.{{ key }}: {{ value }}</li>
          </ol>
          v-for使用范围值(从1开始)
          <span v-for="n in 10" :key="n">{{ n }},</span><br/>
          在&lt;template&gt;上使用v-for来渲染包含多个元素的块
          <ol>
            <template v-for="(item, index) in items" :key="index+1">
              <li>{{ item.message }}</li>
              <li class="divider" role="presentation">-------------------</li>
            </template>
          </ol>
          组件上使用v-for(不会自动传递任何数据, 需要传递props)
          <ItemSample v-for="(item, index) in items" :book="{ name: item.message, author: 'unknown' }" :key="index+1" :index="index"/>
          Vue可以侦测到数组的变更(push,pop,shift,unshift,splice,sort,reverse): 
          <button @click="()=>array.push(array.length + 1)">Add</button>
          <button @click="()=>array.splice(array.length - 1, 1)">Del</button>
          {{ array.join(',') }}<br/>
          展示过滤或排序后的结果:
          <ol>
            <li v-for="n in evenNumbers" :key="n">{{ n }}</li>
          </ol>
          计算属性不可行的情况下可以使用方法:
          <ol v-for="(numbers, i) in sets" :key="i">
            <li v-for="n in even(numbers)" :key="n">{{ n }}</li>
          </ol>
          在计算属性中使用reserve()和sort()会变更原始数组, 计算函数中不应该这么做, 需要在调用之前创建一个原数组的副本
          {{ sortedNumbers }}
        </div>
        <!-- v-if和v-for不推荐同时使用于一个元素上, v-if会首先被执行, 因此v-if将无法访问到v-for作用域内定义的变量别名 -->
        <!-- 推荐在任何时候为v-for提供一个key attribute (string/number) -->
      </li>
    </ul>
  </div>
  <div class="wrapper">
    <HelloWorld msg="事件处理"/>
    <ul>
      <li>
        监听事件: 
        <button @click="inlineCount++">内联处理 {{ inlineCount }}</button>
        <button @click="greet">方法处理 Greet</button>
        <button @click="say('Hello')">内联调用方法 Say Hello</button>
        <button @click="warn('Form cannot be submitted yet.', $event)">使用$event访问事件参数</button>
        <button @click="(event) => warn('Form cannot be submitted yet.', event)">使用内联箭头函数访问事件参数</button>
      </li>
      <li>
        事件修饰符: <code>.stop/.prevent/.self/.capture/.once/.passive</code><br/>
        <a @click.stop="doThis">停止事件传递.stop</a>
        <form @submit.prevent="doThis"><button type="submit">提交不重新加载页面.prevent</button></form>
        <a @click.stop.prevent="doThis">修饰语链式书写.stop.prevent</a>
        <form @submit.prevent><button type="submit">只有修饰符</button></form>
        <div @click.self="doThis">仅当event.target是元素本身时触发(事件不来自子元素): Click <span style="color:blue">here</span> will not trigger event</div>
        <div>使用修饰符需要注意顺序: 
          <ol>
            <li>@click.prevent.self会阻止当前元素及其所有子元素的点击事件默认行为</li>
            <li>而@click.self.prevent只会阻止当前元素本身的点击事件默认行为</li>
          </ol>
        </div>
        <div @click.capture="say('Handled by parent')">使用capture模式添加事件监听(指向内部元素的事件被处理前先被外部处理): <span style="color:blue" @click="say('Hanlde by child')">child</span></div>
        <a @click.once="doThis">点击事件最多被触发一次</a>
        <div>
          滚动事件的默认行为将立即发生而非等待doThis函数完成, 以防其中包含event.preventDefault()
          <div style="width:170px;height:50px;overflow:auto;border:1px solid #000" @scroll.passive="doThis">
            Get started with Vuetify, the world's most popular Vue.js framework for building feature rich, blazing fast applications.
          </div>
          .passive修饰符一般用于触摸事件的监听器, 可以用来改善移动端设备的滚屏性能<br/>
          不要同时使用.passive和.prevent, 否则.prevent将被忽略并抛出警告
        </div>
      </li>
      <li>
        按键修饰符: <code>.enter/.tab/.delete/.esc/.space/.up/.down/.left/.right</code><br/>
        系统按键修饰符(必须在事件发出时处于按下状态): <code>.ctrl/.alt/.shift/.meta</code><br/>
        <input @keyup.enter="say('Enter pressed')" placeholder="Press enter to submit"/><br/>
        <input @keyup.page-down="say('Page Down pressed')" placeholder="Press page down to submit"/><br/>
        <input @keyup.alt.enter="say('Alt + Enter pressed')" placeholder="Press alt+enter to submit"/><br/>
        <div @click.ctrl="say('Ctrl pressed and clicked')">Ctrl + 单击</div>
        .exact控制确定组合的系统按键修饰符
        <button @click.ctrl="say('Ctrl pressed and clicked')">Ctrl + 单击(同时按下Alt或Shift能会触发)</button>
        <button @click.ctrl.exact="say('Only ctrl pressed and clicked')">仅当Ctrl且未按任何其他键时才会触发</button>
        <button @click.exact="say('Only clicked')">仅当没有按下任何系统按键时触发</button>
      </li>
      <li>
        鼠标按钮修饰符: <code>.left/.right/.middle</code><br/>
      </li>
    </ul>
  </div>
  <div class="wrapper">
    <HelloWorld msg="表单输入绑定"/>
    <ul>
      <li>
        <input v-model="text" placeholder="Please input"/> {{ text }}<br/>
        <!-- textarea不支持插值表达式，需要使用v-model -->
        <textarea v-model="paragraph" placeholder="Please input"></textarea> {{ paragraph }}<br/>
        单一复选框绑定布尔类型值: <input type="checkbox" id="checkbox" v-model="checked" /><label for="checkbox">{{ checked }}</label><br/>
        <div>多个复选框绑定数组或集合: Checked names - {{ checkedNames }}<br/>
          <input type="checkbox" id="jack" value="Jack" v-model="checkedNames"/><label for="jack">Jack</label>
          <input type="checkbox" id="john" value="John" v-model="checkedNames"/><label for="john">John</label>
          <input type="checkbox" id="mike" value="Mike" v-model="checkedNames"/><label for="mike">Mike</label>
        </div>
        <div>单选按钮: Picked - {{ picked }}<br/>
          <input type="radio" id="one" value="One" v-model="picked"/><label for="one">One</label>
          <input type="radio" id="two" value="Two" v-model="picked"/><label for="two">Two</label>
        </div>
        <div>下拉框: Selected - {{ selected }}
          <select v-model="selected">
            <option disabled value="">Please select one</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select><br/>
          Selected(multiple): {{ selectedMultiple }}<br/>
          <select v-model="selectedMultiple" multiple style="width:100px;height:60px">
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select><br/>
          使用v-for渲染选项: {{ selectedValue }}<br/>
          <select v-model="selectedValue">
            <option v-for="o in options" :value="o.value" :key="o.value">{{ o.text }}</option>
          </select>
        </div>
      </li>
      <li>
        值绑定: v-model绑定的通常是静态字符串或布尔值, 可以使用v-bind来绑定非字符串类型<br/>
        复选框可以指定true/false为其他类型的值: <input type="checkbox" v-model="toggle" true-value="yes" false-value="no" /> {{ toggle }}<br/>
        v-bind绑定动态值: <input type="checkbox" v-model="choosen" :true-value="trueValue" :false-value="falseValue" /> {{ choosen }}<br/>
        单选按钮动态值: <input type="radio" v-model="pick" :value="firstValue"/> <input type="radio" v-model="pick" :value="secondValue"/> {{ pick }}<br/>
        下拉框选项value动态值: {{ selectedObj }} <select v-model="selectedObj">
          <option :value="{number:123}">123</option>
          <option :value="{number:456}">456</option>
        </select><br/>
      </li>
      <li>
        修饰符: .lazy/.number/.trim<br/>
        .lazy每次change事件后更新数据: <input v-model.lazy="lazyMessage" /> {{ lazyMessage }}<br/>
        .number将用户输入自动转换为数字(如果无法被parseFloat()处理将返回原始值): <input v-model.number="age" /> {{ age }}<br/>
        .trim自动去除两端空格: <input v-model.trim="trimedMessage" /> {{ trimedMessage }}
      </li>
      <li>自定义组件也可以用 <a href="https://cn.vuejs.org/guide/components/v-model.html" target="_blank">v-model</a></li>
    </ul>
  </div>
  <div class="wrapper">
    <HelloWorld msg="组件相关"/>
    <ul>
      <li>生命周期钩子<button @click="lifeCycleState = Math.random()">Update</button> : <LifeCycleSample v-if="lifeCycleState > 0.3" :state="lifeCycleState"/></li>
      <li>侦听器<br/>
        <div><WatchSample/></div>
        <div>
          <button @click="x++">Update X</button><br/>
          <button @click="y++">Update Y</button><br/>
          <button @click="stateObj.count++">Update Count</button><br/>
          <button @click="stateObject.book = { name: 'Replaced name', author: 'Me', publishedAt: '2023-01-22' }">Replace book</button><br/>
          <button @click="stateObject.book.name = 'Updated name'">Update book prop</button><br/>
          <button @click="source++">Update source</button> <button @click="removeWatch">Remove watch on source</button><br/>
          <button @click="toolId++">Update ToolId</button> {{ data }}<br/>
        </div>
      </li>
    </ul>
  </div>
  <div class="wrapper">
    <HelloWorld msg="模板引用"/>
    <ul>
      <li><TemplateRefSample ref="childRef"/></li>
    </ul>
  </div>
  <div class="wrapper">
    <HelloWorld msg="组件基础"/>
    <ul>
      <li>
        <CountSample /><br/>
        <CountSample2 title="Counter: " @updated="onUpdated" />
      </li>
      <li>
        <!-- 传递prop: title, 监听事件: enlarge-text/shrink-text -->
        <div :style="{ fontSize: postFontSize + 'em' }">
          <BlogSample title="My Journey with Vue" @enlarge-text="postFontSize += 0.1" @shrink-text="postFontSize -= 0.1" />
          <BlogSample v-for="post in posts" :key="post.id" :title="post.title" @enlarge-text="postFontSize += 0.1" @shrink-text="postFontSize -= 0.1" />
        </div>
      </li>
      <li>
        向组件中传递内容&lt;slot /&gt;: <AlertBoxSample>Something bad happened</AlertBoxSample>
      </li>
      <li>
        动态组件
        <div class="tabs">
          <button
            v-for="(_, tab) in tabs"
            :key="tab"
            :class="['tab-button', { active: currentTab === tab }]"
            @click="currentTab = tab"
          >
            {{ tab }}
          </button>
          <!-- is属性可以传: 被注册的组件名 或 导入的组件对象 -->
          <!-- 被切换掉的组件会被卸载, 可以用<KeepAlive>组件强制被切换掉的组件仍然保持存活状态 -->
          <component :is="tabs[currentTab]" class="tab"></component>
        </div>
      </li>
      <li>
        DOM模板解析注意(SFC/内联模板字符串/&lt;script type="text/x-template"&gt;不需要考虑)
        <ol>
          <li>
            大小写区分: 标签名、属性名、事件名都需要转为kebab-case形式, 如:
            <code>&lt;blog-post post-title="hello!" @update-post="onUpdatePost"&gt;&lt;/blog-post&gt;</code>
          </li>
          <li>
            闭合标签: Vue支持任意标签使用/&gt;作为标签关闭标志, 在DOM模板中, 必须显式的写出关闭标签(
              <a href="https://html.spec.whatwg.org/multipage/syntax.html#void-elements" target="_blank">HTML只允许少部分元素省略关闭标签</a>
            ), 如:
            <code>&lt;my-component&gt;&lt;/my-component&gt;</code>
          </li>
          <li>
            元素位置限制: 可以使用特殊的is属性(在原生HTML元素上必须加vue:前缀), 如:
            <code>&lt;table&gt;&lt;tr is="vue:blog-post-row"&gt;&lt;/tr&gt;&lt;/table&gt;</code>
          </li>
        </ol>
      </li>
    </ul>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.red {
  color: #ff0000;
}

.green {
  color: #00ff00;
}

.active {
  border: 2px solid #0000ff;
  margin: 1px;
}

.text-danger {
  color: #ff7700;
}

.tabs {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
}

.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}
.tab {
  border: 1px solid #ccc;
  padding: 10px;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 3);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
  .wrapper {
    margin: 20px;
  }
}
</style>
