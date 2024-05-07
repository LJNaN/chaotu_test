<template>
  <el-select class="changeMap" v-model="currentMap" placeholder="图源" @change="changeMap">
    <el-option v-for="item in mapOptions" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script setup>
import { onMounted, ref } from 'vue'
Cesium.CESIUM_BASE_URL = '/Cesium'
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYzA4NzQ3ZC0yOGU0LTRjY2EtYWQwMy1mNGNkODExMTNlNDYiLCJpZCI6MjAyNjY1LCJpYXQiOjE3MTA3NTYxNzR9.GNuJOlYuB5KL_5HPkQEmqMuEBnhG7N21QLUP-nVmeoA';

const currentMap = ref('bing')
const mapOptions = [
  { value: 'gaode', label: '高德' },
  { value: 'osm', label: 'OSM' },
  { value: 'google', label: '谷歌' },
  { value: 'bing', label: '必应' },
  { value: 'ARCgis', label: 'ARC' },
  { value: 'tencent', label: '腾讯' },
  { value: 'tiandi', label: '天地图' }
]

async function changeMap(type) {
  const viewer = GLOBAL.viewer
  const scene = viewer.scene

  let map = null
  if (type === 'gaode') {
    map = new Cesium.UrlTemplateImageryProvider({
      url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
      minimumLevel: 4,
      maximumLevel: 18
    })

  } else if (type === 'osm') {
    map = new Cesium.OpenStreetMapImageryProvider({
      url: 'https://a.tile.openstreetmap.org/'
    })

  } else if (type === 'google') {
    map = new Cesium.UrlTemplateImageryProvider({
      url: "https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}"
    })

  } else if (type === 'bing') {
    map = await Cesium.BingMapsImageryProvider.fromUrl(
      "https://dev.virtualearth.net", {
      key: "AuKafWS8lQnTHXRdIBE7lyieYesaFPqSshgjjzyzPq9-Su7aQ_lu0MVEdoxvcQpO"
    })

  } else if (type === 'ARCgis') {
    map = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
      'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
    )

  } else if (type === 'tencent') {
    map = new Cesium.UrlTemplateImageryProvider({
      url: "https://p2.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=400",
      customTags: {
        sx: function (imageryProvider, x, y, level) { return x >> 4; },
        sy: function (imageryProvider, x, y, level) { return ((1 << level) - y) >> 4 }
      }
    })

  } else if (type === 'tiandi') {
    map = new Cesium.UrlTemplateImageryProvider({
      url: 'http://{s}.tianditu.com/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=a197dc1151c64637e6bc687f7a4a92ca',
      subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
      maximumLevel: 18,
      minimumLevel: 1,
      credit: 'Tianditu'
    })
  }

  if (map) {
    viewer.imageryLayers.addImageryProvider(map);
  }
}

</script>

<style lang="less" scoped>
.changeMap {
  width: 100px;
  margin-right: 12px;
  margin-left: 12px;
}
</style>