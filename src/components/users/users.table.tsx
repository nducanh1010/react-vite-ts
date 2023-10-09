import { useEffect, useState } from "react";
import "../../styles/users.css";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}
const UsersTable = () => {
  const [listUsers, setListUsers] = useState([]);
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
  return (
    <div>
      <Table columns={columnTable} dataSource={listUsers} rowKey={"_id"} />
      {/* <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alfreds Futterkiste</td>
            <td>Maria Anders</td>
            <td>Germany</td>
          </tr>
        </tbody>
      </table> */}
    </div>
  );
};
export default UsersTable;
