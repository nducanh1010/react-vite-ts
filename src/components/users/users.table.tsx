import { useEffect, useState } from "react";
import "../../styles/users.css";
import { Button, Input, Modal, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { ColumnsType } from "antd/es/table";
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}
const UsersTable = () => {
  const [listUsers, setListUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  useEffect(() => {
    console.log("useEffect");
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
    const resp = await fetch("http://localhost:8000/api/v1/users/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const usersData = await resp.json();
    setListUsers(usersData.data.result);
    console.log("check data", data);
    console.log("check data users", usersData);
    // setListUsers(usersData)
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
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
          Add new User
        </Button>
        <Modal
          maskClosable={false}
          title="Add new user"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div>
            <label> Name:</label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <label> Email:</label>

            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label> Password:</label>

            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div>
            <label> Address:</label>

            <Input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </div>
          <div>
            <label> Gender :</label>

            <Input
              value={gender}
              onChange={(event) => setGender(event.target.value)}
            />
          </div>
          <div>
            <label> Age:</label>

            <Input
              value={age}
              onChange={(event) => setAge(event.target.value)}
            />
          </div>
          <div>
            <label> Role:</label>

            <Input
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />
          </div>
        </Modal>
      </div>
      <div>
        <Table columns={columnTable} dataSource={listUsers} rowKey={"_id"} />
      </div>
    </>
  );
};
export default UsersTable;
