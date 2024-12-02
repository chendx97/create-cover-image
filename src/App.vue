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

const titleVal = ref("一起来学前端呀~");
const iconVal = ref("https://cdn.simpleicons.org/vue.js");
const selectedIcon = ref("https://cdn.simpleicons.org/vue.js");
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
        </div>
      </div>
      <div class="config-wrapper">
        <div class="config-item">
          <div class="config-title">标题</div>
          <el-input v-model="titleVal" />
        </div>
        <div class="config-item">
          <div class="config-title">图标</div>
          <el-select class="config-select" v-model="selectedIcon" @change="handleIconChange" popper-class="popper-icons">
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
          <div :class="`gradient-item ${color === bgColor ? 'active' : ''}`" v-for="color in gradientColors" :key="color"
            :style="{ background: color }" @click="handleChangeGradientBg(color)"></div>
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
          <el-color-picker v-model="pickerVal" show-alpha :predefine="singleColors" @active-change="handlePickerChange" />
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

  .main-left {
    flex: 2;
  }

  .main-right {
    flex: 1;
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
    }

    .skeletons-wrapper {
      display: flex;
      gap: 15px;
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
