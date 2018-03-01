<template>
    <el-row  >
        <el-col :span="12">
            <el-form :model="sysRole.roleFrom" :rules="rules" ref="sysRole.roleFrom" label-width="100px" class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="sysRole.roleFrom.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色标识" prop="roleCode">
                    <el-input v-model="sysRole.roleFrom.roleCode"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleRemark">
                    <el-input v-model="sysRole.roleFrom.roleRemark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save('sysRole.roleFrom')" v-if="sysRole.activeName=='roleadd'">添加</el-button>
                    <el-button type="primary" @click="save('sysRole.roleFrom')" v-else>更新</el-button>
                    <el-button @click="resetForm('sysRole.roleFrom')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="12">
            <el-tree :data="sysRole.menuList" :check-strictly="sysRole.checkStrictly" ref="tree" :default-expand-all="sysRole.checkStrictly" show-checkbox  node-key="id"></el-tree>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        props: ["sysRole"],
        data() {
            var checkName = (rule, value, callback) => {
                if (value) {
                    var str = /^[A-Za-z]*$/;
                    if (!str.test(value)) {
                        return callback(new Error(rule.msg));
                    }
                    callback();
                } else {
                    callback(new Error(rule.msg));
                }
            };
            return {
                rules:{
                        roleRemark: [
                            {required: true, message: '请输入描述', trigger: 'blur'},
                        ],
                        roleName: [
                            {required: true, message: '请输入角色名称', trigger: 'blur'},
                        ],
                        roleCode: [
                            {required: true, message: '请输入角色标识', trigger: 'blur'},
                            {validator: checkName, msg: '名称以英文命名,不包含特殊字符!', trigger: 'blur'}
                        ],
                }
            }
        },
        mounted(){
        },
        methods: {
            defaultChecks(){
                if(this.sysRole.activeName=="roleupdate"){
                    if(this.sysRole.roleFrom.roleMenuList!=null){
                        var item=[];
                        for(var i=0;i< this.sysRole.roleFrom.roleMenuList.length;i++){
                            item.unshift(this.sysRole.roleFrom.roleMenuList[i].uuid);
                        }
                        this.$refs.tree.setCheckedKeys(item,true);
                    }
                }
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var param={
                            roleName:this.sysRole.roleFrom.roleName,
                            roleCode:this.sysRole.roleFrom.roleCode,
                            roleRemark:this.sysRole.roleFrom.roleRemark,
                            menuList:this.$refs.tree.getCheckedKeys()
                        };
                       if(this.sysRole.roleFrom.uuid!=""){
                           param.uuid=this.sysRole.roleFrom.uuid;
                           console.log(param);
                           this.axios.post(this.api.role.upadte, param)
                               .then((res) => {
                                   this.sysRole.activeName = "rolelist";
                               })

                       }else{
                           this.axios.post(this.api.role.insert, param)
                               .then((res) => {
                                this.sysRole.activeName = "rolelist";
                           })
                       }
                    } else {
                        return false;
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
    }
</script>