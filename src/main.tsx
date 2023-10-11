import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { FireOutlined, UserOutlined } from "@ant-design/icons";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import UsersPage from "./screens/users.page.tsx";
import { MenuProps, Menu } from "antd";
const items: MenuProps["items"] = [
  {
    label: <Link to={"/"}>Home</Link>,
    key: "home",
    icon: <FireOutlined />,
  },
  {
    label: <Link to={"/users"}>Manage Users</Link>,
    key: "user",
    icon: <UserOutlined />,
  },
];

const Header = () => {
  const [current, setCurrent] = useState("home");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};
const LayoutAdmin = () => {
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const res = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },

      body: JSON.stringify({
        username: "admin@gmail.com",
        password: "123456",
      }),
    });
    const data = await res.json();
    if (data.data) {
      localStorage.setItem("access_token", data.data.access_token);
    }
  };
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <App /> },
      {
        path: "users",
        element: <UsersPage />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
