import React from "react";

import { useRoutes, useOutlet, useNavigate } from "./hooks";

import { LocationContext, NavigatorContext } from "./context";

import { stringifyWithBlacklist } from "stringify-with-filter";

/**
 * 这是跨平台的路由容器组件，给页面添加navigator和location上下文
 * @param {*} children 儿子Routes虚拟DOM
 * @param {*} location 当前路径 {pathname,state} 读取当前路径
 * @param {*} navigator history对象，用来跳转换路径 改变当前路径的
 * @returns Context
 */
export function Router({ children, location, navigator }) {
  return (
    <NavigatorContext.Provider value={{ navigator }}>
      <LocationContext.Provider value={{ location }}>
        {children}
      </LocationContext.Provider>
    </NavigatorContext.Provider>
  );
}

/**
 * 核心就是读取当前的路径，跟它的每个儿子的path进行匹配，渲染匹配到的组件
 * @param {*} param0
 */
export function Routes({ children }) {
  const routes = createRoutesFromChildren(children);
  console.log("====================================");
  console.log(stringifyWithBlacklist(routes, ["key", "ref"]));
  console.log("====================================");
  return useRoutes(routes);
}

/**
 * 把虚拟DOM儿子数组转换成一个普通的JS对象，方便后续匹配
 * 转换为普通对象，里面存储path等信息
 * @param {*} children
 */
function createRoutesFromChildren(children) {
  const routes = [];

  //React.Children.forEach是React提供的用来遍历子元素的方法children.forEach
  React.Children.forEach(children, (child) => {
    let route = {
      path: child.props.path,
      element: child.props.element,
    };
    if (child.props.children) {
      route.children = createRoutesFromChildren(child.props.children);
    }
    routes.push(route);
  });

  return routes;
}

export function Route() {}

export function Outlet() {
  return useOutlet();
}

/**
 * 路由重定向
 */
export function Navigate({ to, state }) {
  let navigate = useNavigate();

  React.useEffect(() => {
    navigate(to, state);
  }, []);
  
  return null;
}
