import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './header.less';

const { Header } = Layout;

const SiteHeader = () => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo jobhax-logo-container">
          <div className="jobhax-logo"></div>
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">
            <NavLink to="/" exact>
              Home
            </NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to="/jobs">Jobs</NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to="/login">Login</NavLink>
          </Menu.Item>
        </Menu>
      </Header>
    </Layout>
  );
};

export default SiteHeader;
