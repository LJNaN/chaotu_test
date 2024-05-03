<template>
  <div class="home">
    <div ref="cesiumContainer"></div>
    <PrintScreen></PrintScreen>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import GLOBAL from '@/GLOBAL.js'
import PrintScreen from '@/components/PrintScreen.vue'
const cesiumContainer = ref(null)

onMounted(() => {
  init()
  setFilter()
  setBloom()
})

function init() {
  GLOBAL.viewer = new Cesium.Viewer(cesiumContainer.value, {
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



</script>

<style lang="less" scoped>
.home {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: antiquewhite;
}
</style>