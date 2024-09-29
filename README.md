## 问题描述

1. 点击基座左侧导航进行切换时，若使用 `microApp.router.push` 的方式会报错`[micro-app] 导航失败，请确保子应用渲染后再调用此方法`, 但是`react-router-dom`自己的 `useNavigate` 则不会报错


2. 快速切换基座导航， 会报错 `Uncaught ChunkLoadError: Loading chunk App failed`， 目前我是采用防抖结合微应用加载的钩子函数来解决这个问题， 请问下有什么更好的方式推荐吗?

3. 不知道这算不算bug 还是刻意设计成这样的：微应用的html标签上的属性并没有被转移到micro-app标签上， 而是直接被忽略了， 但是 body上的属性是被转移到了 `micro-app-body`上的

4. 微应用`micro-app-1`中 通过子路由 实现了两个子应用 `subApp1` 和 `subApp2`，在基座中的配置 如下
示例4.1：
```javascript
<Route key={'micro-app-1-subApp1'} path={'/host-app/micro-app-1/subApp1/*'} element={<micro-app baseroute="/host-app/micro-app-1" url="/host-app/micro-app-1" name="micro-app-1-subApp1" />} />
<Route key={'micro-app-1-subApp2'} path={'/host-app/micro-app-1/subApp2/*'} element={<micro-app baseroute="/host-app/micro-app-1" url="/host-app/micro-app-1" name="micro-app-1-subApp2" />} />
```
router-mode 模式为 'native', 目前路由跳转正常。 但官方文档给出的示例的是下面这种配置方式， 然后再在点击导航栏的时候通过`microApp.router.push`的方式进行跳转
示例4.2：
```javascript
<Route key={'micro-app-1'} path={'/host-app/micro-app-1/*'} element={<micro-app baseroute="/host-app/micro-app-1" url="/host-app/micro-app-1" name="micro-app-1" />} />
/>
```

问：示例4.2的方式会产生额外代码去维护导航栏的高亮逻辑， 比如在刷新页面的情况下， 是否可以只使用示例4.1的方式进行配置， 示例4.1方式目前跳转都是正常， 不知道是否会有别的什么潜在问题？


5. 基座 和  微应用 同时通过模块联邦的方式引入了 一个远程组件库 `RemoteLib`, 微应用的webpack如果按下进行配置：
会报错 
`Uncaught (in promise) Error: Container initialization failed as it has already been initialized with a different share scope
while loading "." from webpack/container/reference/RemoteLib`

```javascript
const config = {
 ...,
  plugins: [
    new ModuleFederationPlugin({
      name: 'RemoteLib',
      remotes: {
        RemoteLib: 'RemoteLib@/remote-lib/remoteEntry.js',
      }
    })
  ]
}
```

