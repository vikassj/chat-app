<script setup>
import { ref,onMounted  } from 'vue';
import { useRouter } from 'vue-router';

const username = ref(''); // Reactive reference for username
const router = useRouter(); // Access the router instance

// Fetch the username from session storage when the component is mounted
onMounted(() => {
  username.value = sessionStorage.getItem('user-name') || 'Guest';
});

const logout = () => {
  sessionStorage.clear();
  router.push('/');
};
</script>

<template>
    <header class="header">
      <div class="header-content d-flex justify-content-between align-items-center">
        <h1 class="text-color">Welcome, {{ username }}</h1>
        <button class="btn btn-clr" @click="logout">Logout</button>
      </div>
    </header>
  </template>

<style scoped>

.text-color{
  color: white;
}

.btn-clr{
  background-color: #009959;
}
.header {
  background-color: #1b2537; /* Change to desired header background color */
  color: white;
  padding: 10px 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  width: 100%;
}
</style>