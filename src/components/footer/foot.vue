<template>
  <div class="footer">
    <ul class="clear" v-if="member.certifiedType=='0'">
      <router-link to="/home" tag="li" class="footer_li" keep-alive>
        <section class="li_svg">
          <img v-if="$route.path.indexOf('home') !== -1" src="./image/home_light.png" alt="" />
          <img v-else src="./image/home.png" alt="" />
        </section>
        <section class="li_text" :class="$route.path.indexOf('home') !== -1 ? 'colortext' : 'color' ">首页</section>
      </router-link>
      <router-link to="/interest" tag="li" class="footer_li" keep-alive>
        <section class="li_svg">
          <img v-if="$route.path.indexOf('interest') !== -1" src="./image/interest_light.png" alt="" />
          <img v-else src="./image/interest.png" alt="" />
        </section>
        <section class="li_text" :class="$route.path.indexOf('interest') !== -1 ? 'colortext' : 'color' ">趣味
        </section>
      </router-link>
      <router-link to="/complete" tag="li" class="footer_li" keep-alive>
        <section class="li_svg">
          <img src="./image/complete.png" alt="" />
        </section>
        <section class="li_text" :class="$route.path.indexOf('complete') !== -1 ? 'colortext' : 'color' ">我来完成</section>
      </router-link>
      <router-link to="/training" tag="li" class="footer_li" keep-alive>
        <section class="li_svg">
          <img v-if="$route.path.indexOf('training') !== -1" src="./image/sport_light.png" alt="" />
          <img v-else src="./image/sport.png" alt="" />
        </section>
        <section class="li_text" :class="$route.path.indexOf('training') !== -1 ? 'colortext' : 'color' ">运动</section>
      </router-link>
      <router-link to="/my" tag="li" class="footer_li" keep-alive>
        <section class="li_svg">
          <img v-if="$route.path.indexOf('my') !== -1" src="./image/my_light.png" alt="" />
          <img v-else src="./image/my.png" alt="" />
        </section>
        <section class="li_text" :class="$route.path.indexOf('my') !== -1 ? 'colortext' : 'color' ">我的</section>
      </router-link>
    </ul>
    <ul class="clear" v-else-if="member.certifiedType=='1'">
      <router-link to="/home" tag="li" class="footer_li" keep-alive>
        <section class="li_svg">
          <img v-if="$route.path.indexOf('home') !== -1" src="./image/home_light.png" alt="" />
          <img v-else src="./image/home.png" alt="" />
        </section>
        <section class="li_text" :class="$route.path.indexOf('home') !== -1 ? 'colortext' : 'color' ">首页</section>
      </router-link>
      <router-link to="/check" tag="li" class="footer_li" keep-alive>
        <section class="li_svg">
          <img v-if="$route.path.indexOf('check') !== -1" src="./image/interest_light.png" alt="" />
          <img v-else src="./image/interest.png" alt="" />
        </section>
        <section class="li_text" :class="$route.path.indexOf('check') !== -1 ? 'colortext' : 'color' ">检查
        </section>
      </router-link>
      <router-link to="/publish" tag="li" class="footer_li" keep-alive>
        <section class="li_svg">
          <img src="./image/complete.png" alt="" />
        </section>
        <section class="li_text" :class="$route.path.indexOf('publish') !== -1 ? 'colortext' : 'color' ">发布</section>
      </router-link>
      <router-link to="/training" tag="li" class="footer_li" keep-alive>
        <section class="li_svg">
          <img v-if="$route.path.indexOf('training') !== -1" src="./image/sport_light.png" alt="" />
          <img v-else src="./image/sport.png" alt="" />
        </section>
        <section class="li_text" :class="$route.path.indexOf('training') !== -1 ? 'colortext' : 'color' ">运动</section>
      </router-link>
      <router-link to="/my" tag="li" class="footer_li" keep-alive>
        <section class="li_svg">
          <img v-if="$route.path.indexOf('my') !== -1" src="./image/my_light.png" alt="" />
          <img v-else src="./image/my.png" alt="" />
        </section>
        <section class="li_text" :class="$route.path.indexOf('my') !== -1 ? 'colortext' : 'color' ">我的</section>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { getStore } from '@/config/mUtil.js';
export default {
  data() {
    return {
      member: {}
    }
  },
  created() {
    this.member = JSON.parse(getStore('currentMember'));
  }
}
</script>
<style lang="scss" scoped>
@import "static/css/public.scss";
	.footer{
		position: fixed;
		bottom:0;
		@include widthHeight(100%, auto);
    background: url("./image/bg.png") center top / 100% auto no-repeat;
    padding-top: .603865rem;
		ul{
			@include widthHeight(100%, 1.690821rem);
			@include justify(space-around);
			box-sizing:border-box;
			.footer_li{
				float: left;
				@include widthHeight(20%, 1.690821rem);
				text-align:center;
				position: relative;
        background: #fff;
				.li_svg{
					@include leftcenter;
					top:.120773rem;
					@include widthHeight(.628019rem,.628019rem);
					img{
						@include widthHeight(100%,100%);
            object-fit: contain;
					}
				}
				.li_text{
					text-align:center;
					@include sizeColor(.241546rem, $black3);
					margin-top:.966184rem;
				}
				.color{
					color:$black3;
				}
				.colortext{
					color:$black1;
				}
			}
			.footer_li:nth-of-type(3){
				.li_svg{
					top: -0.241546rem;
					@include widthHeight(.917874rem, .917874rem);
				}
      }	
			
		}
	}
</style>