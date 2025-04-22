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
