<template>
  <div class="box">
    <div class="watch">
      <video
        ref="video"
        preload="auto"
        src
        playsinline="playsinline"
        webkit-playsinline
        x5-video-player-type="h5-page"
        :poster="poster"
        @waiting="waitVideo($event)"
        @canplaythrough="canVideo($event)"
        @play="playVideo($event)"
        @pause="pauseVideo($event)"
        @timeupdate="updateVideo($event)"
      ></video>
      <div class="floVideo" @click="showControl()"></div>
      <div class="loading" v-if="isLoading"></div>
      <!--视频控件 -->
      <div class="control" v-if="isControl">
        <div class="conPlay" @click="controlPlay()">
          <img
            :src="isPlay ? 'https://sucai.suoluomei.cn/sucai_zs/images/20200425174801-1.png': 'https://sucai.suoluomei.cn/sucai_zs/images/20200425174802-2.png' "
            alt
          />
        </div>
        <div class="conTime">{{ currentTime }} / {{ duration }}</div>
        <div class="conSlider">
          <van-slider
            v-model="schedule"
            :disabled="isDisabled"
            button-size="12px"
            active-color="#6CEFCB"
            @drag-start="startSlide()"
            @input="inputSlide()"
            @change="changeSlide()"
          />
        </div>
        <div class="conSpeed" @click="showMultiple()">{{ speed }}</div>
        <div class="conFull" @click="fullScreen()">
          <img src="https://sucai.suoluomei.cn/sucai_zs/images/20200427113903-3.png" alt />
        </div>
      </div>
      <!-- 倍数弹窗 -->
      <div class="multiple" v-if="isMultiple">
        <span
          v-for="(item, index) in multipleList"
          :key="index"
          :class="index == active ? 'choice' : ''"
          @click="getMultiple(item, index)"
        >{{ item.label }}</span>
      </div>
      <div class="velocity" v-if="!isControl">
        <div :style="{width: schedule +'%'}"></div>
      </div>
    </div>
    <div
      class="row"
      v-for="(item,index) in videoList"
      :key="index"
      @click="changeVideo(item)"
    >{{item}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoList: [
        "https://video.pearvideo.com/mp4/adshort/20200715/cont-1686015-15265461_adpkg-ad_hd.mp4",
        "https://video.pearvideo.com/mp4/adshort/20200715/cont-1685978-15265163_adpkg-ad_hd.mp4",
        "https://video.pearvideo.com/mp4/third/20200715/cont-1686001-10008579-110217-hd.mp4"
      ],
      isPlay: false,
      active: 3,
      isMultiple: false,
      isControl: true,
      isLoading: false,
      multipleList: [
        { label: "2.0x", value: 2.0 },
        { label: "1.5x", value: 1.5 },
        { label: "1.25x", value: 1.25 },
        { label: "1.0x", value: 1.0 },
        { label: "0.5x", value: 0.5 }
      ],
      speed: "1.0x",
      rawDuration: 0,
      rawCurrentTime: 0,
      duration: "00:00",
      currentTime: "00:00",
      poster: "",
      schedule: 0,
      setTimeout: "",
      flag: true,
      isDisabled: true
    };
  },
  mounted() {
    this.$refs.video.src = this.videoList[0];
  },

  methods: {
    // 秒转分、时
    changeTime(duration) {
      var time = parseInt(duration);
      var hour = 0;
      var minute = 0;
      var second = 0;
      if (time < 60) {
        second = parseInt(time);
      }
      if (time >= 60) {
        minute = parseInt(time / 60);
        second = parseInt(time % 60);
      }
      if (minute >= 60) {
        hour = parseInt(minute / 60);
        minute = parseInt(minute % 60);
      }
      hour = hour.toString().length == 1 ? "0" + hour : hour;
      minute = minute.toString().length == 1 ? "0" + minute : minute;
      second = second.toString().length == 1 ? "0" + second : second;
      var result = "";
      if (second < 60 && minute == 0) {
        result = minute + ":" + second;
      }
      if (minute < 60 && hour == 0) {
        result = minute + ":" + second;
      }
      if (hour > 0) {
        result = hour + ":" + minute + ":" + second;
      }
      return result;
    },

    // 点击视频控制显示
    showControl() {
      if (this.isControl) {
        this.isControl = false;
        clearTimeout(this.setTimeout);
      } else {
        this.isControl = true;
        this.setTimeout = setTimeout(() => {
          this.isControl = false;
        }, 3500);
      }
      this.isMultiple = false;
    },

    // 控制视频的播放暂停
    controlPlay() {
      if (this.$refs.video.paused) {
        this.$refs.video.play();
        this.isPlay = true;
      } else {
        this.$refs.video.pause();
        this.isPlay = false;
      }
    },

    // 显示倍数列表
    showMultiple() {
      this.isControl = false;
      this.isMultiple = true;
    },

    // 选择倍数
    getMultiple(item, index) {
      this.active = index;
      this.$refs.video.playbackRate = item.value;
      this.speed = item.label;
      this.isMultiple = false;
    },

    // 全屏
    fullScreen() {
      this.$refs.video.webkitRequestFullScreen();
    },

    // 视频等待播放
    waitVideo(e) {
      // 获取当前网速
      // var netwolk = navigator.connection.downlink;
      // console.log((netwolk * 1024) / 8);
      this.isLoading = true;
    },

    // 视频可以开始播放
    canVideo(e) {
      this.isLoading = false;
    },

    // 视频播放
    playVideo(e) {
      this.isPlay = true;
      this.isDisabled = false;
    },

    // 视频暂停
    pauseVideo(e) {
      this.isPlay = false;
    },

    // 视频进度发生变化
    updateVideo(e) {
      if (this.flag) {
        var duration = e.srcElement.duration;
        var currentTime = e.srcElement.currentTime;
        this.rawDuration = duration;
        this.rawCurrentTime = currentTime;
        this.duration = this.changeTime(duration);
        this.currentTime = this.changeTime(currentTime);
        this.schedule = (currentTime / duration) * 100;
      }
    },

    // 开始拖动进度条
    startSlide() {
      this.flag = false;
      clearTimeout(this.setTimeout);
    },

    // 监听进度条发生变化
    inputSlide() {
      var curren = (this.rawDuration * this.schedule) / 100;
      var currentTime = this.changeTime(curren);
      this.currentTime = currentTime;
    },

    // 拖动进度条
    changeSlide() {
      var curren = (this.rawDuration * this.schedule) / 100;
      this.$refs.video.currentTime = curren;
      this.flag = true;
    },

    // 切换视频源
    changeVideo(item) {
      this.$refs.video.src = item;
      this.$refs.video.play();
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  background: #ffffff;
  width: 100%;
  height: 100%;
}

.watch {
  position: relative;
  width: 100%;
  height: 420px;
}

video {
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
  height: 100%;
}

.floVideo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.loading {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border: 3px solid #6cefcb;
  border-top-color: transparent;
  border-radius: 50%;
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  from {
    -webkit-transform: rotate(0);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

.multiple {
  position: absolute;
  top: 0;
  right: 0;
  width: 150px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  animation: fadeIn 0.5s;
}

.multiple span {
  font-size: 24px;
  color: #fff;
}

@keyframes fadeIn {
  0% {
    transform: translate(100%, 0);
  }
  100% {
    transform: none;
  }
}

.control {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  padding: 0px 30px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #6cefcb;
  font-size: 24px;
  z-index: 10;
}

.conPlay {
  width: 50px;
  height: 50px;
}

.conSlider {
  width: 45%;
}

.velocity {
  position: absolute;
  width: 100%;
  height: 5px;
  border-radius: 2px;
  background: #fff;
}

.velocity div {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #6cefcb;
}

.customButton {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #fff;
}

.conFull {
  width: 35px;
}

.choice {
  color: #6cefcb !important;
}

.row {
  margin: 15px 0;
  word-break: break-all;
}
</style>
