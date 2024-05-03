<template>
  <el-button @click="handle">截图</el-button>
</template>

<script setup>
//根据图片生成画布
function handle() {
  const dom = GLOBAL.viewer.scene.canvas
  const domBase64 = dom.toDataURL()

  const image = new Image();
  image.src = domBase64;
  image.onload = function () {
    const a = document.createElement('a');
    const event = new MouseEvent('click');
    a.download = (new Date()).getTime() + ".png"; // 指定下载图片的名称
    a.href = domBase64;
    a.dispatchEvent(event); // 触发超链接的点击事件
  }
}

</script>

<style lang="less" scoped></style>