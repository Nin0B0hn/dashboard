"use client";

import React, { useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar";

declare global {
  interface UnityInstance {
    Quit: () => Promise<void>;
    SendMessage: (
      objectName: string,
      methodName: string,
      parameter?: string | number
    ) => void;
    Module?: {
      canvas: HTMLCanvasElement;
    };
  }

  interface Window {
    createUnityInstance: (
      canvas: HTMLCanvasElement | null,
      config: UnityConfig
    ) => Promise<UnityInstance>;
    unityInstance?: UnityInstance;
  }
}

interface UnityConfig {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl?: string;
  companyName?: string;
  productName?: string;
  productVersion?: string;
  showBanner?: (msg: string, type: string) => void;
  disableContextMenu?: boolean;
  backgroundColor?: string | HTMLImageElement;
  canvasResize?: boolean;
  webglContextAttributes?: WebGLContextAttributes;
  matchWebGLToCanvasSize?: boolean;
  cacheControl?: (url: string) => string;
  devicePixelRatio?: number;
  preserveDrawingBuffer?: boolean;
  preferWebGL2?: boolean;
  powerPreference?: "default" | "high-performance" | "low-power";
  targetFPS?: number;
  disableInitialInputGrab?: boolean;
}

const UnityWebGL: React.FC = () => {
  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="/Build/Build.loader.js"]'
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = "/Build/Build.loader.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const canvas = document.querySelector<HTMLCanvasElement>("#unityCanvas");
        if (canvas) {
          canvas.tabIndex = 1; // Canvas fokussierbar machen
        }
        if (window.createUnityInstance && canvas) {
          window
            .createUnityInstance(canvas, {
              dataUrl: "/Build/Build.data",
              frameworkUrl: "/Build/Build.framework.js",
              codeUrl: "/Build/Build.wasm",
              disableInitialInputGrab: true, // Optional, da wir es in Unity setzen
            })
            .then((unityInstance) => {
              console.log("Unity Instance Loaded");
              window.unityInstance = unityInstance;
            })
            .catch((message) => {
              console.error("Unity WebGL Fehler:", message);
            });
        } else {
          console.error("createUnityInstance ist nicht definiert.");
        }
      };

      return () => {
        if (script.parentElement) {
          document.body.removeChild(script);
        }
        if (window.unityInstance) {
          window.unityInstance.Quit().then(() => {
            console.log("Unity Instance beendet");
          });
        }
      };
    }
  }, []);

  return (
    <canvas
      id="unityCanvas"
      tabIndex={1}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        zIndex: 0,
      }}
    />
  );
};

const DashboardPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <AppSidebar />
      <div style={{ flex: 1, position: 'relative' }}>
        <UnityWebGL />
      </div>
    </div>
  );
};

export default DashboardPage;
