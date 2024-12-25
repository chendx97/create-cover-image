<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadFile } from 'element-plus';
import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';
import MyHeader from "./components/MyHeader.vue";
import SkeletonTemplate from "./components/SkeletonTemplate.vue";
import IconMore from './components/icons/IconMore.vue';
import IconRandom from './components/icons/IconRandom.vue';
import { iconList, SkeletonTemplates, gradientColors, singleColors, fontFamilys } from "./utils/constants";
import pic1 from './assets/examples/pic1.jpg';
import pic2 from './assets/examples/pic2.jpg';
import pic3 from './assets/examples/pic3.jpg';
import pic4 from './assets/examples/pic4.jpg';
import pic5 from './assets/examples/pic5.jpg';
import pic6 from './assets/examples/pic6.jpg';

const titleVal = ref("一起来学前端呀~");
const iconVal = ref("https://cdn.simpleicons.org/react");
const selectedIcon = ref("https://cdn.simpleicons.org/react");
const authorVal = ref("河豚");

// icon下拉框的change事件
function handleIconChange(val: string) {
  iconVal.value = val;
}

// 上传icon
const uploadImgVal = ref();
const uploadRef = ref();
function handleUploadExceed(files: File[]) {
  uploadRef.value.clearFiles();
  uploadRef.value.handleStart(files[0]);
}
function handleUploadChange(file: UploadFile) {
  iconVal.value = URL.createObjectURL(file.raw as Blob);
}

// 主题切换
const selectedTemplate = ref("skeleton-one");
function handleTemplateChange(val: string) {
  selectedTemplate.value = val;
}

// 背景设置
const bgColor = ref('#41bae5');
function handleChangeGradientBg(color: string) {
  bgColor.value = color;
}

const gradientInputVal = ref('');
const isInvalid = ref(false);
function handleGradientInput() {
  if (gradientInputVal.value === '') {
    isInvalid.value = false;
    return;
  }
  const linearGradientRegex = /^linear-gradient\(\s*((\d+deg)|to\s+(top|bottom|left|right))\s*,\s*(#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\))\s*,\s*(#[0-9A-Fa-f]{3,8}|rgba?\([^)]+\))\s*\)$/;
  if (linearGradientRegex.test(gradientInputVal.value)) {
    isInvalid.value = false;
    bgColor.value = gradientInputVal.value;
  } else {
    isInvalid.value = true;
  }
}

const pickerVal = ref('#41bae5');
const inputColorVal = ref('#41bae5');
function handlePickerChange(val: string) {
  pickerVal.value = val;
  inputColorVal.value = val;
  bgColor.value = val;
}
function handleSingleInputChange() {
  pickerVal.value = inputColorVal.value;
  bgColor.value = pickerVal.value;
}
function handleGenerateRandomColor() {
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  pickerVal.value = randomColor;
  inputColorVal.value = randomColor;
  bgColor.value = randomColor;
}

// 字体
const selectedFont = ref(fontFamilys[0].value);
const fontSizeVal = ref(35);
const getFontSize = computed(() => `${fontSizeVal.value}px`);

// 配图
const exampleUrls = [pic1, pic2, pic3, pic4, pic5, pic6];
let exampleIdx = 0;
const imgFile = ref();
const imgUploadRef = ref();
const imgUrl = ref(pic1);
function handleImgExceed(files: File[]) {
  imgUploadRef.value.handleStart(files[0]);
}
function handleImgChange(file: UploadFile) {
  imgUrl.value = URL.createObjectURL(file.raw as Blob);
}
function handleGetRandomImg() {
  exampleIdx++;
  if (exampleIdx >= 6) {
    exampleIdx = 0;
  }
  imgUrl.value = exampleUrls[exampleIdx];
}

// 尺寸
const coverSize = ref('16:9');
const coverWidth = ref(800);
const getCoverRatio = computed(() => coverSize.value.split(':').join('/'));

// 导出
async function handleDownload() {
  const blob = await toBlob(document.querySelector('.preview-container') as HTMLElement);
  saveAs(blob, 'cover.png');
}
async function handleCopyImg() {
  const blob = await toBlob(document.querySelector('.preview-container') as HTMLElement);
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob!.type]: blob as Blob
    })
  ]);
  ElMessage.success('复制成功');
}
</script>

