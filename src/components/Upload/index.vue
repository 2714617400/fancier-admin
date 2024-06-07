<template>
    <v-dialog width="700" height="500">
        <template v-slot:activator="{ props }">
            <v-btn v-if="!list.length" v-bind="props" class="btn" color="primary">
                <v-icon icon="mdi-upload" size="large" />
                上传图片
            </v-btn>
            <div v-else class="cursor-pointer" style="display: inline-block" v-bind="props">
                <v-img
                    v-for="(v, i) in list"
                    :key="i"
                    class="border-sm border-dashed"
                    :width="100"
                    aspect-ratio="1"
                    :src="previewFileAddress(v)"
                ></v-img>
            </div>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="上传图片">
                <template #append>
                    <div class="mr-n4">
                        <v-btn
                            type="submit"
                            variant="text"
                            @click="isActive.value = false"
                            icon="mdi-close"
                        />
                    </div>
                </template>
                <v-row>
                    <v-col :cols="6">
                        <div class="cropper-box">
                            <input
                                v-show="!option.img"
                                ref="sele"
                                type="file"
                                name="file"
                                accept="image/jpeg, image/png, image/webp"
                                @change="handleFileUpload"
                            />
                            <vueCropper
                                ref="cropper"
                                class="cropper"
                                v-show="option.img"
                                v-bind="option"
                                @realTime="onRealTime"
                            ></vueCropper>
                        </div>
                    </v-col>
                    <v-col :cols="6" class="preview">
                        <div class="avatar">
                            <v-img width="100px" height="100px" :src="base64Img"></v-img>
                            <div class="xg" v-if="showZelda"></div>
                        </div>
                        <div class="avatar circular">
                            <v-img width="100px" height="100px" :src="base64Img"></v-img>
                            <div class="xg" v-if="showZelda"></div>
                        </div>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <div>
                        <v-btn @click="resetUpload" size="small" variant="outlined">
                            重新上传
                        </v-btn>
                        <v-btn
                            @click="onRotate('left')"
                            size="small"
                            variant="outlined"
                            icon="mdi-rotate-left"
                        >
                        </v-btn>
                        <v-btn
                            @click="onRotate('right')"
                            size="small"
                            variant="outlined"
                            icon="mdi-rotate-right"
                        >
                        </v-btn>
                        <v-btn @click="onScale(1)" size="small" variant="outlined"> 放大 </v-btn>
                        <v-btn @click="onScale(-1)" size="small" variant="outlined"> 缩小 </v-btn>
                        <v-btn @click="onZelda" size="small" variant="outlined"> 塞尔达效果 </v-btn>
                        <v-btn @click="setOpt" size="small" variant="outlined"> 详细配置 </v-btn>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn
                        type="submit"
                        class="ma-2"
                        color="primary"
                        size="large"
                        @click="onSubmit(isActive)"
                        >上传</v-btn
                    >
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
    <Snackbar ref="snackbar" />
</template>
<script lang="ts" setup>
import { defineEmits, ref, reactive, watch } from 'vue';
import { VueCropper } from 'vue-cropper';
import axios from 'axios';
const props = withDefaults(
    defineProps<{
        value: string | Array;
    }>(),
    {}
);
const emits = defineEmits<{
    success: [data: any];
}>();

