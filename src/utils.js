export const UserAPI = {
  // 取缓存的用户列表
  list() {
    const userStr = localStorage.getItem("users");

    const users = userStr ? JSON.parse(userStr) : [];

    return users;
  },

  // 添加用户
  add(user) {
    let users = UserAPI.list();

    if (!user.id) {
      user.id = users.length;
    }

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));
  },

  // 匹配用户
  find(userId) {
    let users = UserAPI.list();

    return users.find((user) => user.id === userId);
  },
};
