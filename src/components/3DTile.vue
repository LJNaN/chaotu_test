<template>
  <el-button @click="handle">倾斜摄影</el-button>
</template>

<script setup>
function handle() {
  GLOBAL.viewer.scene.open(URL_CONFIG.SCENE_SUOFEIYA);
  GLOBAL.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2653915.6463913363, 3571045.726807149, 4570293.566342328),
    orientation: {
      heading: 2.1953426301495345,
      pitch: -0.33632707158103625,
      roll: 6.283185307179586
    }
  })
}
</script>

<style lang="less" scoped></style>