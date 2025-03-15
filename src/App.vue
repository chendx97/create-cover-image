<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadFile } from 'element-plus';
import { toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';
import { ChenHeader } from 'chen-header';
import DisableDevtool from 'disable-devtool';
import SkeletonTemplate from "./components/SkeletonTemplate.vue";
import MyComment from './components/MyComment.vue';
import IconMore from './components/icons/IconMore.vue';
import IconRandom from './components/icons/IconRandom.vue';
import { iconList, SkeletonTemplates, gradientColors, singleColors, fontFamilys } from "./utils/constants";
import pic1 from './assets/examples/pic1.jpg';
import pic2 from './assets/examples/pic2.jpg';
import pic3 from './assets/examples/pic3.jpg';
import pic4 from './assets/examples/pic4.jpg';
import pic5 from './assets/examples/pic5.jpg';
import pic6 from './assets/examples/pic6.jpg';

// 禁用开发者工具
DisableDevtool.md5('93ACFC199182A649');

const titleVal = ref("一起来学前端呀");
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
  if (['skeleton-one', 'skeleton-four', 'skeleton-five'].includes(selectedTemplate.value)) {
    titleColor.value = '#000';
    titlePickerVal.value = '#000';
    authorColor.value = '#000';
    authorPickerVal.value = '#000';
  } else {
    titleColor.value = '#fff';
    titlePickerVal.value = '#fff';
    authorColor.value = '#fff';
    authorPickerVal.value = '#fff';
  }
  if (['skeleton-five', 'skeleton-seven', 'skeleton-eight', 'skeleton-nine'].includes(selectedTemplate.value)) {
    imgUrl.value = pic1;
  } else {
    imgUrl.value = '';
  }
}

// 背景设置
const bgColor = ref('#41bae5');
function handleChangeGradientBg(color: string) {
  bgColor.value = color;
}

const gradientInputVal = ref('');
function handleGradientInput() {
  bgColor.value = gradientInputVal.value;
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

// 卡片圆角
const cardRadius = ref(0);
const getCardRadius = computed(() => `${cardRadius.value}px`);

// 标题的字体、大小、颜色
const selectedFont = ref('fangsong');
const fontSizeVal = ref(50);
const getFontSize = computed(() => `${fontSizeVal.value}px`);
const titleColor = ref('#000');
const titlePickerVal = ref('#000');
const titleInputVal = ref('');
function handleTitlePickerChange(val: string) {
  titlePickerVal.value = val;
  titleColor.value = val;
}
function handleTitleInputChange() {
  if (!titleInputVal.value) {
    titleColor.value = titlePickerVal.value;
    return;
  }
  titleColor.value = titleInputVal.value;
}

// 作者的字体、大小、颜色
const authorFont = ref('fangsong');
const authorSize = ref(25);
const getAuthorSize = computed(() => `${authorSize.value}px`);
const authorColor = ref('#000');
const authorPickerVal = ref('#000');
const authorInputVal = ref('');
function handleAuthorPickerChange(val: string) {
  authorPickerVal.value = val;
  authorColor.value = val;
}
function handleAuthorInputChange() {
  if (!authorInputVal.value) {
    authorColor.value = authorPickerVal.value;
    return;
  }
  authorColor.value = authorInputVal.value;
}

// 图标
const isShowIcon = ref(true);

// 配图
const exampleUrls = [pic1, pic2, pic3, pic4, pic5, pic6];
let exampleIdx = 0;
const imgFile = ref();
const imgUploadRef = ref();
const imgUrl = ref();
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
  const originFetch = window.fetch;
  window.fetch = async (url: string, options: RequestInit) => {
    if (typeof url === 'string' && url.match(/\.(woff|ttf|otf|woff2)$/i)) {
      const fontName = url.split('/').pop()?.split('.')[0];
      if (![selectedFont.value, authorFont.value].includes(fontName as string)) {
        return Promise.reject(new Error('Font request blocked'));
      }
    }
    return originFetch(url, options);
  }
  const blob = await toBlob(document.querySelector('.preview-container') as HTMLElement);
  window.fetch = originFetch;
  saveAs(blob, 'cover.png');
  ElMessage.success('导出成功');
}
async function handleCopyImg() {
  const originFetch = window.fetch;
  window.fetch = async (url: string, options: RequestInit) => {
    if (typeof url === 'string' && url.match(/\.(woff|ttf|otf|woff2)$/i)) {
      const fontName = url.split('/').pop()?.split('.')[0];
      if (![selectedFont.value, authorFont.value].includes(fontName as string)) {
        return Promise.reject(new Error('Font request blocked'));
      }
    }
    return originFetch(url, options);
  }
  const blob = await toBlob(document.querySelector('.preview-container') as HTMLElement);
  window.fetch = originFetch;
  document.body.focus();
  await navigator.clipboard.write([
    new ClipboardItem({
      'image/png': blob as Blob
    })
  ]);
  ElMessage.success('复制成功');
}
</script>

