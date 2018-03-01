<template>
    <div style="margin-top: 30px;">
        <div class="menu_icon_add">
            <el-button @click="dialogTableVisible =true" type="primary" size="small">添加</el-button>
        </div>
        <el-table :data="iconList" border style="width: 100%">
            <el-table-column label="图标">
                <template scope="scope">
                    <svg class="icon-sm">
                        <use :xlink:href="scope.row.menuIcon"></use>
                    </svg>
                </template>
            </el-table-column>
            <el-table-column prop="menuIcon" label="标识"></el-table-column>
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
        <el-dialog title="添加图标" :visible.sync="dialogTableVisible">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form :model="iconForm" :rules="rules" ref="iconForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="图标名称" prop="menuIcon">
                            <el-input v-model="iconForm.menuIcon"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="small" type="primary" @click="submitForm('iconForm')">保存</el-button>
                            <el-button size="small" @click="resetForm('iconForm')">重置</el-button>
                        </el-form-item>
                    </el-form>

                </el-col>
                <el-col :span="12">
                    <svg class="icon-sm">
                        <use :xlink:href="addIcon"></use>
                    </svg>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            var checkIncon = (rule, value, callback) => {
                if (value) {
                    callback();
                    this.addIcon = value;
                } else {
                    callback(new Error(rule.message));
                }
            };
            return {
                iconList: [],
                currentPage: 1,
                pageInfo: "",
                iconForm: {
                    menuIcon: ""
                },
                addIcon: "",
                dialogTableVisible: false,
                rules: {
                    menuIcon: [
                        {validator: checkIncon, message: '请输入图标名称', trigger: 'blur'},
                    ],
                }
            }
        },
        mounted(){
            this.selectIconAll();
        },
        methods: {
            selectIconAll(){
                this.axios.post(this.api.menu.selectInconAll + this.currentPage)
                    .then((res) => {
                        this.iconList = res.data.pageInfo.list;
                        console.log(res.data.pageInfo);
                        this.pageInfo = res.data.pageInfo;
                    })
            },
            del(item){
                var param = {
                    uuid: item.uuid
                };
                this.axios.post(this.api.menu.iconDel, param)
                    .then((res) => {
                        this.selectIconAll();
                    })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.axios.post(this.api.menu.iconAdd, this.iconForm)
                            .then((res) => {
                                this.dialogTableVisible=false;
                                this.selectIconAll();
                                this.resetForm("iconForm");
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.selectIconAll();
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.addIcon = "";
            }
        }
    }
</script>
<style scoped>
    .menu_icon_add{
        text-align: right;
        margin:20px 0;
    }
</style>