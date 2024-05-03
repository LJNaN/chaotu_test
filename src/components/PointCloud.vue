<template>
  <el-button @click="handle">点云</el-button>
</template>

<script setup>
function handle() {
  GLOBAL.viewer.scene.open(URL_CONFIG.SCENE_POINTCLOUD);
  GLOBAL.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-3726950.8178392285, 3087276.1287523108, 4154724.882310502),
    orientation: {
      heading: 3.7690494906963523,
      pitch: 0.014489436405058287,
      roll: 6.283185307179586
    }
  })
}
</script>

<style lang="less" scoped></style>