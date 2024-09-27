<template>
     <Header class="border-bottom border-dark"></Header>
     <div class="d-flex justify-content-center align-items-stretch  bg-custom w-100">
        <div class="sidebar-container d-flex flex-column  w-30 ">
      <SideBar :users="users"
        :selectedUserId="selectedUser ? selectedUser.name : null"
        @select-activeTab="setActiveTab"
        @select-group="setGroup"
        @select-user="setSelectedUser"></SideBar>
      </div>
      <div v-if="activeTab === 'users' " class="text-center w-70 ">
        <UserChat :selectedUser="selectedUser" :messages="messages"> </UserChat>
      </div>
      <div v-if="activeTab === 'groups' " class="text-center w-70 ">
        <GroupChat :selectedGroup="selectedGroup"> </GroupChat>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import Header from '@/components/Header.vue';
  import SideBar from '@/components/SideBar.vue';
  import UserChat from '@/components/UserChat.vue'
import GroupChat from '@/components/GroupChat.vue';

  const router = useRouter(); // Access the router instance
  const username = ref(''); // Reactive reference for username
  const messages = ref([]); // Holds chat messages
  const newMessage = ref(''); // For new message input
  const activeTab = ref('users');
  const selectedGroup = ref(null);
  // Fetch user1 from sessionStorage
  const user1 = ref(sessionStorage.getItem('user-name'));

 // Reactive references for users, selected user, loading, and error
const users = ref([]);
const selectedUser = ref(null);
const loading = ref(true); // Loading state
const error = ref(null); // Error state

// Fetch the username from session storage when the component is mounted
onMounted(() => {
  fetchUsers();
});

// Function to fetch users from the API
const fetchUsers = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await fetch('http://localhost:3000/api/users/');
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    
    users.value = data.filter(user => user.name !== user1.value);
    
    // Edge case: If no users are returned from the API
    if (users.value.length === 0) {
      error.value = 'No users available';
    }

  } catch (err) {
    error.value = 'Error fetching users. Please try again later.';
    console.error('Fetch Users Error:', err);
  } finally {
    loading.value = false;
  }
};


const setSelectedUser = (user) => {
  selectedUser.value = user;
  fetchMessages()
};

const setGroup = (group) =>{
  selectedGroup.value = group;
}

const setActiveTab = (tab) =>{
  activeTab.value = tab;
  if(tab === 'users'){
    selectedGroup.value = null;
  }
}

  

    // Function to fetch chat messages
    const fetchMessages = async () => {
      if (user1.value && selectedUser.value) {
        try {
          const response = await fetch(`http://localhost:3000/api/getChats?user1=${user1.value}&user2=${selectedUser.value.name}`);
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          messages.value = data; // Store the messages in the reactive variable
          console.log(JSON.stringify(messages.value));
        } catch (error) {
          console.error('Error fetching chat messages:', error);
        }
      }
    };
 
  </script>
  
  <style scoped>

  .sidebar-container{
    height: 470px;
  }

  .chat-bg{
    background-color: #166e43;
  }
  .w-30{
    width: 30%;
  }
  .w-70{
    width: 70%;
  }
  .bg-custom {
    background-color: #e0f7fa; /* Light Cyan background color */
  }
  </style>
  