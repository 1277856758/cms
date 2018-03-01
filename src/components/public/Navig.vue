<template>
    <el-col :span="24" class="breadcrumb-container">
        <el-breadcrumb separator="/" class="breadcrumb-inner">
            <el-breadcrumb-item v-for="item in $route.matched" :to="{path:item.path}" >
                {{ item.name }}
            </el-breadcrumb-item>
        </el-breadcrumb>
    </el-col>
</template>
<style scoped>
      .breadcrumb-container{
          margin: 10px 0;
      }
</style>