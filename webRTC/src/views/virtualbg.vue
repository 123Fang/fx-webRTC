<template>
  <div style="width: 95%;height: auto;margin-top: 30px;">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="摄像头">
            <el-select v-model="formInline.videoId" placeholder="摄像头">
              <el-option v-for="(item, index) in localDevice.videoIn " :key="index" :label="item.label"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="麦克风">
            <el-select v-model="formInline.audioInId" placeholder="麦克风">
              <el-option v-for="(item, index) in localDevice.audioIn " :key="index" :label="item.label"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="扬声器">
            <el-select v-model="formInline.audioOutId" placeholder="扬声器">
              <el-option v-for="(item, index) in localDevice.audioOut " :key="index" :label="item.label"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row style="width: 100%;">
      <div style="width: 100%;display: flex;flex-direction: row;align-items: center;justify-content: center;">
        <video id="localdemo01" autoplay controls muted></video>
        <canvas id="output_canvas" class="output_canvas" width="620px" height="400px"></canvas>
      </div>
    </el-row>
  </div>
</template>

<script>
import * as SFS from "@mediapipe/selfie_segmentation";
import {initInnerLocalDevice} from '../hooks/initInnerLocalDevice'


var canvasElement;
var canvasCtx;
var image;
var selfieSegmentation = null;

export default {
  name: 'my-virtualbg',
  data() {
    return {
      localDevice: {
        audioIn: [],
        videoIn: [],
        audioOut: []
      },
      formInline: {
        videoId: undefined,
        audioInId: undefined,
        audioOutId: undefined
      },
      meimage: require('@/assets/bg.jpg')
    }
  },
  created() {
    this.$notify({
      title: '温馨提示',
      type: 'warning',
      message: '请在代码中查看模型静态文件夹：virtualmodel,并将当前文件夹映射到静态可访问地址',
      duration: 0
    });
    this.$notify({
      title: '温馨提示',
      type: 'warning',
      message: '点击确定后没有出现虚拟背景请F12查看控制台，大概率是你虚拟背景模型地址没有映射出来',
      duration: 0,
      position: 'bottom-right'
    });
    initInnerLocalDevice(this)
  },
  mounted() {
    this.initVb()
  },
  methods: {
    async onSubmit() {
      let domId = "localdemo01"
      let video = document.getElementById(domId)
      let stream = video.srcObject // 获取到该 video 元素当前播放的媒体流对
      if (stream) {
        stream.getAudioTracks().forEach(e => {
          stream.removeTrack(e)
        })
        stream.getVideoTracks().forEach(e => {
          stream.removeTrack(e)
        })
      }
      let newStream = await this.getTargetDeviceMedia(this.formInline.videoId, this.formInline.audioInId)
      video.srcObject = newStream // 视频和麦克风的流给到视频播放器
      video.muted = true
      this.virtualBg()

    },
    /**
     * 获取设备 stream
     * @param constraints
     * @returns {Promise<MediaStream>}
     */
    async getLocalUserMedia(constraints) {
      return await navigator.mediaDevices.getUserMedia(constraints)
    },

    /**
     * @returns {Promise<MediaStream>}
     * **/
    async getTargetDeviceMedia(videoId, audioId) {
      const constraints = {
        audio: { deviceId: audioId ? { exact: audioId } : undefined },
        video: {
          deviceId: videoId ? { exact: videoId } : undefined,
          width: 1920,
          height: 1080,
          frameRate: { ideal: 10, max: 15 }
        }
      };
      if (window.stream) {
        window.stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      return await this.getLocalUserMedia(constraints).catch(((e)=>console.error(e)));
    },

    //初始化模型
    initVb() {
      canvasElement = document.getElementById('output_canvas');
      canvasCtx = canvasElement.getContext('2d');
      image = new Image();
      image.src = this.meimage
      selfieSegmentation = new SFS.SelfieSegmentation({
        locateFile: (file) => {
          console.log(file);
          return `http://localhost:5500/webRTC/public/v/${file}`;// 你本地的ip+端口
        }
      });
      selfieSegmentation.setOptions({
        modelSelection: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      selfieSegmentation.onResults(this.handleResults);
    },
    //我们自定义的 处理背景的
    handleResults(results) {
      // Prepare the new frame
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);
      // Draw the image as the new background, and the segmented video on top of that
      canvasCtx.globalCompositeOperation = 'source-out';
      canvasCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.globalCompositeOperation = 'destination-atop';
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
      // Done
      canvasCtx.restore();
    },
    //这个是官网的 我们暂时不用。
    // onResults(results) {
    //   canvasCtx.save();
    //   canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //   canvasCtx.drawImage(results.segmentationMask, 0, 0,
    //     canvasElement.width, canvasElement.height);
    //   // Only overwrite existing pixels.
    //   canvasCtx.globalCompositeOperation = 'source-in';
    //   canvasCtx.fillStyle = '#00FF00';
    //   canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    //   // Only overwrite missing pixels.
    //   canvasCtx.globalCompositeOperation = 'destination-atop';
    //   canvasCtx.drawImage(
    //     results.image, 0, 0, canvasElement.width, canvasElement.height);
    //   canvasCtx.restore();
    // },

    /**
     * 监听触发模型处理
     */
    async virtualBg() {
      const that = this
      let video = document.getElementById('localdemo01')
      if (this.rfId) {
        cancelAnimationFrame(this.rfId)
      }
      video.addEventListener('playing', function () {
        let myvideo = this;
        let lastTime = new Date();
        async function getFrames() {
          const now = myvideo.currentTime;
          if (now > lastTime) {
            await selfieSegmentation.send({ image: myvideo });
          }
          lastTime = now;
          //无限定时循环 退出记得取消 cancelAnimationFrame()
          that.rfId = requestAnimationFrame(getFrames);
        }
        getFrames()
      })
    }


  }

}
</script>

<style scoped>
#localdemo01 {
  width: 500px;
  height: 400px;

}

#output_canvas {
  background-color: aqua;
}
</style>
