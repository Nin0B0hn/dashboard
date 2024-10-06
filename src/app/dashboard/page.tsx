// eslint-disable-next-line @typescript-eslint/no-unused-vars
"use client";

import { useEffect, useState } from 'react';

import {AppSidebar} from "@/components/app-sidebar";

const UnityWebGL = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "/Build/Build.loader.js"; // Unity WebGL Build
    document.body.appendChild(script);

    script.onload = () => {
      window.createUnityInstance(document.querySelector("#unityCanvas"), {
        dataUrl: "/Build/Build.data",
        frameworkUrl: "/Build/Build.framework.js",
        codeUrl: "/Build/Build.wasm",
      }).then((unityInstance) => {
        console.log("Unity Instance Loaded");
        window.unityInstance = unityInstance;
      }).catch((message) => {
        console.error(message);
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
      <canvas id="unityCanvas" style={{ width: '100%', height: '100vh' }} />
  );
};

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
      <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
        {/* Sidebar */}

        {/* Hauptinhalt */}
        <div style={{ flex: 1, position: 'relative' }}>
          <UnityWebGL />
          <AppSidebar />

        </div>
      </div>
  );
}
