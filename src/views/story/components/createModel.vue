<template>
    <v-dialog v-model="dialog" width="500" @afterLeave="handleAfterLeave">
        <template v-slot:default="{ isActive }">
            <v-form validate-on="submit" @submit.prevent="onSubmit($event, isActive)">
                <v-card title="创建">
                    <template #append>
                        <div class="mr-n4">
                            <v-btn
                                variant="text"
                                @click="isActive.value = false"
                                icon="mdi-close"
                            />
                        </div>
                    </template>
                    <v-sheet width="350" class="ma-10 mx-auto">
                        <v-text-field
                            v-model="formData.title"
                            prepend-icon="mdi-format-title"
                            clearable
                            :rules="[(firstName) => !!firstName || '请输入']"
                            required
                            label="书名"
                            density="comfortable"
                            variant="outlined"
                        ></v-text-field>
                        <div style="margin-inline-start: 40px; padding-block-end: 16px">
                            <Upload v-model:value="formData.cover_image" @success="handleSuccess" />
                        </div>
                        <v-text-field
                            v-model="formData.author"
                            prepend-icon="r"
                            clearable
                            label="作者"
                            density="comfortable"
                            variant="outlined"
                        ></v-text-field>
                        <!-- <v-file-input label="封面" variant="outlined"></v-file-input> -->
                        <!-- <v-combobox
                            v-model="formData.tag"
                            prepend-icon="s"
                            clearable
                            chips
                            multiple
                            :rules="[(firstName) => !!firstName || 'required']"
                            label="标签"
                            density="comfortable"
                            variant="outlined"
                            :items="[]"
                        ></v-combobox> -->
                        <v-select
                            v-model="formData.genres"
                            prepend-icon="s"
                            clearable
                            label="类型"
                            density="comfortable"
                            variant="outlined"
                            multiple
                            :items="[
                                '奇幻',
                                '玄幻',
                                '悬疑',
                                '历史',
                                '科技',
                                '都市',
                                '言情',
                                '轻小说',
                            ]"
                        ></v-select>
                        <div class="mt-4" />
                        <v-textarea
                            prepend-icon="s"
                            v-model="formData.description"
                            label="描述"
                            variant="outlined"
                        ></v-textarea>
                    </v-sheet>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn type="submit" class="ma-2" color="primary" size="large">保存</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </template>
    </v-dialog>
    <Snackbar ref="snackbar" />
</template>
<script lang="ts" setup>
import { ref, unref, reactive } from 'vue';
import axios from 'axios';
import Upload from '@/components/Upload/index.vue';

const emit = defineEmits(['success']);
const snackbar = ref();
const dialog = ref(false);
const id = ref('');
const formData = ref({
    title: '',
    author: '',
    cover_image: '',
    genres: [],
    description: '',
});

function open(data?: any) {
    dialog.value = true;
    if (data !== undefined) {
        formData.value = { ...data };
        id.value = unref(formData).id;
        console.log('编辑数据: ', formData.value);
    }
}

function handleSuccess(data) {
    console.log('上传', data);
    formData.value.cover_image = data.url;
}

function onSubmit(cb, isActive) {
    cb.then(async ({ valid }) => {
        if (!valid) return snackbar.value.warn('请输入标题');
        try {
            let params = unref(formData);
            let result;
            if (unref(id)) {
                result = await axios.put('/api/story/' + unref(id), params);
            } else {
                result = await axios.post('/api/story', params);
            }
            if (result.status !== 200) return snackbar.value.error('异常');
            snackbar.value.success('操作成功!');
            isActive.value = false;
            emit('success');
        } catch {
            snackbar.value.error('异常');
        }
        console.log('submit: ', unref(formData), result);
    });
}

function handleAfterLeave(e) {
    console.log('handleAfterLeave', e);
    formData.value = {
        title: '',
        author: '',
        cover_image: '',
        genres: [],
        description: '',
    };
    id.value = '';
}

defineExpose({
    open,
});
</script>
