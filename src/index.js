import { lazy, useState, Suspense } from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useRoutes,
} from "./react-router-dom";

import routesConfig from "./routesConfig";

const activeStyle = { backgroundColor: "green" };

const activeClassName = "active";

const activeNavProps = {
  style: ({ isActive }) => (isActive ? activeStyle : {}),
  className: ({ isActive }) => (isActive ? activeClassName : ""),
};

const LazyPost = lazy(() => import("./components/Post"));

function App() {
  const [routesConfig, setRoutes] = useState(routesConfig);

  const addRoute = () => {
    setRoutes([
      ...routesConfig,
      {
        path: "/post",
        element: (
          <Suspense fallback={<div>loading</div>}>
            <LazyPost />
          </Suspense>
        ),
      },
    ]);
  };

  return (
    <div>
      {useRoutes(routesConfig)}

      <button onClick={addRoute}>动态添加路由规则</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ul>
      <li>
        {/* end 是否匹配整个字符串 (默认值: true) */}
        <NavLink end={true} to="/" {...activeNavProps}>
          首页
        </NavLink>
      </li>
      <li>
        <NavLink to="/user" {...activeNavProps}>
          用户管理
        </NavLink>
      </li>
      <li>
        <NavLink to="/profile" {...activeNavProps}>
          个人中心
        </NavLink>
      </li>
      <li>
        <NavLink to="/post" {...activeNavProps}>
          贴子管理
        </NavLink>
      </li>
    </ul>
    <App />
  </BrowserRouter>
);
