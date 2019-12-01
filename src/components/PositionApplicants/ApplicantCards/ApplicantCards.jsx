import React, { Component } from "react";
import { Modal, Select } from "antd";
import { Table, Divider, Tag } from 'antd'

import "./style.scss";

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>Invite {record.name}</a>
        <Divider type="vertical" />
        <a>Delete</a>
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

class ApplicantCards extends Component {
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
    return (

      <Table columns={columns} dataSource={data} />
      // <div>
      // <>
      //     <td>Column1</td><td>Column2</td><td>Column3</td><td>Column4</td><td>Column5</td><td>Column6</td>
      //     </>
      /* <div className="applicant-card">
        <div className="applicant-card-img">
          <img src="https://randomuser.me/api/portraits/women/87.jpg"></img>
        </div>
        <div className="applicant-card-detail">
          <h3>{applicant.name}</h3>
          <div className="small-text all-caps">
            {applicant.location} - {applicant.department} - {applicant.type}
          </div>
          <div className="small-text">Posted at: {applicant.date}</div>
        </div>
        <div className="applicant-card-button">
          <Select defaultValue="">
                  <Option value="">Action</Option>
                  <Option value="sf">Edit</Option>
                  <Option value="dr">Download Resume</Option>
                  <Option value="da">Download Application</Option>
                  <Option value="mv">Archive</Option>
                  <Option value="sj">Reject</Option>
                </Select>
        </div>
        <Modal
          title="Software Engineer"
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Minimum qualifications:</p>
          <ul>
            <li>
              BS degree in Computer Science, similar technical field of study or
              equivalent practical experience.
            </li>
            <li>
              Software development experience in one or more general purpose
              programming languages.
            </li>
            <li>
              Experience working with two or more from the following: web
              application development, Unix/Linux environments, mobile
              application development, distributed and parallel systems, machine
              learning, information retrieval, natural language processing,
              networking, developing large software systems, and/or security
              software development.
            </li>
            <li>
              Working proficiency and communication skills in verbal and written
              English.
            </li>
          </ul>
        </Modal>
      </div> */
      // </div>
    );
  }
}

export default ApplicantCards;
