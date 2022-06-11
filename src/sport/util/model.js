import * as tf from '@tensorflow/tfjs';

async function judgeModelCache() {
    let indexDbCachedModelFlag = false;
    return new Promise((resolve, reject) => {
        try {
            var request = indexedDB.open("tensorflowjs");
            request.onupgradeneeded = function (res) {
                console.log("onupgradeneeded", res)
                var db = res.target.result;
                var transaction = db.transaction('model_info_store');
            };
            request.onsuccess = function (res) {
                var db = res.target.result;
                var transaction = db.transaction('model_info_store');
                var objectStore = transaction.objectStore('model_info_store');
                var obj = objectStore.get(1);
                obj.onsuccess = (res) => {
                    console.log("缓存中存在模型，加载...");
                    indexDbCachedModelFlag = true;
                    resolve(indexDbCachedModelFlag);
                }
                obj.onerror = function (event) {
                    console.log("缓存中不存在模型，通过网络加载...");
                    reject(indexDbCachedModelFlag);
                };
                resolve(true);
            }
            request.onerror = function (err) {
                console.log("err", err)
                resolve(false);
            }
        } catch (e) {
            console.log("访问indexdb出错，缓存中不存在模型，通过网络加载...", e);
            reject(indexDbCachedModelFlag);
        }
    });
}
export async function loadMoveNet() {
    var graphModel = null;
    let indexDbCachedModelFlag = false;

    indexDbCachedModelFlag = await judgeModelCache();

    if (!indexDbCachedModelFlag) {
        console.log('从网络中加载模型...');
        graphModel = await tf.loadGraphModel('https://testfiles.cnaiks.com/0_AIKS_WEB_FILE/models/MoveNet/lightning/v4/model.json');
        console.log("graphModel", graphModel)
        var result = await graphModel.save('indexeddb://movenet-lightning-model');
        console.log("result", result);
    }

    return true;
}