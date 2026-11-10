import React from 'react';
import { customerGalleryPhotos } from './customerGalleryData.js';
import './customer-gallery.css';

export default function CustomerGallery({ photos = customerGalleryPhotos }) {
  return (
    <section className="customer-gallery" id="customer-moments" aria-labelledby="customer-gallery-title">
      <div className="customer-gallery-inner">
        <header className="customer-gallery-heading">
          <div><p className="customer-gallery-eyebrow">THE EVERYDAY EDIT / JCZCARE</p><h2 id="customer-gallery-title">Made for care.<br /><em>Seen in everyday life.</em></h2></div>
          <p className="customer-gallery-intro">The little moments behind everyday essentials.<br />A closer look at our products in use.</p>
        </header>
        <div className="customer-gallery-grid">
          {photos.map((photo) => (
            <figure className={`customer-gallery-photo customer-gallery-photo-${photo.id}${photo.src ? ' has-photo' : ''}`} key={photo.id}>
              {photo.src ? <img src={photo.src} alt={photo.alt} style={{ objectPosition: photo.position }} loading="lazy" /> : (
                <div className="customer-gallery-placeholder" role="img" aria-label={`图片预留 ${photo.id}：${photo.label}`}>
                  <span className="customer-gallery-frame" aria-hidden="true"><span>＋</span></span>
                  <strong>{photo.label}</strong><span>图片待补充 · PHOTO {photo.id}</span>
                  <small>{photo.shape === 'portrait' ? '建议竖图 · 4:5' : '建议横图 · 4:3'}</small>
                </div>
              )}
              <span className="customer-gallery-number" aria-hidden="true">{photo.id} / EVERYDAY MOMENTS</span>
            </figure>
          ))}
        </div>
        <div className="customer-gallery-end"><span>EVERYDAY ESSENTIALS. INDIVIDUAL STORIES.</span><span>JCZCARE <i aria-hidden="true">✦</i> MADE FOR YOUR BRAND</span></div>
      </div>
    </section>
  );
}
