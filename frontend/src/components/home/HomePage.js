import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import * as agreementActions from '../../redux/actions/agreementActions';

class HomePage extends React.Component {
  componentDidMount() {
    const { actions } = this.props;
    actions.loadAgreement().catch(error => {
      console.error('Loading agreement failed' + error);
    });
  }

  render() {
    return (
      <div className="jumbotron">
        <h1>Home Page</h1>
      </div>
    );
  }
}

HomePage.propTypes = {
  agreement: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    agreement: state.agreement
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadAgreement: bindActionCreators(
        agreementActions.loadAgreement,
        dispatch
      )
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
