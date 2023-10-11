import { useEffect, useState } from "react";
import "../../styles/users.css";
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Table,
  message,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { ColumnsType } from "antd/es/table";
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";
import { error } from "console";
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
  const access_token = localStorage.getItem("access_token") as string;
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 2,
    pages: 10,
    total: 0,
  });
  useEffect(() => {
    getUserTableData();
  }, []);
  const handleUpdateUser = (userRows: IUser) => {
    setDataUpdate(userRows);
    setIsModalUpdateUserOpen(true);
  };
  const handleDeleteUser = async (userRows: IUser) => {};

  const getUserTableData = async () => {
    const resp = await fetch(
      `http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const usersData = await resp.json();
    if (!usersData.data) {
      notification.error({
        message: JSON.stringify(usersData.message),
      });
    }
    await setListUsers(usersData.data.result);
    await setMeta({
      current: usersData.data.meta.current,
      pageSize: usersData.data.meta.pageSize,
      pages: usersData.data.meta.pages,
      total: usersData.data.meta.total,
    });
  };
  const handleChangePagination = async (page: number, pageSize: number) => {
    setMeta({
      current: page,
      pageSize: pageSize,
      pages: meta.pages,
      total: meta.total,
    });
    const resp = await fetch(
      `http://localhost:8000/api/v1/users?current=${page}&pageSize=${pageSize}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const usersData = await resp.json();
    if (!usersData.data) {
      notification.error({
        message: JSON.stringify(usersData.message),
      });
    }
    await setListUsers(usersData.data.result);
  };
  const confirm = async (userRows: IUser) => {
    const deleteUser = await fetch(
      `http://localhost:8000/api/v1/users/${userRows._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const res = await deleteUser.json();
    if (res.data) {
      message.success("Xoas User thành công");
      await getUserTableData();
    } else {
      notification.error({
        message: JSON.stringify(res.message),
      });
    }
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
        return (
          <>
            <Button onClick={() => handleUpdateUser(record)}>Edit </Button>
            <Popconfirm
              title="Delete the user"
              description="Are you sure to delete this task?"
              onConfirm={() => confirm(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                style={{ marginLeft: "10px" }}
                danger
                onClick={() => handleDeleteUser(record)}
              >
                Delete{" "}
              </Button>
            </Popconfirm>
          </>
        );
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
          access_token={access_token}
          getData={getUserTableData}
          isCreateModalOpen={isModalCreateUserOpen}
          setIsCreateModalOpen={setIsModalCreateUserOpen}
        />
        <UpdateUserModal
          access_token={access_token}
          getData={getUserTableData}
          isUpdateModalOpen={isModalUpdateUserOpen}
          setIsUpdateModalOpen={setIsModalUpdateUserOpen}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
        />
      </div>
      <div>
        <Table
          columns={columnTable}
          dataSource={listUsers}
          rowKey={"_id"}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            total: meta.total,
            showTotal: (total, range) =>
              `${range[0]} - ${range[1]} of ${total} items`,
            onChange: (page: number, pageSize: number) =>
              handleChangePagination(page, pageSize),
            showSizeChanger: true,
          }}
        />
      </div>
    </>
  );
};
export default UsersTable;
