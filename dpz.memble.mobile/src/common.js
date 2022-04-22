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