import React from "react";
/**
 * 当前路径 {pathname,state} 读取当前路径上下文对象
 */
export const LocationContext = React.createContext(null);

/**
 * history对象，用来跳转换路径 改变当前路径的
 */
export const NavigatorContext = React.createContext(null);

/**
 * 路由上下文
 */
export const RouteContext = React.createContext({
  outlet: null, //匹配的子路由对应的组件
  matches: [], //meta匹配的结果
});
