import * as params from './params';
import FloatPosition from '../util/FloatPosition'
import Queue from '../util/Queue'

// skip below points
const SKIP_KEYPOINTS_NAMES = ["left_eye", "right_eye", "left_ear", "right_ear"];

// key points relationship for draw lines
const MAPPINGS = {
  0: [17, 19], 5: [7, 17], 6: [8, 17], 7: [9], 8: [10],
  17: [18], 18: [11, 12], 11: [13], 12: [14], 13: [15], 14: [16]
};

// 视频输入转显示缩放宽度比例
let videoToCanvasWidthScale = 1;
// 视频输入转显示缩放高度比例
let videoToCanvasHeightScale = 1;

// 相机尺寸
let videoWidth;
let videoHeight;

// 波动点队列
let pointsQueue = new Queue();
// 左脚踝波动点队列
let leftAnklePointsQueue = new Queue();
// 右脚踝波动点队列
let rightAnklePointsQueue = new Queue();

// 波动队列收集帧数
const jumpMiniCount = 6;
// 脚踝波动队列收集数量
const peekAnkleLimitCount = 20;

// 下降趋势中此变量设为true，下次波峰可以计数
let bCanAdd = false;

// 计数
let countingNumber = 0;

// 384*384坐标阈值放大系数
let boostRatio = 1.4;

// 384*384坐标系隔一帧差值阈值
const originJumpValue = 1.2;
// 384*384坐标系内波动阈值
const originWaveValueBottom = 0.7;
// 384*384坐标系内波峰波谷阈值
const originPeakValueLimit = 2.0;
// 384*384坐标系内脚踝波动阈值
const originPeakAnkleValueLimit = 2.5;
// 当前坐标系内隔一帧差值阈值
let jumpValue;
// 当前坐标系内波动阈值
let waveValueBottom;
// 当前坐标系内波峰波谷阈值
let peakValueLimit;
// 当前坐标系内脚踝波动阈值
let peakAnkleValueLimit;

export class Camera {
  constructor() {
    this.video = document.getElementById('video');
    this.canvas = document.getElementById('output');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Initiate a Camera instance and wait for the camera stream to be ready.
   * @param cameraParam From app `STATE.camera`.
   */
  static async setupCamera(cameraParam) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("无法获取摄像头设备！");
      throw new Error(
        'Browser API navigator.mediaDevices.getUserMedia not available');
    }

    // 前置后置摄像头
    let facingMode;
    if (!cameraParam.isBackend) {
      facingMode = "user";
    } else {
      facingMode = { exact: "environment" }
    }

    // 使用屏幕分辨率获取摄像头分辨率，返回接近的屏幕比例的长宽
    // 手机摄像头的长宽比（宽高比），都是将手机横放时的，较长的那一边比较短的那一边的值
    // 所以摄像头中的width为长边，height为短边，此处长宽赋值颠倒非代码错误
    videoWidth = params.CANVAS_SIZE.height;
    videoHeight = params.CANVAS_SIZE.width;

