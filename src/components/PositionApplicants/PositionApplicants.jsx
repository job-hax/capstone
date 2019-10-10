import React, { Component } from "react";
import { Pagination, Input, Switch, Icon, Select } from "antd";
import Footer from "../Partials/Footer/Footer.jsx";

import "./style.scss";



const { Search } = Input;
const { Option } = Select;

class PositionApplicants extends Component {
    render() {
        return (
            <div>
                <div className="companies-big-container">
                    <div className="companies-container">
                        <div className="title">
                            <h2>Position Applicants</h2>
                        </div>
                        <table class="table table-light">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">First</th>
                                    <th scope="col">Last</th>
                                    <th scope="col">Handle</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td><img src="https://randomuser.me/api/portraits/women/17.jpg"></img></td>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>@mdo</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td><img src="https://randomuser.me/api/portraits/men/27.jpg" className="imgAvatar"></img></td>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>@fat</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td><img src="https://randomuser.me/api/portraits/women/2.jpg" className="imgAvatar"></img></td>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                            </tbody>
                            </table>
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
