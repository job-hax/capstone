import React, { Component } from "react";
import { Modal, Select } from "antd";
import { Table, Divider, Tag } from "antd";

import "./style.scss";

const columns = [
  {
    title: "Full Name",
    dataIndex: "name",
    key: "name",
    render: text => <a>{text}</a>
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role"
  },
  {
    title: "Years Of Experience",
    dataIndex: "yearsofexperience",
    key: "yearsofexperience"
  },
  {
    title: "Expected Salary",
    dataIndex: "expectedsalary",
    key: "expectedsalary"
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <span>
        <a>Invite {record.name}</a>
        <Divider type="vertical" />
        <a>Delete</a>
      </span>
    )
  }
];

const data = [
  {
    key: "1",
    name: "John Brown",
    yearsofexperience: 7,
    role: "Software Engineer",
    expectedsalary: "120,000"
  },
  {
    key: "2",
    name: "Scott Davidson Brown",
    yearsofexperience: 8,
    role: "DevOps Engineer",
    expectedsalary: "110,000"
  },
  {
    key: "3",
    name: "Thomos Joyner",
    yearsofexperience: 6,
    role: "Test Engineer",
    expectedsalary: "90,000"
  }
];

class ApplicantTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  showModal() {
    this.setState({ ...this.state, modalVisible: true });
  }

  handleOk() {
    this.setState({ ...this.state, modalVisible: false });
  }

  handleCancel() {
    this.setState({ ...this.state, modalVisible: false });
  }

  render() {
    const { applicant } = this.props;
    return <Table columns={columns} dataSource={data} />;
  }
}

export default ApplicantTable;
