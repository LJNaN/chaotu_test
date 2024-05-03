<template>
  <el-button class="print-btn" @click="convertImageToCanvas">截图</el-button>
</template>

<script setup>
//根据图片生成画布
function convertImageToCanvas() {
  const dom = document.getElementsByClassName('cesium-widget')[0].children[0]
  console.log('dom: ', dom);
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

<style lang="less" scoped>
.print-btn {
  position: absolute;
  top: 0;
  left: 0;
}
</style>