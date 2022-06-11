
/**
  * 转换时间格式
  * @param date 标准时间
  */
export function formatDateTime(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  var d = date.getDate();
  d = d < 10 ? "0" + d : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? "0" + minute : minute;
  return y + "-" + m + "-" + d;
}
/**
 * 转换时间
 * @param year 年
 * @param month 月
 * @param day 日
 */
export function format(year, month, day) {
  month++;
  month < 10 && (month = "0" + month);
  day < 10 && (day = "0" + day);
  return year + "-" + month + "-" + day;
}
/**
 * 转换时间格式
 * @param timestamp 时间戳
 */
export function timestampToTime(timestamp) {
  var date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  var s = ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  let strDate = Y + M + D + h + m;
  return strDate;
}