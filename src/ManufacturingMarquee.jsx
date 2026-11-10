import React, { useState } from 'react';
import './manufacturing-marquee.css';

const highlights = [
  ['20 Years', 'Manufacturing Experience'],
  ['8 Automated Lines', 'Production Capability'],
  ['3-Day Sampling*', 'After Brief Confirmation'],
  ['OEM / ODM', 'Product & Packaging Customization'],
];

export default function ManufacturingMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="manufacturing-marquee" aria-label="JCZCARE manufacturing capabilities" data-paused={paused}>
      <div className="manufacturing-marquee-window">
        <div className="manufacturing-marquee-track">
          {[0, 1].map((copy) => (
            <ul className="manufacturing-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {highlights.map(([value, description]) => (
                <li key={value}>
                  <span className="manufacturing-marquee-divider" aria-hidden="true">✦</span>
                  <strong>{value}</strong>
                  <span>{description}</span>
                </li>
              ))}
              <li className="manufacturing-marquee-brand" aria-label="JCZCARE">
                <span className="manufacturing-marquee-divider" aria-hidden="true">✦</span>
                <strong>JCZCARE</strong>
              </li>
            </ul>
          ))}
        </div>
      </div>
      <button className="manufacturing-marquee-toggle" type="button" aria-label={paused ? 'Resume scrolling highlights' : 'Pause scrolling highlights'} aria-pressed={paused} onClick={() => setPaused(!paused)}>
        <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
      </button>
      <p className="manufacturing-marquee-note">*Sample timing depends on the confirmed specifications and customization scope.</p>
    </section>
  );
}
