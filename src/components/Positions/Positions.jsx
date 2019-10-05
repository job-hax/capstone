import React, { Component } from "react";
import { Pagination, Input, Switch, Icon, Select } from "antd";
import PositionCards from "./PositionCards/PositionCards.jsx";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";

const { Search } = Input;
const { Option } = Select;

class Positions extends Component {
  constructor(props) {
    super(props);

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
