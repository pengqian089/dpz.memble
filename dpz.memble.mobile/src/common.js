import {Notify} from "vant";

/**
 * 抽象fetch响应的处理方式
 * @param {Response} response 响应
 * @param {function} callback 失败回调函数
 * */
export async function handleResponse(response, callback = null) {
    try {
        if (response.ok) {
            let result = await response.json();
            if (result.success) {
                return Promise.resolve(result.data);
            } else {
                warning(result.msg);
                callbackFail(callback);
                return Promise.reject(result.msg);
            }
        } else {
            warning(response.statusText);
            callbackFail(callback);
            return Promise.reject(response.statusText);
        }
    } catch (e) {
        warning(e.toString())
        callbackFail(callback);
        return Promise.reject(e.toString());
    }
}

function callbackFail(fail) {
    if (typeof (fail) === "function") {
        fail();
    }
}

/**
 * 警告通知
 * @param {string} message 警告消息
 * */
export function warning(message) {
    Notify({type: "warning", message});
}

/**
 * 成功通知
 * @param {string} message 成功消息
 * */
export function success(message) {
    Notify({type: "success", message});
}

/**
 * 上传图像的fetch处理
 * @param {Response} response 响应
 * @param {function} callback 失败回调函数
 * */
export async function handleUploadResponse(response, callback = null) {
    try {
        if (response.ok) {
            let result = await response.json();
            if (result.success === 1) {
                return Promise.resolve(result.url);
            } else {
                warning(result.message);
                callbackFail(callback);
                return Promise.reject(result.msg);
            }
        } else {
            warning(response.statusText);
            callbackFail(callback);
            return Promise.reject(response.statusText);
        }
    } catch (e) {
        warning(e.toString())
        callbackFail(callback);
        return Promise.reject(e.toString());
    }
}

let audioChunks = [],
    mediaRecorder = null,
    audio = null;

export const record = {
    /**
     * 播放录音音频
     * @param {function} playAction 播放录音音频后回调函数
     * @param {function} endAction 播放录音音频完毕后回调函数
     * */
    async playAudio(playAction = null, endAction = null) {
        if (audioChunks.length === 0) return;
        if(audio === null) {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            audio = new Audio(audioUrl);
            audio.addEventListener("play", function () {
                if (typeof (playAction) === "function") {
                    playAction();
                }
            });
            audio.addEventListener("ended", function () {
                if (typeof (endAction) === "function") {
                    endAction();
                }
            });
        }
        await audio.play();
    },
    /**
     * 暂停录音音频
     * @param {function} pauseAction 暂停播放音频回调函数
     * */
    async pauseAudio(pauseAction = null){
        if(audio === null){
            return;
        }
        await audio.pause();
        if (typeof (pauseAction) === "function") {
            pauseAction();
        }
    },
    /**
     * 开始录音
     * @param {function} startAction 开始录音回调函数
     * */
    async startRecord(startAction = null) {
        try {
            let stream = await navigator.mediaDevices.getUserMedia({audio: true});
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });
            mediaRecorder.addEventListener("stop",() =>{
                stream.getTracks().forEach(track => {
                    console.log(track);
                    track.stop();
                });
            });
            mediaRecorder.start();
            if (typeof (startAction) === "function") {
                startAction();
            }
        } catch (e) {
            warning("已拒绝授权麦克风权限，无法使用录音");
        }
    },
    /**
     * 结束录音
     * @param {function} endAction 结束录音回调函数
     * */
    endRecord(endAction = null) {
        if (mediaRecorder === null) return;
        mediaRecorder.stop();
        if (typeof (endAction) === "function") {
            endAction();
        }
    },
    /**
     * 清除录音
     * @param {function} clearAction 清除录音回调函数
     * */
    clearAudio(clearAction = null) {
        audioChunks = [];
        audio = null;
        if (typeof (clearAction) === "function") {
            clearAction();
        }
    },
    /**
     * 上传录音
     * @param {function} uploadComplete 录音上传完成回调函数
     * @return {Promise.<string>} 音频地址
     * */
    async uploadAudio(uploadComplete = null) {
        if (audioChunks.length === 0) return Promise.reject("没有获取到音频");
        try {
            const audioBlob = new Blob(audioChunks);
            let form = new FormData();
            form.append("record", audioBlob, `${new Date().getTime()}.wav`);
            let response = await fetch("/Audio/Upload", {
                method: "post",
                body: form
            });

            let result = await handleResponse(response);
            if (typeof (uploadComplete) === "function") {
                uploadComplete();
            }
            return Promise.resolve(result);
        }catch (e){
            return Promise.reject(e.toString());
        }
    },
    saveAs(){
        if (audioChunks.length === 0) return Promise.reject("没有获取到音频");
        const audioBlob = new Blob(audioChunks);
        let url  = URL.createObjectURL(audioBlob);
        window.open(url);
    }
};