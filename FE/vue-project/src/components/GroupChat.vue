<template>
    <div class="chat-window d-flex flex-column cont-height bg-white border-start border-dark">
      <!-- Chat Header -->
      <div class="chat-header bg-head text-white p-2">
        <h4 class="m-0">
          {{ selectedGroup ? selectedGroup.name : 'Select a group to chat' }}
        </h4>
      </div>
  
      <!-- Chat Messages -->
      <div v-if="selectedGroup" class="chat-messages flex-grow-1 p-3" style="overflow-y: auto;">
        <div 
          v-for="(message, index) in localMessages" 
          :key="index" 
          :class="{'text-end': message.userName === loggedInUser, 'text-start': message.userName !== loggedInUser }"
          class="mb-2"
        >
          <div :class="message.userName === loggedInUser ? 'bg-success text-white p-2 rounded d-inline-block' : 'bg-light text-dark p-2 rounded d-inline-block'">
            <strong>{{ message.userName }}:</strong> 
            <span class="ps-1">{{ message.userMessage }}</span>
            <small class="d-block text-muted" style="font-size: 0.8rem;">{{ message.timeStamp }}</small>
          </div>
        </div>
        <div id="scroller"></div>
      </div>
  
      <!-- Chat Input -->
      <div v-if="selectedGroup" class="chat-input d-flex p-2">
        <input
          type="text"
          v-model="newMessage"
          class="form-control"
          placeholder="Type a message"
          @keyup.enter="sendMessage"
        />
        <button class="btn btn-success ms-2" @click="sendMessage">Send</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, computed, onMounted, watch,onUnmounted,nextTick } from 'vue';
  import { format } from 'date-fns'; // Optionally use a library like date-fns for formatting
  const props = defineProps({
    selectedGroup: Object
  });
  
  const loggedInUser = ref('');
  const localMessages = ref([]); // Local variable to store messages
  const newMessage = ref('');
  let socket = null;  // WebSocket instance
  
  // Auto-scroll to the bottom of the chat when new messages are added
  onMounted(() => {
    const userName = sessionStorage.getItem('user-name'); 
    if (userName) {
     loggedInUser.value = userName;
     }

    socket = new WebSocket('ws://localhost:3002');
    // Handle WebSocket connection open event
    socket.onopen = () => {
        console.log('WebSocket connection established.');
        const receivedMessage = JSON.parse(event.data);
        console.log(receivedMessage);
        localMessages.value = receivedMessage.map(({ _id, ...rest }) => rest);
    };

    // Handle incoming WebSocket messages
    socket.onmessage = async (event) => {
        const receivedMessage = JSON.parse(event.data);
        console.log(receivedMessage);
        localMessages.value = receivedMessage.map(({ _id, ...rest }) => rest);
    };

    // Handle WebSocket connection close event
    socket.onclose = () => {
        console.log('WebSocket connection closed.');
    }; 
  });

  // Send a message to the WebSocket server
const sendMessage = () => {
  if (!newMessage.value.trim()) return;  // Prevent sending empty messages

  const chatMessage = {
    // groupName: props.selectedGroup.name,
    groupName: "group-1",
    userName: loggedInUser.value,    // Fetch from session storage (Alice)
    userMessage: newMessage.value,      // Message typed by the user
    timeStamp: format(new Date(), 'p') // Format the current time (e.g., '10:35 AM')
  };

  // Send message over WebSocket
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(chatMessage));
    newMessage.value = '';  // Clear the message input after sending
  }
};

// Scroll to bottom function
    const scrollToBottom = () => {
    // const chatMessagesElement =  document.getElementById('scroller');
    // chatMessagesElement.scrollIntoView({ behavior: 'smooth' });
 }

    // Cleanup WebSocket when the component is destroyed
    onUnmounted(() => {
      if (socket) {
        socket.close();
      }
    });
  </script>
  
  <style scoped>

  .bg-head{
    background-color: #009959;
  }

   .cont-height{
    height: 470px;
  }
  .chat-header {
    height: 50px;
  }
  
  .chat-messages {
    background-color: #f8f9fa;
  }
  
  .chat-input input {
    flex-grow: 1;
  }
  
  .text-start {
    text-align: left;
  }
  
  .text-end {
    text-align: right;
  }
  
  .bg-success {
    background-color: #28a745 !important; /* Right-side messages background */
}

.bg-light {
    background-color: #d1ecf1 !important; /* Left-side messages background (light blue) */
}

.text-dark {
    color: #212529 !important; /* Left-side messages text color */
}
  </style>
  