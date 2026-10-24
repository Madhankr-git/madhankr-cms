import React from 'react';
import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="footer" id="publicSiteFooter">
      <div className="f-col-brand">
        <div className="f-shapes">
          <span className="f-s sq" />
          <span className="f-s semi" />
          <span className="f-s circ" />
        </div>
        <span className="f-title">MADHANKR</span>
        <span className="f-desc">DIGITAL DESIGNER × CREATIVE DEVELOPER</span>
      </div>

      <div className="f-col-status">
        <span className="status-indicator" />
        <span className="status-text">OPEN TO SELECT OPPORTUNITIES</span>
      </div>

      <div className="f-col-copy">
        <span>DESIGN WITH INTENTION</span>
        <span>BUILT THROUGH CURIOSITY</span>
      </div>
    </footer>
  );
}