<template>
  <my-header />
  <div class="main-wrapper">
    <div class="main-left">
      <div class="preview-wrapper">
        <div :class="`preview-container skeleton-template ${selectedTemplate}`"
          :style="{ aspectRatio: getCoverRatio, width: coverWidth + 'px' }">
          <div class="card"></div>
          <div class="title">{{ titleVal }}</div>
          <div class="logo">
            <img class="icon" :src="iconVal" />
          </div>
          <div class="author">{{ authorVal }}</div>
          <div class="img-container">
            <img v-if="imgUrl" class="img" :src="imgUrl" alt="img" />
          </div>
        </div>
      </div>
      <div class="config-wrapper">
        <div class="config-item">
          <div class="config-title">标题</div>
          <el-input v-model="titleVal" />
        </div>
        <div class="config-item">
          <div class="config-title">图标</div>
          <el-select class="config-select" v-model="selectedIcon" @change="handleIconChange"
            popper-class="popper-icons">
            <template #label="{ label, value }">
              <span>{{ label }}</span>
              <img class="label-icon" :src="value" />
            </template>
            <el-option v-for="item in iconList" :key="item.label" :label="item.label" :value="item.icon">
              <span class="option-label">{{ item.label }}</span>
              <img class="option-icon" :src="item.icon" alt="icon" />
            </el-option>
          </el-select>
          <el-upload class="upload-btn" v-model:file-list="uploadImgVal" ref="uploadRef" :limit="1"
            :show-file-list="false" :auto-upload="false" accept=".png,.jpg,.jpeg,.svg" :on-exceed="handleUploadExceed"
            :on-change="handleUploadChange">
            <el-button type="primary">上传图标</el-button>
          </el-upload>
        </div>
        <div class="config-item">
          <div class="config-title">作者</div>
          <el-input v-model="authorVal" />
        </div>
      </div>
    </div>
    <div class="main-right">
      <div class="setting-item">
        <div class="setting-title">主题</div>
        <div class="skeletons-wrapper">
          <skeleton-template v-for="name in SkeletonTemplates" :key="name"
            :class="`${name} ${name === selectedTemplate ? 'active' : ''}`" @click="handleTemplateChange(name)" />
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-title">背景色</div>
        <div class="gradient-colors">
          <div :class="`gradient-item ${color === bgColor ? 'active' : ''}`" v-for="color in gradientColors"
            :key="color" :style="{ background: color }" @click="handleChangeGradientBg(color)"></div>
          <el-popover placement="top" :width="350" trigger="click">
            <template #reference>
              <div class="more-btn">
                <icon-more class="more-icon" />
              </div>
            </template>
            <div class="gradient-custom">
              <p>还可以去以下网站寻找你喜欢的渐变色：</p>
              <p>
                <el-link href="https://uigradients.com/#TheBlueLagoon" type="primary"
                  target="_blank">uiGradients</el-link>
                <el-link href="https://webgradients.com/" type="primary" target="_blank">WebGradients</el-link>
                <el-link href="https://cssgradient.io/" type="primary" target="_blank">cssgradient.io</el-link>
                <el-link href="https://colorffy.com/gradients" type="primary" target="_blank">colorffy</el-link>
              </p>
              <el-input :class="`${isInvalid ? 'invalid' : ''}`" v-model="gradientInputVal" type="textarea"
                placeholder="输入格式：linear-gradient(to right, #e1eec3, #f05053)" @input="handleGradientInput" />
            </div>
          </el-popover>
        </div>
        <div class="single-color">
          <el-color-picker v-model="pickerVal" show-alpha :predefine="singleColors"
            @active-change="handlePickerChange" />
          <el-input class="single-input" v-model="inputColorVal" @input="handleSingleInputChange" />
          <div class="random-btn" @click="handleGenerateRandomColor">
            <icon-random class="random-icon" />
          </div>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-title">字体</div>
        <div class="font-wrapper">
          <el-select class="font-select" v-model="selectedFont">
            <el-option v-for="font in fontFamilys" :key="font.label" :label="font.label" :value="font.value" />
          </el-select>
          <el-slider v-model="fontSizeVal" size="small" :min="30" :max="45" :marks="{ 30: '30px', 45: '45px' }" />
        </div>
      </div>
      <div v-if="['skeleton-five', 'skeleton-seven', 'skeleton-eight', 'skeleton-nine'].includes(selectedTemplate)"
        class="setting-item">
        <div class="setting-title">
          配图
          <el-popover placement="top" :width="250" trigger="click">
            <template #reference>
              <icon-info class="icon-info" />
            </template>
            <div>
              <p>以下是可参考的<b>免费</b>图片资源：</p>
              <div class="links-wrapper">
                <el-link href="https://picjumbo.com/" type="primary" target="_blank">picjumbo</el-link>
                <el-link href="https://www.pexels.com/zh-cn/" type="primary" target="_blank">pexels</el-link>
                <el-link href="https://unsplash.com" type="primary" target="_blank">unsplash</el-link>
                <el-link href="https://pixabay.com" type="primary" target="_blank">pixabay</el-link>
                <el-link href="https://wallpaperscraft.com/" type="primary" target="_blank">wallpaperscraft</el-link>
                <el-link href=" https://vectorcraftr.com/" type="primary" target="_blank">vectorcraftr</el-link>
              </div>
            </div>
          </el-popover>
        </div>
        <div class="img-wrapper">
          <el-upload v-model:file-list="imgFile" ref="imgUploadRef" :limit="1" accept=".png,.jpg,.jpeg"
            :show-file-list="false" :auto-upload="false" :on-exceed="handleImgExceed" :on-change="handleImgChange">
            <el-button type="primary">上传</el-button>
          </el-upload>
          <el-button class="btn-random" color="#6dc5e8" @click="handleGetRandomImg">随机</el-button>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-title">尺寸</div>
        <div class="size-wrapper">
          <span class="size-label">宽高比：</span>
          <el-segmented v-model="coverSize" :options="['4:3', '3:2', '16:9', '2:1']" />
        </div>
        <div class="size-wrapper">
          <span class="size-label">宽度：</span>
          <el-slider v-model="coverWidth" size="small" show-input :min="500" :max="1000"
            :marks="{ 500: '500px', 1000: '1000px' }" />
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-title">导出</div>
        <div class="download-wrapper">
          <el-button type="primary" @click="handleDownload">下载</el-button>
          <el-button type="primary" @click="handleCopyImg">复制</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.main-wrapper {
  display: flex;
  align-items: flex-start;
  column-gap: 30px;
  max-width: 1300px;
  margin: 0 auto;
  padding: 30px 0 50px 0;

  .main-right {
    padding: 20px;
    background-color: #fff;
    box-shadow: var(--el-box-shadow);
    border-radius: 4px;
  }

  .preview-wrapper {
    width: 800px;
    height: 450px;
    padding: 20px;
    background-color: #fff;
    box-shadow: var(--el-box-shadow);
    border-radius: 4px;
    overflow: auto;

    .preview-container {
      position: relative;
      // width: 100%;
      // height: 100%;
      width: 600px;
      // height: 400px;
      height: auto;
      background: v-bind(bgColor);
      font-family: v-bind(selectedFont);
      border: none;

      .title {
        font-size: v-bind(getFontSize);
        font-weight: 600;
        text-align: center;
      }

      .author {
        font-weight: 600;
      }
    }
  }

  .config-wrapper {
    margin-top: 30px;
    padding: 20px;
    background-color: #fff;
    box-shadow: var(--el-box-shadow);
    border-radius: 4px;

    .config-item {
      margin-bottom: 20px;

      .config-title {
        margin-bottom: 10px;
      }

      .config-select {
        width: 200px;

        .label-icon {
          float: right;
          margin-top: 2px;
          width: 20px;
          height: 20px;
        }
      }
    }

    .upload-btn {
      display: inline-block;
      margin-left: 20px;
      vertical-align: middle;
    }
  }

  .setting-item {
    margin-bottom: 15px;

    .setting-title {
      margin-bottom: 10px;
      font-size: 18px;
      color: #000;

      .icon-info {
        width: 20px;
        color: var(--el-color-info);
        cursor: pointer;
        outline: none;
      }
    }

    .skeletons-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .gradient-colors {
      display: flex;
      gap: 10px;

      .gradient-item {
        width: 25px;
        height: 25px;
        cursor: pointer;

        &.active {
          outline: 1px solid var(--el-color-primary);
        }
      }

      .more-btn {
        width: 23px;
        height: 23px;
        border: 1px solid var(--el-border-color-darker);
        cursor: pointer;

        .more-icon {
          width: 100%;
          height: 100%;
          color: #909399;
        }
      }
    }

    .single-color {
      margin-top: 20px;
      display: flex;
      align-items: center;
      column-gap: 10px;

      .single-input {
        width: 200px;
      }

      .random-btn {
        width: 23px;
        height: 23px;
        text-align: center;
        line-height: 30px;
        border: 1px solid var(--el-border-color-darker);
        cursor: pointer;
      }

      .random-icon {
        width: 19px;
        height: 19px;
        color: #909399;
      }
    }

    .font-wrapper {
      display: flex;
      column-gap: 30px;

      .font-select {
        width: 150px;
      }
    }

    .img-wrapper {
      display: flex;
      column-gap: 12px;

      .btn-random {
        color: #fff;
      }
    }

    .size-wrapper {
      &:nth-child(3) {
        margin-top: 20px;
      }

      .size-label {
        display: inline-block;
        width: 80px;
        text-align: right;
      }

      .el-slider {
        display: inline-flex;
        width: calc(100% - 80px);
        vertical-align: middle;
      }
    }
  }
}
</style>
<style lang="less">
.preview-container {
  &.skeleton-eight {
    .img-container {
      aspect-ratio: v-bind(getCoverRatio);
    }
  }
}
</style>
