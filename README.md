### 功能介绍

- 使用组件的形式来持续获取相机画面；
- 提供多种控制方式来控制获取相机画面截图时机：1.时间间隔；2.用户移动；3.手机俯仰角。
- 提供 capture 方法获取 filePath 临时文件地址；

### 外部使用

#### 安装依赖

```bash
npm i camera-capture-mp --save
```

#### 微信小程序中引入组件

```json
{
  "usingComponents": {
    "camera-capture-mp": "camera-capture-mp"
  }
}
```

```html
<camera-capture-mp
  isPause="{{isPause}}"
  bind:capture="capture"
  bind:cameraInitDone="cameraInitDone"
/>
```

```js
Page({
  data: {
    isPause: true,
  },

  cameraInitDone() {
    this.setData({
      isPause: false,
    });
  },

  capture(filePath) {
    console.log("filePath: ", filePath);
  },
});
```

#### capture 事件是如何被触发的？

> 当 isPause 为 true 时，capture 事件会持续触发，触发周期根据多个参数来共同决定，如：时间间隔；用户移动等

### 配置项

#### 组件属性

```js
isPause: {
      // 控制是否开启相机截图
      type: Boolean,
      value: true,
    },
    interval: {
      // 相机截图时间间隔
      type: Number,
      value: 2000,
    },
    fileQuality: {
      // 截图的照片质量
      type: Number,
      value: 0.5,
    },
    moveThreshold: {
      // 移动的阈值，可根据实际需求调整
      type: Number,
      value: 0.3, // 可选值：1.-1；2.正数；当值为-1时，表示不判断用户是否正在移动
    },
    rollThreshold: {
      // 横滚角阈值（单位：度）
      type: Number,
      value: 40, // 可选值：1.-1；2.正数；当值为-1时，表示不判断用户设备的朝向和翻滚
    },
    // 相机配置
    frameSize: {
      type: String,
      value: "medium",
    },
    devicePosition: {
      type: String,
      value: "back",
    },
    resolution: {
      type: String,
      value: "medium",
    },
    flash: {
      type: String,
      value: "off",
    },
```

#### 组件事件

|      名称      |    触发时机    |      返回值      | 说明 |
| :------------: | :------------: | :--------------: | ---- |
| cameraInitDone | 相机初始化完成 |        -         | -    |
|    capture     |  相机画面截图  | 相机截图临时路径 | -    |

### 本地测试

略~

### 更新发包

1. 打包

```bash
npm run build
```

2.修改 package.json 中的 version 版本号

3.发布到 npm

```bash
npm publish
```

### 更新日志

略~
