import { useLocation, useParams } from "../react-router-dom";

import { UserAPI } from "../utils";

function UserDetail() {
  const [user, setUser] = React.useState({});

  const location = useLocation();

  React.useEffect(() => {
    let user = location.state;

    if (!user) {
      const params = useParams();

      user = UserAPI.find(params.id);
    }

    setUser(user);
  }, []);

  return (
    <div>
      {user.id}:{user.name}
    </div>
  );
}

export default UserDetail;
