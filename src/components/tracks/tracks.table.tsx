import { Button, Popconfirm, message, notification } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";

export interface ITracks {
  _id: string;
  title: string;
  description: string;
  category: string;
  imgUrl: string;
  trackUrl: string;
  countLike: number;
  countPlay: number;
}
const TracksTable = () => {
  const [listTracks, setListTracks] = useState([]);
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
      `http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
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
    await setListTracks(d.data.result);
    await setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };
  const confirm = async (track: ITracks) => {
    const deleteTrack = await fetch(
      `http://localhost:8000/api/v1/tracks/${track._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const res = await deleteTrack.json();
    if (res.data) {
      message.success(" Xóa Track thành công");
      await getData();
    } else {
      notification.error({
        message: JSON.stringify(res.message),
      });
    }
  };

  const columns: ColumnsType<ITracks> = [
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
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Track url",
      dataIndex: "trackUrl",
    },
    {
      title: "Uploader",
      dataIndex: ["uploader", "name"], // = uploader.name
    },
    {
      title: "Actions",
      render: (value, record) => {
        return (
          <>
            <Popconfirm
              title="Delete the tracks"
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
      `http://localhost:8000/api/v1/tracks?current=${page}&pageSize=${pageSize}`,
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
    await setListTracks(usersData.data.result);
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
          dataSource={listTracks}
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
export default TracksTable;
