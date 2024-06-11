<template>
    <v-dialog v-model="dialog" width="500" @afterLeave="handleAfterLeave">
        <template v-slot:default="{ isActive }">
            <v-card title="章节">
                <template #append>
                    <div class="mr-n4">
                        <v-btn variant="text" @click="isActive.value = false" icon="mdi-close" />
                    </div>
                </template>
                <v-sheet width="350" class="ma-20 mx-auto">
                    <v-infinite-scroll :height="300" :items="list" :onLoad="handleLoad">
                        <template v-for="(item, index) in list" :key="item">
                            <div class="pa-2 d-flex align-md-center">
                                <div
                                    class="flex-sm-grow-1 d-inline-block text-truncate cursor-pointer"
                                >
                                    {{ item.title }}
                                </div>
                                <v-btn
                                    class="flex-sm-shrink-0"
                                    style="color: #ee82ee"
                                    density="compact"
                                    elevation="0"
                                    icon="mdi-arrow-right-bold"
                                ></v-btn>
                            </div>
                        </template>
                    </v-infinite-scroll>
                </v-sheet>
            </v-card>
        </template>
    </v-dialog>
    <Snackbar ref="snackbar" />
</template>
<script lang="ts" setup>
import { ref, unref, reactive, computed } from 'vue';
import axios from 'axios';

const emit = defineEmits(['success']);
const snackbar = ref();
const dialog = ref(false);
const id = ref('');
const list = ref([]);
const pageParams = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
});
const pLength = computed(() => Math.ceil(pageParams.total / pageParams.pageSize)); // 分页数

function open(data?: any) {
    dialog.value = true;
    id.value = data;
    getChapter();
}

async function getChapter() {
    let result = await axios.get(`/api/story/${unref(id)}/chapter`, {
        params: pageParams,
    });
    let { data } = result;
    list.value.push(...data.result.list);
    pageParams.total = data.result.total;
}

async function handleLoad({ done }) {
    pageParams.page++;
    const res = await getChapter();
    done('ok');
}

function handleEdit(item) {
    // unref(crt).open(item);
}

function handleAfterLeave(e) {
    id.value = '';
    pageParams.page = 1;
    pageParams.pageSize = 10;
    pageParams.total = 0;
    list.value = [];
}

defineExpose({
    open,
});
</script>
