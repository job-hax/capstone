import React from "react";
import {
  Upload,
  message,
  Button,
  Icon,
  DatePicker,
  Input,
  Dropdown,
  Menu,
  Radio,
  Checkbox,
  Tooltip,
  Tabs
} from "antd";
import ReactTelInput from "react-telephone-input";
import moment, { max } from "moment";

import Spinner from "../Partials/Spinner/Spinner.jsx";
import NotificationsBox from "../Partials/NotificationsBox/NotificationsBox.jsx";
import {
  makeTimeBeautiful,
  IS_CONSOLE_LOG_OPEN
} from "../../utils/constants/constants.js";
import { linkedInOAuth } from "../../utils/helpers/oAuthHelperFunctions.js";
import { apiRoot, USERS } from "../../utils/constants/endpoints.js";
import { axiosCaptcha } from "../../utils/api/fetch_api";
import {
  googleClientId,
  jobHaxClientId,
  jobHaxClientSecret
} from "../../config/config.js";
import Footer from "../Partials/Footer/Footer.jsx";
// import "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js";
// import "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js";
// import "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css";
import "./style.scss";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'top',
    };

    this.state = {
      isEditing: false,
      isUpdating: false,
      isDataArrived: false,
      isUpdated: false,
      isProfileSettingsOpen: false,
      isNotificationsChecking: true,
      notificationsList: null,
      employmentStatusList: [],
      selectedDateShowing: new Date(),
      data: null,
      employmentStatus: null,
      gender: null,
      isEmailPublic: true,
      body: {},
      isInitialRequest: "beforeRequest"
    };

    this.body = {};
    this.settingsBody = {};
    this.getEmploymentStatuses = this.getEmploymentStatuses.bind(this);
    this.getProfileData = this.getProfileData.bind(this);
    this.handleGenderClick = this.handleGenderClick.bind(this);
    this.handleStatusClick = this.handleStatusClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
    this.handleSettingsSubmit = this.handleSettingsSubmit.bind(this);
    this.handleStudentMailChange = this.handleStudentMailChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);

    this.handleCompanyNameChange=this.handleCompanyNameChange.bind(this);
    this.handleCompanyWebsiteChange=this.handleCompanyWebsiteChange.bind(this);
    this.handleAboutCompany=this.handleAboutCompany.bind(this);
    this.handleNoOfEmployees=this.handleNoOfEmployees.bind(this);
    this.handleCompanyPhone=this.handleCompanyPhone.bind(this);
    this.handleCompanyFax=this.handleCompanyFax.bind(this);
    this.handleCompanyAddress=this.handleCompanyAddress.bind(this);




    this.handleProfilePhotoUpdate = this.handleProfilePhotoUpdate.bind(this);
    this.handleGoogleOAuth = this.handleGoogleOAuth.bind(this);
    this.handleLinkedInOAuth = this.handleLinkedInOAuth.bind(this);
    this.handlePrivacyEmailCheckbox = this.handlePrivacyEmailCheckbox.bind(
      this
    );
  }

  async componentDidMount() {
    if (this.props.cookie("get", "jobhax_access_token") != "") {
      let notifications = await this.props.notificationCheck();
      this.setState({
        notificationsList: notifications,
        isInitialRequest: true
      });
      this.getEmploymentStatuses();
      this.getProfileData(false);
    }
  }

  async getProfileData(isTokenExpirationChecking) {
    if (this.state.data == null) {
      isTokenExpirationChecking &&
        (await this.props.handleTokenExpiration("profilePage getProfileData"));
      let config = { method: "GET" };
      axiosCaptcha(USERS("profile"), config).then(response => {
        if (response.statusText === "OK") {
          if (response.data.success) {
            this.data = response.data.data;
            this.setState({
              data: this.data,
              isUpdated: true,
              isInitialRequest: false
            });
            if (this.data.dob) {
              this.setState({
                selectedDateShowing: new Date(this.data.dob + "T06:00:00")
              });
            }
            if (this.data.emp_status) {
              this.setState({
                employmentStatus: this.data.emp_status.value
              });
            }
            if (this.data.gender) {
              this.setState({
                gender: this.data.gender
              });
            }
            this.setState({ isEmailPublic: this.data.is_email_public });
          }
        }
      });
    }
  }

  handleLinkedInOAuth() {
    linkedInOAuth();
    let data = this.state.data;
    data.is_linkedin_linked = true;
    this.setState({ data: data });
  }

  handleGoogleOAuth() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          apiKey: "AIzaSyBnF8loY6Vqhs4QWTM_fWCP93Xidbh1kYo",
          clientId: googleClientId,
          scope: "email https://www.googleapis.com/auth/gmail.readonly",
          prompt: "select_account"
        })
        .then(() => {
          this.googleAuth = window.gapi.auth2.getAuthInstance();
          this.googleAuth.signIn().then(response => {
            if (response.Zi.token_type === "Bearer") {
              let photoUrl = response.w3.Paa;
              let googleAccessTokenExpiresOn = new Date();
              googleAccessTokenExpiresOn.setSeconds(
                googleAccessTokenExpiresOn.getSeconds() + response.Zi.expires_in
              );
              const googleAccessToken = this.googleAuth.currentUser
                .get()
                .getAuthResponse().access_token;
              let config = { method: "POST" };
              config.body = {
                client_id: jobHaxClientId,
                client_secret: jobHaxClientSecret,
                provider: "google-oauth2"
              };
              config.body.token = googleAccessToken;
              axiosCaptcha(USERS("linkSocialAccount"), config)
                .then(response => {
                  if (response.statusText === "OK") {
                    if (response.data.success == true) {
                      this.setState({ data: response.data.data });
                      this.props.cookie(
                        "set",
                        "google_access_token_expiration",
                        googleAccessTokenExpiresOn.getTime(),
                        "/",
                        googleAccessTokenExpiresOn
                      );
                      this.props.cookie(
                        "set",
                        "google_login_first_instance",
                        true,
                        "/"
                      );
                    }
                  }
                })
                .then(() => this.postGoogleProfilePhoto(photoUrl));
            }
          });
        });
    });
  }

  postGoogleProfilePhoto(photoURL) {
    let bodyFormData = new FormData();
    bodyFormData.set("photo_url", photoURL);
    let config = { method: "POST" };
    config.body = bodyFormData;
    axiosCaptcha(USERS("updateProfilePhoto"), config).then(response => {
      if (response.statusText === "OK") {
        if (response.data.success == true) {
          this.data = response.data.data;
          this.setState({ data: this.data });
          this.props.setProfilePhotoUrlInHeader();
        }
      }
    });
  }

  getEmploymentStatuses() {
    let config = { method: "GET" };
    axiosCaptcha(USERS("employmentStatuses"), config).then(response => {
      if (response.statusText === "OK") {
        this.employmentStatusList = response.data.data;
        this.setState({
          employmentStatusList: this.employmentStatusList,
          isNotificationsChecking: false
        });
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.submitProfileUpdate(event.target);
  }

  async submitProfileUpdate(target) {
    await this.props.handleTokenExpiration("profilePage submitProfileUpdate");
    this.setState({
      isUpdating: true
    });
    let lastName = null;
    let firstName = null;
    for (let i = 0; i < target.length - 1; i++) {
      if (target[i].name == "last-name") {
        lastName = i;
      } else if (target[i].name == "first-name") {
        firstName = i;
      }
    }
    if (target[firstName].value.trim() != (null || "")) {
      this.body["first_name"] = target[firstName].value.trim();
    }
    if (target[lastName].value.trim() != (null || "")) {
      this.body["last_name"] = target[lastName].value.trim();
    }
    let config = { method: "POST" };
    config.body = this.body;
    axiosCaptcha(USERS("updateProfile"), config, "update_profile").then(
      response => {
        if (response.statusText === "OK") {
          if (response.data.success === true) {
            this.data = response.data.data;
            this.setState({
              data: this.data,
              isUpdating: false,
              isEditing: false,
              isUpdated: true
            });
            this.props.alert(
              5000,
              "success",
              "Your profile have been updated successfully!"
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
      }
    );
    this.body = {};
  }

  handleSettingsSubmit(event) {
    event.preventDefault();
    this.submitSettingsUpdate(event.target);
  }

  async submitSettingsUpdate(target) {
    await this.props.handleTokenExpiration("profilePage submitSettingsUpdate");
    if (target[1].value === target[2].value) {
      this.setState({ isUpdating: true });
      if (target[1].value != (null || "")) {
        this.settingsBody["password"] = target[1].value;
      }
      if (target[0].value != (null || "")) {
        this.settingsBody["username"] = target[0].value;
      }
      let config = { method: "POST" };
      config.body = this.settingsBody;
      axiosCaptcha(USERS("updateProfile"), config, "update_profile").then(
        response => {
          if (response.statusText === "OK") {
            if (response.data.success === true) {
              this.data = response.data.data;
              this.setState({
                data: this.data,
                isUpdating: false,
                isProfileSettingsOpen: false,
                isUpdated: true
              });
              this.props.alert(
                5000,
                "success",
                "Your settings have been updated successfully!"
              );
            } else {
              this.setState({ isUpdating: false });
              this.props.alert(
                5000,
                "error",
                "Error:" + response.data.error_message
              );
            }
          } else {
            this.setState({ isUpdating: false });
            this.props.alert(5000, "error", "Something went wrong!");
          }
        }
      );
      this.settingsBody = {};
    } else
      this.props.alert(
        5000,
        "error",
        "Passwords are not matching!\n Please enter the same password."
      );
  }

  handlePhoneNumberChange(telNumber) {
    this.body["phone_number"] = telNumber;
  }

  handleStudentMailChange(event) {
    this.body["student_email"] = event.target.value.trim();
  }

  handleEmailChange(event) {
    this.body["email"] = event.target.value;
  }

  handleGenderClick(event) {
    this.setState({ gender: event.target.value });
    this.body["gender"] = event.target.value;
  }

  handleStatusClick(event) {
    this.setState({ employmentStatus: event.item.props.value });
    this.body["emp_status_id"] = Number(event.key);
  }

  // company information

  handleCompanyNameChange(event) {
    this.body["companyName"] = event.target.value;
  }

  handleCompanyWebsiteChange(event) {
    this.body["aboutCompany"] = event.target.value;
  }

  handleAboutCompany(event) {
    this.body["companyWebsite"] = event.target.value;
  }

  handleNoOfEmployees(event) {
    this.body["noOfEmployees"] = event.target.value;
  }

  handleCompanyPhone(event) {
    this.body["companyPhone"] = event.target.value;
  }

  handleCompanyFax(event) {
    this.body["companyFax"] = event.target.value;
  }

  handleCompanyAddress(event) {
    this.body["companyAddress"] = event.target.value;
  }

  //end of company information

  handleDatePickerChange(event) {
    this.setState({ selectedDateShowing: event });
    this.body["dob"] = event.toISOString().split("T")[0];
  }

  async handleProfilePhotoUpdate(file) {
    if (
      file.type === "image/png" ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg"
    ) {
      if (file.size < 1024 * 1024 * 2) {
        this.props.alert(5000, "info", "Photo is being uploaded!");
        await this.props.handleTokenExpiration(
          "profilePage handleProfilePhotoUpdate"
        );
        let bodyFormData = new FormData();
        bodyFormData.append("photo", file);
        let config = { method: "POST" };
        config.body = bodyFormData;
        config.headers = {};
        config.headers["Content-Type"] = "multipart/form-data";
        axiosCaptcha(USERS("updateProfilePhoto"), config).then(response => {
          if (response.statusText === "OK") {
            if (response.data.success === true) {
              this.data = response.data.data;
              this.setState({ data: this.data });
              this.props.setProfilePhotoUrlInHeader();
              this.props.alert(
                5000,
                "success",
                "Your profile have been updated successfully!"
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
            this.props.alert(5000, "error", "Something went wrong!");
          }
        });
      } else {
        this.props.alert(
          3000,
          "error",
          "Profile photo must be smaller than 2MB!"
        );
      }
    } else {
      this.props.alert(
        3000,
        "error",
        "Profile photo must be PNG, JPG or JPEG!"
      );
    }
  }

  handlePrivacyEmailCheckbox(event) {
    this.body["is_email_public"] = event.target.checked;
    this.setState({ isEmailPublic: event.target.checked });
  }

  generateNonEditableProfileMainArea() {
    const props = {
      name: "file",
      showUploadList: false,
      action: file => {
        this.handleProfilePhotoUpdate(file);
      }
    };


    // const { mode } = this.state;
    return (
      <div>
        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          style={{ height: 220 }}
        >
          <TabPane tab={<span> <Icon type="user" /> User Profile </span>} key="1">
            <div className="profile-page-left">
              <div className="profile-page-left-first">
                <div className="profile-page-left-first-inside">
                  <div className="profile-image">
                    {this.state.data != null && (
                      <img src={apiRoot + this.state.data.profile_photo} />
                    )}
                  </div>
                  <div className="profile-image-update-container">
                    <div>
                      <Upload {...props}>
                        <Button>
                          <Icon type="upload" /> Update Profile Photo
                  </Button>
                      </Upload>
                    </div>
                  </div>
                  <div className="register-date">
                    {this.state.data != null && this.state.data.date_joined && (
                      <span>
                        Registered on{" "}
                        {makeTimeBeautiful(this.state.data.date_joined, "date")}
                      </span>
                    )}
                  </div>
                  <div className="professional-info-container">
                    <div className="professional-info-header">
                      <img id="workIcon" />
                      Work
              </div>
                    <div className="professional-info-title">
                      <div className="professional-bio-content">professional bio</div>
                    </div>
                    <div className="core-skills-title">
                      <div className="core-skills-content">professional bio</div>
                    </div>
                  </div>
                  <div className="employment-status-big-container">
                    <div className="employment-header">
                      <Icon type="coffee" style={{ fontSize: "120%" }} />
                      <div className="employment-title">Employment Information</div>
                    </div>
                    {this.state.data != null &&
                      this.state.data.company != ("" || null) && (
                        <div className="employment-status-container">
                          <div className="employment-status-label">Company: </div>
                          <div className="employment-status-content">
                            {this.state.data.company.company}
                          </div>
                        </div>
                      )}
                    {this.state.data != null &&
                      this.state.data.job_position != ("" || null) && (
                        <div className="employment-status-container">
                          <div className="employment-status-label">Position: </div>
                          <div className="employment-status-content">
                            {this.state.data.job_position.job_title}
                          </div>
                        </div>
                      )}
                    <div className="employment-status-container">
                      <div className="employment-status-label">
                        Employment Status:{" "}
                      </div>
                      <div className="employment-status-content">
                        {this.state.employmentStatus ? (
                          this.state.employmentStatus
                        ) : (
                            <span className="not-specified-notice">Not specified!</span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-page-main">
                <div className="profile-header">
                  <div className="name">
                    <div className="first-name">
                      {this.state.data != null && this.state.data.first_name ? (
                        this.state.data.first_name
                      ) : (
                          <span>First Name</span>
                        )}
                    </div>
                    <div className="last-name">
                      {this.state.data != null && this.state.data.last_name ? (
                        this.state.data.last_name
                      ) : (
                          <span>Last Name</span>
                        )}
                    </div>
                  </div>
                  {this.state.data != null &&
                    this.state.data.country != ("" || null) && (
                      <div className="location">
                        <Icon type="environment" />
                        <div style={{ margin: "-2px 0px 0px 4px" }}>
                          {this.state.data.state.name +
                            ", " +
                            this.state.data.country.name}
                        </div>
                      </div>
                    )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "spaceBetween"
                    }}
                  >
                    {this.state.data != null &&
                      this.state.data.is_google_linked != true && (
                        <div
                          className="job-position"
                          onClick={() => this.handleGoogleOAuth()}
                        >
                          <Button type="primary">Link With Google</Button>
                        </div>
                      )}
                    {this.state.data != null &&
                      this.state.data.is_linkedin_linked != true && (
                        <div
                          className="job-position"
                          style={{ margin: "0px 0px 0px 20px" }}
                          onClick={() => this.handleLinkedInOAuth()}
                        >
                          <Button type="primary">Link With LinkedIn</Button>
                        </div>
                      )}
                  </div>
                  <div className="city-state" />
                </div>
                <div className="profile-info">
                  <div className="info-header">
                    <div className="info-type-icon">
                      <Icon type="profile" style={{ fontSize: "120%" }} />
                    </div>
                    <div className="info-type-name">About</div>
                  </div>
                  <div className="info-content-container">
                    <div className="info-content-title">Basic Information</div>
                    <div className="info-content-body">
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">Birthday:</div>
                        <div className="info-content-body-item-text">
                          {this.state.data != null && this.state.data.dob ? (
                            makeTimeBeautiful(this.state.data.dob + "T", "date")
                          ) : (
                              <span className="not-specified-notice">
                                Not specified!
                      </span>
                            )}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">Gender:</div>
                        <div className="info-content-body-item-text">
                          {this.state.data != null &&
                            this.state.data.gender != "N" ? (
                              this.state.data.gender == "F" ? (
                                "Female"
                              ) : (
                                  "Male"
                                )
                            ) : (
                              <span className="not-specified-notice">
                                Not specified!
                      </span>
                            )}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">Email:</div>
                        <div className="info-content-body-item-text">
                          {this.state.data != null && this.state.data.email ? (
                            this.state.data.email
                          ) : (
                              <span className="not-specified-notice">
                                Not specified!
                      </span>
                            )}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <Tooltip
                          placement="bottom"
                          title="Share my email with Alumni, Students and Career Services of my University."
                        >
                          <div className="info-content-body-item-label">
                            Connect school:{" "}
                            <Icon
                              type="question-circle"
                              style={{ margin: "0px 0px 0px 4px" }}
                            />
                          </div>
                        </Tooltip>
                        <div className="info-content-body-item-text">
                          {this.state.data != null && (
                            <Checkbox
                              checked={this.state.isEmailPublic}
                              disabled
                            ></Checkbox>
                          )}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">Phone:</div>
                        <div className="info-content-body-item-text">
                          {this.state.data != null && this.state.data.phone_number ? (
                            this.state.data.phone_number
                          ) : (
                              <span className="not-specified-notice">
                                Not specified!
                      </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="city-state" />
                </div>
                <div className="badges-container">
                  <div className="badges-header">
                    <img id="badgesTitleIcon" />
                    Badges
            </div>
                  <div className="badge-icons-container">
                    <img className="badge" />
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab={<span> <Icon type="audit" /> Company Profile </span>} key="2">
            <div className="profile-page-left">
              <div className="profile-page-main">
                <div className="profile-info">
                  <div className="info-header">
                    <div className="info-type-icon">
                      <Icon type="profile" style={{ fontSize: "120%" }} />
                    </div>
                    <div className="info-type-name">Company Profile</div>
                  </div>
                  <div className="info-content-container">
                    {/* <div className="info-content-title">Basic Information</div> */}
                    <div className="info-content-body">
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">E Company Name:</div>
                        <div className="info-content-body-item-text">
                          {this.state.data != null && this.state.data.dob ? (
                            makeTimeBeautiful(this.state.data.dob + "T", "date")
                          ) : (
                              <span className="not-specified-notice">
                                Not specified!
                      </span>
                            )}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">Website:</div>
                        <div className="info-content-body-item-text">
                          {this.state.data != null &&
                            this.state.data.gender != "N" ? (
                              this.state.data.gender == "F" ? (
                                "Female"
                              ) : (
                                  "Male"
                                )
                            ) : (
                              <span className="not-specified-notice">
                                Not specified!
                      </span>
                            )}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">About Company:</div>
                        <div className="info-content-body-item-text">
                          {this.state.data != null && this.state.data.email ? (
                            this.state.data.email
                          ) : (
                              <span className="not-specified-notice">
                                Not specified!
                      </span>
                            )}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <Tooltip
                          placement="bottom"
                          title="Share my email with Alumni, Students and Career Services of my University."
                        >
                          <div className="info-content-body-item-label">
                            Number of Employees:{" "}
                            <Icon
                              type="question-circle"
                              style={{ margin: "0px 0px 0px 4px" }}
                            />
                          </div>
                        </Tooltip>
                        <div className="info-content-body-item-text">
                          {this.state.data != null && (
                            <Checkbox
                              checked={this.state.isEmailPublic}
                              disabled
                            ></Checkbox>
                          )}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">Phone:</div>
                        <div className="info-content-body-item-text">
                          {this.state.data != null && this.state.data.phone_number ? (
                            this.state.data.phone_number
                          ) : (
                              <span className="not-specified-notice">
                                Not specified!
                      </span>
                            )}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">Fax:</div>
                        <div className="info-content-body-item-text">
                          {this.state.data != null && this.state.data.phone_number ? (
                            this.state.data.phone_number
                          ) : (
                              <span className="not-specified-notice">
                                Not specified!
                      </span>
                            )}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">Address:</div>
                        <div className="info-content-body-item-text">
                          {this.state.data != null && this.state.data.phone_number ? (
                            this.state.data.phone_number
                          ) : (
                              <span className="not-specified-notice">
                                Not specified!
                      </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab={<span> <Icon type="setting" /> Profile Settings </span>} key="3">
            <div className="settings-container">
              <div className="settings-header">
                <div>
                  <Icon type="setting" />
                </div>
                <div className="settings-title">Profile Settings</div>
              </div>
              <form onSubmit={this.handleSettingsSubmit}>
                <div className="settings">
                  <div className="setting">
                    <label>
                      User Name:
                            {this.state.data != null && this.state.data.username
                        ? " " + this.state.data.username
                        : " Get one!"}
                      <Input
                        prefix={
                          <Icon
                            type="user"
                            style={{ color: "rgba(0,0,0,.25)" }}
                          />
                        }
                        placeholder="Username"
                        style={{ width: "272px" }}
                      />
                    </label>
                  </div>
                  <div className="setting">
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="password"
                      placeholder="Password"
                      style={{ width: "272px" }}
                    />
                  </div>
                  <div className="setting">
                    <Input
                      prefix={
                        <Icon
                          type="lock"
                          style={{ color: "rgba(0,0,0,.25)" }}
                        />
                      }
                      type="password"
                      placeholder="Confirm Password"
                      style={{ width: "272px" }}
                      onBlur={this.handleConfirmBlur}
                    />
                  </div>
                </div>
                <div className="settings-buttons-container">
                  <div
                    onClick={() =>
                      this.setState({ isProfileSettingsOpen: false })
                    }
                  >
                    <Button>Cancel</Button>
                  </div>
                  <div>
                    <Button
                      type="primary"
                      style={{ margin: "0 120px 0 12px" }}
                      htmlType="submit"
                    >
                      Save
                          </Button>
                  </div>
                </div>
              </form>
            </div>

          </TabPane>
          <TabPane tab={<span> <Icon type="book" /> Academic Information </span>} key="4">
            <div className="info-content-container">
              <div className="info-content-title">Academic Information</div>
              <div className="info-content-body">
                {this.state.data != null &&
                  this.state.data.college != (null || "") &&
                  (this.state.data.user_type.name === "Student" ||
                    this.state.data.user_type.name === "Alumni") && (
                    <div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">
                          University:
                        </div>
                        <div className="info-content-body-item-text">
                          {this.state.data.college.name}
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">
                          Major:
                        </div>
                        <div className="info-content-body-item-text">
                          {this.state.data.major.name}
                        </div>
                      </div>{" "}
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">
                          {this.state.data.user_type.name === "Student"
                            ? "Expected Graduation:"
                            : "Graduation Year:"}
                        </div>
                        <div className="info-content-body-item-text">
                          {this.state.data.grad_year}
                        </div>
                      </div>
                    </div>
                  )}
                <div className="info-content-body-item">
                  <div className="info-content-body-item-label">
                    Student email:
                  </div>
                  <div className="info-content-body-item-text">
                    {this.state.data != null &&
                      this.state.data.student_email ? (
                        this.state.data.student_email
                      ) : (
                        <span className="not-specified-notice">
                          Not specified!
                      </span>
                      )}
                  </div>
                </div>
              </div>
            </div>

          </TabPane>

        </Tabs>


      </div>
    );
  }

  mapEmploymentStatuses() {
    const menu = () => (
      <Menu onClick={event => this.handleStatusClick(event)}>
        {this.state.employmentStatusList.map(status => (
          <Menu.Item key={status.id} value={status.value}>
            {status.value}
          </Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown overlay={menu()} placement="bottomCenter">
        <Button
          className="ant-dropdown-link"
          style={{
            margin: "-8px 0px 0px 0px",
            color: "rgba(0, 0, 0, 0.4)",
            borderColor: "rgb(217, 217, 217)"
          }}
        >
          {this.state.employmentStatus
            ? this.state.employmentStatus
            : "Please Select"}
          <Icon type="down" />
        </Button>
      </Dropdown>
    );
  }

  generateEditableProfileMainArea() {
    const props = {
      name: "file",
      showUploadList: false,
      action: file => {
        this.handleProfilePhotoUpdate(file);
      }
    };
    const dateFormat = "MM.DD.YYYY";
    const { selectedDateShowing } = this.state;
    const inputWidth =
      window.screen.availWidth < 350 ? window.screen.availWidth - 182 : 168;

    return (
      <div>
        <Tabs
          defaultActiveKey="1"
          tabPosition="left"
          style={{ height: 220 }}
        >

          <TabPane tab={<span> <Icon type="user" /> User Profile </span>} key="1">
            <div className="profile-page-left">
              <form className="profile-page-left" onSubmit={this.handleSubmit}>
                <div className="profile-page-left-first">
                  <div className="profile-page-left-first-inside">
                    <div className="profile-image">
                      {this.state.data != null && (
                        <img src={apiRoot + this.state.data.profile_photo} />
                      )}
                    </div>
                    <div className="profile-image-update-container">
                      <div>
                        <Upload {...props}>
                          <Button>
                            <Icon type="upload" /> Update Profile Photo
                    </Button>
                        </Upload>
                      </div>
                    </div>
                    <div className="register-date">
                      <span>Registered on </span>
                      {this.state.data != null &&
                        this.state.data.date_joined &&
                        makeTimeBeautiful(this.state.data.date_joined, "date")}
                    </div>
                    <div className="professional-info-container">
                      <div className="professional-info-header">
                        <img id="workIcon" />
                        Work
                </div>
                      <div className="professional-info-title">
                        <div className="professional-bio-content">
                          professional bio
                  </div>
                      </div>
                      <div className="core-skills-title">
                        <div className="core-skills-content">professional bio</div>
                      </div>
                    </div>
                    <div className="employment-status-big-container">
                      <div className="employment-status-container">
                        <div className="employment-status-label">
                          Employment Status:{" "}
                        </div>
                        <div className="employment-status-content">
                          {this.mapEmploymentStatuses()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="profile-page-main">
                  <div className="profile-header">
                    <div className="name">
                      <div className="first-name">
                        <label>
                          First Name:
                    <Input
                            name="first-name"
                            className="first-name"
                            placeholder={
                              this.state.data != null && this.state.data.first_name
                                ? this.state.data.first_name
                                : "First Name"
                            }
                          />
                        </label>
                      </div>
                      <div className="last-name">
                        <label>
                          Last Name:
                    <Input
                            name="last-name"
                            className="last-name"
                            placeholder={
                              this.state.data != null && this.state.data.last_name
                                ? this.state.data.last_name
                                : "Last Name"
                            }
                          />
                        </label>
                      </div>
                    </div>
                    <div className="job-position" />
                    <div className="city-state" />
                  </div>
                  <div className="profile-info">
                    <div className="info-header">
                      <div className="info-type-icon">
                        <img id="infoTypeIcon" />
                      </div>
                      <div className="info-type-name">About</div>
                    </div>
                    <div className="info-content-container">
                      <div className="info-content-title">Basic Information</div>
                      <div className="info-content-body">
                        <div className="info-content-body-item">
                          <div className="info-content-body-item-label">
                            Birthday:
                    </div>
                          <div className="info-content-body-item-text">
                            <DatePicker
                              onChange={this.handleDatePickerChange}
                              defaultValue={moment(selectedDateShowing, dateFormat)}
                              format={dateFormat}
                              style={
                                window.screen.availWidth > 800
                                  ? {
                                    width: inputWidth,
                                    margin: "-6px 0px 12px 0px"
                                  }
                                  : {
                                    width: inputWidth,
                                    margin: "-6px 0px 12px 5px"
                                  }
                              }
                            />
                          </div>
                        </div>
                        <div className="info-content-body-item">
                          <div className="info-content-body-item-label">Gender:</div>
                          <div className="info-content-body-item-text">
                            <RadioGroup
                              name="gender"
                              style={{ margin: "-6px 0px 4px 5px" }}
                              value={this.state.gender != null && this.state.gender}
                              onChange={this.handleGenderClick}
                            >
                              <RadioButton id="female" value="F">
                                Female
                        </RadioButton>
                              <RadioButton id="male" value="M">
                                Male
                        </RadioButton>
                            </RadioGroup>
                          </div>
                        </div>
                        <div className="info-content-body-item">
                          <div className="info-content-body-item-label">Email:</div>
                          <div className="info-content-body-item-text">
                            <Input
                              style={{
                                width: inputWidth,
                                margin: "-6px 0px 4px 5px"
                              }}
                              onChange={this.handleEmailChange}
                              placeholder={
                                this.state.data != null && this.state.data.email
                                  ? this.state.data.email
                                  : "email"
                              }
                            />
                          </div>
                        </div>
                        <div className="info-content-body-item">
                          <div className="info-content-body-item-label">Profile's public visibility:</div>
                          <div className="info-content-body-item-text">
                            <RadioGroup
                              name="profilevisibility"
                              style={{ margin: "-6px 0px 4px 5px" }}
                              value={this.state.gender != null && this.state.gender}
                              onChange={this.handleGenderClick}
                            >
                              <RadioButton id="on" value="N">
                                On
                        </RadioButton>
                              <RadioButton id="off" value="F">
                                Off
                        </RadioButton>
                            </RadioGroup>
                          </div>
                        </div>
                        <div className="info-content-body-item">
                          <Tooltip
                            placement="bottom"
                            title="Share my email with Alumni, Students and Career Services of my University."
                          >
                            <div className="info-content-body-item-label">
                              Connect school:{" "}
                              <Icon
                                type="question-circle"
                                style={{ margin: "0px 0px 0px 4px" }}
                              />
                            </div>
                          </Tooltip>
                          <div className="info-content-body-item-text">
                            {this.state.data != null && (
                              <Checkbox
                                style={{ margin: "-6px 0px 4px 5px" }}
                                checked={this.state.isEmailPublic}
                                onChange={this.handlePrivacyEmailCheckbox}
                              ></Checkbox>
                            )}
                          </div>
                        </div>
                        <div className="info-content-body-item">
                          <div className="info-content-body-item-label">
                            Student email:
                    </div>
                          <div className="info-content-body-item-text">
                            <label>
                              <Input
                                style={{
                                  width: inputWidth,
                                  margin: "-6px 0px 4px 5px"
                                }}
                                onChange={this.handleStudentMailChange}
                                placeholder={
                                  this.state.data != null &&
                                    this.state.data.student_email
                                    ? this.state.data.student_email.split("@")[0]
                                    : "your student email"
                                }
                              />
                            </label>
                          </div>
                        </div>
                        <div className="info-content-body-item">
                          <div className="info-content-body-item-label">Phone:</div>
                          <div
                            className="info-content-body-item-text"
                            style={
                              window.screen.availWidth > 800
                                ? {
                                  width: inputWidth,
                                  height: 32,
                                  margin: "-6px 0px 0px 0px"
                                }
                                : {
                                  width: inputWidth,
                                  height: 32,
                                  margin: "-6px 0px 0px 5px"
                                }
                            }
                          >
                            <ReactTelInput
                              defaultCountry="us"
                              preferredCountries={["us"]}
                              value={this.state.data.phone_number}
                              flagsImagePath={require("../../assets/icons/flags.png")}
                              onChange={this.handlePhoneNumberChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="badges-container">
                    <div className="badges-header">
                      <img id="badgesTitleIcon" />
                      Badges
              </div>
                    <div className="badge-icons-container">
                      <img className="badge" />
                    </div>
                  </div>
                </div>
              </form>
            </div>

          </TabPane>
          <TabPane tab={<span> <Icon type="audit" /> Company Profile </span>} key="2">

            <div className="profile-page-left">
              <div className="profile-page-left-first">
                <div className="info-content-body-item">
                  <div className="info-content-body-item-label">
                  </div>
                  <div className="info-content-body-item-text">
                    <div className="company-logo">
                      {this.state.data != null && (
                        <img src={apiRoot + this.state.data.profile_photo} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="info-content-body-item">
                  <div className="info-content-body-item-label">
                  </div>
                  <div className="info-content-body-item-text">
                    <div className="company-logo-update-container">
                      <div>
                        <Upload {...props}>
                          <Button>
                            <Icon type="upload" /> Update Company Logo
                                </Button>
                        </Upload>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="profile-page-main" style={{ margin: "0px 90px 0px 0px !important" }}>
                <div className="profile-info">
                  <div className="info-header">
                    <div className="info-type-icon">
                      <img id="infoTypeIcon" />
                    </div>
                    <div className="info-type-name">Compnay Profile</div>
                  </div>
                  <div className="info-content-container">
                    <div className="info-content-title">Basic Information</div>
                    <div className="info-content-body">
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">
                          Company Name:
                    </div>
                        <div className="info-content-body-item-text">
                          <Input
                            style={{
                              width: inputWidth,
                              margin: "-6px 0px 4px 5px"
                            }}
                            onChange={this.handleCompanyNameChange}
                            placeholder="Enter Company Name"
                          />
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">
                          Website:
                    </div>
                        <div className="info-content-body-item-text">
                          <Input
                            style={{
                              width: inputWidth,
                              margin: "-6px 0px 4px 5px"
                            }}
                            onChange={this.handleCompanyWebsiteChange}
                            placeholder="Enter compnay website"
                          />
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">
                          About Company:
                    </div>
                        <div className="info-content-body-item-text">
                          <TextArea rows={4}
                            style={{
                              // width: inputWidth,
                              margin: "-6px 0px 4px 5px"
                            }}
                            onChange={this.handleAboutCompany}
                            placeholder="Describe about the compnay"
                          />
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">
                          Number of Employees:
                    </div>
                        <div className="info-content-body-item-text">
                          <Input
                            style={{
                              width: inputWidth,
                              margin: "-6px 0px 4px 5px"
                            }}
                            onChange={this.handleNoOfEmployees}
                            placeholder="No Of Employees"
                          />
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">Phone:</div>
                        <div
                          className="info-content-body-item-text"
                          style={
                            window.screen.availWidth > 800
                              ? {
                                width: inputWidth,
                                height: 32,
                                // margin: "-6px 0px 0px 0px"
                              }
                              : {
                                width: inputWidth,
                                height: 32,
                                // margin: "-6px 0px 0px 5px"
                              }
                          }
                        >
                          <ReactTelInput
                            defaultCountry="us"
                            preferredCountries={["us"]}
                            value={this.state.data.phone_number}
                            flagsImagePath={require("../../assets/icons/flags.png")}
                            onChange={this.handleCompanyPhone}
                          />
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">
                          Fax:
                    </div>
                        <div className="info-content-body-item-text">
                          <Input
                            style={{
                              width: inputWidth,
                              margin: "-6px 0px 4px 5px"
                            }}
                            onChange={this.handleCompanyFax}
                            placeholder="Enter Fax#"
                          />
                        </div>
                      </div>
                      <div className="info-content-body-item">
                        <div className="info-content-body-item-label">
                          Address:
                    </div>
                        <div className="info-content-body-item-text">
                          <Input
                            style={{
                              width: inputWidth,
                              margin: "-6px 0px 4px 5px"
                            }}
                            onChange={this.handleCompanyAddress}
                            placeholder="Enter office address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </TabPane>
          <TabPane tab={<span> <Icon type="setting" /> Profile Settings </span>} key="3">
            <div className="profile-page-left">
              <div className="profile-page-main">
                <div className="profile-info">
                  <div className="settings-container">
                    {/* <div className="settings-header">
                      <div>
                        <Icon type="setting" />
                      </div>
                      <div className="settings-title">Profile Settings</div>
                    </div> */}
                    <form onSubmit={this.handleSettingsSubmit}>
                      <div className="settings">
                        <div className="setting">
                          <label>
                            User Name:
                            {this.state.data != null && this.state.data.username
                              ? " " + this.state.data.username
                              : " Get one!"}
                            <Input
                              prefix={
                                <Icon
                                  type="user"
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
                              placeholder="Username"
                              style={{ width: "272px" }}
                            />
                          </label>
                        </div>
                        <div className="setting">
                          <Input
                            prefix={
                              <Icon
                                type="lock"
                                style={{ color: "rgba(0,0,0,.25)" }}
                              />
                            }
                            type="password"
                            placeholder="Password"
                            style={{ width: "272px" }}
                          />
                        </div>
                        <div className="setting">
                          <Input
                            prefix={
                              <Icon
                                type="lock"
                                style={{ color: "rgba(0,0,0,.25)" }}
                              />
                            }
                            type="password"
                            placeholder="Confirm Password"
                            style={{ width: "272px" }}
                            onBlur={this.handleConfirmBlur}
                          />
                        </div>
                      </div>
                      <div className="settings-buttons-container">
                        <div
                          onClick={() =>
                            this.setState({ isProfileSettingsOpen: false })
                          }
                        >
                          <Button>Cancel</Button>
                        </div>
                        <div>
                          <Button
                            type="primary"
                            style={{ margin: "0 120px 0 12px" }}
                            htmlType="submit"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab={<span> <Icon type="book" /> Academic Information </span>} key="4">Academic Information</TabPane>

        </Tabs>
      </div >
    );
  }


  render() {
    const notificationsBoxHeight = this.state.isProfileSettingsOpen
      ? { maxHeight: "200px" }
      : { height: "fit-content" };

    const heightForSettings = this.state.isProfileSettingsOpen
      ? { height: "320px" }
      : { height: "180px" };

    const vw = window.screen.availWidth / 100;
    const buttonsLeft = Math.min(90 * vw, 364) + Math.min(vw * 5, 36);
    const buttonsStyle = {
      transform: `translateX(calc(${buttonsLeft}px - 100%))`
    };

    const customNotificationsBoxStyle = {
      boxShadow: "none",
      borderRadius: "16px",
      border: "1px solid rgba(126, 126, 126, 0.4)",
      marginLeft: Math.min(vw * 5, 36),
      zIndex: 0,
      notificationsBoxHeight,
      position: "relative",
      width: "90vw",
      maxWidth: 364,
      right: 0
    };
    if (this.state.isInitialRequest === "beforeRequest")
      return <Spinner message="Reaching your account..." />;
    if (this.state.data == null) {
      return <Spinner message="Reaching profile data..." />;
    }
    if (this.state.isUpdating) {
      return <Spinner message="Updating your profile data..." />;
    }
    return (
      <div>
        <div className="profile-page-big-container">
          <div className="profile-page-medium-container">
            <div className="save-button-container">
              <Button type="primary" htmlType="submit">
                Save
                </Button>
            </div>

            <div className="profile-page-container">
              {/* {!this.state.isEditing
                ? this.generateNonEditableProfileMainArea()
                : this.generateEditableProfileMainArea()} */}
              {this.generateEditableProfileMainArea()}
              <div className="profile-page-right">
                <Button
                  type={!this.state.isEditing ? "primary" : ""}
                  className="edit-button"
                  style={buttonsStyle}
                  onClick={() =>
                    this.setState({ isEditing: !this.state.isEditing })
                  }
                >
                  {!this.state.isEditing ? "Edit" : "Cancel"}
                </Button>
                {/* <div
                  className="profile-notifications"
                  style={heightForSettings}
                >
                  <NotificationsBox
                    notificationsList={this.props.notificationsList}
                    customBoxStyle={customNotificationsBoxStyle}
                    itemListHeight={notificationsBoxHeight}
                  />
                </div> */}
                <div className="to-do-list" />
                {this.state.isProfileSettingsOpen && (

                  <h1>Moved to left</h1>
                )}
                {!this.state.isProfileSettingsOpen && (
                  <Button
                    type="primary"
                    className="profile-settings-button"
                    style={buttonsStyle}
                    onClick={() =>
                      this.setState({
                        isProfileSettingsOpen: !this.state.isProfileSettingsOpen
                      })
                    }
                  >
                    Profile Settings
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 80 }}>
          <Footer />
        </div>
      </div>
    );
  }
}

export default ProfilePage;
