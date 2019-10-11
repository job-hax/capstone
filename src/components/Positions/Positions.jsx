import React, { Component } from "react";
import { Pagination, Input, Switch, Icon, Select, Modal } from "antd";
import PositionCards from "./PositionCards/PositionCards.jsx";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";

const { Search } = Input;
const { Option } = Select;

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
                  <div class="form-row">
                    <div class="form-group col-md-6">
                      <label for="txtPositionTitle">Position Title</label>
                      <input type="text" class="form-control" id="txtPositionTitle" placeholder="Enter Position Title"></input>
                    </div>

                  </div>
                  <div class="form-group">
                    <label for="txtPositionCategory">Category</label>
                    <select id="ddlCategory" class="form-control">
                      <option selected>Choose...</option>
                      <option>--Select--</option>
                      <option>Engineering</option>
                      <option>Dev Ops</option>
                    </select>
                  </div><div class="form-group">
                    <label for="txtPositionStatus">Position Status</label>
                    <select id="ddlStatus" class="form-control">
                      <option selected>Choose...</option>
                      <option>--Select--</option>
                      <option>Open</option>
                      <option>Hold</option>
                      <option>Closed</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="inputAbout">Job Description</label>
                    <textarea rows="4" cols="50" class="form-control" id="inputAbout" placeholder="Describe about the job">
                    </textarea>
                  </div>
                  <div class="form-row">
                    <div class="form-group col-md-4">
                      <label for="inputCity">City</label>
                      <input type="text" class="form-control" id="inputCity"></input>
                    </div>
                    <div class="form-group col-md-4">
                      <label for="inputState">State</label>
                      <select id="inputState" class="form-control">
                        <option selected>Choose...</option>
                        <option>...</option>
                      </select>
                    </div>
                    <div class="form-group col-md-4">
                      <label for="inputZip">Country</label>
                      <select id="inputState" class="form-control">
                        <option selected>Choose...</option>
                        <option>...</option>
                      </select>
                    </div>
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
      </div>
    );
  }
}

export default Positions;
