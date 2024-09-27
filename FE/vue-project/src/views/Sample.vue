<script setup>
 import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      <RouterLink to="/">
        <button class="home-btn">Go to Home Page</button>
      </RouterLink>
    </div>
</template>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 100px;
  }
  
  h1 {
    font-size: 3rem;
    color: #ff4f4f;
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
  
  .home-btn {
    background-color: #42b983;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .home-btn:hover {
    background-color: #2d8a6f;
  }
  </style>
  