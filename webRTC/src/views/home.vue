<template>
  <el-row class="container">
    <div class="task-item">
      <div class="task-item-child" v-for="item in taskList" :key="item.id">
        <el-button @click="changeToTarget(item)" class="task-item-child-button" :icon="item.icon" :style="item.style"
          circle></el-button>
        <div @click="changeToTarget(item)" style="display: flex;flex-direction: column;margin-left: 5px;cursor: pointer;">
          <label style="font-weight: bolder;width: 200px;text-align: left;cursor: pointer;">{{ item.title }}</label>
          <label style="font-weight: lighter;font-size: 12px;width: 200px;text-align: left;cursor: pointer;">{{
            item.description }}</label>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
export default {
  name: 'my-home',
  components: {

  },
  data() {
    return {
      taskList: [
        { id: 1, title: "虚拟背景", description: "虚拟背景例子", icon: "el-icon-video-camera", style: "background-image: linear-gradient(to top, #f920ff 0%, #00dbde 100%);", uriType: 'router', router: "/virtualbg" },
      ]


    }
  },
  created() {
  },
  methods: {
    changeToTarget(item) {
      if (item.router) {
        if (item.uriType === "url") {
          window.open(item.router, "_blank");
        } else if (item.uriType === "router") {
          this.$router.push(item.router)
        } else {
          this.msgError("非法路径")
        }
      } else {
        this.msgError("开发中")
      }
    },

  }
}
</script>

<style scoped>
.container {
  background-image: linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 99%;
  height: 98vh;
}

.task-item {
  display: flex;
  display: -webkit-flex;
  /* Safari */
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px;
  justify-content: flex-start;
}

.task-item-child {
  display: flex;
  /*实现垂直居中*/
  align-items: center;
  border: transparent;
  width: 25%;
  height: 100px;
}
</style>
