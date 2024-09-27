import Demo1 from '@/demo/demo1';
import Demo1_1 from '@/demo/demo1/demo1_1';
import Demo1_2 from '@/demo/demo1/demo1_2';
import Demo2 from '@/demo/demo2';
import Demo2_1 from '@/demo/demo2/demo2_1';
import Demo2_2 from '@/demo/demo2/demo2_2';
import App from './app';

export default [
  {
    key: 'app',
    path: "/",
    element: <App />,
    children: [ {
      key: 'app.demo1',
      path: 'demo1',
      title: 'demo1',
      element: <Demo1 />,
      children: [
        {
          key: 'app.demo1.demo1_1',
          path: 'demo1_1',
          title: 'demo1_1',
          element: <Demo1_1 />,
        },
        {
          key: 'app.demo1.demo1_2',
          path: 'demo1_2',
          title: 'demo1_2',
          element: <Demo1_2 />,
        }
      ]
  }, 
  {
    key: 'app.demo2',
    path: 'demo2',
    title: 'demo2',
    element: <Demo2 />,
    children: [
      {
        key: 'app.demo2.demo2_1',
        path: 'demo2_1',
        title: 'demo2_1',
        element: <Demo2_1 />,
      },
      {
        key: 'app.demo2.demo2_2',
        path: 'demo2_2',
        title: 'demo2_2',
        element: <Demo2_2 />,
      },
    ]
}
  ]
  }
];