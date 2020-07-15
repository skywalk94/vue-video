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
        @waiting="getWait($event)"
        @canplaythrough="getCan($event)"
        @play="getPlay($event)"
        @pause="getPause($event)"
        @timeupdate="getUpdate($event)"
        @ended="getEnd($event)"
      ></video>
      <div class="float" @click="globalControl()"></div>
      <div class="loading" v-if="showLoading"></div>
      <!--视频控件 -->
      <div class="control" v-if="controlShow">
        <div class="transmit" @click="controlPlay()">
          <img
            :src="play ? 'https://sucai.suoluomei.cn/sucai_zs/images/20200425174801-1.png': 'https://sucai.suoluomei.cn/sucai_zs/images/20200425174802-2.png' "
            alt
          />
        </div>
        <div class="time">{{ currentTime }} / {{ duration }}</div>
        <div class="slider">
          <div class="schedule" :style="{width: schedule +'%'}"></div>
        </div>
        <div class="speed" @click="controlSpeed()">{{ speed }}</div>
        <div class="full" @click="fullScreen()">
          <img src="https://sucai.suoluomei.cn/sucai_zs/images/20200427113903-3.png" alt />
        </div>
      </div>
      <!-- 倍数弹窗 -->
      <div class="multiple" v-if="multipleShow">
        <span
          v-for="(item, index) in multipleList"
          :key="index"
          :class="index == active ? 'choice' : ''"
          @click="getMultiple(item, index)"
        >{{ item.text }}</span>
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
      play: false,
      active: 3,
      multipleShow: false,
      controlShow: true,
      showLoading: false,
      multipleList: [
        { text: "2.0x", value: 2.0 },
        { text: "1.5x", value: 1.5 },
        { text: "1.25x", value: 1.25 },
        { text: "1.0x", value: 1.0 },
        { text: "0.5x", value: 0.5 }
      ],
      speed: "1.0x",
      playbackRate: 1,
      duration: "00:00",
      currentTime: "00:00",
      poster: "",
      schedule: 0,
      setTimeout: ""
    };
  },
  mounted() {
    this.$refs.video.src = this.videoList[0];
    this.$refs.video.play();
  },

  methods: {
    // 秒转分、时
    timeConversion(duration) {
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
    globalControl() {
      if (this.controlShow) {
        this.controlShow = false;
        clearTimeout(this.setTimeout);
      } else {
        this.controlShow = true;
        this.setTimeout = setTimeout(() => {
          this.controlShow = false;
        }, 3500);
      }

      this.multipleShow = false;
    },

    // 控制视频的播放暂停
    controlPlay() {
      if (this.$refs.video.paused) {
        this.$refs.video.play();
        this.play = true;
      } else {
        this.$refs.video.pause();
        this.play = false;
      }
    },

    // 显示倍数列表
    controlSpeed() {
      this.controlShow = false;
      this.multipleShow = true;
    },

    // 选择倍数
    getMultiple(item, index) {
      this.active = index;
      this.$refs.video.playbackRate = item.value;
      this.speed = item.text;
      this.multipleShow = false;
    },

    // 全屏
    fullScreen() {
      this.$refs.video.webkitRequestFullScreen();
    },

    // 视频等待播放
    getWait(e) {
      // 获取当前网速
      // var netwolk = navigator.connection.downlink;
      // console.log((netwolk * 1024) / 8);
      this.showLoading = true;
    },

    // 视频可以开始播放
    getCan(e) {
      this.showLoading = false;
    },

    // 视频播放
    getPlay(e) {
      this.play = true;
    },

    // 视频暂停
    getPause(e) {
      this.play = false;
    },

    // 视频进度发生变化
    getUpdate(e) {
      var duration = this.timeConversion(e.srcElement.duration);
      var currentTime = this.timeConversion(e.srcElement.currentTime);
      this.duration = duration;
      this.currentTime = currentTime;
      this.schedule = (e.srcElement.currentTime / e.srcElement.duration) * 100;
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

.float {
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
  animation: fadeInLeft 0.5s;
}

.multiple span {
  font-size: 24px;
  color: #fff;
}

@keyframes fadeInLeft {
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
  height: 100px;
  padding: 0px 20px;
  box-sizing: border-box;
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.7));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6cefcb;
  font-size: 24px;
  z-index: 10;
}

.transmit {
  width: 50px;
  height: 50px;
}

.transmit img {
  width: 100%;
  height: 100%;
}

.time {
  margin: 0 20px;
}

.slider {
  position: relative;
  width: 45%;
  height: 3px;
  border-radius: 5px;
  background: #fff;
}

.schedule {
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

.speed {
  margin: 0 20px;
}

.full {
  width: 35px;
}

.full img {
  width: 100%;
  height: 100%;
}

.choice {
  color: #6cefcb !important;
}

.row {
  margin: 15px 0;
  word-break: break-all;
}
</style>
