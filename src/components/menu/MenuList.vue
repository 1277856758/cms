<template>
    <div class="menu_list">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-select v-model="parentId" placeholder="目录筛选" @change="selectParent">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="item.menuName" :value="item.uuid" v-for="item in parentList"
                               v-if="item.menuType==0 || item.parentId==null ||item.parentId==''"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6">  <el-select v-model="parentMenuId" placeholder="目录筛选"
                                           @change="selectMenuParent">
                <el-option label="全部" value=""></el-option>
                <el-option :label="item.menuName" :value="item.uuid" v-for="item in parentMenuList"
                           v-if="item.menuType==1"></el-option>
            </el-select>
            </el-col>
            <el-col :span="6">
                <el-select v-model="type" placeholder="类型搜索"
                           @change="selectMenuType">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="目录" value="0" v-if="this.parentId==''"></el-option>
                    <el-option label="菜单" value="1" v-if="this.parentMenuId==''"></el-option>
                    <el-option label="按钮" value="2"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-input placeholder="请输入菜单名字" icon="search" v-model="search" :on-icon-click="handleIconClick"></el-input>
            </el-col>
        </el-row>
        <el-table :data="menuList" style="width: 100%;margin-top:20px;" border>
            <el-table-column prop="menuName" label="菜单名称" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column prop="parentName" label="上级菜单" show-overflow-tooltip min-width="110"></el-table-column>
            <el-table-column label="图标"  align="center" width="80">
                <template scope="scope">
                    <svg class="icon-sm" aria-hidden="true">
                        <use :xlink:href="scope.row.menuIcon"></use>
                    </svg>
                </template>
            </el-table-column>
            <el-table-column prop="perms" label="权限标识" show-overflow-tooltip min-width="180"></el-table-column>
            <el-table-column prop="alias" label="功能" show-overflow-tooltip min-width="80"></el-table-column>
            <el-table-column label="类型" width="80">
                <template scope="scope">
                    <el-tag :type="scope.row.menuType==0 ? 'primary' :scope.row.menuType==1?'success':'danger'"
                            close-transition>
                        {{scope.row.menuType==0?"目录":scope.row.menuType==1?"菜单":"按钮"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="menuOrder" label="排序" width="70" align="center"></el-table-column>
            <el-table-column label="时间" width="120">
                <template scope="scope">
                    {{scope.row.time | time(2)}}
                </template>
            </el-table-column>
            <el-table-column label="状态" width="80"  >
                <template scope="scope">
                    <el-tag :type="scope.row.state==1 ? 'success':'danger'" close-transition>
                        {{scope.row.state==1?"正常":"禁用"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作"   width="200">
                <template scope="scope">
                    <el-button @click="updateState(scope.row,1)" type="success" size="small" :disabled="scope.row.state!=1?false:true" v-if="role.menu.state">启用</el-button>
                    <el-button @click="update(scope.row)" type="warning" size="small" v-if="role.menu.update">编辑</el-button>
                    <el-button @click="updateState(scope.row,2)" type="danger" size="small" v-if="scope.row.state==1 && role.menu.state">禁用</el-button>
                    <el-button @click="del(scope.row)" type="danger" size="small" v-else-if="role.menu.del">删除</el-button>
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
        props: ["sysMenu"],
        data() {
            return {
                search: "",
                currentPage: 1,
                pageInfo: [],
                menuList: [],
                parentList: [],
                parentId: "",
                parentMenuId: "",
                parentMenuList: [],
                type: "",
            }
        },
        mounted(){

        },
        methods: {
            selectMenuType(){
            /*  this.parentMenuId = "";
                this.parentId = "";
                this.search = "";*/
                this.selectMenuAll(this.parentMenuId == "" ? this.parentId : this.parentMenuId);
            },
            selectMenuParent(){
                this.selectMenuAll(this.parentMenuId == "" ? this.parentId : this.parentMenuId);
            },
            selectParent(){
                var param = {
                    parentId: this.parentId
                };
                this.axios.post(this.api.menu.selectParentMenu, param)
                    .then((res) => {
                        this.parentMenuList = res.data.sysMenuList;
                    });
                this.parentMenuId = "";
                this.search = "";
                this.selectMenuAll(this.parentId);

            },
            updateState(item,state){
                var param = {
                    uuid: item.uuid,
                    state: state
                };
                this.axios.post(this.api.menu.update,param)
                    .then((res) => {
                        this.selectMenuAll(this.parentMenuId == "" ? this.parentId : this.parentMenuId);
                    })
            },
            del(item){
                this.axios.get(this.api.menu.del+item.uuid)
                    .then((res) => {
                        this.selectMenuAll(this.parentMenuId == "" ? this.parentId : this.parentMenuId);
                    })
            },
            selectParentMenu(){
                this.axios.post(this.api.menu.selectParentMenu, {})
                    .then((res) => {
                        this.parentList = res.data.sysMenuList;
                    })
            },
            update(item){
                this.sysMenu.menuForm = {
                    uuid: item.uuid,
                    menuName: item.menuName,
                    menuUrl: item.menuUrl,
                    menuIcon: item.menuIcon,
                    menuOrder: item.menuOrder,
                    menuType: item.menuType + "",
                    parentId: item.parentId,
                    menuComp: item.menuComp,
                    perms: item.perms,
                    alias:item.alias,
                };
                this.sysMenu.activeName = "menuupdate";
            },
            handleIconClick(){
                this.currentPage = 1;
                var parent = this.parentMenuId == '' ? this.parentId : this.parentMenuId;
                this.selectMenuAll(parent);
            },
            selectMenuAll(parentId){
                var param = {
                    menuName: this.search,
                    p: this.currentPage,
                    parentId: parentId,
                    menuType: this.type
                };
                this.axios.post(this.api.menu.selectMenuAll, param)
                    .then((res) => {
                        this.menuList = res.data.menuList;
                        this.pageInfo = res.data.pageInfo;
                    })
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.selectMenuAll();
            }
        },
    }
</script>
<style>
  /*  .menu_list .el-table__body-wrapper {
        overflow-x: hidden;
    }*/
</style>
<style scoped>
    .search {
        width: 180px;
        float: right;
        margin-bottom: 10px;
    }

    .menu_search {
        float: left;
        margin-right: 20px;
    }
</style>