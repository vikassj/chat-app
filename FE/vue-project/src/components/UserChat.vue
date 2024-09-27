<template>
    <div class="chat-window d-flex flex-column cont-height bg-white border-start border-dark">
      <!-- Chat Header -->
      <div class="chat-header bg-head text-white p-2">
        <h4 class="m-0">
          {{ selectedUser ? selectedUser.name : 'Select a user to chat' }}
        </h4>
      </div>
  
      <!-- Chat Messages -->
      <div id="chat-div" class="chat-messages flex-grow-1 p-3" style="overflow-y: auto;">
        <div 
          v-for="(message, index) in localMessages" 
          :key="index" 
          :class="{'text-end': message.userName === loggedInUser, 'text-start': message.userName !== loggedInUser }"
          class="mb-2"
        >
          <div :class="message.userName === loggedInUser ? 'bg-success text-white p-2 rounded d-inline-block' : 'bg-light text-dark p-2 rounded d-inline-block'">
            <strong>{{ message.userName }}:</strong> 
            <span>{{ message.message }}</span>
            <small class="d-block text-muted" style="font-size: 0.8rem;">{{ message.timeStamp }}</small>
          </div>
        </div>
        <div id="scroller"></div>
      </div>
  
      <!-- Chat Input -->
      <div v-if="selectedUser" class="chat-input d-flex p-2">
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
    selectedUser: Object,
    messages: Object
  });
  
  const loggedInUser = ref('');
  const localMessages = ref([]); // Local variable to store messages
  const messages = ref([]);
  const newMessage = ref('');
  let socket = null;  // WebSocket instance
  
  // Auto-scroll to the bottom of the chat when new messages are added
  onMounted(() => {
    const userName = sessionStorage.getItem('user-name'); 
    if (userName) {
     loggedInUser.value = userName;
     }

    socket = new WebSocket('ws://localhost:3001');
    // Handle WebSocket connection open event
    socket.onopen = () => {
        console.log('WebSocket connection established.');
    };

    // Handle incoming WebSocket messages
    socket.onmessage = async (event) => {
        const receivedMessage = JSON.parse(event.data);
        const isUserPresent = receivedMessage.some(item => item.userName === props.selectedUser.name);
        if(isUserPresent){
            console.log(receivedMessage);
            localMessages.value = receivedMessage.map(({ _id, ...rest }) => rest);;
            scrollToBottom()
        }
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
    user1: loggedInUser.value,          // Fetch from session storage (Alice)
    user2: props.selectedUser.name, // Selected user (Bob)
    userName: loggedInUser.value,    // Fetch from session storage (Alice)
    message: newMessage.value,      // Message typed by the user
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
        const event = new CustomEvent('scrollToChat', {
        detail: {
          chatId: 'chat-div',
          divId: 'scroller',
        }
    });
    window.dispatchEvent(event);
    // const chatMessagesElement =  document.getElementById('scroller');
    // chatMessagesElement.scrollIntoView({ behavior: 'smooth' });
 }

    // handle Props state whenever Changed 
  watch(() => props.messages, (newMessages) => {
    // remove _id from all messages
     localMessages.value = newMessages.map(({ _id, ...rest }) => rest);;
     scrollToBottom()
     console.log(localMessages.value);
    }, { immediate: true });

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
  