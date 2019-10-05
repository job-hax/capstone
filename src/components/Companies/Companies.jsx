import React from "react";
import { Pagination, Input, Switch, Icon, Checkbox } from "antd";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import CompanyCards from "./CompanyCards/CompanyCards.jsx";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import { USERS, COMPANIES } from "../../utils/constants/endpoints.js";
import { IS_CONSOLE_LOG_OPEN } from "../../utils/constants/constants.js";
import Footer from "../Partials/Footer/Footer.jsx";
import { Form, Button } from 'antd';

import "./style.scss";

const Search = Input.Search;

class CreateCompanyProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isWaitingResponse: false,
      isInitialRequest: "beforeRequest",
      isNewPageRequested: false,
      isDetailsRequested: false,
      companies: {},
      pageNo: 1,
      pageSize: 10,
      q: "",
      hasReview: false,
      mine: true,
      searchClicked: false
    };

    this.handlePageChange = this.handlePageChange.bind(this);
    this.urlBuilder = this.urlBuilder.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      this.setState({ isInitialRequest: true });
      await this.getData("initialRequest");
      let config = { method: "POST" };
      axiosCaptcha(USERS("verifyRecaptcha"), config, "companies").then(
        response => {
          if (response.statusText === "OK") {
            if (response.data.success != true) {
              this.setState({ isUpdating: false });
              IS_CONSOLE_LOG_OPEN &&
                console.log(response, response.data.error_message);
              this.props.alert(
                5000,
                "error",
                "Error: " + response.data.error_message
              );
            }
          }
        }
      );
    }
  }

  componentDidUpdate() {
    if (this.props.cookie("get", "jobhax_access_token") != ("" || null)) {
      if (this.state.isNewPageRequested === true) {
        this.getData("newPageRequest");
        this.setState({ isNewPageRequested: false });
      }
      if (this.state.isQueryRequested === true) {
        this.getData("queryRequest");
        this.setState({ isQueryRequested: false });
      }
    }
  }

  componentWillMount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.addEventListener("mousedown", this.handleClickOutside, false);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.state.q == ("" || null || false)) {
        this.setState({ searchClicked: false });
      }
    }
  }

  urlBuilder(list) {
    let parameterList = [];
    for (let i = 0; i <= list.length - 1; i++) {
      if (
        this.state[list[i]] != "" &&
        this.state[list[i]] != null &&
        this.state[list[i]] != false
      ) {
        parameterList.push({
          name: list[i],
          value: this.state[list[i]]
        });
      }
    }
    return parameterList;
  }

  async getData(requestType) {
    this.setState({ isWaitingResponse: true });
    const parameters = this.urlBuilder(["q", "hasReview", "mine"]);
    let config = { method: "GET" };
    let newUrl =
      COMPANIES +
      "?page=" +
      this.state.pageNo +
      "&page_size=" +
      this.state.pageSize;
    parameters.forEach(
      parameter =>
        (newUrl = newUrl + "&" + parameter.name + "=" + parameter.value)
    );
    await this.props.handleTokenExpiration("companies getData");
    axiosCaptcha(newUrl, config).then(response => {
      if (response.statusText === "OK") {
        if (requestType === "initialRequest") {
          this.setState({
            companies: response.data,
            isWaitingResponse: false,
            isInitialRequest: false
          });
        } else if (requestType === "newPageRequest") {
          this.setState({
            companies: response.data,
            isWaitingResponse: false,
            isNewPageRequested: false
          });
        } else if (requestType === "queryRequest") {
          this.setState({
            companies: response.data,
            isWaitingResponse: false,
            isQueryRequested: false
          });
        }

        IS_CONSOLE_LOG_OPEN &&
          console.log("companies response.data data", response.data);
      }
    });
  }

  handlePageChange(page) {
    this.setState({ pageNo: page, isNewPageRequested: true });
  }

  generateFeatureArea() {
    return (
      <div id="profile">
        <form>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="txtCompanyName">Company Name</label>
              <input type="text" class="form-control" id="txtCompanyName" placeholder="Company Name"></input>
            </div>
            <div class="form-group col-md-6">
              <label for="txtWebsite">Website</label>
              <input type="text" class="form-control" id="txtWebsite" placeholder="Website"></input>
            </div>
          </div>
          <div class="form-group">
            <label for="inputAddress">Address</label>
            <input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St"></input>
          </div>
          <div class="form-group">
            <label for="inputAddress2">Address 2</label>
            <input type="text" class="form-control" id="inputAddress2" placeholder="Address 2"></input>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
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
            <div class="form-group col-md-2">
              <label for="inputZip">Zip</label>
              <input type="text" class="form-control" id="inputZip"></input>
            </div>
          </div>
          
          <button type="submit" class="ant-btn ant-btn-primary">Save</button>
        </form>

      </div>

    );

  }

  generateCompanyCards() {
    return this.state.companies.data.map(company => (
      <div key={company.id}>
        <CompanyCards
          company={company}
          handleTokenExpiration={this.props.handleTokenExpiration}
        />
      </div>
    ));
  }

  render() {
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    else if (this.state.isInitialRequest === true)
      return <Spinner message="Preparing companies..." />;
    if (this.state.isNewPageRequested === true)
      return <Spinner message={"Preparing page " + this.state.pageNo} />;
    if (this.state.isInitialRequest === false) {
      return (
        <div>
          <div className="companies-big-container">
            <div className="companies-container">
            <div className="title">
                  <h4>Create/Edit Company Profile</h4>
                </div>
              {this.generateFeatureArea()}
              <div className="company-cards-container">
                
              </div>
            </div>
          </div>
          <div
            className={
              this.state.companies.pagination.total_count < 2
                ? "bottom-fixed-footer"
                : ""
            }
          >
            <Footer />
          </div>
        </div>
      );
    }
  }
}

export default CreateCompanyProfile;
