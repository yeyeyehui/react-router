import { Link, Outlet, useParams } from "../react-router-dom";

import React from "react";

import { UserAPI } from "../utils";

function UserList() {
  let [users, setUsers] = React.useState([]);

  let params = useParams();
  
  console.log(params);
  
  React.useEffect(() => {
    const users = UserAPI.list();
    
    setUsers(users);
  }, []);
  
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Link to={`/user/detail/${user.id}`} state={user}>
            {user.name}
          </Link>
        </li>
      ))}
      <Outlet />
    </ul>
  );
}

export default UserList;
