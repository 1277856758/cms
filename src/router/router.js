import Vue from "vue";
import RouterVue from "vue-router";
import RouterConfig from "./routerConfig";
Vue.use(RouterVue);
const router = new RouterVue(RouterConfig);
router.beforeEach((to, from, next) => {
    // if (from.path != "/login") {
    //     next()
    // } else {
        next();
    // }
});
export default router;
export function sessionRouters(menu = [], routes = []) {
    routes = eachMenu(menu);
    return routes
}
export function filterRouters(old = [], routes = []) {
    if(old.length == 0 || routes.length == 0) return [];
    var new_routes = [];
    for (let route of old){
        for(let tmp of routes) {
            if(!route.id && route.id != tmp.id) {
                new_routes.push(route);
                break
            }
        }
    }
    return new_routes
}

function eachMenu(menu = [], routes = []) {
    if(menu.length <= 0) return routes;
    for (let item of menu){
        if(item.menuUrl  ) {
        // if(item.menuUrl && item.component) {
            let arr = {
                path:item.menuUrl ,
                name:item.menuName,
                meta: { id: item.uuid },
                component: resolve => require(["../components"+item.menuComp+".vue"], resolve)
            };
            routes.push(arr);
        }
    }
    return routes
}
