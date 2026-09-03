import React from 'react';
import {
  Anchor,
  ArrowRight,
  BadgeCheck,
  Boxes,
  ClipboardCheck,
  Factory,
  Globe2,
  MapPin,
  PackageCheck,
  Ship,
  Truck,
  Warehouse,
} from 'lucide-react';

export const partnershipSolutionContent = {
  eyebrow: 'B2B OEM/ODM Partnership Solution',
  identity: 'Professional OEM/ODM Pet Hygiene Manufacturer',
  strengthsAriaLabel: 'Partnership strengths',
  strengths: ['3-Day Sampling', 'Controlled Production', 'Worldwide Delivery'],
  timeline: {
    title: 'OEM/ODM Customization Timeline',
    subtitle:
      'A procurement-ready path from first sample to finished order delivery, with clear milestones at every stage.',
    timeLabel: 'Lead time',
    steps: [
      {
        number: '01',
        icon: ClipboardCheck,
        title: 'Sample Development',
        time: '3 Days',
        description: 'Confirm the product brief and receive a production-ready sample within 3 days.',
      },
      {
        number: '02',
        icon: PackageCheck,
        title: 'Sample Delivery',
        time: 'By Destination',
        description:
          'Samples dispatch from Nantong, China, with delivery timing confirmed for your destination.',
      },
      {
        number: '03',
        icon: Factory,
        title: 'Mass Production',
        time: '30 Days',
        description: 'Approved specifications move into scheduled production with in-process quality control.',
      },
      {
        number: '04',
        icon: Globe2,
        title: 'Global Delivery',
        time: '2-3 Months',
        description: 'Finished orders are inspected, packed, and coordinated to your designated market.',
      },
    ],
  },
  shipping: {
    eyebrow: 'Incoterms & Delivery Planning',
    title: 'One-Stop Global Export Solution',
    subtitle: 'Choose the shipping structure that fits your import experience, logistics network, and delivery scope.',
    applicationLabel: 'Best for',
    terms: [
      {
        name: 'FOB',
        icon: Anchor,
        description: 'Cargo is handed over at the nominated port for buyer-managed international freight.',
        application: 'Professional importers managing their own logistics.',
      },
      {
        name: 'EXW',
        icon: Warehouse,
        description: 'Collect finished goods directly from our Nantong factory.',
        application: 'Customers with established logistics partners.',
      },
      {
        name: 'CIF',
        icon: Ship,
        description: 'We coordinate ocean freight and insurance to your destination port.',
        application: 'Customers requiring simplified transportation.',
      },
      {
        name: 'DDP',
        icon: Truck,
        description: 'A coordinated door-to-door delivery solution for a simpler import process.',
        application: 'Brands seeking a fully managed supply chain.',
      },
    ],
  },
  logistics: {
    eyebrow: 'Integrated Export Workflow',
    title: 'One coordinated path from our factory to your market.',
    description:
      'Production control, inspection, export documents, and delivery coordination remain connected from order release to shipment.',
    stages: [
      { icon: Factory, label: 'China Factory' },
      { icon: Boxes, label: 'Production' },
      { icon: BadgeCheck, label: 'Quality Inspection' },
      { icon: Ship, label: 'Shipping' },
      { icon: MapPin, label: 'Global Destination' },
    ],
  },
  routes: {
    ariaLabel: 'Representative global shipping routes from China',
    originCountry: 'China',
    source: 'Nantong, China',
    title: 'Representative Export Routes',
    destinations: [
      { region: 'USA', note: 'North America' },
      { region: 'Europe', note: 'European Union & UK' },
      { region: 'Japan', note: 'East Asia' },
    ],
  },
  seoKeywords: [
    'OEM pet products manufacturer',
    'Pet training pads OEM supplier',
    'Custom pet hygiene products factory',
    'Private label pet products manufacturer',
    'China pet care products supplier',
  ],
};

