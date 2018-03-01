<template>
    <div class="menu_add_div">
        <el-form :model="sysMenu.menuForm" :rules="rules" ref="sysMenu.menuForm" label-width="100px"
                 class="demo-ruleForm">
            <el-form-item label="菜单类型" required>
                <el-radio-group v-model="sysMenu.menuForm.menuType" @change="selectParentMenu">
                    <el-radio label="0" value="0"
                              :disabled="sysMenu.menuForm.uuid==''?false:sysMenu.menuForm.menuType==0?false:true">目录
                    </el-radio>
                    <el-radio label="1" value="1"
                              :disabled="sysMenu.menuForm.uuid==''?false:sysMenu.menuForm.menuType==1?false:true">菜单
                    </el-radio>
                    <el-radio label="2" value="2"
                              :disabled="sysMenu.menuForm.uuid==''?false:sysMenu.menuForm.menuType==2?false:true">按钮
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单名称" prop="menuName" required>
                <el-input v-model="sysMenu.menuForm.menuName"></el-input>
            </el-form-item>
            <el-form-item label="菜单模块" prop="menuComp" v-if="sysMenu.menuForm.menuType==1" required>
                <el-input v-model="sysMenu.menuForm.menuComp"></el-input>
            </el-form-item>
            <el-form-item label="菜单地址" prop="menuUrl" v-if="sysMenu.menuForm.menuType==1" required>
                <el-input v-model="sysMenu.menuForm.menuUrl"></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" prop="menuIcon" v-if="sysMenu.menuForm.menuType!=2" required>
                <el-popover ref="popover" placement="right-start" title="图标选择" width="500" trigger="click" v-model="radioVisble">
                   <div v-if="iconList!=null && iconList.length>0">
                       <el-radio-group v-model="sysMenu.menuForm.menuIcon" size="small">
                           <el-radio-button :label="item.menuIcon" v-for="(item,index) in iconList">
                               <svg class="icon-sm">
                                   <use :xlink:href="item.menuIcon"></use>
                               </svg>
                           </el-radio-button>
                       </el-radio-group>
                       <div class="block">
                           <el-pagination
                                   @current-change="handleCurrentChange"
                                   :current-page.sync="currentPage"
                                   :page-size="pageInfo.pageSize"
                                   layout="->, prev, pager, next"
                                   :total="pageInfo.total">
                           </el-pagination>
                       </div>
                   </div>
                    <div v-else>
                        <el-button @click="handleCurrentChange(currentPage)"  icon="search">加载图标</el-button>
                    </div>
                    <div style="text-align: right; margin:10px;">
                        <el-button type="primary" size="mini" @click="radioVisble = false;currentPage=1">关闭</el-button>
                    </div>
                </el-popover>

                <el-button v-popover:popover v-if="sysMenu.menuForm.menuIcon==null||sysMenu.menuForm.menuIcon==''">
                    选择图标
                </el-button>
                <el-button v-else v-popover:popover style="padding:5px;">
                    <svg class="icon-sm">
                        <use :xlink:href="sysMenu.menuForm.menuIcon"></use>
                    </svg>
                </el-button>
            </el-form-item>
            <el-form-item label="菜单权限" prop="perms" required>
                <el-input v-model="sysMenu.menuForm.perms"></el-input>
            </el-form-item>
            <el-form-item label="功能标识" prop="perms" required v-if="sysMenu.menuForm.menuType==2">
                <el-select v-model="sysMenu.menuForm.alias" placeholder="功能标识">
                    <el-option :label="item.buttonName" :value="item.alias" v-for="item in sysMenu.aliasList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="菜单排序" prop="menuOrder" v-if="sysMenu.menuForm.menuType==0" required>
                <el-input v-model="sysMenu.menuForm.menuOrder"></el-input>
            </el-form-item>
            <el-form-item label="父级菜单" v-if="sysMenu.menuForm.menuType==1">
                <el-select v-model="sysMenu.menuForm.parentId" placeholder="父级菜单">
                    <el-option :label="item.menuName" :value="item.uuid"
                               v-for="item in sysMenu.parentMenuList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="父级菜单" prop="parentId" v-if="sysMenu.menuForm.menuType==2" required>
                <el-select v-model="sysMenu.menuForm.parentId" placeholder="父级菜单">
                    <el-option :label="item.menuName" :value="item.uuid"
                               v-for="item in sysMenu.parentMenuList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('sysMenu.menuForm')" v-if="sysMenu.menuForm.uuid==''">保存
                </el-button>
                <el-button type="primary" @click="submitForm('sysMenu.menuForm')" v-else>修改</el-button>
                <el-button @click="resetForm('sysMenu.menuForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        props: ["sysMenu"],
        data() {
            var checkNull = (rule, value, callback) => {
                if (value) {
                    callback();
                } else {
                    callback(new Error(rule.mes));
                }
            };
            var checkInteger = (rule, value, callback) => {
                if (!Number.isInteger(value)) {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };

            return {
                radioVisble: false,
                iconList:[],
                pageInfo:[],
                currentPage:1,
                rules: {
                    menuName: [
                        {validator: checkNull, message: '请输入菜单名称', trigger: 'blur'},
                    ],
                    menuUrl: [
                        {validator: checkNull, message: '请输入菜单地址', trigger: 'blur'},
                    ],
                    menuIcon: [
                        {validator: checkNull, message: '请选择菜单图标', trigger: 'blur'},
                    ],
                    menuOrder: [
                        {validator: checkNull, message: '请输入菜单排序', trigger: 'blur'},
                        {validator: checkInteger, message: '请输入数字值', trigger: 'blur'},
                    ],
                    menuType: [
                        {validator: checkNull, message: '请选择菜单类型', trigger: 'blur'},
                    ],
                    parentId: [
                        {validator: checkNull, message: '请选择父级菜单', trigger: 'blur'},
                    ],
                    perms: [
                        {validator: checkNull, message: '请输入菜单权限', trigger: 'blur'},
                    ],
                    menuComp: [
                        {validator: checkNull, message: '请输入菜单模块', trigger: 'blur'},
                    ],

                }
            }
        },
        mounted(){
        },
        methods: {
            selectAlias(){
                this.axios.post(this.api.menu.selectButtonAll+"0")
                    .then((res) => {
                        this.sysMenu.aliasList = res.data.pageInfo.list;
                    })
            },
            selectParentMenu(value,blog){
                if(!blog){
                    this.resetForm();
                }
                if (value != 0) {
                    var param = {
                        menuType: value
                    };
                    this.axios.post(this.api.menu.selectParentMenu, param)
                        .then((res) => {
                            this.sysMenu.parentMenuList = res.data.sysMenuList;
                        })
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var param = this.sysMenu.menuForm;
                        if (this.sysMenu.menuForm.uuid == ""){
                            this.axios.post(this.api.menu.add, param)
                                .then((res) => {
                                    this.sysMenu.activeName = "menulist";
                                })
                        } else {
                            this.axios.post(this.api.menu.update, param)
                                .then((res) => {
                                    this.sysMenu.activeName = "menulist";
                                })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm() {
                this.sysMenu.menuForm.menuName = "";
                this.sysMenu.menuForm.perms = "";
                this.sysMenu.menuForm.menuUrl = "";
                this.sysMenu.menuForm.menuIcon = "";
//                this.sysMenu.menuForm.menuOrder = "";
                this.sysMenu.menuForm.parentId = "";
                this.sysMenu.menuForm.menuComp = "";
                this.$refs["sysMenu.menuForm"].resetFields();
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.axios.post(this.api.menu.selectInconAll + val)
                    .then((res) => {
                        this.iconList = res.data.pageInfo.list;
                        this.pageInfo = res.data.pageInfo;
                    })
            },
        },
        components: {},
        watch: {
            /* 'sysMenu.menuForm.menuType': function (val, oldVal){

             }*/

        }
    }
</script>
<style>
    .el-radio-button__inner {
        border: 0 !important;
        border-radius: 0 !important;
        margin-right: 5px !important;
    }
</style>
<style scoped>
    .menu_add_div {
        width: 70%;
    }
</style>