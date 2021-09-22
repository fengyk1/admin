import React from 'react';
import { Layout, Menu } from 'antd';
import { useHistory } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const SiderMenu: React.FC = () => {
  const history = useHistory()
  const menuList = [
    {
      key: 'home',
      menuText: '首页',
      path: '/'
    },
    {
      key: 'person_center',
      menuText: '个人中心',
      children: [
        {
          key: 'person_info',
          menuText: '个人信息',
          path: '/user'
        },
        {
          key: 'user_manage',
          menuText: '用户管理',
          path: '/user-manage'
        },
      ],
    },
  ];
  // 根据key获取menu
  const getMenuItemByKey = (list:any,key:string) =>{
    let menuItem:any = null
    for(let i = 0;i<list.length;i++){
      if (list[i].key === key){
        menuItem = list[i]
        break
      }else{
        if (list[i].children && list[i].children.length){
          menuItem = getMenuItemByKey(list[i].children,key)
          if (menuItem) break
        }
      }
    }
    return menuItem
  }
  return (
    <Sider collapsible>
      <div
        className="logo"
        style={{
          height: 60,
          color: '#fff',
          textAlign: 'center',
          lineHeight: '60px',
        }}
      >
        logo
      </div>
      <Menu theme="dark" selectedKeys={['home']} mode="inline" onSelect={({ key, keyPath, domEvent })=>{
        const menuItem = getMenuItemByKey(menuList,key)
        history.push(menuItem.path)
      }}>
        {menuList.map((menu) => {
          const { children } = menu;
          if (children?.length) {
            return (
              <SubMenu key={menu.key} title={menu.menuText}>
                {children.map((subMenu) => (
                  <Menu.Item key={subMenu.key}>{subMenu.menuText}</Menu.Item>
                ))}
              </SubMenu>
            );
          }
          return <Menu.Item key={menu.key}>{menu.menuText}</Menu.Item>;
        })}
      </Menu>
    </Sider>
  );
};


const PageLayout: React.FC = (props) => {
  const { children } = props;
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderMenu />
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: 0, color: '#fff', textAlign: 'center' }}
        >
          header
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>footer</Footer>
      </Layout>
    </Layout>
  );
};
export default PageLayout;
