<template>
  <el-button @click="handle">增删图层</el-button>
</template>

<script setup>
import geoCoordMap from '@/assets/js/airportGPS.js'

function handle() {
  Cesium.loadJson('/examples/webgl/data/GlobalFlight.json').then(function (jsonData) {
    var behind_border = [];

    layer.group[url].stateList.length = 0;

    index = 1;
    viewer.entities.removeAll();
    if (cross.selectedIndex == 1) {
      createPolyLine(jsonData, "all");
    }
    else if (cross.selectedIndex == 0) {
      for (var c = 0; c < jsonData.length; c++) {
        var a = jsonData[c][0];
        var b = jsonData[c][1];
        if (geoCoordMap[a] && geoCoordMap[b] && geoCoordMap[a][4] == geoCoordMap[b][4]) {
          behind_border.push(jsonData[c]);
        }
      }
      createPolyLine(behind_border, "all");
    }

    var airportData = [];
    for (var j = 0; j < jsonData.length; j++) {
      if (jsonData[j][0] == "PEK") {
        airportData.push(jsonData[j]);
      }
    }
    index = 1;
    createPolyLine(airportData, "dep", "PEK");
    document.getElementById("search").onclick = function () {
      flag = 0;
      if (selectDiv.selectedIndex == 0) { airport = "PEK"; }
      if (selectDiv.selectedIndex == 1) { airport = "PVG"; }
      if (selectDiv.selectedIndex == 2) { airport = "CTU"; }
      if (dirDiv.selectedIndex == 0) { dir = "dep"; }
      if (dirDiv.selectedIndex == 1) { dir = "arr"; }
      if (airportData.length > 0) {
        airportData.length = 0;
      }
      for (var j = 0; j < jsonData.length; j++) {
        if (dir == "dep") {
          if (jsonData[j][0] == airport) {
            airportData.push(jsonData[j]);
          }
        }
        if (dir == "arr") {
          if (jsonData[j][1] == airport) {
            airportData.push(jsonData[j]);
          }
        }
      }

      // for(var i = 0;i < objects.length;i++){
      //     layer.clear(url, i);
      // }
      layer.clearAll();
      layer.group[url].stateList.length = 0;

      index = 1;
      viewer.entities.removeAll();
      createPolyLine(airportData, dir, airport);
    }
  }).otherwise(function (error) {
  });

  GLOBAL.viewer.camera.flyTo({
    destination: new Cesium.Cartesian3(-3726950.8178392285, 3087276.1287523108, 20000000),
    orientation: {
      heading: 3.7690494906963523,
      pitch: -1.5707963267948966,
      roll: 0
    }
  })
}

function createPolyLine(data, mode, airport) {
  var num = 300;
  objects.length = 0;
  objects = [];
  var polylineEntities = [];
  var t = "此时空中有" + data.length + "条航线";
  var i;
  if (mode == "dep") {
    var p = data[0][0];
  }
  else if (mode == "arr") {

    var p = data[0][1]
  }
  else {
    flag = 1;
    num = 30;
  }
  if (airport == 'PVG') {
    //上海浦东机场
    camera.setView({
      destination: new Cesium.Cartesian3(-4032578.8016693345, 5427649.626208913, 2512475.6081795795),
      orientation: {
        heading: 5.925348571914093,
        pitch: -0.6753207694751793,
        roll: 0
      }
    });
  }
  else if (airport == 'CTU') {
    //成都双流机场
    camera.setView({
      destination: new Cesium.Cartesian3(-1432104.201252676, 6959576.20812267, 2245802.5051383465),
      orientation: {
        heading: 0.1345035833313153,
        pitch: -0.7237342876759398,
        roll: 0
      }
    });
  }
  else if (airport == 'PEK') {
    //北京首都机场
    scene.camera.setView({
      destination: new Cesium.Cartesian3(-3496883.8069757824, 5504094.655760036, 3717965.1235123337),
      orientation: {
        heading: 5.896655316895333,
        pitch: -0.8476315034394291,
        roll: 0
      }
    });
  } else {
    GLOBAL.viewer.camera.setView({

      destination: Cesium.Cartesian3.fromDegrees(116.44829499568006, 39.9038584836946, 25500000),
      orientation: {
        heading: 4.462824916628415,
        pitch: -1.5695598976662626,
        roll: 2.0831853071570976
      }
    });
  }
  if (p) {
    var pos = geoCoordMap[p];
    GLOBAL.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(parseFloat(pos[0]), parseFloat(pos[1])),
      point: {
        pixelSize: 8,
        color: new Cesium.Color(1, 1, 0, 0.9)
      }
    });
  }

  for (i = 0; i < data.length; i++) {
    var dep = data[i][0];
    var arr = data[i][1];
    var pointA = geoCoordMap[dep];
    var pointB = geoCoordMap[arr];
    if (pointA && pointB) {

      var origin = [parseFloat(pointA[0]), parseFloat(pointA[1])];
      var destination = [parseFloat(pointB[0]), parseFloat(pointB[1])];
      var dis = getGreatCircleDistance(origin[1], origin[0], destination[1], destination[0]);
      var pntArray = addBezier(origin, destination, dis / 7, num);

      if (mode == "dep") {
        var color = new Cesium.Color(0.745, 0.402, 0.8, 0.6);
        GLOBAL.viewer.entities.add({

          position: Cesium.Cartesian3.fromDegrees(destination[0], destination[1]),
          point: {
            pixelSize: 5,
            color: new Cesium.Color(0, 1, 1)
          }
        });
      }
      else if (mode == "arr") {
        var color = new Cesium.Color(51 / 255, 153 / 255, 255 / 255, 0.6);
        GLOBAL.viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(origin[0], origin[1]),
          point: {
            pixelSize: 5,
            color: new Cesium.Color(1, 0, 1)
          }
        });
      }
      else if (mode = "all") {
        var color = new Cesium.Color(0.2, 0.9, 0.8, 0.8);
      }
      if (data[i][4]) {
        data[i].pop();
      }
      if (mode != "all") {
        if (!data[i][4]) {
          data[i].push(pntArray);
        }
        dynamiclayer(pntArray);
      }
      var entity = new Cesium.Entity();
      entity.dep = dep;
      entity.arr = arr;
      entity.bezier = new
        Cesium.ConstantProperty(true);
      entity.bezier = true;
      entity.polyline = {
        positions: pntArray,
        width: 0.1,
        material: color
      };
      entity.description = pointA[2] + '-' + pointB[2] + "     " + "  Distance:   " + dis / 1000 + " KM";
      viewer.entities.add(entity);
      polylineEntities.push(entity);
    }

  }
  if (mode == "all") {

    return;
  }
  else {
    layer.updateObjectWithModel(url, objects);
    if (timeInterval) {
      clearInterval(timeInterval);
    }
    timeInterval = setInterval(function () {
      if (flag == 0) {
        if (index > 299) {
          index = 1;
          for (i = 0; i < data.length; i++) {
            layer.clear(url, i);
          }
        }
        for (i = 0; i < data.length; i++) {
          var p = data[i][4];
          var point = earth.cartesianToCartographic(p[index]);
          var state = objects[i];
          state.longitude = Cesium.Math.toDegrees(point.longitude);
          state.latitude = Cesium.Math.toDegrees(point.latitude);
          state.altitude = point.height;
        }
        index++;
        layer.updateObjectWithModel(url, objects);
      }
      else {
        // for(i=0;i<data.length;i++){
        //     layer.clear(url,i);
        // }
        layer.clearAll();
        return;
      }
    }, 200);
    layer.updateInterval = 200;
  }
}

</script>

<style lang="less" scoped></style>