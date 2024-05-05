<template>
  <el-button @click="handle">量算(已{{ active ? '开启' : '关闭' }})</el-button>
  <el-button v-if="active" @click="distance" style="position: absolute; top: 60px;left: 120px;">长度</el-button>
  <el-button v-if="active" @click="area" style="position: absolute; top: 60px;left: 200px;">面积</el-button>
  <el-button v-if="active" @click="height" style="position: absolute; top: 60px;left: 280px;">等高线</el-button>
  <el-button v-if="active" @click="clearAll" style="position: absolute; top: 60px;left: 380px;">清除</el-button>

</template>

<script setup>
import { ref } from 'vue'
const active = ref(false)
let viewer
let scene
let clampMode = 0; // 空间模式
let widget
let handlerDis
let handlerArea = 0
let handlerHeight = 0

// 初始化数据
let layers, isoline, lineHeight, setHypFlag, height_0 = 0, point1, point2, pickPointEnabled = false;
let isShowLine = true;

function handle() {
  active.value = !active.value
  viewer = GLOBAL.viewer
  scene = viewer.scene
  widget = viewer.cesiumWidget;
  scene.lightSource.ambientLightColor = new Cesium.Color(0.65, 0.65, 0.65, 1);
  // var promise = scene.open(URL_CONFIG.SCENE_CBD, undefined, { 'autoSetView': false });
  var promise = scene.open(URL_CONFIG.SCENE_CBD, undefined);
  Cesium.when(promise, function (layers) {
    layers.forEach((s3mlayer) => {
      if (!s3mlayer.visibleDistanceMax || s3mlayer.visibleDistanceMax > 12000) {
        s3mlayer.visibleDistanceMax = 12000   //设置模型最可见距离
      }
    })
    setHypsometricSetting()
  })

  init();
  // 初始化等高线
  function init() {
    // 等高线
    isoline = new Cesium.HypsometricSetting();
    isoline.DisplayMode = Cesium.HypsometricSettingEnum.DisplayMode.LINE;
    let colorTable = new Cesium.ColorTable();
    isoline._lineColor = Cesium.Color.fromCssColorString('#ff7d00');
    isoline.ColorTable = colorTable;
    isoline.Opacity = 0.6;
    isoline.MaxVisibleValue = -100;
    isoline.MinVisibleValue = -100;
    layers = viewer.scene.layers.layerQueue;
    viewer.scene.globe.HypsometricSetting = {
      hypsometricSetting: isoline,
      analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
    };
  }

  // 初始化设置图层等高线
  function setHypsometricSetting() {
    for (let i = 0; i < layers.length; i++) {
      layers[i].hypsometricSetting = {
        hypsometricSetting: isoline,
        analysisMode: Cesium.HypsometricSettingEnum.AnalysisRegionMode.ARM_ALL
      };
    }
    setHypFlag = true;
  }


  //初始化测量距离
  handlerDis = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Distance, clampMode);
  //注册测距功能事件
  handlerDis.measureEvt.addEventListener(function (result) {
    var dis = Number(result.distance);
    var selOptV = $("#selOpt").val();
    var positions = result.positions;
    if (selOptV == 3 || selOptV == 4) {
      dis = Number(calcClampDistance(positions));
    }
    var distance = dis > 1000 ? (dis / 1000).toFixed(2) + 'km' : dis.toFixed(2) + 'm';
    handlerDis.disLabel.text = '距离:' + distance;

  });
  handlerDis.activeEvt.addEventListener(function (isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = '';
      $('body').removeClass('measureCur').addClass('measureCur');
      viewer.scene.pickPointEnabled = pickPointEnabled;
    }
    else {
      viewer.enableCursorStyle = true;
      $('body').removeClass('measureCur');
      viewer.scene.pickPointEnabled = false;
    }
  });

  //初始化测量面积
  handlerArea = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Area, clampMode);
  handlerArea.measureEvt.addEventListener(function (result) {
    var mj = Number(result.area);
    var selOptV = $("#selOpt").val();
    var positions = result.positions;
    if (selOptV == 3 || selOptV == 4) {
      mj = Number(calcClampValue(positions));
    } else if (selOptV == 5) {
      mj = Number(calcAreaWithoutHeight(positions));
    }

    var area = mj > 1000000 ? (mj / 1000000).toFixed(2) + 'km²' : mj.toFixed(2) + '㎡'
    handlerArea.areaLabel.text = '面积:' + area;
  });
  handlerArea.activeEvt.addEventListener(function (isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = '';
      $('body').removeClass('measureCur').addClass('measureCur');
      viewer.scene.pickPointEnabled = pickPointEnabled;
    }
    else {
      viewer.enableCursorStyle = true;
      $('body').removeClass('measureCur');
      viewer.scene.pickPointEnabled = false;
    }
  });

  //初始化测量高度
  handlerHeight = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH);
  handlerHeight.measureEvt.addEventListener(function (result) {
    var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
    var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
    var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
    handlerHeight.disLabel.text = '空间距离:' + distance;
    handlerHeight.vLabel.text = '垂直高度:' + vHeight;
    handlerHeight.hLabel.text = '水平距离:' + hDistance;
    //实时等高线显示
    lineHeight = Number(result.endHeight);
    if (isShowLine) updateContourLine(lineHeight)
  });

  handlerHeight.activeEvt.addEventListener(function (isActive) {
    if (isActive == true) {
      viewer.enableCursorStyle = false;
      viewer._element.style.cursor = '';
      $('body').removeClass('measureCur').addClass('measureCur');
      viewer.scene.pickPointEnabled = pickPointEnabled;
    }
    else {
      viewer.enableCursorStyle = true;
      $('body').removeClass('measureCur');
      viewer.scene.pickPointEnabled = false;
    }
  });

  //   设置等值线
  function updateContourLine(height) {
    viewer.scene.globe.HypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
    viewer.scene.globe.HypsometricSetting.hypsometricSetting.MinVisibleValue = height;
    if (!setHypFlag) return;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].hypsometricSetting.hypsometricSetting) {
        layers[i].hypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
        layers[i].hypsometricSetting.hypsometricSetting.MinVisibleValue = height;
      } else {
        setHypsometricSetting();
      }
    }
  };



  //椭球贴地面积
  function calcClampValue(positions) {
    var lonlat = [];
    var value = 0;
    for (var i = 0; i < positions.length; i++) {
      var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
      var lon = Cesium.Math.toDegrees(cartographic.longitude);

      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      lonlat.push(lon, lat);
    }

    var gemetry = new Cesium.PolygonGeometry.fromPositions({
      positions: Cesium.Cartesian3.fromDegreesArray(lonlat)
    });

    var selOptV = $("#selOpt").val();
    if (selOptV == 3) {
      value = scene.globe.computeSurfaceArea(gemetry, Cesium.Ellipsoid.CGCS2000);

    } else if (selOptV == 4) {
      value = scene.globe.computeSurfaceArea(gemetry, Cesium.Ellipsoid.XIAN80);
    }
    return value;
  }
  //椭球贴地距离
  function calcClampDistance(positions) {
    var lonlat = [];
    var value = 0;
    for (var i = 0; i < positions.length; i++) {
      var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
      var lon = Cesium.Math.toDegrees(cartographic.longitude);

      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      lonlat.push(lon, lat);
    }

    var gemetry = new Cesium.PolylineGeometry({
      positions: Cesium.Cartesian3.fromDegreesArray(lonlat)
    });


    var selOptV = $("#selOpt").val();
    if (selOptV == 3) {
      value = scene.globe.computeSurfaceDistance(gemetry, Cesium.Ellipsoid.CGCS2000);

    } else if (selOptV == 4) {
      value = scene.globe.computeSurfaceDistance(gemetry, Cesium.Ellipsoid.XIAN80);
    }
    return value;
  }

  function calcAreaWithoutHeight(positions) {
    var totalLon = 0;
    for (var i = 0; i < positions.length; i++) {
      var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
      var lon = Cesium.Math.toDegrees(cartographic.longitude);
      totalLon += lon;
    }



    var dh = Math.round((totalLon / positions.length + 6) / 6);//带号
    var centralMeridian = dh * 6 - 3;
    //高斯投影
    var projection = new Cesium.CustomProjection({
      name: "tmerc",
      centralMeridian: centralMeridian,
      primeMeridian: 0,
      standardParallel_1: 0,
      standardParallel_2: 0,
      eastFalse: 500000.0,
      northFalse: 0.0,
      semimajorAxis: 6378137,
      inverseFlattening: 298.257222101

    });
    var cartesians = [];
    for (var i = 0; i < positions.length; i++) {
      var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);

      var cartesian = projection.project(cartographic);
      cartesians.push(cartesian);
    }

    cartesians.push(cartesians[0]);//首尾相接
    var value = Cesium.getPreciseArea(cartesians, "China2000", centralMeridian, dh, 1);
    return value;
  }

}
//   设置等值线
function updateContourLine(height) {
  viewer.scene.globe.HypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
  viewer.scene.globe.HypsometricSetting.hypsometricSetting.MinVisibleValue = height;
  if (!setHypFlag) return;
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].hypsometricSetting.hypsometricSetting) {
      layers[i].hypsometricSetting.hypsometricSetting.MaxVisibleValue = height;
      layers[i].hypsometricSetting.hypsometricSetting.MinVisibleValue = height;
    } else {
      setHypsometricSetting();
    }
  }
};


//   清除等值线
function clearLine() {
  updateContourLine(-10000);
};

function distance() {
  deactiveAll();
  handlerDis && handlerDis.activate();
}

function area() {
  deactiveAll();
  handlerArea && handlerArea.activate();
}

function height() {
  if (!setHypFlag) setHypsometricSetting();
  clearLine();
  deactiveAll();
  handlerHeight && handlerHeight.activate();
}

function clearAll() {
  deactiveAll();
  handlerDis && handlerDis.clear();
  handlerArea && handlerArea.clear();
  handlerHeight && handlerHeight.clear();
  clearLine();
}

function deactiveAll() {
  handlerDis && handlerDis.deactivate();
  handlerArea && handlerArea.deactivate();
  handlerHeight && handlerHeight.deactivate();
  lineHeight = -10000;
}
</script>

<style lang="less" scoped></style>