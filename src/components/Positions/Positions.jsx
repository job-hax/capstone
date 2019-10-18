import React, { Component } from "react";
import { Pagination, Input, Switch, Icon, Select, Modal } from "antd";
import PositionCards from "./PositionCards/PositionCards.jsx";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const inputWidth =
  window.screen.availWidth < 350 ? window.screen.availWidth - 182 : 168;

class Positions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false
    };

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      isDetailsRequested: false,
      positions: [
        {
          company: "google",
          position: "Software Engineer",
          location: "Sunnyvale, CA, USA",
          department: "Engineering",
          type: "Full Time",
          date: "10/01/2019"
        },
        {
          company: "google",
          position: "DevOp",
          location: "Sunnyvale, CA, USA",
          department: "Engineering",
          type: "Full Time",
          date: "10/01/2019"
        },
        {
          company: "google",
          position: "Software Engineer",
          location: "Sunnyvale, CA, USA",
          department: "Engineering",
          type: "Full Time",
          date: "10/01/2019"
        },
        {
          company: "google",
          position: "Software Engineer",
          location: "Sunnyvale, CA, USA",
          department: "Engineering",
          type: "Full Time",
          date: "10/01/2019"
        }
      ],
      pageNo: 1,
      pageSize: 10,
      q: "",
      mine: true,
      searchClicked: false
    };
  }

  generatePositions() {
    return this.state.positions.map(position => (
      <div key={position.id}>
        <PositionCards
          position={position}
          handleTokenExpiration={this.props.handleTokenExpiration}
        />
      </div>
    ));
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
    return (
      <div>
        <div className="positions-big-container">
          <div className="positions-container">
            <div className="title">
              <h2>Positions</h2>
            </div>

            <div className="positions-card-container">
              <Search placeholder="search" />
              <div className="positions-filter">
                <div>Filter by:</div>
                <Select defaultValue="">
                  <Option value="">Location</Option>
                  <Option value="sf">San Francisco</Option>
                  <Option value="mv">Mountain View</Option>
                  <Option value="sj">San Jose</Option>
                </Select>
                <Select defaultValue="">
                  <Option value="">Department</Option>
                  <Option value="sf">Sales</Option>
                  <Option value="mv">Engineering</Option>
                  <Option value="sj">Human Resource</Option>
                </Select>
                <Select defaultValue="">
                  <Option value="">Type</Option>
                  <Option value="sf">Full Time</Option>
                  <Option value="mv">Part Time</Option>
                  <Option value="sj">Contractor</Option>
                </Select>

                <button type="submit" class="ant-btn ant-btn-primary" onClick={this.showModal}>Create Position</button>

                <Modal
                  title="Create Position"
                  visible={this.state.modalVisible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  <div class="form-group">
                    <div className="info-content-body-item-label">Position Title</div>
                    <Input placeholder="Enter Position Title" />
                  </div>
                  <div class="form-group">
                    <div className="info-content-body-item-label">Category</div>
                    <Select defaultValue="">
                      <Option value="">Category</Option>
                      <Option value="eng">Engineering</Option>
                      <Option value="dops">Dev Ops</Option>
                    </Select>

                  </div><div class="form-group">
                    <div className="info-content-body-item-label">Status</div>
                    <Select defaultValue="">
                      <Option value="">Position Status</Option>
                      <Option value="o">Open</Option>
                      <Option value="h">Hold</Option>
                      <Option value="c">Closed</Option>
                    </Select>
                  </div>
                  <div class="form-group">
                    <div className="info-content-body-item-label">Job Description</div>
                    <TextArea rows={4} />
                  </div>
                  <div class="form-group">
                    <div className="info-content-body-item-label">City</div>
                    <Input style={{
                      width: inputWidth
                    }} placeholder="City" />
                  </div>
                  <div class="form-group">
                    <div className="info-content-body-item-label">State</div>
                    <Select defaultValue="">
                      <Option value="">State</Option>
                      <Option value="o">CA, USA</Option>
                      <Option value="h">TX, USA</Option>
                    </Select>
                  </div>
                  <div class="form-group">
                    <div className="info-content-body-item-label">Country</div>
                    <Select defaultValue="">
                      <Option value="">Country</Option>
                      <Option value="o">USA</Option>
                      <Option value="h">Australia</Option>
                    </Select>
                  </div>
                  {/* <button type="submit" class="ant-btn ant-btn-primary">Save</button>
                          <button type="submit" class="vbtn">Delete</button> */}
                </Modal>
              </div>
              {this.generatePositions()}
            </div>
          </div>
        </div>
        <div className="bottom-fixed-footer">
          <Footer />
        </div>
      </div >
    );
  }
}

export default Positions;
