import React from "react";
import { Rate, Input, Button, DatePicker } from "antd";

import { axiosCaptcha } from "../../../../../../../../utils/api/fetch_api.js";
import { IS_CONSOLE_LOG_OPEN } from "../../../../../../../../utils/constants/constants.js";
import { REVIEWS } from "../../../../../../../../utils/constants/endpoints.js";

import "./style.scss";

const descRating = [
  "no hire",
  "weak",
  "average",
  "above average",
  "strong hire"
];

class FeedbackInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      interviewer: "",
      interview_notes: "",
      interview_rating: null,
      interview_date: null
    };

    this.body = {
      company_id: this.props.card.company_object.id,
      position_id: this.props.card.position.id
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInterviewRatingChange = this.handleInterviewRatingChange.bind(
      this
    );
    this.handleInterviewDateChange = this.handleInterviewDateChange.bind(this);
  }

  async componentDidMount() {
    await this.props.handleTokenExpiration("feedbackInput componentDidMount");
    IS_CONSOLE_LOG_OPEN && console.log("old feeback is", this.props.oldReview);
    if (this.props.oldReview.id != -1) {
      this.body["review_id"] = this.props.oldReview.id;
      if (this.props.oldReview.interview_notes != null) {
        this.setState({
          interview_notes: this.props.oldReview.interview_notes
        });
      }
      if (this.props.oldReview.interview_rating != null) {
        this.setState({
          interview_rating: this.props.oldReview.interview_rating
        });
      }
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    await this.props.handleTokenExpiration("reviewInput handleSubmit");
    this.props.toggleReview();
    let config = this.props.card.company_object.review_id
      ? { method: "PUT" }
      : { method: "POST" };
    config.body = this.body;
    axiosCaptcha(REVIEWS, config, "review").then(response => {
      if (response.statusText === "OK") {
        if (response.data.success === true) {
          IS_CONSOLE_LOG_OPEN &&
            console.log("review Submit Request response", response.data.data);
          this.props.setCompany(response.data.data.company);
          this.props.setReview(response.data.data.review);
          this.props.renewReviews();
          this.props.alert(
            5000,
            "success",
            "Your review has saved successfully!"
          );
        } else {
          this.setState({ isUpdating: false });
          this.props.alert(
            5000,
            "error",
            "Error: " + response.data.error_message
          );
        }
      } else {
        this.setState({ isUpdating: false });
        this.props.alert(5000, "error", "Something went wrong!");
      }
    });
    this.body = {
      company_id: this.props.card.company_object.id,
      position_id: this.props.card.position.id
    };
  }

  handleInputChange(event) {
    const newValue = event.target.value;
    const name = event.target.name;
    if (event.target.type === "dropdown") {
      const object = { id: event.target.id, value: event.target.textContent };
      const optionName = event.target.title;
      this.body[optionName + "_id"] = event.target.id;
      this.setState({
        [optionName]: object
      });
    } else {
      this.body[name] = newValue;
      this.setState({ [name]: newValue });
    }
  }

  handleInterviewRatingChange(value) {
    this.body["interview_rating"] = value;
    this.setState({ interview_rating: value });
  }

  handleInterviewDateChange(date, dateString) {
    this.body["interview_date"] = dateString;
    this.setState({ interview_date: date });
  }

  generateInterviewFeedbacksPart() {
    const interviewRatingStyle = { width: "200px" };
    return (
      <div>
        <div className="feedback-header">Interview Feedback</div>
        <div>
          <div className="label">Interviewer:</div>
          <Input
            value={this.state.interviewer}
            onChange={event =>
              this.setState({ interviewer: event.target.value })
            }
          />
        </div>
        <div style={interviewRatingStyle} className="question">
          <div className="label">Overall Rating:</div>
          <Rate
            name="interview_rate"
            value={this.state.interview_rating}
            onChange={this.handleInterviewRatingChange}
            tooltips={descRating}
          />
        </div>
        <div>
          <div className="label">Interview experience:</div>
          <textarea
            id="interview-experience-text"
            name="interview_notes"
            type="text"
            className="text-box interview-experience"
            placeholder="+tell about your interview experience"
            value={this.state.interview_notes}
            onChange={this.handleInputChange}
          />
        </div>
        <div>
          <div className="label">Interview Date:</div>
          <DatePicker
            value={this.state.interview_date}
            onChange={this.handleInterviewDateChange}
          />
        </div>
      </div>
    );
  }

  generateReviewForm() {
    return (
      <div className="feedback-form-container">
        <form>
          <div className="feedback-form">
            <div className="interview-reviews">
              {this.generateInterviewFeedbacksPart()}
              <div className="feedback-button-container">
                <Button onClick={this.props.toggleReview}>Cancel</Button>
                <Button
                  type="primary"
                  style={{ marginLeft: 12 }}
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  render() {
    return <div>{this.generateReviewForm()}</div>;
  }
}

export default FeedbackInput;
