import React, { Component } from "react";

class ApplicantCards extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { applicant } = this.props;
        return (
            <React.Fragment>
                    <td>
                        {applicant.firstname}
                    </td>
                    <td>
                        {applicant.lastname}
                    </td>
                    <td>
                        {applicant.location}
                    </td>
                    <td>
                        {applicant.experience}
                    </td>
                    <td>
                        {applicant.salary}
                    </td>
            </React.Fragment>
            );
    }
}

export default ApplicantCards;
