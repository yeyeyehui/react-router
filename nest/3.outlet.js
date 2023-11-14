/**
先渲染子的，然后渲染父的
郭同学
覆盖了？
web
渲染父的，父的包含子的
郭同学
父的覆盖了子的
web
父的里面outlet
web
就是子的
花儿要打败熊猫当国宝
先渲染父，用父的值。渲染子的时候用子的
初心
match里面的outlet

 */
let routeContext = {//的确是单例的，里面的value也的确在变化
    outlet:null,
    matches:[]
}

let child =  <RouteContext.Provider value={{outlet,matches}}>
{match.route.element}
</RouteContext.Provider>;

let outlet = null;
let matches = [User,UserList]
RouteContext.value = {outlet,matches}
let childVdom = React.createElement(RouteContext.Provider,{value:RouteContext.value});
childVdom={
    type:Provider,
    props:{value:{outlet,matches}}
}
//第一次遍历结束了
outlet=childVdom
matches=[User]
RouteContext.value = {outlet,matches}
let parentVdom = React.createElement(RouteContext.Provider,{value:RouteContext.value});
parentVdom={
    type:Provider,
    props:{value:{outlet,matches}}
}
return parentVdom;


let arr1 = [1]
let arr2 = arr1;
arr1 = [2]