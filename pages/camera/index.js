Page({
  data: {
    isPause: true,
  },

  onLoad() {},

  onReady() {},

  cameraInitDone() {
    this.setData({
      isPause: false,
    });
  },

  capture(filePath) {
    console.log("filePath: ", filePath);
  },
});
