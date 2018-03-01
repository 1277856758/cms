<template>
    <div class="role_list">
        <div class="search">
            <el-input placeholder="请输入角色名字" icon="search" v-model="search" :on-icon-click="handleIconClick"></el-input>
        </div>
        <el-table :data="roleList" style="width: 100%;margin-top:20px;" border>
            <el-table-column prop="roleName" label="角色名称" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column prop="roleCode" label="角色标识" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column prop="createName" label="创建者" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column prop="roleRemark" label="角色描述" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column label="时间" width="120">
                <template scope="scope">
                    {{scope.row.time | time(2)}}
                </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
                <template scope="scope">
                    <el-tag :type="scope.row.state==0?'primary':scope.row.state==1?'success':'danger'" close-transition>
                        {{scope.row.state==0?"创建":scope.row.state==1?"正常":"禁用"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button type="success" size="small" @click="updateState(scope.row,1)" :disabled="scope.row.state!=1?false:true" v-if="role.role.state">启用</el-button>
                    <el-button type="warning" size="small" @click="update(scope.row)" v-if="role.role.update">编辑</el-button>
                    <el-button type="danger" size="small" @click="updateState(scope.row,2)" v-if="scope.row.state==1 && role.role.state">禁用</el-button>
                    <el-button type="danger" size="small" @click="del(scope.row)" v-else-if="role.role.state">删除</el-button>
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
    </div>
</template>
<script>
    export default {
        props: ["sysRole"],
        data() {
            return {
                search: "",
                currentPage: 1,
                pageInfo: [],
                roleList: []
            }
        },
        mounted(){
        },
        methods: {
            updateState(item, state){
                var param = {
                    uuid: item.uuid,
                    state: state
                };
                this.axios.post(this.api.role.upadte, param)
                    .then((res) => {
                        this.selectRoleAll();
                    })
            },
            del(item){
                this.currentPage = 1;
                this.axios.get(this.api.role.del + item.uuid)
                    .then((res) => {
                        this.selectRoleAll();
                    })
            },
            update(item){
                this.axios.get(this.api.menu.selectMenuRole + item.uuid)
                    .then((res) => {
                        this.sysRole.activeName = "roleupdate";
                        this.sysRole.roleFrom = {
                            uuid: item.uuid,
                            roleName: item.roleName,
                            roleCode: item.roleCode,
                            roleRemark: item.roleRemark,
                            roleMenuList: res.data.menuList
                        };
                    });
            },
            selectRoleAll(){
                var param = {
                    p: this.currentPage,
                    roleName: this.search,
                };
                this.axios.post(this.api.role.selectAllRole, param)
                    .then((res) => {
                        this.roleList = res.data.roleList;
                        this.pageInfo = res.data.pageInfo;
                    })
            },
            handleIconClick(){
                this.currentPage = 1;
                this.selectRoleAll();
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.selectRoleAll();
            }
        },
    }
</script>
<style>
    /*.role_list .el-table__body-wrapper {
        overflow-x: hidden;
    }*/
</style>
<style scoped>
    .search {
        width: 180px;
        float: right;
        margin-bottom: 10px;
    }
</style>