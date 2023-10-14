import {
  Modal,
  Input,
  notification,
  Button,
  Form,
  Checkbox,
  Select,
  InputNumber,
} from "antd";
import { useState } from "react";
interface IProps {
  access_token: string;
  getData: any;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}
const CreateUserModal = (props: IProps) => {
  const { getData, isCreateModalOpen, setIsCreateModalOpen, access_token } =
    props;
  const { Option } = Select;
  const [form] = Form.useForm();
  const handleCloseCreateModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };
  const onFinish = async (values: any) => {
    console.log("val", values);
    const { name, email, password, age, gender, role, address } = values;
    const data = { name, email, password, age, gender, role, address };
    const addNewUser = await fetch("http://localhost:8000/api/v1/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(data),
    });
    const res = await addNewUser.json();
    if (res.data) {
      // truong hop co data tra ve
      await getData();
      notification.success({
        message: "Tạo mới user thành công",
      });
      setIsCreateModalOpen(false);
    } else {
      notification.error({
        message: "có lỗi xảy ra",
        description: JSON.stringify(res.message),
      });
    }
  };
  return (
    <>
      <Modal
        maskClosable={false}
        title="Add new user"
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCloseCreateModal}
      >
        <Form
          name="basic"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          form={form} // state của form, giống ref Vuejs
        >
          <Form.Item
            label="Username"
            name="name"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email !" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            style={{ width: "100%" }}
            rules={[{ required: true, message: "Please input your age!" }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
            <Select placeholder="Select your gender" allowClear>
              <Option value="MALE">male</Option>
              <Option value="FEMALE">female</Option>
              <Option value="OTHER">other</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true }]}>
            <Select placeholder="Select your Role" allowClear>
              <Option value="USER">user</Option>
              <Option value="ADMIN">admin</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
        </Form>
        {/* <div>
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
        </div> */}
      </Modal>
    </>
  );
};
export default CreateUserModal;