目前的一个解决方式：将微应用中`RemoteLib`的webpack配置改成了如下配置，
该方式目前可以解决基座和微应用都使用同一个模块联邦的问题(参考的webpack官方文档：https://webpack.js.org/concepts/module-federation/#promise-based-dynamic-remotes)

```javascript
const config = {
 ...,
  plugins: [
    new ModuleFederationPlugin({
      name: 'RemoteLib',
      remotes: {
      RemoteLib: `promise new Promise(resolve => {
      const urlParams = new URLSearchParams(window.location.search)
      const version = urlParams.get('app1VersionParam')
      // This part depends on how you plan on hosting and versioning your federated modules
      const remoteUrlWithVersion = '/remote-lib/remoteEntry.js'
      const script = document.createElement('script')
      script.src = remoteUrlWithVersion
      script.onload = () => {
        // the injected script has loaded and is available on window
        // we can now resolve this Promise
        const proxy = {
          get: (request) => window.RemoteLib.get(request),
          init: (...arg) => {
            try {
              return window.RemoteLib.init(...arg)
            } catch(e) {
              console.log('remote container already initialized')
            }
          }
        }
        resolve(proxy)
      }
      // inject this script with the src set to the versioned remoteEntry.js
      document.head.appendChild(script);
    })
    `,
      }
    })
  ]
}
```

问： 是否有`micro-zoe`的方式解决该报错？

6. 在基座中的微应用使用通过模块联邦使用的组件库中的window对象 是基座中的window对象 而不是微应用自身的window对象
尝试在微应用使用远程组件库时，在远程组件库`RemoteLib`中打印
```javascript
window.__MICRO_APP_BASE_APPLICATION__ true
```
当微应用将自身的window传入`RemoteLib`输出的组件，并在`RemoteLib`再次打印
```javascript
appRealWindow.__MICRO_APP_ENVIRONMENT__ true
```
该现象表示：基座和微应用都能正常获取自身的window， 但基座和微应用通过模块联邦引入的公共组件库`RemoteLib`中的window却实在指向了基座的window

问： 我不确定这个是不是因为 问题 5 的webpack引入方式改造导致的，该现在是否正常？ 如果不正常， 有什么解决方式吗？ 我目前的处理方式是 微应用将自己的window传入到`RemoteLib`输出的组件中去

7. 微应用中打印 `window.document.body`， 打印出的body元素指向了基座的body 而不是 micro-app-body， 请问这个是正常的吗？

## 复现步骤

1. git clone 复现仓库

2. 分别cd HostApp、MicroApp1、MicroApp2、RemoteLib, 分别npm i, npm start

3. 模块联邦组件`RemoteLib`输出在 http://localhost:8081/remote-lib/remoteEntry.js， 组件demo地址： http://localhost:8081/remote-lib/

   微应用 micro-app-1 地址 http://localhost:8082/micro-app-1/
   微应用 micro-app-1 子应用 subApp1 地址 http://localhost:8082/micro-app-1/subApp1/
   微应用 micro-app-1 子应用 subApp2 地址 http://localhost:8082/micro-app-1/subApp2/

   微应用 micro-app-2 地址 http://localhost:8083/micro-app-2/
   
   基座 host-app 地址 http://localhost:8084/host-app/
   基座中访问 微应用 micro-app-1 subApp1  http://localhost:8084/host-app/micro-app-1/subApp1/
   基座中访问 微应用 micro-app-1 subApp2  http://localhost:8084/host-app/micro-app-1/subApp2/
   基座中访问 微应用 micro-app-2   http://localhost:8083/host-app/micro-app-2/

  
  ### 问题 1 复现步骤
 将路径`HostApp/src/components/SiderMenus/index.js` 中函数 naviagteToApp 中 microApp.router.push 的注释解开，并注释掉navigate， 在基座中左侧菜单进行切换，即报错 `[micro-app] 导航失败，请确保子应用渲染后再调用此方法`

 ### 问题 2 复现步骤

  将路径`HostApp/src/components/SiderMenus/index.js` 中函数 naviagteToApp 的防抖逻辑及if条件注释， 在基座中左侧菜单进行快速切换，即出现各种报错

### 问题3 复现步骤

访问 http://localhost:8083/micro-app-2/module1 并打开调试台选中html 可看到html和body标签均有class为`micro-app-2`， 访问 http://localhost:8084/host-app/micro-app-2/module1， 可发现仅micro-app-body有class为`micro-app-2`， html的class丢失

### 问题4 复现步骤

基座中的路由配置路径`HostApp/src/modules/App.js` 及菜单高亮实现逻辑为通过currentApp实现， currentApp在MicroApp被路由渲染后的useEffect中进行更新`HostApp/src/components/MicroApp/index.js`
主要是问这样写是否可行， 实在不想通过microApp.router.push的方式，高亮逻辑会变得复杂

### 问题5 复现步骤
将路径`MicroAPP2/config/webpack.base.config.js`中的模块联邦引入方式替换为已注释的那一行代码`RemoteLib: 'RemoteLib@/remote-lib/remoteEntry.js',` 重启服务后访问 http://localhost:8084/host-app/micro-app-2/module1即可看到报错

### 问题6 复现步骤
访问 http://localhost:8084/host-app/micro-app-2/module1 查看控制台，查看`====现在Remote Lib 处于微前端环境====`以下内容， 该打印逻辑写在 `RemoteLib/src/RemoteLibWapper/index.js`

### 问题7 复现步骤
访问 http://localhost:8084/host-app/micro-app-1/subApp1/module1 查看控制台， 查看`===========微应用 window.document.body ========== `以下内容， 该打印逻辑写在`MicroAPP1/src/modules/SubApp1/index.js`