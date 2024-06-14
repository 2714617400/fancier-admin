<template>
    <div class="tables_page">
        <v-card class="my-4">
            <div class="search-bar ma-4 d-flex">
                <div class="filter d-flex">
                    <div class="row">
                        <v-text-field
                            v-model="pageParams.title"
                            clearable
                            hide-details
                            label="书名"
                            placeholder="搜索书名"
                            prepend-inner-icon="mdi-magnify"
                            density="compact"
                            dense
                            variant="outlined"
                        ></v-text-field>
                    </div>
                    <!-- <div class="row my-4 my-sm-0">
                        <div class="px-sm-4 px-0">
                            <v-select
                                clearable
                                hide-details
                                label="Status"
                                placeholder="Status"
                                density="compact"
                                dense
                                variant="outlined"
                                :items="['secondary', 'red', 'green', 'pink', 'blue']"
                            ></v-select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="pr-0 pr-sm-4">
                            <v-select
                                clearable
                                hide-details
                                label="License use"
                                placeholder="License use"
                                density="compact"
                                dense
                                variant="outlined"
                                :items="[
                                    '0% - 20%',
                                    '20% - 40%',
                                    '40% - 60%',
                                    '60% - 80%',
                                    '80% - 100%',
                                ]"
                            ></v-select>
                        </div>
                    </div> -->
                    <div class="row">
                        <div class="pr-0 pr-sm-4">
                            <v-btn
                                class="btn mr-4 my-4 my-sm-0 mx-2"
                                color="primary"
                                @click="handleSearch"
                                >查询</v-btn
                            >
                        </div>
                    </div>
                </div>
                <!-- <v-btn
                    class="btn mr-4 my-4 my-sm-0"
                    variant="tonal"
                    prepend-icon="mdi-filter-variant"
                    >Filter</v-btn
                > -->
                <div class="d-flex jsb">
                    <!-- <v-divider vertical class="d-none d-sm-flex"></v-divider>
                    <v-btn class="btn" variant="tonal"
                        ><v-icon icon="mdi-tray-arrow-down" size="large"
                    /></v-btn>
                    <v-btn class="btn mx-4" variant="tonal"
                        ><v-icon icon="mdi-share" size="large"
                    /></v-btn> -->
                    <v-btn class="btn" color="primary" @click="handleCreate">
                        <v-icon icon="mdi-plus" size="large" />
                    </v-btn>
                </div>
            </div>
            <v-divider class="ma-4"></v-divider>
            <v-table class="ma-4 table">
                <thead>
                    <tr>
                        <th class="text-left">书名</th>
                        <th class="text-left">封面</th>
                        <th class="text-left">章数</th>
                        <th class="text-left">更新时间</th>
                        <th class="text-left">创建时间</th>
                        <th class="text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, i) in list" :key="i">
                        <td class="td1 py-4">
                            <div class="d-flex">
                                <div class="ml-2">
                                    <div class="name">{{ item.title }}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <v-img
                                class="my-2"
                                :width="100"
                                aspect-ratio="16/9"
                                cover
                                :src="previewFileAddress(item.cover)"
                            ></v-img>
                        </td>
                        <td>
                            <div>
                                {{ item.chaptersCount }}
                            </div>
                        </td>
                        <td>
                            <div>
                                {{ item.updatedAt }}
                            </div>
                        </td>
                        <td>
                            <div>
                                {{ item.createdAt }}
                            </div>
                        </td>
                        <td>
                            <div>
                                <v-icon
                                    icon="mdi-format-list-bulleted"
                                    color="#999"
                                    style="margin-inline-end: 10px"
                                    @click="handleViewChapt(item)"
                                />
                                <v-icon
                                    icon="mdi-lead-pencil"
                                    color="#999"
                                    style="margin-inline-end: 10px"
                                    @click="handleEdit(item)"
                                />
                                <v-icon
                                    icon="mdi-trash-can-outline"
                                    color="red"
                                    @click="handleDel(item)"
                                />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <div class="py-2" style="justify-content: center">
                <v-pagination
                    v-model="pageParams.page"
                    :length="pLength"
                    size="small"
                    rounded="circle"
                    @update:modelValue="handleUpdate"
                ></v-pagination>
            </div>
        </v-card>
        <v-dialog v-model="dialog" width="30%">
            <v-card title="Dialog">
                <v-card-text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
    <Create ref="crt" @success="handleSuccess" />
    <ViewChaptersModel ref="viewChapt" @success="handleSuccess" />
    <Snackbar ref="snackbar" />
</template>
<script setup lang="ts">
import axios from 'axios';
import Create from './components/createModel.vue';
import ViewChaptersModel from './components/viewChaptersModel.vue';
import { ref, reactive, computed, unref, onMounted } from 'vue';

const snackbar = ref();
const dialog = ref(false);
const Cover = new URL('../../assets/cover.jpg', import.meta.url).href;
const list = ref([]);
const crt = ref();
const viewChapt = ref();
const pageParams = reactive({
    page: 1,
    pageSize: 5,
    title: '',
    total: 0,
});
const pLength = computed(() => Math.ceil(pageParams.total / pageParams.pageSize)); // 分页数
// 列表操作
async function getStory() {
    let result = await axios.get('/api/story', {
        params: pageParams,
    });
    let { data } = result;
    list.value = data.result.list;
    pageParams.total = data.result.total;
}
function handleSearch() {
    pageParams.page = 1;
    getStory();
}
function handleUpdate() {
    getStory();
}
function handleCreate() {
    unref(crt).open();
}
function handleEdit(item) {
    unref(crt).open(item);
}
async function handleDel({ id }) {
    try {
        let result = await axios.delete('/api/story/' + id);
        if (result.status !== 200) return unref(snackbar).error('异常');
        unref(snackbar).success('操作成功!');
        getStory();
    } catch {
        unref(snackbar).error('异常');
    }
}
function handleViewChapt(item) {
    unref(viewChapt).open(item.id);
}
function handleSuccess() {
    getStory();
}

onMounted(() => {
    getStory();
});

function previewFileAddress(url: string) {
    if (!url || url.split(':')[0] === 'http' || url.split(':')[0] === 'https') {
        return url;
    } else return 'http://123.60.18.204:3000/images/' + url;
}
</script>
<style lang="scss">
.tables_page {
    .search-bar {
        .filter {
            flex: 1;
            .row {
                width: 33.3%;
            }
        }
    }
    .table {
        .td1 {
            .name {
                font-weight: 700;
                height: 21px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .sub_title {
                font-size: 12px;
            }
            .v-icon {
                font-size: 35px;
            }
        }
    }
}
.mobile {
    .tables_page {
        .search-bar {
            display: block !important;
            .filter {
                display: block !important;
                flex: 1;
                .row {
                    width: 100%;
                }
            }
            .d-flex {
                display: block !important;
            }
        }
        .table {
            width: calc(100vw - 64px);
            overflow: hidden;
        }
    }
}
</style>
