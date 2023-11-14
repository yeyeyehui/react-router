import Home from "./components/Home";

import User from "./components/User";

import UserList from "./components/UserList";

import UserAdd from "./components/UserAdd";

import UserDetail from "./components/UserDetail";

import Profile from "./components/Profile";

import Login from "./components/Login";

import { Navigate } from "./react-router-dom";

const routes = [
  {
    path: "/",
    element: <Home />, // 首页
  },
  {
    path: "/user",
    element: <User />,
    children: [
      {
        path: "list",
        element: <UserList />,
      },
      {
        path: "add",
        element: <UserAdd />,
      },
      {
        path: "detail/:id",
        element: <UserDetail />,
      },
    ],
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/login",
    element: <Login />, // 登陆
  },
  {
    path: "*",
    element: <Navigate to="/" />, // 重定向
  },
];

export default routes;
