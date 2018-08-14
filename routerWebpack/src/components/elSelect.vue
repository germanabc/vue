<template>
  <div class="hello">
     我是b组件
     <!-- <el-select v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select> -->
    <el-button>默认按钮</el-button> 
    <el-button type="primary">主要按钮</el-button> 
    <i class="el-icon-edit"></i>
  </div>

</template>

<script>
export default {
  name: "elSelect",
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: ""
    };
  },
  mounted() {
    console.log(1);
  }
};
</script>


<style scoped>
.hello{
  height: 100px;
}
</style>
