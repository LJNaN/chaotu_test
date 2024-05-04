<template>
  <el-button @click="handle">二维地图</el-button>
</template>

<script setup>
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { TileSuperMapRest } from '@supermap/iclient-ol';
import GLOBAL from '@/GLOBAL.js'

function handle() {
  GLOBAL.show2D.value = true

  var url = "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
  var map = new Map({
    target: 'map2D',
    view: new View({
      center: [0, 0],
      zoom: 2,
      projection: 'EPSG:4326'
    })
  });
  var layer = new TileLayer({
    source: new TileSuperMapRest({
      url: url,
      wrapX: true
    }),
    projection: 'EPSG:4326'
  });
  map.addLayer(layer);
}
</script>

<style lang="less" scoped></style>