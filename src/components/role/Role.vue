<template>
    <el-row>
        <el-col :span="24" class="tabs-div">
            <el-tabs v-model="sysRole.activeName" >
                <el-tab-pane label="角色列表" name="rolelist" >
                    <RoleListVue ref="rolelist" :sysRole="sysRole" ></RoleListVue>
                </el-tab-pane>
                <el-tab-pane label="角色添加" name="roleadd" v-if="role.role.add">
                    <RoleAddVue :sysRole="sysRole" :key="new Date().getTime()"></RoleAddVue>
                </el-tab-pane>
                <el-tab-pane label="角色编辑" name="roleupdate" :disabled="sysRole.updateSate" v-if="role.role.update">
                    <RoleAddVue  ref="roleupdate" :sysRole="sysRole"></RoleAddVue>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>
<script>
    import RoleListVue from "./RoleList.vue"
    import RoleAddVue from "./RoleAdd.vue"
    export default {
        data() {
            return {
                sysRole:{
                    activeName:"rolelist",
                    checkStrictly:true,
                    updateSate:true,
                    menuList:[],
                    roleFrom:{
                        uuid:"",
                        roleName:"",
                        roleCode:"",
                        roleRemark:"",
                        roleMenuList:[],
                    }
                }
            }
        },
        created(){
            this.role.AuthorityAudit(this.$route.matched[1].meta.id,this.role.role);
        },
        mounted(){
            this.$refs["rolelist"].selectRoleAll();
            this.selectAllMenu();

        },
        methods: {
            selectAllMenu(){
                this.axios.post(this.api.menu.selectAllMenuTree)
                    .then((res) => {
                        this.sysRole.menuList = res.data.sysMenuList;
                })
            },
        },
        components: {
            RoleListVue,RoleAddVue
        },
        watch: {
            'sysRole.activeName': function (val, oldVal){
                 if(this.sysRole.activeName=="roleadd")
                     this.sysRole.roleFrom={
                             uuid:"",
                             roleName:"",
                             roleCode:"",
                             roleRemark:"",
                             roleMenuList:[],
                 }
                if(this.sysRole.activeName=="roleupdate"){
                    this.$refs["roleupdate"].defaultChecks();
                }
                if(this.sysRole.activeName=="rolelist"){
                    this.$refs["rolelist"].selectRoleAll();
                }
            }
        }
    }

</script>