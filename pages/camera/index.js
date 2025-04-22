Page({
  data: {
    isPause: true,
  },

  onLoad() {},

  onReady() {},

  cameraInitDone() {
    setTimeout(() => {
      this.setData({
        isPause: false,
      });
    }, 2000);
  },

  capture(filePath) {
    console.log("filePath: ", filePath);
  },
});
