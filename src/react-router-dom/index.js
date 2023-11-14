import React from "react";

import { createBrowserHistory, createHashHistory } from "../router";

import { Router, useLocation, useNavigate } from "../react-router";

export * from "../react-router";

/**
 * 创建BrowserRouter，给子页面添加context上下文
 */
export function BrowserRouter({ children }) {
  //在整个项目中只有一份history实例
  const historyRef = React.useRef(null);

  if (historyRef.current === null) {
    historyRef.current = createBrowserHistory();
  }

  const history = historyRef.current;

  //调用工厂方法，创建浏览器历史对象
  //定义一个状态，获取当前历史对象中的路径
  let [state, setState] = React.useState({
    action: history.action, //执行哪个动作到达此路径的 pushState=>PUSH popState=>POP
    location: history.location, //当前路径
  });

  // 给history添加监听函数，当浏览器的路径发生变化的时候，会执行setState,并传递最新的路径
  // 并重新渲染路由容器组件
  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}

/**
 * 创建HashRouter，给子页面添加context上下文
 */
export function HashRouter({ children }) {
  //在整个项目中只有一份history实例
  const historyRef = React.useRef(null);

  if (historyRef.current === null) {
    historyRef.current = createHashHistory();
  }

  const history = historyRef.current;

  //调用工厂方法，创建浏览器历史对象
  //定义一个状态，获取当前历史对象中的路径
  let [state, setState] = React.useState({
    action: history.action, //执行哪个动作到达此路径的 pushState=>PUSH popState=>POP
    location: history.location, //当前路径
  });

  // 给history添加监听函数，当浏览器的路径发生变化的时候，会执行setState,并传递最新的路径，并重新渲染路由容器组件
  // React.useLayoutEffect初始化的时候执行一次，用history.listen来监听路由跳转
  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
}

/**
 * 跳转方法，
 */
export const Link = function (props) {
  const { to, state, ...rest } = props;

  const navigate = useNavigate();
  
  const handleClick = (event) => {
    // 阻止冒泡默认事件
    event.preventDefault();

    navigate(to, state);
  };
  
  return <a {...rest} onClick={handleClick} />;
};

/**
 * 导航链接，可以根据是否选中给样式，还有跳转的链接to
 */
export function NavLink({
  className: classNameProp,
  style: styleProp,
  to,
  children,
  end = false,
  ...rest
}) {
  const { pathname } = useLocation();

  // 计算当前NavLink中的to路径和地址栏中的路径是否匹配
  // 如果完整匹配是可以的
  // 或者不需要结束，也不是不区要严格匹配的话，只要pathname是以to开头的就可以，并且to后面跟的是路径分隔符
  // pathname = '/user/list'  to="/user" TODO
  const isActive =
    pathname === to ||
    (!end && pathname.startsWith(to) && pathname?.indexOf(to.length) === "/");

  let className = classNameProp({ isActive });

  let style = styleProp({ isActive });

  return (
    <Link className={className} style={style} to={to} {...rest}>
      {children}
    </Link>
  );
}
