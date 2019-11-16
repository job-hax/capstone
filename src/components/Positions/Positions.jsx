import React, { Component } from "react";
import {
  AutoComplete,
  Pagination,
  Input,
  Switch,
  Icon,
  Select,
  Modal
} from "antd";
import Spinner from "../Partials/Spinner/Spinner.jsx";
import PositionCards from "./PositionCards/PositionCards.jsx";
import Footer from "../Partials/Footer/Footer.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import {
  COMPANY_POSITIONS,
  GET_COMPANY_POSITIONS,
  USERS,
  AUTOCOMPLETE
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

    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.deletePosition = this.deletePosition.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handlePositionsSearch = this.handlePositionsSearch.bind(this);

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
      searchClicked: false,
      modalVisible: false,
      autoCompletePositionsData: [],
      job_title: null,
      responsibilities: "",
      requirements: "",
      city: "",
      state_id: "",
      country_id: "",
      department: "",
      job_type: ""
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

  async handlePositionsSearch(value) {
    this.setState({ job_title: value });
    await this.props.handleTokenExpiration("jobInput handlePositionsSearch");
    let config = { method: "GET" };
    let newUrl = AUTOCOMPLETE("positions") + "?q=" + value + "&count=5";
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          IS_CONSOLE_LOG_OPEN && console.log(response.data);
          let bufferPositionsList = [];
          response.data.data.forEach(position =>
            bufferPositionsList.push(position.job_title)
          );
          this.setState({
            autoCompletePositionsData: bufferPositionsList
          });
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
    const post_body = {
      job_title: this.state.job_title,
      department: this.state.department,
      job_type: this.state.job_type,
      responsibilities: this.state.responsibilities,
      requirements: this.state.requirements,
      city: this.state.city,
      state_id: this.state.state_id,
      country_id: this.state.country_id,
      company_id: this.state.company_id
    };
    axiosCaptcha(COMPANY_POSITIONS, {
      method: "POST",
      body: post_body
    }).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success) {
          this.setState({
            ...this.state,
            modalVisible: false,
            job_title: null,
            responsibilities: "",
            requirements: "",
            city: "",
            state_id: "",
            country_id: "",
            department: "",
            job_type: ""
          });
          this.getPositions("newPageRequest");
        }
      }
    });
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
      const { job_title } = this.state;
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
                    <AutoComplete
                      dataSource={this.state.autoCompletePositionsData}
                      style={{ marginTop: "4px" }}
                      className="input-addJob"
                      onSearch={this.handlePositionsSearch}
                      placeholder="Job Title"
                      value={job_title}
                      onSelect={value => this.setState({ job_title: value })}
                    />
                    <div class="form-group">
                      <Select
                        value={this.state.department}
                        onChange={value => this.setState({ department: value })}
                      >
                        <Option value="">Department</Option>
                        <Option value="Engineering">Engineering</Option>
                        <Option value="Business">Business</Option>
                      </Select>
                    </div>
                    <div class="form-group">
                      <Select
                        value={this.state.job_type}
                        onChange={value => this.setState({ job_type: value })}
                      >
                        <Option value="">Job Type</Option>
                        <Option value="Full Time">Full Time</Option>
                        <Option value="Part Time">Part Time</Option>
                        <Option value="Contractor">Contractor</Option>
                      </Select>
                    </div>
                    <div class="form-group">
                      <div className="info-content-body-item-label">
                        Responsibilities
                      </div>
                      <TextArea
                        rows={4}
                        value={this.state.responsibilities}
                        onChange={event =>
                          this.setState({
                            responsibilities: event.target.value
                          })
                        }
                      />
                    </div>
                    <div class="form-group">
                      <div className="info-content-body-item-label">
                        Requirements
                      </div>
                      <TextArea
                        rows={4}
                        value={this.state.requirements}
                        onChange={event =>
                          this.setState({ requirements: event.target.value })
                        }
                      />
                    </div>
                    <div class="form-group">
                      <Input
                        style={{
                          width: inputWidth
                        }}
                        placeholder="City"
                        value={this.state.city}
                        onChange={event =>
                          this.setState({ city: event.target.value })
                        }
                      />
                    </div>
                    <div class="form-group">
                      <Select
                        value={this.state.state_id}
                        onChange={value => this.setState({ state_id: value })}
                      >
                        <Option value="">State</Option>
                        <Option value="1">CA, USA</Option>
                        <Option value="2">TX, USA</Option>
                      </Select>
                    </div>
                    <div class="form-group">
                      <Select
                        value={this.state.country_id}
                        onChange={value => this.setState({ country_id: value })}
                      >
                        <Option value="">Country</Option>
                        <Option value="1">USA</Option>
                        <Option value="2">Australia</Option>
                      </Select>
                    </div>
                  </Modal>
                </div>
                {this.state.positions.pagination.total_count == 0 ? (
                  <div
                    className="no-data"
                    style={{ textAlign: "center", margin: "24px 0 24px 0" }}
                  >
                    No positions found based on your criteria!
                  </div>
                ) : (
                  this.generatePositions()
                )}
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
