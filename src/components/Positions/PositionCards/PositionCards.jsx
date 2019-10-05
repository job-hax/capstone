import React, { Component } from "react";
import { Modal, Button } from "antd";

import "./style.scss";

class PositionCards extends Component {
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
    const { position } = this.props;
    return (
      <div className="position-card">
        <div className="position-card-img">
          <img src="https://logo.clearbit.com/testout.com"></img>
        </div>
        <div className="position-card-detail">
          <h3>{position.position}</h3>
          <div className="small-text all-caps">
            {position.location} - {position.department} - {position.type}
          </div>
          <div className="small-text">Posted at: {position.date}</div>
        </div>
        <div className="position-card-button">
          <Button type="primary" onClick={this.showModal}>
            LEARN MORE
          </Button>
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
      </div>
    );
  }
}

export default PositionCards;
