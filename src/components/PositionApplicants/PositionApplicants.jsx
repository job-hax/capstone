import React, { Component } from "react";
import { Pagination, Input, Switch, Icon, Select } from "antd";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";



const { Search } = Input;
const { Option } = Select;

class PositionApplicants extends Component {

  constructor(props) {
    super(props)
    this.state = {
      applicants: [
        { firstname: 'Shiva', lastname: 'John', location: 'San Jose, CA , USA', experience: '7+', salary: '$140,000', application: '', resume: '' },
        { firstname: 'Larissa', lastname: 'Ken', location: 'Milpitas, CA , USA', experience: '6+', salary: '$150,000', application: '', resume: '' },
        { firstname: 'Richard', lastname: 'Son', location: 'San Francisco, CA , USA', experience: '6+', salary: '$130,000', application: '', resume: '' },
        { firstname: 'Syerra', lastname: 'Erris', location: 'San Mateo, CA , USA', experience: '8+', salary: '$170,000', application: '', resume: '' },
        { firstname: 'Wasif', lastname: 'Kevin', location: 'Foster City, CA , USA', experience: '7+', salary: '$125,000', application: '', resume: '' },
        { firstname: 'Ram', lastname: 'Lotig', location: 'Sunnyvale, CA , USA', experience: '6+', salary: '$145,000', application: '', resume: '' }
      ]
    }
  }

  renderTableHeader() {
    let header = Object.keys(this.state.applicants[0])
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  renderTableData() {
    return this.state.applicants.map((applicant, index) => {
      const { firstname, lastname, location, experience, salary } = applicant //destructuring
      return (
        <tr key={Math.random()}>
          <td>{firstname}</td>
          <td>{lastname}</td>
          <td>{location}</td>
          <td>{experience}</td>
          <td>{salary}</td>
          <td><i className="fa fa-download"></i></td>
          <td><i className="fa fa-download"></i></td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        <div className="companies-big-container">
          <div class="col-md-10">
            <div className="title">
              <h2>Applicants</h2>
            </div>

            <div class="table-responsive m-b-40">
              <table id='applicants' className="table table-borderless table-striped table-earning">
                <thead>
                  <tr>{this.renderTableHeader()}</tr>
                </thead>
                <tbody>
                  {this.renderTableData()}
                </tbody>
              </table>
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

export default PositionApplicants;
