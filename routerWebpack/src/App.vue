<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <img @click="showb1" :src="img" alt="">
    <router-view/>
   
    <!-- <elSelect v-if="isdisplay"></elSelect> -->
    <!-- <elSelect ></elSelect>  -->
  </div>
</template>

<script>
import img from './assets/logo.png'
import elSelect from  './components/elSelect'
export default {
  name: 'App',
  components:{
    elSelect
  },
  data(){
    return{
      img,
      isdisplay: false
    }
  },
  methods:{
    showb1(){
      // this.isdisplay=false
      //在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
      // this.$nextTick(function () {
      //   // DOM 更新了
      //   this.isdisplay=true
      // })
     
    }
    
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  img{
    display: block;
    width: 200px;
    height: 20px;
  }
}
</style>
