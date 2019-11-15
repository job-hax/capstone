import React, { Component } from "react";
import { Pagination, Input, Switch, Icon, Select, Modal } from "antd";
import Spinner from "../Partials/Spinner/Spinner.jsx";
import PositionCards from "./PositionCards/PositionCards.jsx";
import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import {
  COMPANY_POSITIONS,
  GET_COMPANY_POSITIONS,
  USERS
} from "../../utils/constants/endpoints.js";

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
    this.deletePosition = this.deletePosition.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      isDetailsRequested: false,
      company_id: null,
      positions: {
        data: [],
        pagination: {}
      },
      pageNo: 1,
      pageSize: 10,
      q: "",
      mine: true,
      searchClicked: false
    };
  }

  async componentDidMount() {
    this.setState({ isInitialRequest: true });

    axiosCaptcha(USERS("profile"), { method: "GET" }).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.data = response.data.data;
          this.setState({
            company_id: this.data.company.id
          });

          this.getPositions("initialRequest");
        }
      }
    });
  }

  componentDidUpdate() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      if (this.state.isNewPageRequested === true) {
        this.getPositions("newPageRequest");
        this.setState({ isNewPageRequested: false });
      }
      if (this.state.isQueryRequested === true) {
        this.getData("queryRequest");
        this.setState({ isQueryRequested: false });
      }
    }
  }

  getPositions(requestType) {
    axiosCaptcha(
      GET_COMPANY_POSITIONS(
        `${this.state.company_id}&page_size=${this.state.pageSize}&page=${this.state.pageNo}`
      ),
      {
        method: "GET"
      }
    ).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.data = response.data;
          if (requestType === "initialRequest") {
            this.setState({
              positions: {
                data: this.data.data,
                pagination: this.data.pagination
              },
              isWaitingResponse: false,
              isInitialRequest: false
            });
          } else if (requestType === "newPageRequest") {
            this.setState({
              positions: {
                data: this.data.data,
                pagination: this.data.pagination
              },
              isWaitingResponse: false,
              isNewPageRequested: false
            });
          } else if (requestType === "queryRequest") {
            this.setState({
              positions: {
                data: this.data.data,
                pagination: this.data.pagination
              },
              isWaitingResponse: false,
              isQueryRequested: false
            });
          }
        }
      }
    });
  }

  deletePosition(id) {
    axiosCaptcha(COMPANY_POSITIONS, {
      method: "DELETE",
      body: { position_id: id }
    }).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.getPositions("newPageRequest");
        }
      }
    });
  }

  handlePageChange(page) {
    this.setState({ pageNo: page, isNewPageRequested: true });
  }

  generatePositions() {
    return this.state.positions.data.map(position => (
      <div key={position.id}>
        <PositionCards
          position={position}
          deletePosition={this.deletePosition}
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
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing positions..." />;
    if (this.state.isNewPageRequested === true)
      return <Spinner message={"Preparing page " + this.state.pageNo} />;
    if (this.state.isInitialRequest === false) {
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

                  <button
                    type="submit"
                    class="ant-btn ant-btn-primary"
                    onClick={this.showModal}
                  >
                    Create Position
                  </button>

                  <Modal
                    title="Create Position"
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                  >
                    <div class="form-group">
                      <div className="info-content-body-item-label">
                        Position Title
                      </div>
                      <Input placeholder="Enter Position Title" />
                    </div>
                    <div class="form-group">
                      <div className="info-content-body-item-label">
                        Category
                      </div>
                      <Select defaultValue="">
                        <Option value="">Category</Option>
                        <Option value="eng">Engineering</Option>
                        <Option value="dops">Dev Ops</Option>
                      </Select>
                    </div>
                    <div class="form-group">
                      <div className="info-content-body-item-label">Status</div>
                      <Select defaultValue="">
                        <Option value="">Position Status</Option>
                        <Option value="o">Open</Option>
                        <Option value="h">Hold</Option>
                        <Option value="c">Closed</Option>
                      </Select>
                    </div>
                    <div class="form-group">
                      <div className="info-content-body-item-label">
                        Job Description
                      </div>
                      <TextArea rows={4} />
                    </div>
                    <div class="form-group">
                      <div className="info-content-body-item-label">City</div>
                      <Input
                        style={{
                          width: inputWidth
                        }}
                        placeholder="City"
                      />
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
                      <div className="info-content-body-item-label">
                        Country
                      </div>
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

                <div className="pagination-container">
                  <Pagination
                    onChange={this.handlePageChange}
                    defaultCurrent={
                      this.state.positions.pagination.current_page
                    }
                    current={this.state.positions.pagination.current_page}
                    total={this.state.positions.pagination.total_count}
                  />
                </div>
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
}

export default Positions;
