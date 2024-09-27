import React from 'react';
import {  MenuNav } from '@/index';

export default () => {
  return <div style={{ borderBottom: '1px solid rgba(51,51,51,0.2)'}}>
      <MenuNav>
        <MenuNav.SubMenu title="标题1" active >
          <MenuNav.Item >
            <a href="#">标题1.1</a>
          </MenuNav.Item>
          <MenuNav.Item >
            <a href="#" className="active">标题1.2</a>
          </MenuNav.Item>
        </MenuNav.SubMenu>

        <MenuNav.Item>
            <a href="#">标题2</a>
        </MenuNav.Item>

        <MenuNav.Item >
            <a href="#">标题3</a>
        </MenuNav.Item>

        <MenuNav.SubMenu title={<a href="#">标题4</a>}>
            <MenuNav.Item >
              <a href="#">标题4.1</a>
            </MenuNav.Item>
            <MenuNav.Item active>
              <a href="#">标题4.2</a>
            </MenuNav.Item>
            <MenuNav.Item >
              <a href="#">标题4.3</a>
            </MenuNav.Item>
        </MenuNav.SubMenu>

        <MenuNav.SubMenu  title={<span>标题5</span>}>
            <MenuNav.Item >
              <a href="#">标题5.1</a>
            </MenuNav.Item>
            <MenuNav.Item >
              <a href="#" >标题5.2</a>
            </MenuNav.Item>
        </MenuNav.SubMenu>

    </MenuNav>
  </div>
 

}
