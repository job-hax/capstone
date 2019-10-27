import React, { PureComponent } from "react";
import classNames from "classnames";
import { AutoComplete, Input, Select, Icon, Menu, Button } from "antd";

import { IS_CONSOLE_LOG_OPEN } from "../../../utils/constants/constants";
import { axiosCaptcha } from "../../../utils/api/fetch_api";
import { AUTOCOMPLETE } from "../../../utils/constants/endpoints";

import "./style.scss";

class JobInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      jobTitle: "",
      autoCompletePositionsData: []
    };
    this.handlePositionsSearch = this.handlePositionsSearch.bind(this);
    this.handleAddNewApplication = this.handleAddNewApplication.bind(this);
    this.cancelJobInputEdit = this.cancelJobInputEdit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event, type) {
    event.preventDefault();
    if (type === "first_name") {
      this.setState({ first_name: event.target.value });
    }
    if (type === "last_name") {
      this.setState({ last_name: event.target.value });
    }
  }

  async handlePositionsSearch(value) {
    this.setState({ jobTitle: value });
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

  handleAddNewApplication() {
    const { columnName } = this.props;
    this.props.toggleJobInput();
    this.props
      .addNewApplication({
        columnName,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        title: this.state.jobTitle
      })
      .then(({ ok }) => {
        if (ok) {
          this.setState({
            first_name: "",
            last_name: "",
            jobTitle: ""
          });
        }
      });
  }

  cancelJobInputEdit() {
    this.props.toggleJobInput();
    this.setState({
      first_name: "",
      last_name: "",
      jobTitle: ""
    });
  }

  render() {
    const { showInput, toggleJobInput } = this.props;
    const { first_name, last_name, jobTitle } = this.state;
    return (
      <div>
        <form
          className="column-addJob-form"
          onSubmit={this.handleAddNewApplication}
        >
          <Input
            placeholder="First Name"
            value={this.state.first_name}
            onChange={event => this.handleInputChange(event, "first_name")}
          />
          <Input
            placeholder="Last Name"
            value={this.state.last_name}
            onChange={event => this.handleInputChange(event, "last_name")}
          />
          <AutoComplete
            dataSource={this.state.autoCompletePositionsData}
            style={{ marginTop: "4px" }}
            className="input-addJob"
            onSearch={this.handlePositionsSearch}
            placeholder="Job Title"
            value={jobTitle}
            onSelect={value => this.setState({ jobTitle: value })}
          />
          <div className="column-addJob-form-buttons-container">
            <button
              className="column-addJob-form-button"
              type="reset"
              onClick={this.cancelJobInputEdit}
            >
              Cancel
            </button>
            <Button
              type="primary"
              disabled={
                first_name.trim().length < 1 ||
                last_name.trim().length < 1 ||
                jobTitle.trim().length < 1
              }
              onClick={this.handleAddNewApplication}
            >
              Add Job
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default JobInput;
