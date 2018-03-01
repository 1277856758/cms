<template>
    <el-row>
        <el-col :span="24" class="tabs-div">
            <el-tabs v-model="sysUser.activeName" @tab-click="handleClick">
                <el-tab-pane label="用户列表" name="userlist" >
                    <UserListVue ref="userlist" :sysUser="sysUser"></UserListVue>
                </el-tab-pane>
                <el-tab-pane label="用户添加" name="useradd" >
                    <UserAddVue ref="useradd" :sysUser="sysUser" :key="new Date().getTime()"></UserAddVue>
                </el-tab-pane>
                <el-tab-pane label="用户编辑" name="userupdate" :disabled="sysUser.updateSate" >
                    <UserAddVue ref="userupdate" :sysUser="sysUser" :key="new Date().getTime()"></UserAddVue>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>
<script>
    import UserListVue from "./UserList.vue"
    import UserAddVue from "./UserAdd.vue"
    export default {
        data() {
            return {
                sysUser: {
                    updateSate:true,
                    activeName: 'userlist',
                    userFrom: {
                        uuid:"",
                        userName: "",
                        realName: "",
                        email: "",
                        mobile: "",
                        password:"",
                        pass:"",
                        role:[]
                    },

                }
            };
        },
        created(){
            this.role.AuthorityAudit(this.$route.matched[1].meta.id,this.role.user);
            console.log(this.role.user)
        },
        mounted(){
            this.$refs["userlist"].selectUserAll();
        },
        methods: {
            handleClick(tab, event) {
           }
        },
        components: {
            UserListVue, UserAddVue
        },
        watch: {
            'sysUser.activeName': function (val, oldVal) {
                if (this.sysUser.activeName == "userlist") {
                    this.$refs["userlist"].search="";
                    this.$refs["userlist"].selectUserAll();
                }
                if (this.sysUser.activeName == "useradd") {
                    this.sysUser.userFrom={
                        userName: "",
                        realName: "",
                        email: "",
                        mobile: "",
                        password:"",
                        pass:"",
                        role:[]
                    }
                }
                if (this.sysUser.activeName == "userupdate") {

                }
            },
        }
    };
</script>