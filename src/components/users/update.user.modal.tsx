import { Modal, Input, notification } from "antd";
import { useEffect, useState } from "react";
import { IUser } from "./users.table";
interface IProps {
  token: string;
  getData: any;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: null | IUser;
  setDataUpdate: any;
}
const UpdateUserModal = (props: IProps) => {
  const {
    getData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    token,
    dataUpdate,
    setDataUpdate,
  } = props;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");
  useEffect(() => {
    if (dataUpdate) {
      setAddress(dataUpdate.address);
      setAge(dataUpdate.age);
      setEmail(dataUpdate.email);
      setGender(dataUpdate.gender);
      setName(dataUpdate.name);
      setPassword(dataUpdate.password);
      setRole(dataUpdate.role);
    }
  }, [dataUpdate]);
  const handleOk = async () => {
    const addNewUser = await fetch("http://localhost:8000/api/v1/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    const res = await addNewUser.json();
    if (res.data) {
      // truong hop co data tra ve
      await getData();
      notification.success({
        message: "Tạo mới user thành công",
      });
      setIsUpdateModalOpen(false);
    } else {
      notification.error({
        message: "có lỗi xảy ra",
        description: JSON.stringify(res.message),
      });
    }
  };
  const handleCloseUpdateModal = () => {
    setDataUpdate(null);
    setAddress("");
    setAge(0);
    setEmail("");
    setGender("");
    setName("");
    setPassword("");
    setRole("");
    setIsUpdateModalOpen(false);
  };
  return (
    <>
      <Modal
        maskClosable={false}
        title="Add new user"
        open={isUpdateModalOpen}
        onOk={handleOk}
        onCancel={handleCloseUpdateModal}
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

          <Input value={age} onChange={(event) => setAge(event.target.value)} />
        </div>
        <div>
          <label> Role:</label>

          <Input
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};
export default UpdateUserModal;
