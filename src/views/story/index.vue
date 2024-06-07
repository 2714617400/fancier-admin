<template>
    <div class="tables_page">
        <!-- <v-row no-gutters>
            <v-col cols="12" sm="4"><Statistic /></v-col>
            <v-col cols="12" sm="4" class="my-sm-0 my-4"
                ><Statistic
                    :up="false"
                    value="360"
                    chart-color="#4caf50"
                    class="mx-0 mx-sm-4"
                    :chart-data="[30, 47, 75, 47, 65]"
            /></v-col>
            <v-col cols="12" sm="4"
                ><Statistic value="15,260" chart-color="#FF5722" :chart-data="[68, 58, 65, 72]"
            /></v-col>
        </v-row> -->
        <v-card class="my-4">
            <div class="search-bar ma-4 d-flex">
                <div class="filter d-flex">
                    <div class="row">
                        <v-text-field
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
                        <th class="text-left">进度</th>
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
                                :width="100"
                                aspect-ratio="16/9"
                                cover
                                :src="previewFileAddress(item.cover_image)"
                            ></v-img>
                        </td>
                        <td>
                            <div style="width: 200px">
                                <v-progress-linear
                                    v-model="item.progress"
                                    :color="item.color"
                                    rounded
                                    height="6"
                                ></v-progress-linear>
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
            <div class="d-flex py-2" style="justify-content: center">
                <v-pagination
                    :model-value="1"
                    :length="4"
                    size="small"
                    rounded="circle"
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
    <Snackbar ref="snackbar" />
</template>
<script setup lang="ts">
import Statistic from '@/components/Statistic/index.vue';
import axios from 'axios';
import Create from './components/createModel.vue';
import { ref, unref, onMounted } from 'vue';

const snackbar = ref();
const dialog = ref(false);
const Cover = new URL('../../assets/cover.jpg', import.meta.url).href;
const list = ref([
    {
        title: 'GitHub',
        cover_image: Cover,
        color: 'secondary',
        progress: 0,
        id: '',
        createdAt: '',
        updatedAt: '',
    },
    {
        title: 'Angular',
        cover_image: Cover,
        color: 'red',
        progress: 0,
        id: '',
        createdAt: '',
        updatedAt: '',
    },
    {
        title: 'Apple',
        cover_image: Cover,
        color: 'green',
        progress: 0,
        id: '',
        createdAt: '',
        updatedAt: '',
    },
]);
const crt = ref();

// 列表操作
async function getStory() {
    let result = await axios.get('/api/story');
    let { data } = result;
    list.value = data;
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
function handleSuccess() {
    getStory();
}

onMounted(() => {
    getStory();
    setTimeout(() => {
        list.value.forEach((item) => {
            item.progress = Math.floor(Math.random() * 100) + 1;
        });
    }, 600);
});

const onTest = () => {
    // router.push({
    //     path: '/graphics/oasis-engine',
    // });
};

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
