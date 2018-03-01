<template>
    <el-row>
        <el-col :span="12" >
            <el-form :model="sysUser.userFrom" :rules="rules" ref="sysUser.userFrom" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="登录帐号:" prop="userName">
                    <el-input v-model="sysUser.userFrom.userName"></el-input>
                </el-form-item>
                <el-form-item label="真实名称:" prop="realName">
                    <el-input v-model="sysUser.userFrom.realName"></el-input>
                </el-form-item>
                <el-form-item label="密码:" prop="password">
                    <el-input type="password" v-model="sysUser.userFrom.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码:" prop="pass">
                    <el-input type="password" v-model="sysUser.userFrom.pass"></el-input>
                </el-form-item>
                <el-form-item label="邮箱:" prop="email">
                    <el-input v-model="sysUser.userFrom.email"></el-input>
                </el-form-item>
                <el-form-item label="联系电话:" prop="mobile">
                    <el-input v-model="sysUser.userFrom.mobile"></el-input>
                </el-form-item>
                <el-form-item label="添加角色:">
                    <el-checkbox-group v-model="sysUser.userFrom.role">
                        <el-checkbox v-for="item  in roleList" :label="item.uuid" :key="item.uuid" name="type">
                            {{item.roleName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save('sysUser.userFrom')" v-if="!state">添加</el-button>
                    <el-button type="primary" @click="save('sysUser.userFrom')" v-else>更新</el-button>
                    <el-button @click="resetForm('sysUser.userFrom')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        props: ["sysUser"],
        data() {
            var checkPwd = (rule, value, callback) => {
                if (value != this.sysUser.userFrom.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var checkPhone = (rule, value, callback) => {
                var str = /^1[34578]\d{9}$/;
                if (!str.test(value)) {
                    callback(new Error(rule.msg));
                    return false;
                } else {
                    callback();
                }
            };
            var checkUserName = (rule, value, callback) => {
                if( this.sysUser.userFrom.uuid!=""){
                    callback();
                }else{
                    var  param={
                        p:1,
                        userName:value
                    };
                    this.axios.post(this.api.user.selectUserAll,param)
                        .then((res) => {
                            if(res.data.userList!=null&&res.data.userList!=''){
                                callback(new Error(rule.msg));
                                return false;
                            }else{
                                callback();
                            }
                        })
                }
            };
            return {
                pass: "",
                password: "",
                role: "",
                roleList: [],
                state: false,
                rules: {
                    userName: [
                        {required: true, message: '请输入登录账户', trigger: 'blur'},
                        {min: 5, max: 12, message: '账户长度在 6 到 12 个字符', trigger: 'blur'},
                        {validator: checkUserName, msg: '用户名已经存在!', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 12, message: '密码长度为6-12', trigger: 'blur'}
                    ],
                    pass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 12, message: '密码长度为6-12', trigger: 'blur'},
                        {validator: checkPwd, msg: '两次输入密码不一致!', trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入名称邮箱', trigger: 'blur'},
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
                    ],
                    mobile: [
                        {required: true, message: '请输入联系电话', trigger: 'blur'},
                        {validator: checkPhone, msg: '请输入正确手机格式!', trigger: 'blur'}
                    ],
                }
            };
        },
        mounted(){
            this.selectAllRole();
            if (this.sysUser.userFrom.uuid) {
                this.state = true;
            }
        },
        methods: {
            selectAllRole(){
                this.axios.get(this.api.role.selectRole)
                    .then((res) => {
                        this.roleList = res.data.roleList;
                    })
            },
            save(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var param = {
                            userName:this.sysUser.userFrom.userName,
                            userPassword: this.sysUser.userFrom.password,
                            email: this.sysUser.userFrom.email,
                            mobile:this.sysUser.userFrom.mobile,
                            time: this.sysUser.userFrom.time,
                            realName: this.sysUser.userFrom.realName,
                            roleList: this.sysUser.userFrom.role

                        };
                        if (this.state) {
                            param.uuid = this.sysUser.userFrom.uuid;
                            this.axios.post(this.api.user.update, param)
                                .then((res) => {
                                    this.sysUser.activeName = "userlist";
                                })
                        } else {
                            this.axios.post(this.api.user.add, param)
                                .then((res) => {
                                    this.sysUser.activeName = "userlist";
                                })
                        }

                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    };
</script>
<style scoped>

</style>