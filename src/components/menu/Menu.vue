<template>
    <el-row>
        <el-col :span="24" class="tabs-div">
            <el-tabs v-model="sysMenu.activeName">
                <el-tab-pane label="菜单列表" name="menulist">
                    <MenuListVue ref="menulist" :sysMenu="sysMenu"></MenuListVue>
                </el-tab-pane>
                <el-tab-pane label="菜单添加" name="menuadd" v-if="role.menu.add">
                    <MenuAddVue ref="menuadd" :sysMenu="sysMenu" :key="new Date().getTime()"></MenuAddVue>
                </el-tab-pane>
                <el-tab-pane label="菜单编辑" name="menuupdate" disabled  v-if="role.menu.update">
                    <MenuAddVue ref="menuupdate" :sysMenu="sysMenu" :key="new Date().getTime()"></MenuAddVue>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>
<script>
    import  MenuAddVue from "./MenuAdd.vue"
    import  MenuListVue from "./MenuList.vue"
    export default {
        data() {
            return {
                sysMenu: {
                    parentMenuList: [],
                    activeName: "menulist",
                    aliasList: [],
                    menuForm: {
                        uuid: "",
                        menuName: "",
                        menuUrl: "",
                        menuIcon: "",
                        menuOrder: "",
                        menuType: "",
                        parentId: "",
                        menuComp: "",
                        perms: "",
                        alias: "",
                    }
                }
            }
        },
        created(){
            this.role.AuthorityAudit(this.$route.matched[1].meta.id,this.role.menu);
            console.log(this.role.menu)
        },
        mounted(){
            this.$refs["menulist"].selectMenuAll();
            this.$refs["menulist"].selectParentMenu();
        },
        methods: {
        },
        components: {
            MenuAddVue, MenuListVue
        },
        watch: {
            'sysMenu.activeName': function (val, oldVal) {
                if (this.sysMenu.activeName == "menulist") {
                    this.$refs["menulist"].selectMenuAll(this.$refs["menulist"].parentMenuId == "" ? this.$refs["menulist"].parentId : this.$refs["menulist"].parentMenuId);

                }
                if (this.sysMenu.activeName == "menuupdate") {
                    this.$refs["menuupdate"].selectAlias();
                    this.$refs["menuupdate"].selectParentMenu(this.sysMenu.menuForm.menuType, true);
                }
                if (this.sysMenu.activeName == "menuadd") {
                    this.$refs["menuadd"].selectAlias();
                    this.sysMenu.menuForm = {
                        uuid: "",
                        menuName: "",
                        menuUrl: "",
                        menuIcon: "",
                        menuOrder: "",
                        menuType: "0",
                        parentId: "",
                        menuComp: "",
                        perms: "",
                        alias: "",
                    }
                }
            }
        }
    }

</script>