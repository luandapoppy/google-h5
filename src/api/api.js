import { post } from '@/config/request.js'

// 通用获取验证码
export const sendCaptcha = h => post('captcha/sendCaptcha', h);
// 通用验证验证码
export const checkCaptcha = h => post('captcha/checkCaptcha', h);
//认证短信验证码发送接口
export const certifyIdentificationSendCaptcha = h => post('certification/certifyIdentificationSendCaptcha', h);

//获取应用启动必要数据接口
export const getAppInitData = h => post('appInit/getAppInitData', h);
//版本信息检查接口
export const checkAppVersion = h => post('version/checkAppVersion', h);
//获取用户当日剩余可加分匹配次数
export const getLeftMatchTimes = h => post('matchRecord/getLeftMatchTimes', h);
//查询所有成员未完成活动提示标识
export const getAllMemberUnfinishedTaskTip = h => post('sportTask/getAllMemberUnfinishedTaskTip', h);
//获取消息通知概况数据
export const getUserNotificationProfile = h => post('userNotification/getUserNotificationProfile', h);

// 登录
export const login = h => post('user/login', h);
// 登出
export const logout = h => post('user/logout', h);
// 注册
export const register = h => post('user/register', h);
// 注销
export const accountCancellation = h => post('user/accountCancellation', h);
// 设置密码
export const setPassword = h => post('user/setPassword', h);
// 重置密码发送验证码
export const resetPassCaptcha = h => post('user/resetPassCaptcha', h)
// 重置密码
export const resetPassword = h => post('user/resetPassword', h);
//修改手机号
export const changeUserPhoneNum = h => post('user/changeUserPhoneNum', h);


// 我的
//成员统计数据获取接口
export const getMemberStatisticsData = h => post('statistics/getMemberStatisticsData', h);
//成员运动种类统计数据获取接口
export const getMemberSportStatisticsData = h => post('statistics/getMemberSportStatisticsData', h);

//成员新增接口
export const addMember = h => post('member/addMember', h);
//成员更新接口
export const updateMember = h => post('member/updateMember', h);
//成员删除接口
export const batchDeleteMemberByIds = h => post('member/batchDeleteMemberByIds', h);
//成员管理列表
export const getMembers = h => post('member/getMembers', h);

//获取可以加入的学校列表
export const getExistSchoolList = h => post('school/getExistSchoolList', h);
//获取可以加入的班级列表
export const getSchoolExistClassList = h => post('school/getSchoolExistClassList', h);

//身份认证提交接口
export const addMemberCertInfo = h => post('certification/addMemberCertInfo', h);
//获取邀请页信息
export const getInviteInfo = h => post('certification/getInviteInfo', h);

// 运动须知和运动道具
export const getNoticeAndPropsBySportType = h => post('sport/getSportIntroductionInfo', h);

// 我来完成
//获取学生活动日历数据接口
export const getSportTaskCalendarData = h => post('sportTask/getSportTaskCalendarData', h);
//获取学生某天活动数据接口
export const getSportTaskList = h => post('sportTask/getSportTaskList', h);
// 获取本学期活动统计
export const getSportTaskStatisticData = h => post('sportTask/getSportTaskStatisticData', h);
// 学生作业列表获取接口
export const getStuSportTaskList = h => post('sportTask/getStuSportTaskList', h);
// 学生活动详情查询接口
export const getFinishedSportTaskDetail = h => post('sportTask/getFinishedSportTaskDetail', h);
//替换上次活动成绩
export const replaceSportTaskDetail = h => post('sportTask/replaceSportTaskDetail', h);
//学生活动成绩校对接口
export const validateMeasures = h => post('sportTask/validateMeasures', h);

// 运动
//组合运动保存设置接口
export const addCombinationSports = h => post('sport/addCombinationSports', h);