<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref(''); // Reactive reference for username
const router = useRouter(); // Access the router instance

const login = () => {
  if (username.value.trim()) {
    // Set username in session storage
    sessionStorage.setItem('user-name', username.value);
    loginUser()
    // Route to the Chats component
    router.push('/chats');
  } else {
    alert('Please enter a username.');
  }
};

const loginUser = async () => {

  const userData = { name: username.value }; // Create user object

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData), // Convert object to JSON string
    });

    // Check for a successful response
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON response
    // responseMessage.value = `Logged in as: ${data.name} with ID: ${data.id}`; // Display success message
  } catch (error) {
    // responseMessage.value = `Error: ${error.message}`; // Display error message
  }
  }
</script>

<template>
     <div class="d-flex justify-content-center align-items-center vh-100 bg-custom">
     <div class="card shadow p-4" style="width: 300px;">
      <h3 class="text-center mb-4">Login</h3>
      <div class="form-group mb-3">
        <label class="mb-2" for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          class="form-control"
          placeholder="Enter your username"
        />
      </div>
      <button class="btn btn-primary w-100" @click="login">Login</button>
    </div>
  </div>
</template>

<style scoped>
.bg-custom {
  background-color: rgb(54, 121, 198); /* Light Cyan background color */
}

.card {
  border-radius: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}   

button:focus {
  outline: none;
}

input:focus {
  border-color: #17437c; /* Vibrant green */
  box-shadow: 0 0 5px rgba(102, 187, 106, 0.5);
}
</style>