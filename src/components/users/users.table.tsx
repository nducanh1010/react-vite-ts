import { useEffect, useState } from "react";
import "../../styles/users.css";
import { Button, Input, Modal, Table, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { ColumnsType } from "antd/es/table";
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  address: string;
  age: number;
  gender: string;
  password: string;
}
const UsersTable = () => {
  const [listUsers, setListUsers] = useState([]);

  const [token, setToken] = useState("");
  // modal section
  const [isModalCreateUserOpen, setIsModalCreateUserOpen] = useState(false);
  const [isModalUpdateUserOpen, setIsModalUpdateUserOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<null | IUser>(null);
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
    const accessToken = await data.data.access_token;
    await setToken(accessToken);
    await getUserTableData();
  };
  const handleUpdateUser = (userRows: IUser) => {
    setDataUpdate(userRows);
    setIsModalUpdateUserOpen(true);
  };
  const getUserTableData = async () => {
    const resp = await fetch("http://localhost:8000/api/v1/users/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const usersData = await resp.json();
    setListUsers(usersData.data.result);
  };
  const columnTable: ColumnsType<IUser> = [
    {
      title: "Email",
      dataIndex: "email",
      render: (value, record) => {
        return <a>{record.email}</a>;
      },
    },
    { title: "Name", dataIndex: "name" },
    { title: "Role", dataIndex: "role" },
    {
      title: "Actions",
      render: (value, record) => {
        return <Button onClick={() => handleUpdateUser(record)}>Edit </Button>;
      },
    },
  ];
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          onClick={() => setIsModalCreateUserOpen(true)}
          icon={<PlusOutlined />}
        >
          Add new User
        </Button>
        <CreateUserModal
          token={token}
          getData={getUserTableData}
          isCreateModalOpen={isModalCreateUserOpen}
          setIsCreateModalOpen={setIsModalCreateUserOpen}
        />
        <UpdateUserModal
          token={token}
          getData={getUserTableData}
          isUpdateModalOpen={isModalUpdateUserOpen}
          setIsUpdateModalOpen={setIsModalUpdateUserOpen}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
        />
      </div>
      <div>
        <Table columns={columnTable} dataSource={listUsers} rowKey={"_id"} />
      </div>
    </>
  );
};
export default UsersTable;
