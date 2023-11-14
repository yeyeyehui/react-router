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