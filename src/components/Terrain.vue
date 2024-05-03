<template>
  <el-button @click="handle">地形</el-button>
</template>

<script setup>
function handle() {
  const terrainProvider = new Cesium.CesiumTerrainProvider({
    url: URL_CONFIG.SiChuan_TERRAIN,
    isSct: true,
    invisibility: true
  })

  GLOBAL.viewer.terrainProvider = terrainProvider

  GLOBAL.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-1206939.1925299785, 5337998.241228442, 3286279.2424502545),
    orientation: {
      heading: 1.4059101895600987,
      pitch: -0.20917672793046682,
      roll: 2.708944180085382e-13
    }
  })
}
</script>

<style lang="less" scoped></style>