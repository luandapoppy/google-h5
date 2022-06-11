//获取图片地址
let fileUrl;
let baseUrl;
if (process.env.NODE_ENV == 'development') {
  if (process.env.domain !== 'local') {
    baseUrl = 'http://192.168.0.13'
  }
  fileUrl = "https://testfiles.cnaiks.com/";
} else if (process.env.NODE_ENV == 'test') {
  fileUrl = "https://testfiles.cnaiks.com/";
  baseUrl = 'https://test.cnaiks.com'
} else {
  fileUrl = "https://files.cnaiks.com/";
  baseUrl = 'https://www.cnaiks.com'
}

// 应用版本号
const versionNo = 'v1.0.0'

export {
  baseUrl,
  fileUrl,
  versionNo
}
