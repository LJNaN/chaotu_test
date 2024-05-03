<template>
  <el-button @click="handle">流动管线</el-button>
</template>

<script setup>
async function handle() {
  await GLOBAL.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2343784.953917227, 4546449.518116666, 3810304.124116188),
    orientation: {
      heading: 4.750885487110618,
      pitch: -0.38228770591445227,
      roll: 0
    }
  })
  await GLOBAL.viewer.scene.open('http://www.supermapol.com/realspace/services/3D-ChunShuiLvSeGuanDaounknowns3munknown/rest/realspace');
  const line = GLOBAL.viewer.scene.layers.find("纯水绿色管道优化@管线");
  line.textureUVSpeed = new Cesium.Cartesian2(0, -2);//模型纹理在UV坐标上的运动速度
}
</script>

<style lang="less" scoped></style>