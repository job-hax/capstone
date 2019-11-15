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
    this.handleDeletePosition = this.handleDeletePosition.bind(this);
  }

  handleDeletePosition() {
    this.props.deletePosition(this.props.position.id);
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
          <h3>{position.job.job_title}</h3>
          <div className="small-text all-caps">
            {position.city} - {position.department} - {position.job_type}
          </div>
          <div className="small-text">Posted at: {position.created_date}</div>
        </div>
        <div className="position-card-button">
          <Button
            type="primary"
            onClick={this.showModal}
            className="btn-view-edit"
          >
            LEARN MORE
          </Button>
          <Button type="primary" className="btn-view-edit">
            EDIT
          </Button>
          <Button
            type="primary"
            className="btn-delete"
            onClick={this.handleDeletePosition}
          >
            DELETE
          </Button>
        </div>
        <Modal
          title={position.job.job_title}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <h4>RESPONSIBILITES:</h4>
          <p>{position.responsibilities}</p>
          <h4>REQUIREMENTS:</h4>
          <p>{position.requirements}</p>
        </Modal>
      </div>
    );
  }
}

export default PositionCards;