    const videoConfig = {
      'audio': false,
      'video': {
        facingMode: facingMode,
        width: videoWidth,
        height: videoHeight,
        frameRate: {
          // 帧率控制
          ideal: cameraParam.targetFPS,
        }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
    const camera = new Camera();
    camera.video.srcObject = stream;
    await new Promise((resolve) => {
      camera.video.onloadedmetadata = () => {
        resolve(video);
      };
    });
    camera.video.play();

    videoWidth = camera.video.videoWidth;
    videoHeight = camera.video.videoHeight;

    // Must set below two lines, otherwise video element doesn't show.
    camera.video.width = videoWidth;
    camera.video.height = videoHeight;

    // 画布区域大小
    camera.canvas.width = params.CANVAS_SIZE.width;
    camera.canvas.height = params.CANVAS_SIZE.height;

    // 测试提示使用，上线后去除
    if (videoWidth != params.CANVAS_SIZE.width || videoHeight != params.CANVAS_SIZE.height) {
      alert("相机尺寸与屏幕尺寸不匹配，可能会出现画面拉伸或压缩，videoWidth：" + videoWidth
        + ", videoHeight:" + videoHeight + ", canvasWidth:" + params.CANVAS_SIZE.width +
        ", canvasHeight:" + params.CANVAS_SIZE.height);
    }

    // 宽高缩放比例计算
    videoToCanvasWidthScale = videoWidth / params.CANVAS_SIZE.width;
    videoToCanvasHeightScale = videoHeight / params.CANVAS_SIZE.height;

    // 阈值计算
    const heightScaler = videoHeight / 384;
    jumpValue = heightScaler * originJumpValue * boostRatio;
    waveValueBottom = heightScaler * originWaveValueBottom * boostRatio;
    peakValueLimit = heightScaler * originPeakValueLimit * boostRatio;
    peakAnkleValueLimit = heightScaler * originPeakAnkleValueLimit * boostRatio;

    // 画布样式
    const canvasContainer = document.querySelector('.canvas-wrapper');
    canvasContainer.style = `position: relative;overflow:hidden;width: 
    ${params.CANVAS_SIZE.width}px; height: ${params.CANVAS_SIZE.height}px`;

    // 前置摄像头画面是镜像的，所以需要水平翻转
    if (!cameraParam.isBackend) {
      camera.ctx.scale(-1, 1)
      camera.ctx.translate(-params.CANVAS_SIZE.width, 0);
    }

    return camera;
  }

  drawCtx() {
    this.ctx.drawImage(
      this.video, 0, 0, params.CANVAS_SIZE.width, params.CANVAS_SIZE.height);
  }

  clearCtx() {
    this.ctx.clearRect(0, 0, params.CANVAS_SIZE.width, params.CANVAS_SIZE.height);
  }

  /**
   * Draw the keypoints and skeleton on the video.
   * @param poses A list of poses to render.
   */
  drawResults(poses) {
    for (const pose of poses) {
      this.drawResult(pose);
    }
  }

  /**
   * Draw the keypoints and skeleton on the video.
   * @param pose A pose with keypoints to render.
   */
  drawResult(pose) {

    // filter low socre pose
    var highScoreCount = 0;
    for (const keypoint of pose.keypoints) {
      if (SKIP_KEYPOINTS_NAMES.indexOf(keypoint.name) != -1) {
        continue;
      }
      if (keypoint.score >= params.MOVENET_CONFIG.scoreThreshold) {
        highScoreCount++;
      }
    }
    // filter low score pose
    if (highScoreCount < 8) {
      return;
    }

    this.drawKeypoints(pose.keypoints);
    this.drawSkeleton(pose.keypoints, pose.id);
  }

  /**
   * Draw the keypoints on the video.
   * @param keypoints A list of keypoints.
   */
  drawKeypoints(keypoints) {

    // calculate the chin point from nose and shoulders
    var nose = keypoints[0];
    var leftShoulder = keypoints[5];
    var rightShoulder = keypoints[6];
    var leftHip = keypoints[11];
    var rightHip = keypoints[12];

    var chin = {};
    chin.name = 'chin';
    chin.score = (nose.score + leftShoulder.score + rightShoulder.score) / 3;
    chin.x = nose.x;
    chin.y = ((rightShoulder.y + leftShoulder.y) / 2 + nose.y) / 2;

    keypoints.push(chin);

    // calculate the belly point from shoulders and hips
    var belly = {};
    belly.name = 'belly';
    belly.score = (leftShoulder.score + rightShoulder.score + leftHip.score + rightHip.score) / 4;
    belly.x = (leftShoulder.x + rightShoulder.x + leftHip.x + rightHip.x) / 4;
    belly.y = (leftShoulder.y + rightShoulder.y + leftHip.y + rightHip.y) / 4;

    keypoints.push(belly);

    // calculate the head point from nose and chin
    var head = {};
    head.name = 'head';
    head.score = (chin.score + nose.score) / 2;
    head.x = nose.x;
    head.y = 2 * nose.y - chin.y;

    keypoints.push(head);

    // 计算运动个数
    this.sportCount(keypoints);

    this.ctx.fillStyle = '#ff8b22';
    this.ctx.lineWidth = params.DEFAULT_LINE_WIDTH;
    for (var i = 0; i < keypoints.length; i++) {
      // filter eyes and ears
      if (i >= 1 && i <= 4) {
        continue;
      }
      this.drawKeypoint(keypoints[i]);
    }
  }

  /**
   * 以nose点为准，结合波动范围、波峰波谷、脚踝波动，
   * 进行计数判断
   * @param {*} keyPoints 
   * @returns 
   */
  sportCount(keyPoints) {
    // nose
    var nose = keyPoints[0];
    var noseFloatPosition = new FloatPosition(nose.x, nose.y);

    // left ankle
    var leftAnkle = keyPoints[15];
    var leftAnkleFloatPosition = new FloatPosition(leftAnkle.x, leftAnkle.y);

    // right ankle
    var rightAnle = keyPoints[16];
    var rightAnleFloatPosition = new FloatPosition(rightAnle.x, rightAnle.y);

    // 入队
    pointsQueue.enqueue(noseFloatPosition);
    leftAnklePointsQueue.enqueue(leftAnkleFloatPosition);
    rightAnklePointsQueue.enqueue(rightAnleFloatPosition);

    // 数量不足，跳过
    let pointsSize = pointsQueue.size;
    let leftAnklePointsSize = leftAnklePointsQueue.size;
    let rightAnklePointsSize = rightAnklePointsQueue.size;
    if (pointsSize < jumpMiniCount ||
      leftAnklePointsSize < peekAnkleLimitCount ||
      rightAnklePointsSize < peekAnkleLimitCount) {
      return false
    }

    // 数量超出，出队
    if (pointsSize > jumpMiniCount) {
      pointsSize = pointsSize - 1;
      pointsQueue.dequeue();
    }
    if (leftAnklePointsSize > peekAnkleLimitCount) {
      leftAnklePointsSize = leftAnklePointsSize - 1;
      leftAnklePointsQueue.dequeue();
    }
    if (rightAnklePointsSize > peekAnkleLimitCount) {
      rightAnklePointsSize = rightAnklePointsSize - 1;
      rightAnklePointsQueue.dequeue();
    }

    // 波动幅度过滤
    if (this.filterRadian()) {
      console.log("波动幅度过滤")
      return;
    }
    // 波峰波谷过滤
    if (this.filterPeak()) {
      console.log("波峰波谷过滤")
      return;
    }
    // 脚踝波动过滤
    if (this.filterAnkle()) {
      console.log("脚踝波动过滤")
      return;
    }

    // 判断计数
    var nextPosition = pointsQueue.getByIndex(pointsSize - 1);
    var previewPosition = pointsQueue.getByIndex(pointsSize - 3);
    var offset = nextPosition.y - previewPosition.y;
    if (offset < - jumpValue) {
      bCanAdd = true
    }
    else if (offset > jumpValue) {
      if (bCanAdd) {
        bCanAdd = false
        countingNumber++;
        return true
      }
    }
    return false;
  }

  // 波动幅度过滤
  filterRadian() {
    let size = pointsQueue.size;
    if (size < jumpMiniCount) {
      return false
    }
    let meanValue = 0.0;
    let waveValue = 0.0;
    pointsQueue.items.forEach((e) => {
      meanValue += e.y;
    });
    meanValue = meanValue / size;
    pointsQueue.items.forEach((e) => {
      waveValue += Math.abs(e.y - meanValue);
    });
    waveValue = waveValue / size;
    return waveValue < waveValueBottom;
  }

  // 波峰波谷过滤
  filterPeak() {
    let size = pointsQueue.size;
    if (size < jumpMiniCount) {
      return false
    }
    let maxValue = 0.0;
    let minValue = 99999.0;
    pointsQueue.items.forEach((e) => {
      if (maxValue < e.y) {
        maxValue = e.y;
      }
      if (minValue > e.y) {
        minValue = e.y;
      }
    });
    let peakValue = maxValue - minValue;
    return peakValue < peakValueLimit;
  }

  // 脚踝波动过滤
  filterAnkle() {
    let leftAnkleSize = leftAnklePointsQueue.size;
    let rightAnkleSize = rightAnklePointsQueue.size;
    if (leftAnkleSize < peekAnkleLimitCount || rightAnkleSize < peekAnkleLimitCount) {
      return false
    }
    let maxValue = 0.0;
    let minValue = 99999.0;
    leftAnklePointsQueue.items.forEach((e) => {
      if (maxValue < e.y) {
        maxValue = e.y;
      }
      if (minValue > e.y) {
        minValue = e.y;
      }
    });
    rightAnklePointsQueue.items.forEach((e) => {
      if (maxValue < e.y) {
        maxValue = e.y;
      }
      if (minValue > e.y) {
        minValue = e.y;
      }
    });
    let peakValue = maxValue - minValue;
    return peakValue < peakAnkleValueLimit;
  }

  drawKeypoint(keypoint) {
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = params.STATE.modelConfig.scoreThreshold || 0;

    if (score >= scoreThreshold) {
      const circle = new Path2D();
      circle.arc(keypoint.x / videoToCanvasWidthScale, keypoint.y / videoToCanvasHeightScale, params.DEFAULT_RADIUS, 0, 2 * Math.PI);
      this.ctx.fill(circle);
    }
  }

  /**
   * Draw the skeleton of a body on the video.
   * @param keypoints A list of keypoints.
   */
  drawSkeleton(keypoints, poseId) {
    const color = "#ff8b22"
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = params.DEFAULT_LINE_WIDTH;

    for (const startIndex in MAPPINGS) {
      var mappingPointsIndexes = MAPPINGS[startIndex];
      for (const endIndex of mappingPointsIndexes) {
        const kp1 = keypoints[startIndex];
        const kp2 = keypoints[endIndex];
        this.ctx.beginPath();
        this.ctx.moveTo(kp1.x / videoToCanvasWidthScale, kp1.y / videoToCanvasHeightScale);
        this.ctx.lineTo(kp2.x / videoToCanvasWidthScale, kp2.y / videoToCanvasHeightScale);
        this.ctx.stroke();
      }
    }
  }

  drawFPS(fps) {
    const color = "#ff8b22"
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.font = "32px Georgia";
    if (!params.STATE.camera.isBackend) {
      this.ctx.scale(-1, 1)
      this.ctx.translate(-params.CANVAS_SIZE.width, 0);
      this.ctx.fillText(fps, 30, 30, 100);
      this.ctx.scale(-1, 1)
      this.ctx.translate(-params.CANVAS_SIZE.width, 0);
    } else {
      this.ctx.fillText(fps, 30, 30, 100);
    }
  }

  drawCount() {
    const color = "#ff8b22"
    this.ctx.fillStyle = color;
    this.ctx.strokeStyle = color;
    this.ctx.font = "32px Georgia";
    if (!params.STATE.camera.isBackend) {
      this.ctx.scale(-1, 1)
      this.ctx.translate(-params.CANVAS_SIZE.width, 0);
      this.ctx.fillText("个数: " + countingNumber, 300, 30, 100);
      this.ctx.scale(-1, 1)
      this.ctx.translate(-params.CANVAS_SIZE.width, 0);
    } else {
      this.ctx.fillText("个数: " + countingNumber, 300, 30, 100);
    }
  }
}
