<template>
  <el-dropdown style="margin-left: 12px; word-break: keep-all; min-width: 120px;" split-button>
    <p style="width: 40px;">滤镜</p>
    <template #dropdown>
      <el-dropdown-menu style="width: 400px;overflow: hidden; padding: 12px;">
        <div style="display: flex;"><span style="width: 100px">brightness</span><el-slider v-model="brightness"
            size="small" :min="0" :max="5" :step="0.01" @input="change" /></div>
        <div style="display: flex;"><span style="width: 100px">contrast</span><el-slider v-model="contrast" size="small"
            :min="0" :max="5" :step="0.01" @input="change" /></div>
        <div style="display: flex;"><span style="width: 100px">hue</span><el-slider v-model="hue" size="small" :min="0"
            :max="1" :step="0.01" @input="change" /></div>
        <div style="display: flex;"><span style="width: 100px">saturation</span><el-slider v-model="saturation"
            size="small" :min="0" :max="5" :step="0.01" @input="change" /></div>
        <div style="display: flex;"><span style="width: 100px">gamma</span><el-slider v-model="gamma" size="small"
            :min="0" :max="5" :step="0.01" @input="change" /></div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { ref } from 'vue'
const brightness = ref(1)
const contrast = ref(1)
const hue = ref(0)
const saturation = ref(1)
const gamma = ref(1)

function change() {
  const layer = GLOBAL.viewer.imageryLayers.get(1)
  layer.brightness = brightness.value
  layer.contrast = contrast.value
  layer.hue = hue.value
  layer.saturation = saturation.value
  layer.gamma = gamma.value
}

</script>

<style lang="less" scoped></style>