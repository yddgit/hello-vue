import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

// createApp函数创建一个应用实例
const app = createApp(App)
// 添加全局属性，应用实例内所有组件都可以使用
app.config.globalProperties = {
    baseUrl: 'https://www.example.com/api'
}
// 调用mount方法渲染应用实例，mount方法应该始终在整个应用配置和资源注册完成后被调用，它的返回值是根组件实例
app.mount('#app')
// 应用实例会暴露一个config对象允许我们配置一些应用级的选项，如全局异常处理器
app.config.errorHandler = (err) => {
    console.error('Error: ', err);
}
// 应用实例还提供一些方法来注册应用范围内可用的资源
//app.component('TodoDeleteButton', TodoDeleteButton)

// 多个应用实例，每个应用实例有自己的配置和全局资源作用域
//refer to /public/multi-apps.html