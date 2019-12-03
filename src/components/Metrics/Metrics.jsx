import React, { PureComponent } from "react";
import CompanyGraphCard from "./CompanyGraphCard/CompanyGraphCard.jsx";
import Footer from "../Partials/Footer/Footer.jsx";
import { Table, Divider, Tag } from 'antd';

import { axiosCaptcha } from "../../utils/api/fetch_api";
import { USERS } from "../../utils/constants/endpoints.js";
import {
  IS_CONSOLE_LOG_OPEN,
  USER_TYPES,
  USER_TYPE_NAMES
} from "../../utils/constants/constants.js";
import Map from "./SubComponents/Map/Map.jsx";
import IndividualMetrics from "./SubComponents/IndividualMetrics/IndividualMetrics.jsx";
import UniversityMetrics from "./SubComponents/UniversityMetrics/UniversityMetrics.jsx";

import "./style.scss";

// start of positions
const positionscolumns = [
  {
    title: '',
    dataIndex: 'color',
    key: 'color',
    render: text => <div className="colorcode"></div>,
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '%',
    dataIndex: 'percentage',
    key: 'percentage',
  },
  {
    title: 'Count',
    dataIndex: 'count',
    key: 'count',
  },
];

const positionsdata = [
  {
    key: '1',
    value: 'DevOps',
    percentage: '17.00%',
    count: '12'
  },
  {
    key: '2',
    value: 'Software Engineering',
    percentage: '15.00%',
    count: '10'
  },
  {
    key: '3',
    value: 'Azure Architect',
    percentage: '12.00%',
    count: '5'
  },
];

const schoolsdata = [
  {
    key: '1',
    value: 'ITU',
    percentage: '17.00%',
    count: '18'
  },
  {
    key: '2',
    value: 'San Jose State University',
    percentage: '15.00%',
    count: '12'
  },
  {
    key: '3',
    value: 'UC Berkely',
    percentage: '12.00%',
    count: '10'
  },
];

// end of positions

class Metrics extends PureComponent {
  
  constructor(props) {
    super(props);
  }

  generateCompanyGraphCard() {
    return
    <div>
      <CompanyGraphCard
      />
    </div>
  }

  render() {
    const { state } = this;
    return (
      <div>
        <div className="title"><h2>Metrics</h2>
          <div className="cdiv"><h3>Company</h3>
            {this.generateCompanyGraphCard()}
          </div>
          <div className="cdiv"><h3>Positions</h3>
            <Table columns={positionscolumns} dataSource={positionsdata} pagination={false} />
          </div>
          <div className="cdiv"><h3>Schools</h3>
          <Table columns={positionscolumns} dataSource={schoolsdata} pagination={false}/>
          </div>
          <div className="cdiv"><h3>Degree</h3>
          <Table columns={positionscolumns} dataSource={positionsdata} pagination={false}/>
          </div>
          <div className="cdiv"><h3>Skills</h3>
          <Table columns={positionscolumns} dataSource={positionsdata} pagination={false}/>
          </div>
          <div className="cdiv"><h3>Certificates</h3>
          <Table columns={positionscolumns} dataSource={positionsdata} pagination={false}/>
          </div>
          <div className="cdiv"><h3>Spoken Languages</h3>
          <Table columns={positionscolumns} dataSource={positionsdata} pagination={false}/>
          </div>
          <div className="cdiv"><h3>Summary</h3>
          <Table columns={positionscolumns} dataSource={positionsdata} pagination={false}/>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default Metrics;
