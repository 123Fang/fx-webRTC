


function handleError(error) {
  // alert("摄像头无法正常使用，请检查是否占用或缺失")
  console.error('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}


export function initInnerLocalDevice(vm) {
  let localDevice = {
    audioIn: [],
    videoIn: [],
    audioOut: []

  }
  let constraints = { video: true, audio: true }
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log("浏览器不支持获取媒体设备");
    return;
  }
  navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
      stream.getTracks().forEach(trick => {
        trick.stop()
      })

      // enumerateDevices 方法于获取当前设备上可用的媒体输入和输出设备的信息，如摄像头、麦克风、扬声器等。
      navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
          devices.forEach(function (device) {
            let obj = { id: device.deviceId, kind: device.kind, label: device.label }
            if (device.kind === 'audioinput') { // 麦克风
              if (localDevice.audioIn.filter(e => e.id === device.deviceId).length === 0) {
                localDevice.audioIn.push(obj)
              }
            } if (device.kind === 'audiooutput') { // 扬声器
              if (localDevice.audioOut.filter(e => e.id === device.deviceId).length === 0) {
                localDevice.audioOut.push(obj)
              }
            } else if (device.kind === 'videoinput') { // 摄像头
              if (localDevice.videoIn.filter(e => e.id === device.deviceId).length === 0) {
                localDevice.videoIn.push(obj)
              }
            }
          });

          vm.localDevice = localDevice
          return vm
        })
        .catch(handleError);

    })
    .then(() => {
      console.log(localDevice)
    })
    .catch(handleError);
}
