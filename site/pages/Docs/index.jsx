import React, { PureComponent } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { Menu, Icon } from 'dragon-ui';
import AsyncComponent from '@site/components/AsyncComponent';
import { components } from '@site/demos';
import Format from '@site/utils/format';
import Container from '@site/components/Container';
import Header from '@site/components/Header';
import ScrollToTop from '@site/components/ScrollToTop';
import './Docs.scss';

class Page extends PureComponent {
  getMenu = (groupName, key) => {
    const { history, match } = this.props;
    return (
      <Menu.SubMenu title={groupName} key={key}>
        {
          components[key].map(component => (
            <Menu.Item key={Format.camel2Dash(component.name)} onClick={() => history.replace(`${match.path}/${Format.camel2Dash(component.name)}`)}>
              <div className="menu-item-content">
                <span>{component.name}</span>
                <span className="chinese">{component.description}</span>
              </div>
            </Menu.Item>
          ))
        }
      </Menu.SubMenu>
    );
  }

  render() {
    const { location, history, match } = this.props;
    const { form, feedback, view, navigation } = components;
    const iframeURL = location.pathname.split('/')[2] !== 'quick-start'
      ? `https://zarm.design/#/${location.pathname.split('/')[2]}`
      : 'https://zarm.design';

    return (
      <Container className="docs-page">
        <Header />
        <main>
          <div className="side-bar">
            <div className="menu">
              <Menu
                defaultOpenKeys={['components', 'form', 'feedback', 'view', 'navigation']}
                defaultSelectedKeys={[location.pathname.split('/')[2]]}
              >
                <Menu.Item onClick={() => history.replace(`${match.path}/quick-start`)}>快速上手</Menu.Item>
                <Menu.SubMenu title="组件" key="components">
                  {this.getMenu('数据录入', 'form')}
                  {this.getMenu('操作反馈', 'feedback')}
                  {this.getMenu('数据展示', 'view')}
                  {this.getMenu('导航', 'navigation')}
                </Menu.SubMenu>
              </Menu>
            </div>
          </div>
          <div className="main-container">
            <Switch>
              {
                [...form, ...feedback, ...view, ...navigation].map((component, i) => {
                  return <Route key={+i} path={`${match.path}/${Format.camel2Dash(component.name)}`} component={AsyncComponent(() => import(`../${component.name}Page`))} />;
                })
              }
              <Route path={`${match.path}/quick-start`} component={AsyncComponent(() => import('../QuickStart'))} />
              <Redirect to="/" />
            </Switch>
          </div>
          <div className="simulator">
            <iframe src={iframeURL} title="simulator" frameBorder="0" style={{ width: 375, height: 667 }} />
          </div>
          <ScrollToTop>
            <div className="scroll-to-top">
              <Icon type="arrow-top" />
            </div>
          </ScrollToTop>
        </main>
      </Container>
    );
  }
}

export default withRouter(Page);
