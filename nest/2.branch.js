/**
 * 1.从虚拟DOM计算出routes配置
 */
let routes = [
    {
        path:"/user",
        element:'User',
        children:[
            {
              path:"add",
              element:'UserAdd'
            },
            {
               path:"list",
               element:'UserList'
            }
        ]
    }
]
/**
 * 2。打平路由，计算分支
 */

function flattenRoutes(routes,branches = []){
    routes.forEach(route=>{
        if(route.children && route.children.length>0){
            flattenRoutes(route.children,branches);
        }
        branches.push({name:route.path,element:route.element});
    });
}
const branches = [];
flattenRoutes(routes,branches);
console.log(branches);