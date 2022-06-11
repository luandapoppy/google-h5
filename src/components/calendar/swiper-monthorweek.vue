<template>
  <div class="calendar-body">
    <transition name="fade">
      <!-- @click.prevent阻止默认行为  @click.stop阻止js事件冒泡 -->
      <div class="calendar-boxs" ref="calendar" style="height: 1.449275rem" @touchstart.stop="moveStart"
        @touchend.stop="moveEnd" @touchmove.prevent.stop="move">
        <div class="calendar-s-box" :class="{transition:transition}"
          :style="{transform: 'translate3d('+calendarMove.x+'px,'+calendarMove.y+'px,0px)'}">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: ['checkDate'],
  data() {
    return {
      transition: true,//是否显示动画
      calendarHeight: -100, //日历的高度
      calendarMove: { x: 0, y: 0 },
      moveStartX: 0, //开始移动的位置x轴
      moveStartY: 0, //开始移动的位置y轴
      moveMode: 1,  //移动方式,1左右移动,2上下移动
      canChangeMode: false, //是否可以改变移动方式
      moveStartCalendarHeight: 0,  //开始移动的高度初始值
      canMove: false, //是否触发move事件
      itemWidth: 0,  //窗口的宽度
      moveIndex: 0, // 左右移动 1 向右移动-1向左移动
      lineNum: 0, //  选中或今天是第几行的周
      isWeek: true, //是否是周历模式
    }
  },
  created() {
    //初始化日历宽度和lineNum
    this.itemWidth = window.innerWidth
    this.lineNum = this.calcLineNum(this.checkDate)
  },
  watch: {
    /**
     *监听当天
     *@param  val 当前天 
     */
    checkDate(val) {
      if (val) {
        this.lineNum = this.calcLineNum(val)
      }
    },
    /**
     *监听日历高度
     *@param  newVal height 
     */
    calendarHeight(newVal) {
      this.$emit('calendarHeight', newVal);
    }
  },
  mounted() {
    console.log("swiper create");
    //初始化为周历
    this.moveInit(false);
  },
  methods: {
    /**
     * PC端为了鼠标移出日历后不能触发mouseup事件而触发的事件
     * @param e event
     */
    moveEndPcOne(e) {
      if (this.canMove) {
        this.moveEndPc(e)
      }
    },
    /**
     * pc端开始移动
     * @param e event
     */
    moveStartPc(e) {
      if (!ISPC) return
      this.moveStart(e)
    },
    /**
     * pc端移动
     * @param e event
     */
    movePc(e) {
      if (!ISPC) return
      this.move(e)
    },
    /**
     * pc端结束移动
     * @param e event
     */
    moveEndPc(e) {
      if (!ISPC) return
      this.moveEnd(e)
    },
    /**
     * 手机端端开始移动
     * @param e event
     */
    moveStart(e) {
      var touch;
      if (e.changedTouches) {
        touch = e.changedTouches[0];
      } else {
        touch = e
      }
      this.moveStartX = touch.clientX
      this.moveStartY = touch.clientY
      // this.moveStartCalendarHeight = this.calendarHeight
      this.canMove = true
      // this.moveMode = 0
      this.$parent.canClick = true
    },
    /**
     * 切换月或周
     * @param e event
     */
    toggleMove(e) {
      if (this.calendarHeight == 100) {
        this.calendarHeight = 200;
        this.moveInit(true)
        setTimeout(() => {
          this.$parent.get3month()
        }, 500)
      } else {
        this.calendarHeight = 100;
        this.moveInit(false)
      }
    },
    /**
     * 手机端端移动
     * @param e event
     */
    move(e) {
      // e.stopPropagation();// 阻止js事件冒泡,引发pull refresh事件, 等同于@click.stop
      if (!this.canMove) return
      var touch;
      if (e.changedTouches) {
        touch = e.changedTouches[0];
      } else {
        touch = e
      }

      this.$parent.canClick = false;
      // if (this.canChangeMode) {
      //   if (Math.abs(touch.clientX - this.moveStartX) > Math.abs(touch.clientY - this.moveStartY)) {
      //     this.moveMode = 1
      //   } else {
      //     this.moveMode = 2
      //   }
      //   this.canChangeMode = false
      // }
      // 左右移动
      if (this.moveMode == 1) {
        this.calendarMove.x = touch.clientX - this.moveStartX
      }
      // 上下移动
      // if (this.moveMode == 2) {
      //   if (this.calendarHeight == 100) {
      //     this.$parent.get3month()
      //   }
      //   let moveWidth = '';
      //   // touch.clientY 日历动态高度
      //   // this.moveStartY 点击位置高度坐标
      //   moveWidth = Math.abs(touch.clientY - this.moveStartY);
      //   if (touch.clientY > this.moveStartY && this.moveStartY < 200) {
      //     if (touch.clientY > 298) {
      //       return
      //     }
      //     this.calendarHeight = this.moveStartCalendarHeight + moveWidth
      //     this.calendarMove.y = -((this.lineNum * 40 > moveWidth) ? this.lineNum * 40 - moveWidth : 0)
      //   } else if (touch.clientY < this.moveStartY && this.moveStartY > 200) {
      //     if (touch.clientY < 100) {
      //       return
      //     }
      //     this.calendarHeight = this.moveStartCalendarHeight - moveWidth
      //     this.calendarMove.y = -moveWidth
      //   }
      // }
    },
    /**
     * 手机端端结束移动
     * @param e event
     */
    moveEnd(e) {
      this.canMove = false
      if (this.moveMode == 0) return
      var touch;
      if (e.changedTouches) {
        touch = e.changedTouches[0];
      } else {
        touch = e
      }
      // this.canChangeMode = true
      this.canChangeMode = false;
      if (this.moveMode == 1) {
        if (this.moveStartX < touch.clientX) {
          // 移动距离超过250才会切换
          if (this.moveStartX - touch.clientX < -200) {
            this.calendarMove.x = this.itemWidth // x移动窗口宽度
            this.moveIndex = -1
          } else {
            this.calendarMove.x = 0;
            this.moveIndex = 0;
          }
        } else {
          if (this.moveStartX - touch.clientX > 200) {
            this.calendarMove.x = -this.itemWidth
            this.moveIndex = 1
          } else {
            this.calendarMove.x = 0;
            this.moveIndex = 0;
          }
        }
      }
      if (this.moveMode == 2) {
        if (this.moveStartY - touch.clientY < 0) {
          if (this.moveStartY - touch.clientY < -50) {
            this.moveInit(true)
            this.$parent.get3month()
          } else {
            this.moveInit(false)
          }
        } else {
          if (this.moveStartY - touch.clientY > 50) {
            this.moveInit(false)
          } else {
            this.moveInit(true)
            this.$parent.get3month()
          }
        }
      }
      this.transition = true;
      setTimeout(() => {
        this.transition = false
        if (this.moveMode == 1) {
          this.$emit('on-change', this.moveIndex, this.isWeek)
        }
      }, 500)
    },
    /**
     * 左右切换
     * @param index 当前月索引值
     */
    moveChange(index) {
      this.transition = false
      this.calendarMove.x = 0
    },
    /**
     * 初始化
     * @param mode 类型 月或周
     */
    moveInit(mode) {
      this.isWeek = !mode
      if (mode) {
        // 月
        var self = this
        self.calendarHeight = -100
        this.calendarMove.y = 0
        //日历高度设置为最大高度
        setTimeout(function() {
          self.calendarHeight = self.$refs.calendar.offsetHeight
        }, 300);
      } else {
        // mode: 周
        // 恢复高度
        this.calendarHeight = 100
        this.calendarMove.y = -(100 * this.lineNum)
        setTimeout(() => {
          this.$parent.get3week();
        }, 150)
        this.calendarMove.y = 0
      }
    },
    /**
     * 计算今天在第几行
     * @param day 当天
     */
    calcLineNum(day) {
      var year = day.getFullYear()
      var month = day.getMonth()
      var dt_first = new Date(year, month, 1)   //每个月第一天
      var space = (dt_first.getDay() - 1 + 7) % 7   //月历前面空格
      return parseInt((space + day.getDate() - 1) / 7)
    }
  }
}
</script>
<style scoped>
@import "/static/css/calendar/common.css";
</style>

