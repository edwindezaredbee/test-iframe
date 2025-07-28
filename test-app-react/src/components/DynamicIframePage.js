import React, { useEffect, useState } from 'react';
import './IframePage.css';

const DynamicIframePage = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [renderCount, setRenderCount] = useState(0);
  const [isComponentActive, setIsComponentActive] = useState(true);
  const [scrollData, setScrollData] = useState({
    scrollY: 0,
    scrollPercentage: 0,
    timestamp: Date.now()
  });

  useEffect(() => {
    setRenderCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    const handleScroll = () => {
      if (!isActive) return;

      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollHeight > 0 ? (scrollY / scrollHeight) * 100 : 0;

      setScrollData({
        scrollY,
        scrollPercentage: Math.round(scrollPercentage),
        timestamp: Date.now()
      });

      const sections = document.querySelectorAll('.section');
      const windowHeight = window.innerHeight;

      let newSection = 1;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollY >= sectionTop - windowHeight / 2 && scrollY < sectionBottom - windowHeight / 2) {
          newSection = index + 1;
        }
      });

      setCurrentSection(newSection);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    handleScroll();

    return () => {
      isActive = false;
      setIsComponentActive(false);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const interval = setInterval(() => {
      if (!isActive) return;

      setScrollData(prev => ({
        ...prev,
        timestamp: Date.now()
      }));
    }, 1000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="iframe-page">
      <div className="scroll-indicator dynamic">
        <div>Section <span>{currentSection}</span> of 4</div>
        <div>Re-renders: <span className="render-count">{renderCount}</span></div>
        <div>Scroll: <span>{scrollData.scrollPercentage}%</span></div>
        <div>Timestamp: <span>{scrollData.timestamp}</span></div>
        <div>Status: <span className={isComponentActive ? "active-status" : "inactive-status"}>
          {isComponentActive ? "🟢 Active" : "🔴 Inactive"}
        </span></div>
      </div>

      <section className="section">
        <div className="content">
          <h1>Welcome to EagleRider</h1>
          <p>Discover the freedom of traveling by motorcycle on the most beautiful roads in the world. Book your adventure now.</p>
          <div className="test-info">
            <h3>🔄 Test: With Constant Re-rendering</h3>
            <p>This page constantly updates the state to cause re-renders and test iframe behavior.</p>
            <div className="debug-info">
              <p><strong>Re-renders:</strong> {renderCount}</p>
              <p><strong>Scroll Y:</strong> {scrollData.scrollY}px</p>
              <p><strong>Scroll percentage:</strong> {scrollData.scrollPercentage}%</p>
              <p><strong>Last update:</strong> {new Date(scrollData.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="iframe-container">
          <iframe
            src="https://www.eaglerider.com/reservation_widget/new?ReferralCode=444c1237-f9fb-4cba-b1b7-122455d9a2b9&amp;width=750&amp;height=280&amp;horizontal=true&amp;version=v2"
            frameBorder="0"
            key={`iframe-1`}
            style={{ width: '750px', height: '280px' }}
            title="EagleRider Reservation Widget"
          />
        </div>
      </section>

      <section className="section">
        <div className="content">
          <h1>Unique Experiences</h1>
          <p>From coastal routes to snow-capped mountains, every journey is a new adventure waiting to be discovered.</p>
          <div className="debug-info">
            <p><strong>Current state:</strong> Section {currentSection}</p>
            <p><strong>Total re-renders:</strong> {renderCount}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content">
          <h1>Ready for Adventure?</h1>
          <p>Join thousands of travelers who have transformed their vacations into unforgettable experiences with EagleRider.</p>
          <div className="debug-info">
            <p><strong>Iframe analysis:</strong></p>
            <p>• Re-renders: {renderCount}</p>
            <p>• Does the iframe remain stable?</p>
            <p>• Is the form state lost?</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DynamicIframePage; 