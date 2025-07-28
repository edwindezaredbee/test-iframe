(function monitorWebViewPerformance() {
  const monitoringData = {
    environment: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor,
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isAndroid: /Android/.test(navigator.userAgent),
      isWKWebView: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isAndroidWebView: /Android/.test(navigator.userAgent) && /wv/.test(navigator.userAgent),
      isEmbedded: window.parent !== window,
      isStandalone: window.navigator.standalone || false,
      timestamp: new Date().toISOString()
    },
    performance: {
      memory: null,
      fps: 0,
      loadTime: 0,
      domReady: false
    },
    thirdPartyScripts: {
      vwo: false,
      newRelic: false,
      airbrake: false,
      vwoScripts: 0,
      totalScripts: 0
    },
    reloads: {
      count: 0,
      lastReload: null,
      timeSinceFirstLoad: 0
    },
    issues: []
  };

  function detectEnvironment() {
    const ua = navigator.userAgent;
    const isWKWebView = /iPad|iPhone|iPod/.test(ua) && /Safari/.test(ua) && !/Chrome/.test(ua);
    const isAndroidWebView = /Android/.test(ua) && /wv/.test(ua);
    monitoringData.environment.isWKWebView = isWKWebView;
    monitoringData.environment.isAndroidWebView = isAndroidWebView;
    monitoringData.environment.isProblematicEnvironment = isWKWebView || isAndroidWebView;

    console.log('🔍 Environment:', monitoringData.environment);
  }

  function measureMemory() {
    if ('memory' in performance) {
      const mem = performance.memory;
      monitoringData.performance.memory = {
        used: Math.round(mem.usedJSHeapSize / 1024 / 1024),
        total: Math.round(mem.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(mem.jsHeapSizeLimit / 1024 / 1024),
        percentage: Math.round((mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100)
      };
      if (monitoringData.performance.memory.percentage > 80) {
        monitoringData.issues.push(`High memory usage: ${monitoringData.performance.memory.percentage}%`);
      }
    }
  }

  function measureFPS() {
    let frameCount = 0;
    let lastTime = performance.now();
    function countFrames() {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        monitoringData.performance.fps = fps;
        if (fps < 30) {
          monitoringData.issues.push(`Low FPS: ${fps}`);
        }
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(countFrames);
    }
    requestAnimationFrame(countFrames);
  }

  function detectThirdPartyScripts() {
    const scripts = document.querySelectorAll('script');
    monitoringData.thirdPartyScripts.totalScripts = scripts.length;
    const vwoScripts = [...scripts].filter(s => s.src.includes('visualwebsiteoptimizer'));
    monitoringData.thirdPartyScripts.vwoScripts = vwoScripts.length;
    monitoringData.thirdPartyScripts.vwo = vwoScripts.length > 0 || !!window.VWO || !!window._vwo_code;
    monitoringData.thirdPartyScripts.newRelic = !!window.NREUM || !!window.newrelic;
    monitoringData.thirdPartyScripts.airbrake = !!window.Airbrake;
    if (vwoScripts.length > 3) {
      monitoringData.issues.push(`Too many VWO scripts: ${vwoScripts.length}`);
    }
    console.log('📜 Third-party scripts:', monitoringData.thirdPartyScripts);
  }

  function monitorReloads() {
    let count = parseInt(sessionStorage.getItem('webview_reload_count') || '0');
    count++;
    sessionStorage.setItem('webview_reload_count', count.toString());
    monitoringData.reloads.count = count;

    const startTime = sessionStorage.getItem('webview_start_time') || Date.now().toString();
    sessionStorage.setItem('webview_start_time', startTime);
    monitoringData.reloads.timeSinceFirstLoad = Math.round((Date.now() - parseInt(startTime)) / 1000);

    if (count > 3) {
      monitoringData.issues.push(`Too many reloads: ${count}`);
    }

    console.log('🔄 Reloads:', monitoringData.reloads);
  }

  function detectSpecificIssues() {
    try {
      const testArray = new Array(100000).fill('x');
      testArray.length = 0;
    } catch (e) {
      monitoringData.issues.push(`Memory pressure detected: ${e.message}`);
    }

    const start = performance.now();
    requestAnimationFrame(() => {
      const end = performance.now();
      if (end - start > 20) {
        monitoringData.issues.push(`UI lag: ${Math.round(end - start)}ms`);
      }
    });

    if (monitoringData.thirdPartyScripts.vwo) {
      const loadTime = performance.now() - performance.timing.navigationStart;
      if (loadTime > 3000) {
        monitoringData.issues.push(`VWO slow load: ${Math.round(loadTime)}ms`);
      }
    }
  }

  function startDashboard() {
    const box = document.createElement('div');
    box.style.cssText = `
      position:fixed;top:80px;right:10px;z-index:9999;
      background:#111;color:#fff;padding:10px;font-size:11px;
      font-family:monospace;border-radius:6px;max-width:280px;
      border:1px solid #555;
    `;
    document.body.appendChild(box);

    function update() {
      const mem = monitoringData.performance.memory;
      const fps = monitoringData.performance.fps;
      const reloads = monitoringData.reloads.count;
      const issues = monitoringData.issues.length;
      box.innerHTML = `
        <b>📊 WebView Monitor</b><br/>
        Env: ${monitoringData.environment.isWKWebView ? 'WKWebView' : 'Other'}<br/>
        Mem: ${mem ? mem.percentage + '%' : 'N/A'}<br/>
        FPS: ${fps}<br/>
        Reloads: ${reloads}<br/>
        Issues: ${issues}<br/>
        Time: ${monitoringData.reloads.timeSinceFirstLoad}s
      `;
    }

    setInterval(update, 1000);
  }

  // 🔁 Execute all
  console.log('🚀 Starting WebView monitoring...');
  detectEnvironment();
  monitorReloads();
  detectThirdPartyScripts();
  measureMemory();
  measureFPS();
  detectSpecificIssues();
  startDashboard();

  setInterval(() => {
    measureMemory();
    detectSpecificIssues();
  }, 5000);

  setInterval(() => {
    console.log('🧾 Report:', monitoringData);
    if (monitoringData.issues.length) {
      console.warn('⚠️ Issues detected:', monitoringData.issues);
    }
  }, 30000);

  window.__webviewMonitor = monitoringData;
})(); 