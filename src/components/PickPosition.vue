<template>
  <el-button @click="handleToggle">位置选择与自定义弹窗(已{{ toggle ? '开启' : '关闭' }})</el-button>
</template>

<script setup>
import Popup from '@/assets/js/bubble/popup.js'
import { ref } from 'vue'

const toggle = ref(false)


let handler = null
let currentPoint = null
let popups = []
function handle() {
  handler = new Cesium.ScreenSpaceEventHandler(GLOBAL.viewer.scene.canvas);

  //设置鼠标左键单击回调事件
  handler.setInputAction(function (e) {
    //首先移除之前添加的点
    GLOBAL.viewer.entities.removeAll();
    //获取点击位置笛卡尔坐标
    const position = GLOBAL.viewer.scene.pickPosition(e.position);

    //将笛卡尔坐标转化为经纬度坐标
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
    let height = cartographic.height;
    if (height < 0) {
      height = 0;
    }


    //在点击位置添加对应点
    const point = new Cesium.Entity({
      point: new Cesium.PointGraphics({
        color: new Cesium.Color(0.16, 0.62, 0.75),
        pixelSize: 15,
        outlineColor: new Cesium.Color(1, 1, 1)
      }),
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height + 1)
    })
    GLOBAL.viewer.entities.add(point);
    currentPoint = point

    // 弹窗
    const popup = new Popup({
      viewer: GLOBAL.viewer,
      pixelOffset: new Cesium.Cartesian2(0, -90),
      translucencyByDistance: new Cesium.NearFarScalar(0, 1, 17000000, 0.5),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 22000000),
      showClose: true,
      html: `
      <div style="position:relative; background: url('/img/1.png') center / 100% 100% no-repeat; width: 200px; height: 150px;padding: 12px">
        <p style="color: white; font-size: 12px;">经度: ${longitude}</p>
        <p style="color: white; font-size: 12px;">纬度: ${latitude}</p>
        <p style="color: white; font-size: 12px;">高度: ${height}</p>
      </div>
    `
    });
    popup.setPosition(position)
    popups.push(popup)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function handleToggle() {
  toggle.value = !toggle.value

  if (toggle.value) {
    handle()

  } else {
    handler && handler.destroy()
    popups.forEach(e => {
      e.destroy()
    })
    currentPoint && (currentPoint.show = false)

    popups = []
  }
}
</script>

<style lang="less" scoped></style>