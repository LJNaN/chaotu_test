<template>
  <el-button @click="handle">晴/雨/雪</el-button>
</template>

<script setup>
import GLOBAL from '@/GLOBAL.js'
import { ref } from 'vue'

const type = ref('晴')
let groundLayer = null
let buildingLayer = null

async function handle() {
  if (type.value === '晴') {
    type.value = '雨'

  } else if (type.value === '雨') {
    type.value = '雪'

  } else if (type.value === '雪') {
    type.value = '晴'

  } else {
    return
  }

  if (groundLayer && buildingLayer) {
    buildingLayer.removePBRMaterial();
    groundLayer.removePBRMaterial();
  }

  const scene = GLOBAL.viewer.scene
  scene.skyAtmosphere.show = type.value === '晴'
  scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1);
  scene.debugShowFramesPerSecond = true;
  GLOBAL.viewer.scene.postProcessStages.rain.enabled = false;
  GLOBAL.viewer.scene.postProcessStages.snow.enabled = false;

  if (type.value === '晴') {

  } else if (type.value === '雨') {
    //创建天空盒
    const cloudSkyBox = new Cesium.SkyBox({
      sources: {
        positiveX: '/examples/webgl/images/SkyBox/cloudy/Right.jpg',
        negativeX: '/examples/webgl/images/SkyBox/cloudy/Left.jpg',
        positiveY: '/examples/webgl/images/SkyBox/cloudy/Front.jpg',
        negativeY: '/examples/webgl/images/SkyBox/cloudy/Back.jpg',
        positiveZ: '/examples/webgl/images/SkyBox/cloudy/Up.jpg',
        negativeZ: '/examples/webgl/images/SkyBox/cloudy/Down.jpg'
      }
    })
    scene.skyBox = cloudSkyBox

    GLOBAL.viewer.scene.postProcessStages.rain.enabled = true;
    GLOBAL.viewer.scene.postProcessStages.rain.uniforms.density = 10;
    GLOBAL.viewer.scene.postProcessStages.rain.uniforms.angle = 6;
    GLOBAL.viewer.scene.postProcessStages.rain.uniforms.speed = 6;

  } else if (type.value === '雪') {
    GLOBAL.viewer.scene.postProcessStages.snow.enabled = true;
    GLOBAL.viewer.scene.postProcessStages.snow.uniforms.density = 10;
    GLOBAL.viewer.scene.postProcessStages.snow.uniforms.angle = 0;
    GLOBAL.viewer.scene.postProcessStages.snow.uniforms.speed = 3;
  }

  await GLOBAL.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-2141928.463803975, 4391705.204806254, 4099531.6497787824),
    orientation: {
      heading: 6.268809805519916,
      pitch: 0.05347051142348236,
      roll: 6.283185307179576
    }
  })

  const model = await scene.open(URL_CONFIG.SCENE_CBD_RIAN_SNOW);
  groundLayer = model[2];
  buildingLayer = model[3];


  if (type.value === '晴') {

  } else if (type.value === '雨') {
    groundLayer.setPBRMaterialFromJSON("/examples/webgl/SampleData/pbr/MaterialJson/rain_.json");
    buildingLayer.setPBRMaterialFromJSON("/examples/webgl/SampleData/pbr/MaterialJson/rain_.json");
    let recordRain = 0;
    let intervalValue = setInterval(() => {
      if (groundLayer._PBRMaterialParams.pbrMetallicRoughness.rainEffect !== undefined && buildingLayer._PBRMaterialParams.pbrMetallicRoughness.rainEffect !== undefined) {
        if (recordRain === 0) {
          recordRain = 1;
        }
        groundLayer._PBRMaterialParams.pbrMetallicRoughness.rainEffect.wetnessFactor += 0.0005;
        buildingLayer._PBRMaterialParams.pbrMetallicRoughness.rainEffect.wetnessFactor += 0.0005;
      }
      if (buildingLayer._PBRMaterialParams.pbrMetallicRoughness.rainEffect !== undefined && buildingLayer._PBRMaterialParams.pbrMetallicRoughness.rainEffect.wetnessFactor - 0.85 > 0)
        clearInterval(intervalValue);
    }, 40)

  } else if (type.value === '雪') {
    groundLayer.setPBRMaterialFromJSON("/examples/webgl/SampleData/pbr/MaterialJson/M_Brick_Clay_Old_.json");
    buildingLayer.setPBRMaterialFromJSON("/examples/webgl/SampleData/pbr/MaterialJson/M_Brick_Clay_Old_.json");

    let intervalValue = setInterval(() => {
      if (buildingLayer._PBRMaterialParams.pbrMetallicRoughness.snowEffect !== undefined) {
        buildingLayer._PBRMaterialParams.pbrMetallicRoughness.snowEffect.snow_coverage += 0.0006;
        groundLayer._PBRMaterialParams.pbrMetallicRoughness.snowEffect.snow_coverage += 0.0006;
      }
      if (buildingLayer._PBRMaterialParams.pbrMetallicRoughness.snowEffect !== undefined && buildingLayer._PBRMaterialParams.pbrMetallicRoughness.snowEffect.snow_coverage - 1 > 0)
        clearInterval(intervalValue);
    }, 30)
  }
}
</script>

<style lang="less" scoped></style>