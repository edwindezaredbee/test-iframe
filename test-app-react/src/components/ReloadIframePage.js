import React, { useEffect, useState } from 'react';
import './IframePage.css';

const ReloadIframePage = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [reloadCount, setReloadCount] = useState(0);
  const [key, setKey] = useState(0);
  const [scrollData, setScrollData] = useState({
    scrollY: 0,
    scrollPercentage: 0,
    timestamp: Date.now()
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollHeight > 0 ? (currentScrollY / scrollHeight) * 100 : 0;

      setScrollData({
        scrollY: currentScrollY,
        scrollPercentage: Math.round(scrollPercentage),
        timestamp: Date.now()
      });

      const sections = document.querySelectorAll('.section');
      const windowHeight = window.innerHeight;

      let newSection = 1;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (currentScrollY >= sectionTop - windowHeight / 2 && currentScrollY < sectionBottom - windowHeight / 2) {
          newSection = index + 1;
        }
      });

      setCurrentSection(newSection);

      if (Math.abs(currentScrollY - lastScrollY) > 50) {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
          setReloadCount(prev => prev + 1);
          setKey(prev => prev + 1);
          lastScrollY = currentScrollY;
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    handleScroll();

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="iframe-page" key={key}>
      <div className="scroll-indicator reload">
        <div>Section <span>{currentSection}</span> of 4</div>
        <div>Reloads: <span className="reload-count">{reloadCount}</span></div>
        <div>Scroll: <span>{scrollData.scrollPercentage}%</span></div>
        <div>Timestamp: <span>{scrollData.timestamp}</span></div>
        <div>Key: <span className="key-display">{key}</span></div>
      </div>

      <section className="section">
        <div className="content">
          <h1>Welcome to EagleRider</h1>
          <p>Discover the freedom of traveling by motorcycle on the most beautiful roads in the world. Book your adventure now.</p>
          <div className="test-info">
            <h3>🔄 Test: Reload on Scroll</h3>
            <p>This page completely reloads the component (including the iframe) every time you make significant scroll.</p>
            <div className="debug-info">
              <p><strong>Total reloads:</strong> {reloadCount}</p>
              <p><strong>Scroll Y:</strong> {scrollData.scrollY}px</p>
              <p><strong>Scroll percentage:</strong> {scrollData.scrollPercentage}%</p>
              <p><strong>Current key:</strong> {key}</p>
              <p><strong>Last update:</strong> {new Date(scrollData.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="iframe-container">
          <iframe
            key={`iframe-${key}`}
            src="https://www.eaglerider.com/reservation_widget/new?ReferralCode=444c1237-f9fb-4cba-b1b7-122455d9a2b9&amp;width=750&amp;height=280&amp;horizontal=true&amp;version=v2"
            frameBorder="0"
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
            <p><strong>Total reloads:</strong> {reloadCount}</p>
            <p><strong>Does the iframe reload?</strong> Yes, with each significant scroll</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content">
          <h1>Ready for Adventure?</h1>
          <p>Join thousands of travelers who have transformed their vacations into unforgettable experiences with EagleRider.</p>
          <div className="debug-info">
            <p><strong>Iframe analysis with reload:</strong></p>
            <p>• Total reloads: {reloadCount}</p>
            <p>• Does the iframe get destroyed and recreated?</p>
            <p>• Is the form state completely lost?</p>
            <p>• Is performance affected?</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReloadIframePage; 