<template>
  <ChenHeader title="封面图生成器"/>
  <div class="main-wrapper">
    <div class="main-left">
      <div class="preview-wrapper">
        <div :class="`preview-container skeleton-template ${selectedTemplate}`"
          :style="{ aspectRatio: getCoverRatio, width: coverWidth + 'px' }">
          <div class="card"></div>
          <div class="title">{{ titleVal }}</div>
          <div v-if="isShowIcon" class="logo">
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
        <div
          v-if="['skeleton-one', 'skeleton-two', 'skeleton-three', 'skeleton-four', 'skeleton-five'].includes(selectedTemplate)"
          class="config-item">
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
        <div
          v-if="['skeleton-one', 'skeleton-two', 'skeleton-three', 'skeleton-four', 'skeleton-five'].includes(selectedTemplate)"
          class="config-item">
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
              <el-input v-model="gradientInputVal" type="textarea"
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
      <div v-if="['skeleton-one', 'skeleton-four', 'skeleton-five'].includes(selectedTemplate)" class="setting-item">
        <div class="setting-title">卡片</div>
        <div class="cardradius-wrapper">
          <span>圆角：</span>
          <el-input-number v-model="cardRadius" :min="0" :max="50" />
        </div>
      </div>
      <div v-if="['skeleton-one', 'skeleton-two', 'skeleton-three', 'skeleton-four',
        'skeleton-five'].includes(selectedTemplate)" class="setting-item">
        <div class="setting-title">图标</div>
        <div>
          <el-checkbox v-model="isShowIcon">显示</el-checkbox>
        </div>
      </div>
      <div class="setting-item">
        <div class="setting-title">标题</div>
        <div class="font-wrapper">
          <el-select class="font-select" v-model="selectedFont">
            <el-option v-for="font in fontFamilys" :key="font.label" :label="font.label" :value="font.value"
              :style="{ fontFamily: font.value, fontSize: '18px' }" />
          </el-select>
          <el-slider v-model="fontSizeVal" size="small" :min="30" :max="100" :marks="{ 30: '30px', 100: '100px' }" />
        </div>
        <div class="setting-title-color">
          <el-color-picker v-model="titlePickerVal" show-alpha :predefine="singleColors"
            @active-change="handleTitlePickerChange" />
          <el-input v-model="titleInputVal" placeholder="单一颜色值或linear-gradient(to right, red, blue)"
            @input="handleTitleInputChange" />
        </div>
      </div>
      <div v-if="!['skeleton-six', 'skeleton-seven', 'skeleton-eight', 'skeleton-nine'].includes(selectedTemplate)"
        class="setting-item">
        <div class="setting-title">作者</div>
        <div class="font-wrapper">
          <el-select class="font-select" v-model="authorFont">
            <el-option v-for="font in fontFamilys" :key="font.label" :label="font.label" :value="font.value"
              :style="{ fontFamily: font.value, fontSize: '18px' }" />
          </el-select>
          <el-slider v-model="authorSize" size="small" :min="16" :max="80" :marks="{ 16: '16px', 80: '80px' }" />
        </div>
        <div class="setting-title-color">
          <el-color-picker v-model="authorPickerVal" show-alpha :predefine="singleColors"
            @active-change="handleAuthorPickerChange" />
          <el-input v-model="authorInputVal" placeholder="单一颜色值或linear-gradient(to right, red, blue)"
            @input="handleAuthorInputChange" />
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
  <my-comment />
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
      border: none;

      .card {
        border-radius: v-bind(getCardRadius);
      }

      .title {
        font-size: v-bind(getFontSize);
        color: transparent;
        background: v-bind(titleColor);
        background-clip: text;
        font-weight: 600;
        font-family: v-bind(selectedFont);
        text-align: center;
      }

      .author {
        font-size: v-bind(getAuthorSize);
        font-weight: 600;
        color: transparent;
        background: v-bind(authorColor);
        background-clip: text;
        font-family: v-bind(authorFont);
      }

      &.skeleton-five {
        .img-container {
          border-radius: 0 v-bind(getCardRadius) v-bind(getCardRadius) 0;
        }
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
        width: 200px;
      }
    }

    .setting-title-color {
      margin-top: 20px;
      display: flex;
      column-gap: 30px;
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
