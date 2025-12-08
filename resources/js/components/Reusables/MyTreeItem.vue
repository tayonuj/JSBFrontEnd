<template>
    <div :style="{ paddingLeft: `${1.5 * depth}rem` }">
        <v-hover v-slot="{ isHovering, props }">
            <v-list-item size="compact"  v-bind="props">
                <template v-slot:prepend>
                    <v-icon :color="generateColors(item.type)">{{generateIcon(item.type)}}</v-icon>
                </template>
<!--                <v-list-item-title>{{item.name}}</v-list-item-title>-->
                <template v-if="!isEditing">
                    <v-list-item-title @dblclick="isEditing = true">{{ item.name }}</v-list-item-title>
                </template>
                <v-text-field v-else hide-details density="compact" variant="solo" v-model="newName" @blur="renameItem" />
                <template v-slot:append>
                    <v-btn variant="text" v-if="isHovering" size="small" @click="deleteData">
                        <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                </template>
            </v-list-item>
        </v-hover>
<!--        <span>{{ item.name }}</span>-->
<!--        <button @click="deleteData">X</button>-->
    </div>
<!--    <v-list-group :value="item.name">-->
<!--        <template v-slot:activator="{ props }">-->
<!--            <v-list-item-->
<!--                size="compact"-->
<!--                v-bind="props"-->
<!--                prepend-icon="mdi-folder"-->
<!--                :title="item.name"-->
<!--            ></v-list-item>-->
<!--        </template>-->
<!--    </v-list-group>-->

<!--    </v-list-item>-->
</template>

<script setup>
import {inject, ref} from 'vue'
const props = defineProps(['item', 'depth', 'expanded'])
defineEmits(['setExpanded'])
const expanded = ref(false);

const generateIcon = (type) => {
  switch (type) {
      case 'folder': return "mdi-folder";
      case 'file': return "mdi-file-upload";
  }
}

const generateColors = (type) => {
  switch (type) {
      case 'folder': return "light-blue-darken-1";
      case 'file': return "teal-lighten-1";
  }
}

const deleteHandler = inject('delete');
const renameHandler = inject('rename'); // Assume this is provided from parent
const isEditing = ref(false);
const newName = ref(props.item.name);

const deleteData = () => {
    if (confirm("Are you want to delete "+props.item.name+" ?"))
        deleteHandler(props.item.id ,props.item.category_name);
};

const renameItem = () => {
    if (newName.value !== props.item.name) {
        renameHandler(props.item.id, newName.value ,props.item.category_name);
    }
    isEditing.value = false;
};
</script>
