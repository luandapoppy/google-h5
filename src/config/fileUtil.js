import Compressor from "compressorjs";
import { post } from "./request.js";
import { fileUrl } from "./env.js";

/**
 * 
 * @param {*} image  图片
 * @param {*} quality 图片压缩比 0-1 数字越小 图片压缩越小
 * @returns 
 */
export const compressorImage = (image, quality) => {
  return new Promise((resolve, reject) => {
    new Compressor(image, {
      quality: quality || 0.8,
      success(result) {
        let file = new File([result], image.name, { type: image.type });
        resolve(file)
      },
      error(err) {
        reject(err)
      }
    })
  })
}

export const uploadFile = (file) => {
  return new Promise((resolve) => {
    let bucket = "";
    switch (process.env.NODE_ENV) {
      case "production":
        bucket = "cnaiks-prod-region-hz";
        break;
      case "test":
        bucket = "cnaiks-test-region-hz";
        break;
      default:
        bucket = "cnaiks-test-region-hz";
        break;
    }
    post("oss/getSecurityToken", { platform: "Web" }).then(
      (res) => {
        var OSS = require("ali-oss");
        var client = new OSS({
          accessKeyId: res.data.AccessKeyId,
          accessKeySecret: res.data.AccessKeySecret,
          stsToken: res.data.SecurityToken,
          bucket: bucket,
          region: "oss-cn-hangzhou",
        });

        let fileName = file.name;
        let suffixs = fileName.split(".");

        //取最后的为文件后缀
        let suffix = suffixs[suffixs.length - 1];
        let fileUrl = "user/images/web/";
        if (suffix == "mp4") {
          fileUrl = "user/videos/web/";
        }
        let newFileName = fileUrl + getTimeId(8, 16) + "." + suffix;
        let result = client.multipartUpload(newFileName, file);
        resolve(result);
      }
    );
  });
};

function getTimeId(len, radix) {
  const time = new Date().getTime();
  const uuid = getuuid(len, radix);
  return `${time}${uuid}`;
}

function getuuid(len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var uuid = [];
  var i = 0;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
}


export const getCompleteFileName = (fileName) => {
  if (
    !fileName ||
    fileName.startsWith("http") ||
    fileName.startsWith("/basicservice") ||
    fileName.startsWith("/static/img")
  ) {
    return fileName;
  } else {
    return fileUrl + fileName;
  }
}