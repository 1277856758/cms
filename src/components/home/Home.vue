<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-row :gutter="20">
                <el-col :span="2">
                    <div class="grid-content bg-purple" style="width:70px;">
                        <svg class="icon-sm" aria-hidden="true" @click="isCollapse=!isCollapse">
                            <use xlink:href="#icon-caidan"></use>
                        </svg>
                    </div>
                </el-col>
                <el-col :span="20">
                    <div class="grid-content bg-purple">
                        权限管理系统
                    </div>
                </el-col>
                <el-col :span="2">
                    <div class="grid-content bg-purple">
                        <el-dropdown>
                        <span class="el-dropdown-link" style="color: white">
                          <span v-text="sysUser.userName"></span><i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><span @click="logout">退出</span></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-col>
            </el-row>
        </el-col>
        <el-col class="main" :span="24">
            <el-menu class="el-menu-vertical-demo" router theme="dark" style="height: 100%;" :collapse="isCollapse">
                <template v-for="(item,index) in menuList" v-if="item.parentId==null||item.parentId==''">
                    <el-submenu v-if="item.menuType==0" :index="item.menuUrl ">
                        <template slot="title">
                            <svg class="icon-sm" aria-hidden="true">
                                <use :xlink:href="item.menuIcon"></use>
                            </svg>
                            <span slot="title">{{item.menuName}}</span>
                        </template>
                        <el-menu-item v-for="child in menuList" :index="child.menuUrl "
                                      v-if="child.parentId==item.uuid && child.menuType==1">
                            <svg class="icon-sm" aria-hidden="true">
                                <use :xlink:href="child.menuIcon"></use>
                            </svg>
                            <span slot="title"> {{child.menuName}}</span>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item v-if="item.menuType==1" :index="item.menuUrl ">
                        <svg class="icon-sm" aria-hidden="true">
                            <use :xlink:href="item.menuIcon"></use>
                        </svg>
                        <span slot="title">{{item.menuName}}</span>
                    </el-menu-item>
                </template>
            </el-menu>
            <el-col  :span="24"    class="menu_right">
                <NavigVue></NavigVue>
                <router-view></router-view>
            </el-col>
        </el-col>
    </el-row>
</template>
<script>
    import {sessionRouters, filterRouters} from '../../router/router'
    import NavigVue from "../public/Navig.vue"
    export default {
        data: function () {
            return {
                isCollapse: false,
                sysUser: "",
                menuList: [],
            }
        },
        mounted(){
            this.selectUser();

        },
        methods: {
            selectMenuUser(){
                this.axios.post(this.api.menu.selectMenuUser)
                    .then((res) => {
                        //重新追加权限路由
                        for (var i = 0; i < this.$router.options.routes.length; i++) {
                            var item = this.$router.options.routes[i];
                            if (item.left) {
                                this.$router.options.routes[i].children = sessionRouters(res.data.menuList);
                                this.menuList = res.data.menuList;
                            }
                        }
                        //加载当前用户所有权限
                        for(var i = 0; i <res.data.menuList.length; i++){
                            var item =res.data.menuList[i];
                            if(item.perms!=""&&item.perms!=null){
                                this.role.permsList.push(item);
                            }
                        }
                        //重新追加权限路由
                        this.$router.addRoutes(this.$router.options.routes);
                    });
            },
            selectUser(){
                this.axios.post(this.api.user.selectUser)
                    .then((res) => {
                        this.sysUser = res.data.sysUser;
                        this.selectMenuUser();
                    })
            },
            logout(){
                this.axios.post(this.api.user.logOut)
                    .then((res) => {
                        this.$router.push({path: "/login"})
                    })
            }
        },
        components: {
            NavigVue
        }
    }
</script>
<style scoped>
    .bg-purple {
        width: 100%;
        text-align: center;

    }
    .menu_right{
        padding-right:20px;padding-left: 10px;float:right;overflow-y: auto;background: #ffffff;
    }
    .container {
        position: absolute;
        top: 0px;
        bottom: 0px;
        width: 100%;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 240px;
        min-height: 400px;
    }

    .container .header {
        height: 50px;
        line-height: 50px;
        background: rgb(55, 61, 65);
        color: #fff;
    }

    .icon-sm {
        width: 1.5em;
        height: 1.5em;
    }

    .main {
        display: flex;
        position: absolute;
        top: 50px;
        bottom: 0px;
        overflow: hidden;
    }
</style>
