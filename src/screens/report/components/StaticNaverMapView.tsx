import { useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface StaticNaverMapViewProps {
  latitude: number;
  longitude: number;
}

const NAVER_CLIENT_ID = import.meta.env.NAVER_MAP_CLIENT_ID;
const BASE_URL = 'https://puffzone.co.kr';

const HTML_SOURCE = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
    />
    <style>
      body { margin: 0; padding: 0; height: 100vh; width: 100vw; background-color: #f0f0f0; }
      #map { width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}"></script>

    <script>
      // ======= 상태 =======
      window.__PZ__ = {
        sdkReady: false,
        mapInited: false,
        pendingInit: null, // {lat,lng}
      };

      // ======= RN 로깅/메시징 =======
      function post(payload) {
        try {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          }
        } catch (e) {}
      }

      function log(msg) {
        post({ type: "LOG", message: String(msg) });
      }

      function isSdkReady() {
        return (
          window.naver &&
          window.naver.maps &&
          typeof naver.maps.LatLng === "function" &&
          typeof naver.maps.Map === "function" &&
          typeof naver.maps.Marker === "function"
        );
      }

      // ======= SDK 준비 대기 =======
      function waitForSdkReady(maxMs) {
        var started = Date.now();
        var timer = setInterval(function () {
          if (isSdkReady()) {
            clearInterval(timer);
            window.__PZ__.sdkReady = true;
            log("Static Map SDK ready.");
            post({ type: "SDK_READY" });

            // RN에서 먼저 initMap을 호출해둔 경우 처리
            if (window.__PZ__.pendingInit) {
              var p = window.__PZ__.pendingInit;
              window.__PZ__.pendingInit = null;
              initMap(p.lat, p.lng);
            }
            return;
          }

          if (Date.now() - started > maxMs) {
            clearInterval(timer);
            log("SDK load timeout");
            post({ type: "SDK_TIMEOUT" });
          }
        }, 100);
      }

      // ======= 맵 초기화 =======
      function initMap(lat, lng) {
        if (!isSdkReady()) {
          window.__PZ__.pendingInit = { lat: lat, lng: lng };
          log("initMap queued (SDK not ready yet)");
          return;
        }

        if (window.__PZ__.mapInited && window.map) {
             // 이미 맵이 있으면 위치만 이동
             var pos = new naver.maps.LatLng(lat, lng);
             window.map.setCenter(pos);
             if (window.marker) {
                window.marker.setPosition(pos);
             }
             return;
        }

        try {
          log("Initializing static map...");
          var mapOptions = {
            center: new naver.maps.LatLng(lat, lng),
            zoom: 16,
            scaleControl: false,
            logoControl: false,
            mapDataControl: false,
            zoomControl: false,
            mapTypeControl: false,
            draggable: false, 
            scrollWheel: false, 
            keyboardShortcuts: false, 
            disableDoubleTapZoom: true, 
            disableTwoFingerTapZoom: true, 
          };

          window.map = new naver.maps.Map("map", mapOptions);
          window.__PZ__.mapInited = true;
          
          window.marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(lat, lng),
            map: window.map,
            icon: {
              url: 'https://www.puffzone.co.kr/images/markers/green_marker_44.png',
              size: new naver.maps.Size(44, 44),
              scaledSize: new naver.maps.Size(44, 44),
              origin: new naver.maps.Point(0, 0),
              anchor: new naver.maps.Point(22, 22)
            }
          });
          window.marker.setMap(window.map);
          
          log("Static map created.");
        } catch (e) {
          log("initMap error: " + e.message);
        }
      }

      function handleRNMessage(e) {
        try {
          var msg = JSON.parse(e.data);
          if (msg.type === 'INIT_MAP') {
             initMap(msg.lat, msg.lng);
          }
        } catch (err) {
             log("Message error: " + err.message);
        }
      }

      document.addEventListener("message", handleRNMessage);
      window.addEventListener("message", handleRNMessage);

      window.addEventListener("load", function () {
        waitForSdkReady(8000);
      });
    </script>
  </body>
</html>
`;

export default function StaticNaverMapView({ latitude, longitude }: StaticNaverMapViewProps) {
  const webviewRef = useRef<WebView>(null);

  const webViewSource = useMemo(() => ({
    html: HTML_SOURCE,
    baseUrl: BASE_URL,
  }), []);

  // Send init message once loaded
  const handleLoadEnd = () => {
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify({
        type: 'INIT_MAP',
        lat: latitude,
        lng: longitude
      }));
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        style={styles.webview}
        source={webViewSource}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        pointerEvents="none" // Ensure no interaction at RN level too
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F4F6',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