const snackbar = ref();
const cropper = ref();
const list = ref([]);
// 截图插件文档: https://github.com/xyxiao001/vue-cropper
const option = reactive({
    img: '', // 裁剪图片的地址 可接受类型: url地址, base64, blob
    outputSize: 1, // 裁剪生成图片的质量 可选范围: 0.1 ~ 1, 默认1
    outputType: 'png', // 裁剪生成图片的格式 可选: jpeg, png, webp, 默认jpg (jpg 需要传入jpeg)
    info: true, // 裁剪框的大小信息 默认true
    canScale: true, // 图片是否允许滚轮缩放 默认true
    autoCrop: true, // 是否默认生成截图框 默认false
    // autoCropWidth: ??? 默认生成截图框宽度 可选: 0 ~ max, 默认容器的 80%
    // autoCropHeight: ??? 默认生成截图框高度 可选: 0 ~ max, 默认容器的 80%
    fixed: true, // 是否开启截图框宽高固定比例	默认false
    fixedNumber: [1, 1], // 截图框的宽高比例, 开启fixed生效 可选[宽度, 高度] 默认[1, 1]
    full: false, // 是否输出原图比例的截图 默认false
    // fixedBox: ??? 固定截图框大小 默认不允许改变 可选: false
    canMove: true, // 上传图片是否可以移动 默认true
    canMoveBox: false, // 截图框能否拖动 默认true
    original: false, // 上传图片按照原始比例渲染 默认false
    centerBox: true, // 截图框是否被限制在图片里面 默认false
    high: true, // 是否按照设备的dpr 输出等比例图片 默认true
    infoTrue: false, // rue 为展示真实输出图片宽高 false 展示看到的截图框宽高 默认false
    maxImgSize: 2000, // 限制图片最大宽度和高度 可选: 0 ~ max 默认2000
    enlarge: 1, // 图片根据截图框输出比例倍数 可选: 0 ~ max(建议不要太大不然会卡死的呢) 默认1
    mode: 'contain', // 图片默认渲染方式 可选: contain , cover, 100px, 100% auto, 默认contain
    limitMinSize: 10, // 裁剪框限制最小区域 可选值类型: Number, Array, String, 默认10
    fillColor: '', // 导出时背景颜色填充 可选值类型: #ffffff, white, 默认空
});
const fileInfo = {
    name: '',
};
watch(
    () => props,
    (val) => {
        console.log('sssss', val, val.value);
        if (val.value) {
            list.value = [val.value];
            option.img = previewFileAddress(val.value);
        }
    },
    {
        immediate: true,
    }
);

// 裁剪操作栏
const sele = ref();
const showZelda = ref(false);
function resetUpload() {
    // 重新上传
    sele.value.click();
}
function onRotate(d) {
    // 旋转
    if (d === 'left') {
        cropper.value.rotateLeft();
    }
    if (d === 'right') {
        cropper.value.rotateRight();
    }
}
function onScale(n) {
    // 缩放
    cropper.value.changeScale(n);
}
function onZelda() {
    // 塞尔达效果
    showZelda.value = !showZelda.value;
}
function setOpt() {}

// 裁剪
const base64Img = ref('');
const suffixReg = /(\.jpg|\.jpeg|\.png|\.webp)$/; // 后缀限制
let timer = null;
function setPreviewData() {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
        cropper.value.getCropData((data) => {
            base64Img.value = data;
        });
        clearTimeout(timer);
    }, 500);
}
const onRealTime = function () {
    setPreviewData();
};
function handleFileUpload(event) {
    const file = event.target.files[0];
    console.log('上传文件: ', file);
    if (!file.size) {
        return snackbar.value.warn('上传的文件为空文件,请重新上传！');
    }
    if (!suffixReg.test(file.name)) {
        return snackbar.value.warn('仅支持JPG,JPEG,PNG,WEBP格式的图片上传！');
    }
    if (window.FileReader) {
        let reader = new FileReader();
        reader.onload = async (e) => {
            let data;
            if (typeof e.target.result === 'object') {
                data = window.URL.createObjectURL(new Blob([e.target.result]));
            } else {
                data = e.target.result;
            }
            option.img = data;
            fileInfo.name = file.name;
        };
        reader.readAsArrayBuffer(file);
    } else {
        snackbar.value.warn('FileReader 无法找到!');
    }
}

function onSubmit(isActive) {
    if (!option.img) return snackbar.value.warn('请上传图片!');
    cropper.value.getCropBlob(async (data) => {
        const formData = new FormData();
        formData.append('file', data, fileInfo.name);
        console.log('文件参数: ', fileInfo);
        let result = await axios.post('/api/upload/file', formData);
        console.log(result, '结果');
        if (result.status !== 200) return snackbar.value.warn('上传失败!');
        isActive.value = false;
        list.value = [result.data.url];
        emits('success', result.data);
        snackbar.value.success('上传成功!');
    });
}

function previewFileAddress(url: string) {
    if (!url || url.split(':')[0] === 'http' || url.split(':')[0] === 'https') {
        return url;
    } else return 'http://123.60.18.204:3000/images/' + url;
}
</script>
<style lang="scss">
.cropper-box {
    width: 100%;
    height: 100%;
    min-width: 300px;
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    .cropper {
        width: 300px;
        height: 300px;
        // border: 1px solid #000;
        background-repeat: repeat;
    }
}
.preview {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .avatar {
        width: 100px;
        height: 100px;
        overflow: hidden;
        border: 1px solid #f0f8ff;
        position: relative;
    }
    .circular {
        border-radius: 50%;
    }

    .xg {
        width: 100%;
        height: 100%;
        box-shadow: inset 0px 0px 30px 30px #000;
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>
