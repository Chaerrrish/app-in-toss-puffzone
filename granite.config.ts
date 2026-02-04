
import { appsInToss } from '@apps-in-toss/framework/plugins';
import { defineConfig } from '@granite-js/react-native/config';
import { env } from '@granite-js/plugin-env';


export default defineConfig({
  scheme: 'intoss',
  appName: 'puffzone',
  plugins: [
    appsInToss({
      brand: {
        displayName: '퍼프존', // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
        primaryColor: '#168741', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
        icon: 'https://static.toss.im/appsintoss/5845/7e595ede-551d-4e52-9e18-47fb042d47c9.png', // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
      },
      permissions: [
        {
          name: "geolocation",
          access: "access",
        },
        { name: 'photos', access: 'read' },
        { name: 'camera', access: 'access' },
      ],
    }),
    env({
      NAVER_MAP_APPLICATION: 'puffzone',
      NAVER_MAP_CLIENT_ID: '51wm2hbym8',
      BASE_URL: 'https://knowing-oldest-shark-bidder.trycloudflare.com',
    })
  ],

});