export function CustomizationTimeline({ content = partnershipSolutionContent }) {
  const { timeline } = content;

  return (
    <section className="partnership-timeline" aria-labelledby="customization-timeline-title">
      <div className="container partnership-container">
        <div className="partnership-intro">
          <div className="partnership-intro-copy">
            <span className="partnership-intro-icon" aria-hidden="true">
              <Factory size={23} strokeWidth={1.65} />
            </span>
            <div>
              <p className="partnership-eyebrow">{content.eyebrow}</p>
              <p className="partnership-identity">{content.identity}</p>
            </div>
          </div>
          <ul className="partnership-strengths" aria-label={content.strengthsAriaLabel}>
            {content.strengths.map((strength) => (
              <li key={strength}>
                <BadgeCheck size={17} aria-hidden="true" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <header className="partnership-heading">
          <div>
            <span className="partnership-section-number" aria-hidden="true">01</span>
            <h2 id="customization-timeline-title">{timeline.title}</h2>
          </div>
          <p>{timeline.subtitle}</p>
        </header>

        <ol className="customization-timeline-list">
          {timeline.steps.map(({ number, icon: Icon, title, time, description }) => (
            <li className="customization-timeline-step" key={number}>
              <div className="timeline-marker" aria-hidden="true">
                <Icon size={23} strokeWidth={1.7} />
                <span>{number}</span>
              </div>
              <div className="timeline-step-copy">
                <div className="timeline-time-row">
                  <p className="timeline-time-label">{timeline.timeLabel}</p>
                  <strong className="timeline-time">{time}</strong>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ShippingSolution({ content = partnershipSolutionContent }) {
  const { shipping, logistics, routes } = content;

  return (
    <section className="shipping-solution" aria-labelledby="shipping-solution-title">
      <div className="container partnership-container">
        <header className="partnership-heading shipping-heading">
          <div>
            <p className="shipping-eyebrow">{shipping.eyebrow}</p>
            <span className="partnership-section-number" aria-hidden="true">02</span>
            <h2 id="shipping-solution-title">{shipping.title}</h2>
          </div>
          <p>{shipping.subtitle}</p>
        </header>

        <div className="shipping-term-grid">
          {shipping.terms.map(({ name, icon: Icon, description, application }, index) => (
            <article className="shipping-term-card" key={name}>
              <div className="shipping-term-topline">
                <span className="shipping-term-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.7} />
                </span>
                <h3>{name}</h3>
                <span className="shipping-term-code" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p>{description}</p>
              <div className="shipping-term-application">
                <span>{shipping.applicationLabel}</span>
                <strong>{application}</strong>
              </div>
            </article>
          ))}
        </div>

        <div className="global-logistics-visual">
          <div className="global-logistics-copy">
            <p className="partnership-eyebrow">{logistics.eyebrow}</p>
            <h3>{logistics.title}</h3>
            <p>{logistics.description}</p>
          </div>

          <ol className="global-logistics-flow">
            {logistics.stages.map(({ icon: Icon, label }, index) => (
              <li key={label}>
                <span className="global-flow-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="global-flow-icon" aria-hidden="true">
                  <Icon size={21} strokeWidth={1.7} />
                </span>
                <strong>{label}</strong>
              </li>
            ))}
          </ol>

          <div className="export-route-map" aria-label={routes.ariaLabel}>
            <div className="export-route-origin">
              <span className="export-route-globe" aria-hidden="true">
                <Globe2 size={32} strokeWidth={1.35} />
              </span>
              <div>
                <small>{routes.title}</small>
                <strong>{routes.source}</strong>
              </div>
            </div>
            <div className="export-route-list">
              {routes.destinations.map(({ region, note }) => (
                <div className="export-route" key={region}>
                  <span className="export-route-line" aria-hidden="true">
                    <i />
                  </span>
                  <div>
                    <strong className="export-route-label">
                      <span>{routes.originCountry}</span>
                      <ArrowRight size={13} strokeWidth={1.8} aria-hidden="true" />
                      <span>{region}</span>
                    </strong>
                    <small>{note}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="partnership-seo-text">
          {content.seoKeywords.join('. ')}.
        </p>
      </div>
    </section>
  );
}
