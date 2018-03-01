<template>
    <div class="login_div"  >
        <div>
            <h2>权限管理测试系统</h2>
        </div>
        <div class="login_div_from">
            <el-form :model="loginFrom" :rules="loginRules" ref="loginFrom" label-width="70px" class="demo-ruleForm">
                <el-form-item label="账户" prop="name">
                    <el-input v-model="loginFrom.name"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginFrom.password"></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="captcha">
                    <el-input v-model="loginFrom.captcha" @keyup.enter.native="submitForm"></el-input>
                </el-form-item>
                <el-form-item style="text-align: left">
                    <ul class="catcha_ul">
                        <li>
                            <img :src="src" alt="如果看不清除,请单击刷新验证码!" @click="refreshCode">
                        </li>
                        <li>
                            <span style="line-height: 37px;" @click="refreshCode">
                              点击刷新
                          </span>
                        </li>
                    </ul>

                </el-form-item>
                <el-button type="primary" @click.stop="submitForm">登录</el-button>
                <el-button type="primary" @click="submitForm">重置</el-button>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {sessionRouters, filterRouters} from '../../router/router'
    export default {
        data() {
            var checkNull = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(rule.msg));
                } else {
                    callback();
                }
            };
            return {
                loginFrom: {
                    name: "",
                    password: "",
                    captcha: ""
                },
                src: "",
                loginRules: {
                    name: [
                        {required: true, message: '请输入登录账户', trigger: 'blur'},
                        {min: 5, max: 12, message: '账户长度在 6 到 12 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 12, message: '密码长度为6-12', trigger: 'blur'}
                    ],
                    captcha: [
                        {required: true, message: '请输入验证码', trigger: 'blur'},
                        {min: 5, max: 5, message: '验证码长度为5', trigger: 'blur'}
                    ],
                }
            }
        },
        mounted(){
            this.refreshCode();
        },
        methods: {
            refreshCode(){
                this.src = "http://10.10.12.248:8999/sys/captcha?t=" + new Date().getTime();
//                this.src = "http://10.10.4.69:8999/sys/captcha?t=" + new Date().getTime();
            },
            submitForm(){
                this.$refs['loginFrom'].validate((valid) => {
                    if (valid) {
                        var params = {
                            userName: this.loginFrom.name,
                            userPassword: this.loginFrom.password,
                        };
                        this.axios.post(this.api.loginApi.login + "?captcha=" + this.loginFrom.captcha, params)
                            .then((reponse) => {
                                this.refreshCode();
                                this.$router.push({path: "/home"});
                            })
                    } else {
                        this.refreshCode();
                        return false;
                    }
                });
            },
        },
        components: {}
    }
</script>
<style scoped>
    .login_div {
        text-align: center;
        margin-top: 10%;
    }

    .catcha_ul li {
        float: left;
        line-height: 55px;
    }

    .login_div_from {
        margin: 0 auto;
        margin-top: 30px;
        background: #ffffff;
        border-radius: 5px;
        width: 400px;
        padding: 20px;
        padding-top: 30px;
    }
</style>
