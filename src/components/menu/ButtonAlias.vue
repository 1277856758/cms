<template>
    <div style="margin-top: 30px;">
        <div class="menu_button_add">
            <el-button @click="dialogTableVisible =true" type="primary" size="small">添加</el-button>
        </div>
        <el-table :data="buttonAliasList" border style="width: 100%">
            <el-table-column prop="buttonName" label="按钮功能"></el-table-column>
            <el-table-column prop="alias" label="标识"></el-table-column>
            <el-table-column>
                <template scope="scope">
                    <el-button @click="del(scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageInfo.pageSize"
                    layout="->, prev, pager, next"
                    :total="pageInfo.total">
            </el-pagination>
        </div>
        <el-dialog title="添加功能标识" :visible.sync="dialogTableVisible">
            <el-row :gutter="20">
                <el-col :span="18">
                    <el-form :model="buttonAliasFrom" :rules="rules" ref="buttonAliasFrom" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="按钮功能" prop="buttonName">
                            <el-input v-model="buttonAliasFrom.buttonName"></el-input>
                        </el-form-item>
                        <el-form-item label="功能标识" prop="alias">
                            <el-input v-model="buttonAliasFrom.alias"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="submitForm('buttonAliasFrom')">保存</el-button>
                            <el-button size="small" @click="resetForm('buttonAliasFrom')">重置</el-button>
                        </el-form-item>
                    </el-form>

                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                currentPage: 1,
                buttonAliasList: [],
                pageInfo:[],
                dialogTableVisible: false,
                buttonAliasFrom: {
                    buttonName: "",
                    alias: ""
                },
                rules: {
                    buttonName: [
                        {required: true, message: '按钮功能不能为空!', trigger: 'blur'},
                    ],
                    alias: [
                        {required: true, message: '功能标识不能为空!', trigger: 'blur'},
                    ],
                }
            }
        },
        mounted(){
            this.selectButtonAll();
        },
        methods: {
            selectButtonAll(){
                this.axios.post(this.api.menu.selectButtonAll + this.currentPage)
                    .then((res) => {
                        this.buttonAliasList = res.data.pageInfo.list;
                        this.pageInfo = res.data.pageInfo;
                    })
            },
            del(item){
                var param = {
                    uuid: item.uuid
                };
                this.axios.post(this.api.menu.buttonDel,param)
                    .then((res) => {
                        this.selectButtonAll();
                    })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post(this.api.menu.buttonAdd, this.buttonAliasFrom)
                            .then((res) => {
                                this.dialogTableVisible=false;
                                this.selectButtonAll();
                                this.resetForm("buttonAliasFrom");
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.selectButtonAll();
            },
        }
    }
</script>


<style scoped>
    .menu_button_add {
        text-align: right;
        margin: 20px 0;
    }
</style>