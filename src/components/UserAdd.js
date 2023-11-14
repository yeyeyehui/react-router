import React from "react";

import { UserAPI } from "../utils";

import { useNavigate } from "../react-router-dom";

function UserAdd() {
  const nameRef = React.useRef();

  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    // 禁用默认行为
    event.preventDefault();
  
    let name = nameRef.current.value;
  
    UserAPI.add({ name });
  
    navigate("/user/list");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={nameRef} />
      
      <button type="submit">添加用户</button>
    </form>
  );
}

export default UserAdd;
