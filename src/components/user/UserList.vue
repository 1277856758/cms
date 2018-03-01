<template>
    <div class="user_list">
        <div class="search">
            <el-input placeholder="请输入名字" icon="search" v-model="search" :on-icon-click="handleIconClick"></el-input>
        </div>
        <el-table :data="userList" style="width: 100%;margin-top:20px;" border>
            <el-table-column prop="userName" label="帐号" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column prop="realName" label="真实名称" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column prop="email" label="邮箱" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column prop="mobile" label="手机号" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column prop="createUser" label="创建者" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column label="时间" width="120">
                <template scope="scope">
                    {{scope.row.time | time(2)}}
                </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
                <template scope="scope">
                    <el-tag :type="scope.row.state==0 ? 'primary' :scope.row.state==1?'success':'danger'" close-transition>
                        {{scope.row.state==0?"创建":scope.row.state==1?"正常":"禁用"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button type="success" size="small" v-if="(scope.row.state==0 || scope.row.state==2)&&role.user.state" @click="updateState(scope.row,1)" >启用</el-button>
                    <el-button @click="selectRole(scope.row)" type="info" size="small" v-if="scope.row.state==1&&role.user.role">角色</el-button>
                    <el-button @click="update(scope.row)" type="warning" size="small" v-if="role.user.update">编辑</el-button>
                    <el-button type="danger" size="small" v-if="(scope.row.state==2 || scope.row.state==0)&&role.user.del"  @click="del(scope.row)">删除</el-button>
                    <el-button type="danger" size="small" v-if="scope.row.state==1&&role.user.state"  @click="updateState(scope.row,2)">禁用</el-button>
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
        <el-dialog title="所属角色" :visible.sync="dialogRoleVisible" size="small" @close="closeDialog">
            <!--:closable="true"-->
            <el-tag type="primary" v-for="item in roleList"
                    :key="item.roleName"
                    :close-transition="true"
                    @close="handleClose(item)"
                    class="role_tag"
            ><span @click.stop="roleMenu(item)" style="cursor: pointer">{{item.roleName}}</span></el-tag>
            <el-table :data="roleMenuList" border style="width: 100%;margin-top: 20px;" v-if="roleMenuVisible">
                <el-table-column prop="menuName" label="权限名称"></el-table-column>
                <el-table-column prop="perms" label="权限"></el-table-column>
                <el-table-column label="类型">
                    <template scope="scope">
                        <el-tag :type="scope.row.menuType==0 ? 'primary' :scope.row.menuType==1?'warning':'success'"
                                close-transition>
                            {{scope.row.state==0?"目录":scope.row.menuType==1?"菜单":"按钮"}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="parentName" label="父级"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props: ["sysUser"],
        data() {
            return {
                userList: [],
                currentPage: 1,
                pageInfo: [],
                dialogRoleVisible: false,
                search: "",
                roleList: [],
                roleMenuList: [],
                roleMenuVisible: false
            }
        },
        mounted(){
        },
        methods: {
            closeDialog(){
                this.roleMenuVisible = false;
            },
            del(item){
                this.currentPage = 1;
                this.axios.get(this.api.user.del+item.uuid)
                    .then((res) => {
                        this.selectUserAll();
                    })
            },
            updateState(item,state){
                var param={
                    uuid:item.uuid,
                    state:state
                };
                this.axios.post(this.api.user.update, param)
                    .then((res) => {
                        this.selectUserAll();
                    })
            },
            handleClose(tag){
                this.roleList.splice(this.roleList.indexOf(tag), 1);
                this.roleMenuVisible = false;
            },
            roleMenu(item){
                this.axios.get(this.api.menu.selectMenuRole + item.uuid)
                    .then((res) => {
                        this.roleMenuList = res.data.menuList;
                        this.roleMenuVisible = true;
                    })
            },
            handleIconClick(){
                this.currentPage = 1;
                this.selectUserAll();
            },
            selectUserAll(){
                var param = {
                    p: this.currentPage,
                    userName: this.search,
                };
                this.axios.post(this.api.user.selectUserAll, param)
                    .then((res) => {
                        this.userList = res.data.userList;
                        this.pageInfo = res.data.pageInfo;
                    })
            },
            tableRowClassName(row, index) {
                if (row.state == 1) {
                    return 'info-row';
                } else if (row.state === 0) {
                    return 'positive-row';
                }
                return '';
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.selectUserAll();
            },
            selectRole(item){
                this.dialogRoleVisible = true;
                this.axios.get(this.api.role.selectUserRole + item.uuid)
                    .then((res) => {
                        this.roleList = res.data.roleList;
                    })
            },
            update(item){
                this.sysUser.userFrom.uuid=item.uuid;
                this.sysUser.userFrom.userName=item.userName;
                this.sysUser.userFrom.realName=item.realName;
                this.sysUser.userFrom.email=item.email;
                this.sysUser.userFrom.mobile=item.mobile;
                this.axios.get(this.api.role.selectUserRole + item.uuid)
                    .then((res) => {
                        var role=[];
                        for(var i=0;i<res.data.roleList.length;i++){
                            role.push(res.data.roleList[i].uuid)
                        }
                        this.sysUser.userFrom.role=role;
                        this.sysUser.addOrUpdate = true;
                        this.sysUser.activeName = "userupdate";
                    });
            },
        },
    }
</script>
<style scoped>
    .role_tag {
        margin-right: 20px;
    }

    .search {
        width: 180px;
        float: right;
        margin-bottom: 10px;
    }

    .el-table .info-row {
        background: red;
    }

    .el-table .positive-row {
        background: #e2f0e4;
    }
</style>