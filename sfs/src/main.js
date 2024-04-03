import * as SFS from "@mediapipe/selfie_segmentation";

let obj = new SFS.SelfieSegmentation({
  locateFile: (file) => {
    return `http://120.78.136.2/cdn/${file}`;// 你本地的ip+端口
  }
}

)
obj.setOptions({
  modelSelection: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

export function sfs() {
  return obj
}
