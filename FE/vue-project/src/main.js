import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS and optionally Bootstrap JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Optional for JS components

const app = createApp(App)

app.use(router)

app.mount('#app')

// window.addEventListener('scrollToChat', (event) => {
//     const chatId = event.detail.scroller;
//     const chatElement = document.getElementById('scroller');
//     debugger
//     chatElement.scrollTop = chatElement.scrollHeight;
//     if (chatElement) {
//       // Scroll the container to the specific chat
//       chatElement.scrollIntoView({ behavior: 'smooth' });
//     }
//   });