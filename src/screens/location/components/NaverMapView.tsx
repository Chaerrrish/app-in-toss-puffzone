import { useImperativeHandle, useRef, useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export interface CameraState {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface NaverMapSelectorProps {
  mapRef: any;
  camera: CameraState;
  onCameraChange: (camera: CameraState) => void;
  onMapTap: (latitude: number, longitude: number) => void;
  selectedLocation: { latitude: number; longitude: number } | null;
}

const NAVER_CLIENT_ID = import.meta.env.NAVER_MAP_CLIENT_ID;
const BASE_URL = 'https://puffzone.co.kr';


const HTML_SOURCE = `
 <!-- HTML_SOURCE 로 넣을 문자열 (그대로 백틱 템플릿에 넣으세요) -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
        height: 100vh;
        width: 100vw;
        background-color: #f0f0f0;
      }
      #map {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>

  <body>
    <div id="map"></div>

    <!-- 네이버 지도 SDK -->
    <script type="text/javascript" src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}"></script>

    <script>
      // ======= 상태 =======
      window.__PZ__ = {
        sdkReady: false,
        mapInited: false,
        pendingInit: null, // {lat,lng,zoom}
        pendingMarker: null, // {lat,lng}
        lastCamera: null,
      };

      // ======= RN 로깅/메시징 =======
      function post(payload) {
        try {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
          }
        } catch (e) {
          // ignore
        }
      }

      function log(msg) {
        console.log(msg);
        post({ type: "LOG", message: String(msg) });
      }

      function isSdkReady() {
        return (
          window.naver &&
          window.naver.maps &&
          typeof naver.maps.LatLng === "function" &&
          typeof naver.maps.Map === "function" &&
          typeof naver.maps.Marker === "function" &&
          naver.maps.Event &&
          typeof naver.maps.Event.addListener === "function"
        );
      }

      function attachAuthFailedHandler() {
        // naver가 생긴 다음에만 붙이기
        if (!window.naver || !window.naver.maps) return false;

        // 중복 방지
        if (window.__PZ__.__authHandlerAttached) return true;
        window.__PZ__.__authHandlerAttached = true;

        window.naver.maps.onAuthFailed = function (error) {
          console.error("Naver Map Auth Failed:", error);
          post({ type: "AUTH_ERROR", error: error });
        };

        return true;
      }

      // ======= SDK 준비 대기 =======
      function waitForSdkReady(maxMs) {
        var started = Date.now();
        var timer = setInterval(function () {
          attachAuthFailedHandler();

          if (isSdkReady()) {
            clearInterval(timer);
            window.__PZ__.sdkReady = true;
            log("Naver Map SDK is ready.");
            post({ type: "SDK_READY" });

            // RN에서 먼저 initMap을 호출해둔 경우 처리
            if (window.__PZ__.pendingInit) {
              var p = window.__PZ__.pendingInit;
              window.__PZ__.pendingInit = null;
              initMap(p.lat, p.lng, p.zoom);
            }
            // RN에서 먼저 marker를 찍어둔 경우 처리
            if (window.__PZ__.pendingMarker) {
              var m = window.__PZ__.pendingMarker;
              window.__PZ__.pendingMarker = null;
              updateMarker(m.lat, m.lng);
            }
            return;
          }

          if (Date.now() - started > maxMs) {
            clearInterval(timer);
            log("SDK load timeout (script blocked or clientId invalid?)");
            post({ type: "SDK_TIMEOUT" });
          }
        }, 100);
      }

      // ======= 맵 초기화 =======
      function initMap(lat, lng, zoom) {
        // SDK 준비 전이면 보류
        if (!isSdkReady()) {
          window.__PZ__.pendingInit = { lat: lat, lng: lng, zoom: zoom };
          log("initMap queued (SDK not ready yet)");
          return;
        }

        // 이미 맵 생성했으면 카메라만 이동
        if (window.__PZ__.mapInited && window.map) {
          moveCamera(lat, lng, zoom);
          return;
        }

        try {
          log("Initializing map instance...");
          var mapOptions = {
            center: new naver.maps.LatLng(lat, lng),
            zoom: zoom,
            scaleControl: false,
            logoControl: false,
            mapDataControl: false,
            zoomControl: false,
            mapTypeControl: false,
            maxZoom: 21,
            minZoom: 10,
          };

          window.map = new naver.maps.Map("map", mapOptions);
          window.__PZ__.mapInited = true;
          log("Map instance created.");

          // 맵 생성 직후 대기 중인 마커가 있다면 처리
          if (window.__PZ__.pendingMarker) {
             var m = window.__PZ__.pendingMarker;
             window.__PZ__.pendingMarker = null;
             updateMarker(m.lat, m.lng);
          }

          // 클릭 이벤트
          naver.maps.Event.addListener(window.map, "click", function (e) {
            var clat = e.coord.lat();
            var clng = e.coord.lng();

            post({
              type: "MAP_CLICK",
              latitude: clat,
              longitude: clng,
            });

            updateMarker(clat, clng);
          });

          // idle 이벤트(카메라 변경)
          naver.maps.Event.addListener(window.map, "idle", function () {
            try {
              var center = window.map.getCenter();
              var zoomLevel = window.map.getZoom();

              // 너무 잦은 동일값 방지(옵션)
              var next = {
                latitude: center.lat(),
                longitude: center.lng(),
                zoom: zoomLevel,
              };
              var prev = window.__PZ__.lastCamera;
              if (
                prev &&
                prev.latitude === next.latitude &&
                prev.longitude === next.longitude &&
                prev.zoom === next.zoom
              ) {
                return;
              }
              window.__PZ__.lastCamera = next;

              post({
                type: "CAMERA_CHANGE",
                latitude: next.latitude,
                longitude: next.longitude,
                zoom: next.zoom,
              });
            } catch (err) {
              log("idle handler error: " + err.message);
            }
          });
        } catch (e) {
          log("initMap error: " + e.message);
        }
      }

      // ======= 마커 =======
      // window.MARKER_DATA_URI = ''; // Removed

      function updateMarker(lat, lng) {
        log("updateMarker called with: " + lat + ", " + lng);
        if (!window.map) {
          window.__PZ__.pendingMarker = { lat: lat, lng: lng };
          log("updateMarker queued (map not ready)");
          return;
        }

        try {
          var pos = new naver.maps.LatLng(lat, lng);
          if (!window.marker) {
            log("Creating new marker...");
            window.marker = new naver.maps.Marker({
              position: pos,
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
            log("Marker created and set to map.");
          } else {
            log("Updating existing marker position...");
            window.marker.setPosition(pos);
            window.marker.setMap(window.map);
            log("Marker position updated.");
          }
        } catch (e) {
          log("updateMarker error: " + e.message);
        }
      }

      function handleRNMessage(e) {
        try {
          var msg = JSON.parse(e.data);
          log("Received RN message: " + msg.type);
          
          if (msg.type === 'SET_MARKER') {
             updateMarker(msg.lat, msg.lng);
          } else if (msg.type === 'MOVE_CAMERA') {
             moveCamera(msg.lat, msg.lng, msg.zoom);
          } else if (msg.type === 'INIT_MAP') {
             initMap(msg.lat, msg.lng, msg.zoom);
          }
        } catch (err) {
          log("Error parsing RN message: " + err.message);
        }
      }

      document.addEventListener("message", handleRNMessage);
      window.addEventListener("message", handleRNMessage);

      // ======= 카메라 이동 =======
      function moveCamera(lat, lng, zoom) {
        if (!isSdkReady()) {
          // 카메라 이동도 initMap처럼 보류해도 되지만, 여기선 initMap에 위임
          window.__PZ__.pendingInit = { lat: lat, lng: lng, zoom: zoom };
          log("moveCamera queued (SDK not ready yet)");
          return;
        }
        if (!window.map) return;

        try {
          var newCenter = new naver.maps.LatLng(lat, lng);
          window.map.panTo(newCenter);
          if (typeof zoom === "number") {
            window.map.setZoom(zoom);
          }
        } catch (e) {
          log("moveCamera error: " + e.message);
        }
      }

      // ======= 시작 =======
      window.addEventListener("load", function () {
        log("DOM loaded. Waiting for Naver SDK...");
        attachAuthFailedHandler();
        waitForSdkReady(8000);
      });
    </script>
  </body>
</html>
 `;

export function NaverMapSelector({
  mapRef,
  camera,
  onCameraChange,
  onMapTap,
  selectedLocation,
}: NaverMapSelectorProps) {
  const webviewRef = useRef<WebView>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const webViewSource = useMemo(
    () => ({
      html: HTML_SOURCE,
      baseUrl: BASE_URL,
    }),
    []
  );

  useImperativeHandle(mapRef, () => ({
    animateCameraTo: (params: { latitude: number; longitude: number; zoom?: number }) => {
      if (webviewRef.current && isMapReady) {
        webviewRef.current.postMessage(JSON.stringify({
          type: 'MOVE_CAMERA',
          lat: params.latitude,
          lng: params.longitude,
          zoom: params.zoom
        }));
      }
    },
    setLocationTrackingMode: (mode: any) => {
      console.log('Tracking mode not fully implemented in WebView adapter yet:', mode);
    },
  }));

  useEffect(() => {
    if (selectedLocation && webviewRef.current && isMapReady) {
      webviewRef.current.postMessage(JSON.stringify({
        type: 'SET_MARKER',
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude
      }));
    }
  }, [selectedLocation, isMapReady]);

  useEffect(() => {
    if (webviewRef.current && isMapReady) {
      webviewRef.current.postMessage(JSON.stringify({
        type: 'INIT_MAP',
        lat: camera.latitude,
        lng: camera.longitude,
        zoom: camera.zoom
      }));

      if (selectedLocation) {
        webviewRef.current.postMessage(JSON.stringify({
          type: 'SET_MARKER',
          lat: selectedLocation.latitude,
          lng: selectedLocation.longitude
        }));
      }
    }
  }, [isMapReady]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'MAP_CLICK') {
        onMapTap(data.latitude, data.longitude);
      } else if (data.type === 'CAMERA_CHANGE') {
        onCameraChange({
          latitude: data.latitude,
          longitude: data.longitude,
          zoom: data.zoom,
        });
      } else if (data.type === 'LOG') {
        console.log('[WebView Log]:', data.message);
      } else if (data.type === 'AUTH_ERROR') {
        console.error('[Naver Map Auth Error]:', data.error);
      } else if (data.type === 'SDK_READY') {
        console.log('[WebView]: SDK fully loaded and ready');
        setIsMapReady(true);
      }
    } catch (e) {
      console.error('Failed to parse WebView message', e);
    }
  };


  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        style={styles.webview}
        source={webViewSource}
        onMessage={handleMessage}
        onLoadStart={() => {
          console.log('[WebView] Loading started...');
        }}
        onLoadEnd={() => {
          console.log('[WebView] Loading completed');
        }}
        onError={(event) => {
          console.error('[WebView Error]:', event.nativeEvent);
          console.error('[WebView Error Code]:', event.nativeEvent.code);
          console.error('[WebView Error Description]:', event.nativeEvent.description);
        }}
        onHttpError={(event) => {
          console.error('[WebView HTTP Error]:', event.nativeEvent);
          console.error('[HTTP Error URL]:', event.nativeEvent.url);
          console.error('[HTTP Error Code]:', event.nativeEvent.statusCode);
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        bounces={false}
        scrollEnabled={false}
        overScrollMode="never"
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

export default NaverMapSelector;
