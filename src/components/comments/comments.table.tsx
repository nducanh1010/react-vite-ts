import { Button, Popconfirm, message, notification } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

interface IComments {
  _id: string;
  content: string;
  moment: number;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
  };
  track: {
    _id: string;
    title: string;
    description: string;
    trackUrl: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
const CommentsTable = () => {
  const [listComments, setListComments] = useState([]);
  const access_token = localStorage.getItem("access_token") as string;
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const res = await fetch(
      `http://localhost:8000/api/v1/comments?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const d = await res.json();
    if (!d.data) {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
    await setListComments(d.data.result);
    await setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };
  const confirm = async (comment: IComments) => {
    const deleteComment = await fetch(
      `http://localhost:8000/api/v1/comments/${comment._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const res = await deleteComment.json();
    if (res.data) {
      message.success(" Xóa Comment thành công");
      await getData();
    } else {
      notification.error({
        message: JSON.stringify(res.message),
      });
    }
  };

  const columns: ColumnsType<IComments> = [
    //OPTIONS
    {
      dataIndex: "_id",
      title: "STT",
      render: (value, record, index) => {
        // tính vị trí soosthuws tự
        return <>{(meta.current - 1) * meta.pageSize + index + 1}</>;
      },
    },
    {
      title: "Content",
      dataIndex: "content",
    },
    {
      title: "Track",
      dataIndex: ["track", "title"],
    },
    {
      title: "User",
      dataIndex: ["user", "email"],
    },
    {
      title: "Actions",
      render: (value, record) => {
        return (
          <>
            <Popconfirm
              title="Delete the Comments"
              description="Are you sure to delete this task?"
              onConfirm={() => confirm(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ marginLeft: "10px" }} danger>
                Delete{" "}
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const handleChangePagination = async (page: number, pageSize: number) => {
    const resp = await fetch(
      `http://localhost:8000/api/v1/Comments?current=${page}&pageSize=${pageSize}`,
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
    await setListComments(usersData.data.result);
    await setMeta({
      current: usersData.data.meta.current,
      pageSize: usersData.data.meta.pageSize,
      pages: usersData.data.meta.pages,
      total: usersData.data.meta.total,
    });
  };
  return (
    <>
      <div>
        <Table
          columns={columns}
          dataSource={listComments}
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
export default CommentsTable;
