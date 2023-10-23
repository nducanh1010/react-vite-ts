import {
  Modal,
  Input,
  notification,
  Form,
  InputNumber,
  Select,
  Checkbox,
} from "antd";
import { useEffect, useState } from "react";
import { IUser } from "./users.table";
interface IProps {
  getData: any;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: null | IUser;
  setDataUpdate: any;
  access_token: string;
}
const UpdateUserModal = (props: IProps) => {
  const {
    getData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    access_token,
    dataUpdate,
    setDataUpdate,
  } = props;
  const { Option } = Select;
  const [form] = Form.useForm();
  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        _id: dataUpdate._id,
        name: dataUpdate.name,
        email: dataUpdate.email,
        password: dataUpdate.password,
        age: dataUpdate.age,
        gender: dataUpdate.gender,
        role: dataUpdate.role,
        address: dataUpdate.address,
      });
    }
  }, [dataUpdate]);
  const handleCloseUpdateModal = () => {
    form.resetFields();
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
  };
  const onFinish = async (values: any) => {
    const { name, address, email, age, gender, role } = values;

    if (dataUpdate) {
      const data = {
        _id: dataUpdate._id,
        name,
        address,
        email,
        age,
        gender,
        role,
      };
      const updateUser = await fetch("http://localhost:8000/api/v1/users/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(data),
      });
      const res = await updateUser.json();
      if (res.data) {
        // truong hop co data tra ve
        await getData();
        notification.success({
          message: "Cap nhat user thành công",
        });
        setIsUpdateModalOpen(false);
        handleCloseUpdateModal();
      } else {
        notification.error({
          message: "có lỗi xảy ra",
          description: JSON.stringify(res.message),
        });
      }
    }
  };
  return (
    <>
      <Modal
        maskClosable={false}
        title="Update new user"
        open={isUpdateModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCloseUpdateModal}
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
            rules={[
              {
                required: dataUpdate ? false : true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password disabled={dataUpdate ? true : false} />
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
      </Modal>
    </>
  );
};
export default UpdateUserModal;
