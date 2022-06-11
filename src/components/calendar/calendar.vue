<template>
  <div>
    <div class="calendar-box" style="height: 2.415459rem">
      <!-- 星期 -->
      <ul class="calendar-head">
        <li v-for="(item, index) in projectConfig.week_list" :key="index">
          <span class="today" v-if="istoday==item.value">今</span>
          <span v-else>{{item.text}}</span>
        </li>
      </ul>
      <!-- 日历 -->
      <calendarContent ref="calendarSwiper" :checkDate="currentDay" @on-change="changeIndex"
        @calendarHeight="calendarHeight">
        <div v-for="(month, index) in monthList" :key="index" class="month swiper-item">
          <ul v-for="(week, weekindex) in month" :key="weekindex">
            <li v-for="(day, dayindex) in week" :class="{ ischecked: checkedDay == day.date,istoday: day.istoday,}"
              @click.prevent.stop="chooseDay(day.year, day.month,day.day,day.othermonth,day.mode,day.thing)"
              :key="dayindex">
              <div class="week-day"
                :class="{ischecked: checkedDay == day.date,othermonth: day.othermonth,istoday: day.istoday,}">
                <span class="one-day">
                  <i class="day" :class="day.istoday?'today':''">{{ day.day }}</i>
                </span>
                <!-- 有事项标记 -->
                <div :class="'thing '+ computeStatus(things[day.date])">
                  <a></a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </calendarContent>
    </div>
  </div>
</template>
<script>
import { getStore, setStore } from '@/config/mUtil.js'
import { formatDateTime, format } from '@/config/date.js'
import calendarContent from "@/components/calendar/swiper-monthorweek.vue"
import projectConfig from "./js/config.js"
export default {
  components: {
    calendarContent,
  },
  data() {
    return {
      projectConfig: projectConfig,
      dispDate: new Date(),//当前时间 滑动之后每次选中时间
      today: new Date(),//当前时间
      currentDay: new Date(),//当前时间
      monthList: [],//月份
      checkedDay: "0000-00-00",//选中的时间
      canClick: true,
      calHeight: "", //日历外框高度，自适应要用到
      things: {},
      istoday: '', // 今天
      memberId: ''
    };
  },
  created() {
    console.log("calendar create");
    this.todayDate();
    this.memberId = JSON.parse(getStore('currentMember')).memberId || {};
    this.things = JSON.parse(getStore(this.memberId + '-getSportTaskCalendarData')) || {};
  },
  methods: {
    /**
     * 计算作业状态class
     * @param status 作业状态
     */
    computeStatus(status) {
      let result = '';
      switch (status) {
        case 1:
          result = 'finished';
          break;
        case 2:
          result = 'unstart';
          break;
        case 3:
          result = 'unfinished';
          break;
      }
      return result
    },
    /**
     * 日历高度
     * @param newVal 日历动态高度
     */
    calendarHeight(newVal) {
      this.calHeight = newVal;
    },
    /**
     * 获取今天日期
     */
    todayDate() {
      this.checkedDay = formatDateTime(this.today);
      this.$emit('chooseDay', this.checkedDay, true);
    },
    /**
     * 选中某一天
     * @param year 年
     * @param month 月
     * @param day 日
     * @param othermonth 其他月份，当前月前面空值
     * @param mode 类型，'month','week'
     * @param thing 事项
     */
    chooseDay(year, month, day, othermonth, mode, thing) {
      // 为了PC端点击事件和移动冲突
      if (!this.canClick) return;
      this.currentDay = new Date(year, month, day);//标准时间
      this.checkedDay = format(year, month, day);//"2020-11-11"
      const today = formatDateTime(new Date());
      this.$emit('chooseDay', this.checkedDay, today == this.checkedDay);
      this.dispDate = this.currentDay;
    },
    /**
     * 获取星期
     * @param year 为选中当天的年
     * @param month 为选中当天的月
     * @param day 为选中当天的日
     */
    getWeek(year, month, day) {
      var dt = new Date(year, month, day);
      var weekArr = [];
      var dtFirst = new Date(year, month, day - ((dt.getDay() + 6) % 7));
      var week = [];
      //循环选中当天所在那一周的每一天
      for (var j = 0; j < 7; j++) {
        var newdt = new Date(
          dtFirst.getFullYear(),
          dtFirst.getMonth(),
          dtFirst.getDate() + j
        );
        var years = newdt.getFullYear();
        var months = newdt.getMonth();
        var days = newdt.getDate();
        week.push({
          mode: "week",
          day: days,
          year: years,
          month: months,
          date: format(years, months, days),
          //日历要显示的其他内容
          // thing: this.ifOrder(years, months, days),
          istoday:
            this.today.getFullYear() == years &&
              this.today.getMonth() == months &&
              this.today.getDate() == days
              ? true
              : false,
          ischecked: false,
          othermonth: months != month,
        });
      }
      weekArr.push(week);
      return weekArr;
    },
    /**
     * 获取三周
     */
    get3week() {
      var year = this.dispDate.getFullYear();
      var month = this.dispDate.getMonth();
      var day = this.dispDate.getDate();
      this.monthList = [];
      this.monthList.push(this.getWeek(year, month, day - 7));
      this.monthList.push(this.getWeek(year, month, day));
      this.monthList.push(this.getWeek(year, month, day + 7));

      this.getThings();

      const today = formatDateTime(new Date());
      // 判断是否包含今天 显示 今 字
      const temp = this.monthList[1][0].find(item => item.date == today);
      if (temp) {
        this.istoday = new Date().getDay().toString();
      } else {
        this.istoday = '0'
      }
    },
    /**
     * 左右移动
     * @param index 月的index
     * @param isWeek 是否显示周
     * @param isClick 移动不可点击
     */
    changeIndex(index, isWeek, isClick = false) {
      if (index) {
        if (isWeek) {
          this.dispDate = new Date(
            this.dispDate.getFullYear(),
            this.dispDate.getMonth(),
            this.dispDate.getDate() + 7 * index
          );
          this.currentDay = this.dispDate;
          this.get3week();
        } else {
          var tmpDt = new Date(
            this.dispDate.getFullYear(),
            this.dispDate.getMonth() + index,
            0
          );
          var maxday = tmpDt.getDate();
          var days = maxday < this.dispDate.getDate() ? maxday : this.dispDate.getDate();
          this.dispDate = new Date(
            this.dispDate.getFullYear(),
            this.dispDate.getMonth() + index,
            days
          );
          if (!isClick) {
            this.checkedDay = format(
              this.dispDate.getFullYear(),
              this.dispDate.getMonth(),
              this.dispDate.getDate()
            );
          }
          this.get3month();
        }
        this.$refs.calendarSwiper.moveChange();
      }
    },
    /**
     * 获取日历作业完成状态
     * 若有缓存 则读取缓存
     */
    getThings() {
      const flatList = this.monthList.flat(Infinity);
      let things = this.things;
      if (things[flatList[7].date] || things[flatList[7].date] == '') {
        return
      } else {
        this.$api.getSportTaskCalendarData({ startDate: flatList[7].date, endDate: flatList[13].date }).then(res => {
          const data = res.data.calendarData;
          for (let i = 7; i < 14; i++) {
            const date = flatList[i].date;
            const findobj = data.find(item => item.date == date);
            let s;
            s = findobj ? findobj.status : '';
            this.$set(this.things, date, s);
          }
          setStore(this.memberId + 'getSportTaskCalendarData', this.things)
        })
      }
    },
  },
};
</script>
<style scoped>
@import "/static/css/calendar/common.css";
</style>
