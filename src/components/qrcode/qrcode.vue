<template>
  <!-- <qrcode-drop-zone @decode="onDecode"> -->
  <qrcode-stream @decode="onDecode" :torch="torchActive" @init="onInit" :camera="camera">
    <div>框</div>
  </qrcode-stream>
  <!-- </qrcode-drop-zone> -->
</template>

<script>
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
export default {
  data() {
    return {
      torchActive: false,
      camera: 'front' // {auto, rear, front, off}
    }
  },
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  },
  methods: {
    async onInit(promise) {
      try {
        const { capabilities } = await promise;
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.$toast("暂无相机权限!")
          // user denied camera access permisson
        } else if (error.name === 'NotFoundError') {
          this.$toast("找不到相机!")
          // no suitable camera device installed
        } else if (error.name === 'NotSupportedError') {
          this.$toast("仅支持https!")
          // page is not served over HTTPS (or localhost)
        } else if (error.name === 'NotReadableError') {
          this.$toast("相机已被使用!")
          // maybe camera is already in use
        } else if (error.name === 'OverconstrainedError') {
          this.$toast("相机约束错误!")
          // did you requested the front camera although there is none?
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.$toast("当前浏览器暂不支持!")
          // browser seems to be lacking features
        }
      }
    },
    onDecode(decodedString) {
      this.$toast(decodedString);
    },
  }
}
</script>

<style>

</style>