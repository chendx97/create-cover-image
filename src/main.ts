import { createApp } from 'vue';
import DisableDevtool from 'disable-devtool';
import 'element-plus/es/components/message/style/css';
import './style.less';
import App from './App.vue';

// 禁用开发者工具
DisableDevtool({
  md5: 'a1a8887793acfc199182a649e905daab',
});

createApp(App).mount('#app');
