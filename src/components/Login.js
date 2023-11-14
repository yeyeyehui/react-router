import { useLocation, useNavigate } from "../react-router";

function Login() {
  const location = useLocation();

  const navigate = useNavigate();
  
  const login = () => {
    localStorage.setItem("login", "true");

    let to = "/";
    
    if (location.state && location.state.from) {
      to = location.state.from;
    }
    
    navigate(to);
  };
  
  return <button onClick={login}>登录</button>;
}

export default Login;
