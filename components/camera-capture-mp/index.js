/**
 * @description
 * 组件使用：
 * 组件会在保存相册成功后，抛出finish事件。
 * -----------
 * options的配置项：
 *   type: "multilineText/text/image", // 绘制类型，支持字符和图片
 */

Component({
  properties: {
    isPause: {
      type: Boolean,
      value: true,
    },
    interval: {
      type: Number,
      value: 200000000,
    },
  },

  data: {
    width: 390,
    height: 844,
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
    },
    detached() {
      this.listener && this.listener.stop();
      this.listener = null;
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

        if (this.properties.isPause) {
          return;
        }

        if (this.lastSearchTime + this.properties.interval > Date.now()) {
          return;
        }
        this.lastSearchTime = Date.now();

        const imageData = this.capture(frame);
        let filePath = await this.dataUrlToTempFilePath(imageData);
        this.triggerEvent("capture", filePath);
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
      const data = this.canvas.toDataURL("image/jpeg", 0.5);
      return data;
    },

    dataUrlToTempFilePath(dataUrl) {
      return new Promise((resolve, reject) => {
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
  },
});
