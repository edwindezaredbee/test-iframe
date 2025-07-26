import React, { useEffect, useState } from 'react';
import './IframePage.css';

const StaticIframePage = () => {
  const [currentSection, setCurrentSection] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.section');
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      let newSection = 1;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop - windowHeight / 2 && scrollPosition < sectionBottom - windowHeight / 2) {
          newSection = index + 1;
        }
      });

      setCurrentSection(newSection);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="iframe-page">
      <div className="scroll-indicator">
        Section <span>{currentSection}</span> of 4
      </div>

      <section className="section">
        <div className="content">
          <h1>Welcome to EagleRider</h1>
          <p>Discover the freedom of traveling by motorcycle on the most beautiful roads in the world. Book your adventure now.</p>
          <div className="test-info">
            <h3>🔍 Test: No Re-rendering</h3>
            <p>This page maintains the iframe static without state changes that cause re-rendering.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="iframe-container">
          <iframe
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
        </div>
      </section>

      <section className="section">
        <div className="content">
          <h1>Ready for Adventure?</h1>
          <p>Join thousands of travelers who have transformed their vacations into unforgettable experiences with EagleRider.</p>
        </div>
      </section>
    </div>
  );
};

export default StaticIframePage; 