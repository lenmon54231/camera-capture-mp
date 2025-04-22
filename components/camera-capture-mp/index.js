Component({
  properties: {
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
      value: 0.3, // 可选值：1.-1；2.正数
    },
    rollThreshold: {
      // 横滚角阈值（单位：度）
      type: Number,
      value: 40, // 可选值：1.-1；2.正数
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
  },

  data: {
    width: 390,
    height: 844,

    isMoving: false, // 用于标记用户是否在移动

    isOverRoll: false, // 用于标记用户手机是否超出俯仰角
  },

  lifetimes: {
    ready() {
      const info = wx.getSystemInfoSync();
      const width = info.windowWidth;
      const height = info.windowHeight;
      this.setData({
        width,
        height,
      });

      if (this.properties.moveThreshold !== -1) {
        this.startGyroscope();
      }
      if (this.properties.rollThreshold !== -1) {
        this.startDeviceMotionListening();
      }
    },
    detached() {
      this.listener && this.listener.stop();
      this.listener = null;
      if (this.properties.moveThreshold !== -1) {
        this.stopDeviceMotionListening();
      }
      if (this.properties.rollThreshold !== -1) {
        this.stopGyroscope();
      }
    },
  },

  observers: {},

  methods: {
    async cameraInitDone() {
      this.canvas = await this.getCanvas();
      if (this.canvas) {
        this.context = this.canvas.getContext("2d");
      }
      this.triggerEvent("cameraInitDone");

      this.listener = wx.createCameraContext().onCameraFrame(async (frame) => {
        if (!this.setCanvasSize) {
          this.canvas.width = frame.width;
          this.canvas.height = frame.height;
          this.setCanvasSize = true;
        }

        // 外层控制暂停
        if (this.properties.isPause) {
          return;
        }

        // 未到间隔时间
        if (this.lastSearchTime + this.properties.interval > Date.now()) {
          return;
        }

        // 用户正在移动
        if (this.data.isMoving && this.properties.moveThreshold !== -1) {
          return;
        }

        // 用户摄像头过高或者过低
        if (this.data.isOverRoll && this.properties.rollThreshold !== -1) {
          return;
        }

        this.lastSearchTime = Date.now();

        let filePath = await this.frameToTempFilePath(frame);

        this.triggerEvent("capture", filePath);

        // wx.previewImage({
        //   urls: [filePath], // 需要预览的图片路径数组
        //   current: filePath, // 当前显示的图片路径
        // });
      });

      this.listener.start();
    },

    getCanvas() {
      return new Promise((res, rej) => {
        const query = wx.createSelectorQuery().in(this);
        query
          .select("#canvas")
          .fields({ node: true, size: true })
          .exec((e) => {
            if (e[0]) {
              let canvas = e[0]?.node || null;
              res(canvas);
            } else {
              rej();
            }
          });
      });
    },

    capture(frame) {
      const image = this.context.createImageData(frame.width, frame.height);
      image.data.set(new Uint8ClampedArray(frame.data));
      this.context.putImageData(image, 0, 0);
      const data = this.canvas.toDataURL(
        "image/jpeg",
        this.properties.fileQuality
      );
      return data;
    },

    frameToTempFilePath(frame) {
      return new Promise((resolve, reject) => {
        const dataUrl = this.capture(frame);
        const fileManager = wx.getFileSystemManager();
        fileManager.writeFile({
          filePath: wx.env.USER_DATA_PATH + "/temp.jpg",
          data: dataUrl.split(",")[1],
          encoding: "base64",
          success: () => {
            resolve(wx.env.USER_DATA_PATH + "/temp.jpg");
          },
          fail: (err) => {
            console.log("err", err);
            reject(err);
          },
        });
      });
    },

    // 启动陀螺仪监听
    startGyroscope() {
      wx.startGyroscope({
        interval: "normal",
        success: () => {
          wx.onGyroscopeChange(this.handleGyroscopeChange.bind(this));
        },
      });
    },

    // 处理陀螺仪数据变化事件
    handleGyroscopeChange(res) {
      const { x, y, z } = res;
      const isMoving =
        Math.abs(x) > this.properties.moveThreshold ||
        Math.abs(y) > this.properties.moveThreshold ||
        Math.abs(z) > this.properties.moveThreshold;
      this.setData({ isMoving });
    },

    // 停止陀螺仪监听
    stopGyroscope() {
      wx.offGyroscopeChange(this.handleGyroscopeChange.bind(this));
      wx.stopGyroscope();
    },

    // 启动设备方向监听
    startDeviceMotionListening() {
      wx.startDeviceMotionListening({
        interval: "normal",
        success: () => {
          wx.onDeviceMotionChange(this.handleDeviceMotionChange.bind(this));
        },
      });
    },

    // 停止设备方向监听
    stopDeviceMotionListening() {
      wx.offDeviceMotionChange(this.handleDeviceMotionChange.bind(this));
      wx.stopDeviceMotionListening();
    },

    // 处理设备方向变化事件
    handleDeviceMotionChange(res) {
      // alpha: 坐在椅子上，向左或者向右转动，alpha值会变化
      // beta： 手机从平行于地面转到垂直于地面，beta值会变化
      // gamma：手机以自身竖直方向为轴心，绕自身旋转，gama值会发生变化
      const { beta } = res;
      const isWithinPitchThreshold =
        Math.abs(beta) > this.properties.rollThreshold;
      if (isWithinPitchThreshold) {
        this.setData({ isOverRoll: false });
      } else if (!isWithinPitchThreshold) {
        this.setData({ isOverRoll: true });
      }
    },
  },
});
