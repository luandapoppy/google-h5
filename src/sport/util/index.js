/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import '@tensorflow/tfjs-backend-webgl';
import * as posedetection from '@tensorflow-models/pose-detection';

import { Camera } from './camera';
import { setupDatGui } from './option_panel';
import { STATE } from './params';
import { setupStats } from './stats_panel';
import { setBackendAndEnvFlags } from './util';
import { loadMoveNet } from './model';

let detector, camera, stats;
let startInferenceTime, numInferences = 0;
let inferenceTimeSum = 0, lastPanelUpdate = 0;
let fps = 0;
let rafId;

async function createDetector() {
  let modelType;
  if (STATE.modelConfig.type == 'lightning') {
    modelType = posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
  } else if (STATE.modelConfig.type == 'thunder') {
    modelType = posedetection.movenet.modelType.SINGLEPOSE_THUNDER;
  } else if (STATE.modelConfig.type == 'multipose') {
    modelType = posedetection.movenet.modelType.MULTIPOSE_LIGHTNING;
  }
  const modelConfig = { modelType };

  if (STATE.modelConfig.customModel !== '') {
    modelConfig.modelUrl = STATE.modelConfig.customModel;
  }
  if (STATE.modelConfig.type === 'multipose') {
    modelConfig.enableTracking = STATE.modelConfig.enableTracking;
  }
  // 此处需要加“模型资源加载中”进度条
  // 不支持indexedDB的需要从网络加载模型，或直接提示无法加载（可能浏览器或机型太老）
  let getModelFlag = await loadMoveNet();
  let model = await posedetection.createDetector(STATE.model, modelConfig);
  console.log("model", model)
  return model;
}

async function checkGuiUpdate() {
  if (STATE.isTargetFPSChanged) {
    camera = await Camera.setupCamera(STATE.camera);
    STATE.isTargetFPSChanged = false;
  }

  if (STATE.isModelChanged || STATE.isFlagChanged || STATE.isBackendChanged) {
    STATE.isModelChanged = true;

    window.cancelAnimationFrame(rafId);

    if (detector != null) {
      detector.dispose();
    }

    if (STATE.isFlagChanged || STATE.isBackendChanged) {
      await setBackendAndEnvFlags(STATE.flags, STATE.backend);
    }

    try {
      detector = await createDetector(STATE.model);
    } catch (error) {
      detector = null;
      console.log(error);
    }

    STATE.isFlagChanged = false;
    STATE.isBackendChanged = false;
    STATE.isModelChanged = false;
  }
}

function beginEstimatePosesStats() {
  startInferenceTime = (performance || Date).now();
}

function endEstimatePosesStats() {
  const endInferenceTime = (performance || Date).now();
  inferenceTimeSum += endInferenceTime - startInferenceTime;
  ++numInferences;

  const panelUpdateMilliseconds = 1000;
  if (endInferenceTime - lastPanelUpdate >= panelUpdateMilliseconds) {
    const averageInferenceTime = inferenceTimeSum / numInferences;
    inferenceTimeSum = 0;
    numInferences = 0;
    stats.customFpsPanel.update(
      1000.0 / averageInferenceTime, 120 /* maxValue */);
    fps = parseInt(1000.0 / averageInferenceTime);
    lastPanelUpdate = endInferenceTime;
  }
}

async function renderResult() {
  if (camera.video.readyState < 2) {
    await new Promise((resolve) => {
      camera.video.onloadeddata = () => {
        resolve(video);
      };
    });
  }

  let poses = null;

  // Detector can be null if initialization failed (for example when loading
  // from a URL that does not exist).
  if (detector != null) {
    // FPS only counts the time it takes to finish estimatePoses.
    beginEstimatePosesStats();

    // Detectors can throw errors, for example when using custom URLs that
    // contain a model that doesn't provide the expected output.
    try {
      poses = await detector.estimatePoses(
        camera.video,
        { maxPoses: STATE.modelConfig.maxPoses, flipHorizontal: false });
    } catch (error) {
      detector.dispose();
      detector = null;
      console.log(error);
    }
    camera.drawCtx();
    if (poses && poses.length > 0) {
      camera.drawResults(poses);
    }
    endEstimatePosesStats();
    // 画FPS值
    camera.drawFPS("FPS: " + fps);
    // 画运动成绩
    camera.drawCount();
  }
}

async function renderPrediction() {
  await checkGuiUpdate();
  if (!STATE.isModelChanged) {
    await renderResult();
  }
  rafId = requestAnimationFrame(renderPrediction);
};

async function app() {

  await setupDatGui();

  stats = setupStats();

  camera = await Camera.setupCamera(STATE.camera);

  await setBackendAndEnvFlags(STATE.flags, STATE.backend);

  detector = await createDetector();

  renderPrediction();
};

app();
