<template>
    <div class="sidebar bg-light vh-100 p-3 border-start border-end border-dark ms-3 me-3">
      <div class="d-flex justify-content-center mb-3">
        <button
        class="btn me-2 flex-fill"
        :class="{ 'btn-primary': activeTab === 'users', 'btn-outline-primary': activeTab !== 'users' }"
        @click="changeTab('users')"
      >
        Users
      </button>
      <button
        class="btn flex-fill"
        :class="{ 'btn-primary': activeTab === 'groups', 'btn-outline-primary': activeTab !== 'groups' }"
        @click="changeTab('groups')"
      >
        Groups
      </button>
        </div>
      <ul v-if="activeTab === 'users' " class="list-group">
        <li
          v-for="user in users"
          :key="user.id"
          @click="selectUser(user)"
          class="list-group-item list-group-item-action pointer"
          :class="{ 'bg-select': user.name === selectedUserId }"
        >
          {{ user.name }}
        </li>
      </ul>

      <ul v-if="activeTab === 'groups' " class="list-group">
        <li
          v-for="group in groups"
          :key="group.id"
          @click="selectedGroup(group)"
          class="list-group-item list-group-item-action pointer"
          :class="{ 'bg-select': group.name === selectedGroupName }"
        >
          {{ group.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    users: Array,
    selectedUserId: String
  });
  
  const emit = defineEmits(['select-user', 'select-group', 'select-activeTab']);
  const activeTab = ref('users');
  
  const selectUser = (user) => {
    emit('select-user', user);
  };

  const changeTab = (tab) => {
    activeTab.value = tab;
    if(tab ==='users'){
       selectedGroupName.value = null
    }
    emit('select-activeTab', tab);
  };

  const groups = ref([
  { id: 1, name: 'Friends Group' },
 ]);

    const selectedGroupName = ref(null);

    const selectedGroup = (group) => {
      selectedGroupName.value = group.name; // Set selected group name
      emit('select-group', group);
    };
  </script>
  
  <style scoped>

.bg-select{
    background-color: #009959;
  }

  .pointer{
    cursor: pointer;
  }
  .sidebar {
    /* width: 300px; */
  }
  
  ul {
    list-style: none;
    padding: 0;
  }

  li:hover {
  background-color: #009959; /* Ensure it matches the default */
}
  </style>
  