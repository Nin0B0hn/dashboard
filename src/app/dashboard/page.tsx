"use client";

declare global {
  interface UnityInstance {
    Quit: () => Promise<void>;
    SendMessage: (objectName: string, methodName: string, parameter?: string | number) => void;
  }

  interface Window {
    createUnityInstance: (canvas: HTMLCanvasElement | null, config: UnityConfig) => Promise<UnityInstance>;
    unityInstance?: UnityInstance;
  }
}

interface UnityConfig {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
}

import { useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar";

const UnityWebGL = () => {
  useEffect(() => {
    if (!document.querySelector('script[src="/Build/Build.loader.js"]')) {
      const script = document.createElement('script');
      script.src = "/Build/Build.loader.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const canvas = document.querySelector("#unityCanvas") as HTMLCanvasElement;
        if (window.createUnityInstance && canvas) {
          window.createUnityInstance(canvas, {
            dataUrl: "/Build/Build.data",
            frameworkUrl: "/Build/Build.framework.js",
            codeUrl: "/Build/Build.wasm",
          }).then((unityInstance) => {
            console.log("Unity Instance Loaded");
            window.unityInstance = unityInstance;
          }).catch((message) => {
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
    <canvas id="unityCanvas" style={{ width: '100%', height: '100vh' }} />
  );
};

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <AppSidebar />
      <div style={{ flex: 1, position: 'relative' }}>
        <UnityWebGL />
      </div>
    </div>
  );
}
