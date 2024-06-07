<template>
    <v-snackbar v-model="snackbar" :color="color">
        {{ message }}
        <template v-slot:actions>
            <!-- <v-btn color="pink" variant="text" @click="snackbar = false"> Close </v-btn> -->
            <v-icon icon="mdi-alert-circle" :color="color" />
        </template>
    </v-snackbar>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const snackbar = ref(false);
const message = ref('');
const color = ref('info');

function info(text: string, opt?: any) {
    message.value = text;
    color.value = 'info';
    show();
}
function success(text) {
    message.value = text;
    color.value = 'success';
    show();
}
function warn(text) {
    message.value = text;
    color.value = 'warning';
    show();
}
function error(text) {
    message.value = text;
    color.value = 'error';
    show();
}
function show() {
    snackbar.value = true;
}

defineExpose({
    info,
    success,
    warn,
    error,
});
</script>
