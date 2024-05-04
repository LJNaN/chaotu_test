<template>
  <div class="home">
    <div v-show="!GLOBAL.show2D.value" ref="cesiumContainer" style="width: 100%; height: 100%;"></div>
    <div v-show="!GLOBAL.show2D.value" id="popupContainer"></div>
    <div v-show="!GLOBAL.show2D.value" class="btn">
      <PrintScreen></PrintScreen>
      <Terrain></Terrain>
      <S3DTile></S3DTile>
      <Filter></Filter>
      <PointCloud></PointCloud>
      <!-- <Layer></Layer> -->
      <Pipeline></Pipeline>
      <PickPosition></PickPosition>
      <OpenLayers></OpenLayers>
      <Rain></Rain>
    </div>

    <div v-show="GLOBAL.show2D.value" id="map2D" style="position:absolute;width: 100%; height: 100%;top: 0;left: 0;">
      <el-button @click="to3D" style="position: absolute; top: 10px;left: 50px; z-index: 2;">返回三维地图</el-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import GLOBAL from '@/GLOBAL.js'
import PrintScreen from '@/components/PrintScreen.vue'
import Terrain from '@/components/Terrain.vue'
import S3DTile from '@/components/3DTile.vue'
import Filter from '@/components/Filter.vue'
import PointCloud from '@/components/PointCloud.vue'
import Layer from '@/components/Layer.vue'
import Pipeline from '@/components/Pipeline.vue'
import PickPosition from '@/components/PickPosition.vue'
import OpenLayers from '@/components/OpenLayers.vue'
import Rain from '@/components/Rain.vue'
const cesiumContainer = ref(null)

onMounted(() => {
  init()
  // setFilter()
  // setBloom()
})

function init() {
  GLOBAL.viewer = new Cesium.Viewer(cesiumContainer.value, {
    infoBox: false,
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true
      }
    }
  })
  GLOBAL.viewer.imageryLayers.addImageryProvider(new Cesium.BingMapsImageryProvider({
    url: "https://dev.virtualearth.net",
    mapStyle: Cesium.BingMapsStyle.AERIAL,
    key: "AuKafWS8lQnTHXRdIBE7lyieYesaFPqSshgjjzyzPq9-Su7aQ_lu0MVEdoxvcQpO"
  }))
  GLOBAL.viewer.scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1);
}

function setFilter() {
  GLOBAL.viewer.scene.colorCorrection.show = true;
  GLOBAL.viewer.scene.colorCorrection.saturation = 1;
  // GLOBAL.viewer.scene.colorCorrection.brightness = 1;
  // GLOBAL.viewer.scene.colorCorrection.contrast = 1;
  // GLOBAL.viewer.scene.colorCorrection.hue = 1;
}

function setBloom() {
  GLOBAL.viewer.scene.bloomEffect.show = true;
  GLOBAL.viewer.scene.bloomEffect.threshold = 0.2;
  GLOBAL.viewer.scene.bloomEffect.bloomIntensity = 0.5;
}

function to3D() {
  GLOBAL.show2D.value = false
}

</script>

<style lang="less" scoped>
.home {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: antiquewhite;
}

.btn {
  position: absolute;
  top: 10px;
  display: flex;
}
</style>