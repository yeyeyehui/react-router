import { Outlet, Link } from "../react-router-dom";

function User() {
  //V5版本中props {location,children,history}
  //V6版本中props就是空对象
  return (
    <div>
      <ul>
        <li>
          <Link to="/user/list">用户列表</Link>
        </li>
        <li>
          <Link to="/user/add">添加用户</Link>
        </li>
      </ul>
      
      <Outlet />
    </div>
  );
}

export default User;
