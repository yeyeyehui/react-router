import { useNavigate } from "../react-router";

function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <p>Home</p>

      <button onClick={() => navigate("/profile")}>跳转到/profile</button>
    </div>
  );
}

export default Home;
