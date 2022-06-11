<template>
  <div class="empty">
    <van-image :src="imgUrl"></van-image>
    <div class="empty-text">{{text}}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    text: {
      type: String,
      default: "当前暂无活动"
    }, imgUrl: {
      type: String,
      default: "/static/image/empty.png"
    }
  },
}
</script>

<style scoped>
.empty{
  text-align: center;
}

.empty .van-image{
  width: 70%;
  margin-top: 15%;
}

.empty-text{
  color: rgba(0, 0, 0, .45);
  font-size: .362319rem;
}
</style>