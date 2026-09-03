import React from 'react';

const privacySections = [
  { id: 'scope', label: 'Scope' },
  { id: 'information', label: 'Information we collect' },
  { id: 'use', label: 'How we use information' },
  { id: 'legal-bases', label: 'Legal bases' },
  { id: 'cookies', label: 'Cookies and similar technologies' },
  { id: 'sharing', label: 'How we share information' },
  { id: 'transfers', label: 'International transfers' },
  { id: 'retention', label: 'Data retention' },
  { id: 'security', label: 'Data security' },
  { id: 'rights', label: 'Your rights and choices' },
  { id: 'children', label: "Children's privacy" },
  { id: 'changes', label: 'Changes to this policy' },
  { id: 'contact', label: 'Contact us' },
];

function PolicySection({ id, number, title, children }) {
  return (
    <section className="privacy-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="privacy-section-number" aria-hidden="true">{String(number).padStart(2, '0')}</div>
      <div className="privacy-section-content">
        <h2 id={`${id}-title`}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="privacy-page" id="privacy-policy-top">
      <header className="privacy-hero">
        <div className="container privacy-hero-inner">
          <nav className="privacy-breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Privacy Policy</span>
          </nav>
          <p className="section-kicker">Legal &amp; Privacy</p>
          <h1>Privacy Policy</h1>
          <p className="privacy-hero-summary">
            This policy explains how Nantong JINCHENG ZENCARE Technology Company collects, uses,
            shares, and protects personal information when you visit JCZCARE or contact our team.
          </p>
          <div className="privacy-effective-date">
            <span>Effective date</span>
            <strong>August 22, 2026</strong>
          </div>
        </div>
      </header>

      <div className="container privacy-layout">
        <aside className="privacy-toc" aria-label="Privacy Policy contents">
          <p>On this page</p>
          <ol>
            {privacySections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.label}</a>
              </li>
            ))}
          </ol>
        </aside>

        <article className="privacy-article">
          <div className="privacy-intro">
            <p>
              Nantong JINCHENG ZENCARE Technology Company ("JCZCARE," "we," "us," or "our") is
              the controller of personal information described in this policy unless stated otherwise.
              Our website is <a href="https://www.jczcare.com">www.jczcare.com</a> (the "Site").
            </p>
          </div>

          <PolicySection id="scope" number={1} title="Scope">
            <p>
              This policy applies to personal information collected through the Site, our inquiry and
              account forms, and related business communications. It does not apply to third-party
              websites or services that have their own privacy policies, including sites reached through
              links on the Site.
            </p>
          </PolicySection>

          <PolicySection id="information" number={2} title="Information we collect">
            <h3>Information you provide</h3>
            <ul>
              <li>Contact details, such as your name, work email, telephone or WhatsApp number, country, and company details.</li>
              <li>Project and inquiry details, such as product interests, quantities, specifications, packaging requirements, messages, and requested samples.</li>
              <li>Account details submitted through our business sign-in page. Passwords are stored in hashed form rather than as readable text.</li>
              <li>Any other information you choose to provide by email, WhatsApp, a form, or another business communication channel.</li>
            </ul>
            <h3>Information collected automatically</h3>
            <ul>
              <li>Device and network information, such as IP address, browser type, user agent, operating system, language, and approximate location derived from IP address.</li>
              <li>Usage information, such as pages visited, referring page, session activity, form interactions, and the date and time of your visit.</li>
              <li>Advertising and attribution information, such as UTM parameters and advertising click identifiers when present in the URL.</li>
              <li>Cookie, local storage, session storage, pixel, and similar technology data described below.</li>
            </ul>
          </PolicySection>

          <PolicySection id="use" number={3} title="How we use information">
            <p>We may use personal information to:</p>
            <ul>
              <li>Respond to inquiries and prepare quotations, samples, specifications, and OEM or ODM project plans.</li>
              <li>Manage business relationships, orders, account access, communications, and customer support.</li>
              <li>Operate, maintain, secure, troubleshoot, and improve the Site and our services.</li>
              <li>Measure Site performance, understand traffic sources, and evaluate marketing campaigns.</li>
              <li>Detect spam, fraud, abuse, security incidents, and violations of our terms or applicable law.</li>
              <li>Comply with legal, tax, accounting, regulatory, and recordkeeping obligations.</li>
              <li>Establish, exercise, or defend legal claims and protect our rights and those of others.</li>
            </ul>
          </PolicySection>

          <PolicySection id="legal-bases" number={4} title="Legal bases">
            <p>
              Where applicable law requires a legal basis, we process personal information based on one
              or more of the following: your consent; steps taken at your request before entering a
              contract; performance of a contract; compliance with legal obligations; and our legitimate
              interests in operating a secure B2B website, responding to business inquiries, improving our
              services, and promoting our products, provided those interests are not overridden by your
              rights. You may withdraw consent at any time, without affecting processing already completed.
            </p>
          </PolicySection>

          <PolicySection id="cookies" number={5} title="Cookies and similar technologies">
            <p>
              The Site uses cookies, pixels, browser storage, and similar technologies for site operation,
              language preferences, security, analytics, lead attribution, and advertising measurement.
              Services used on the Site may include:
            </p>
            <ul>
              <li><strong>Google Analytics</strong> to measure visits, page views, interactions, and traffic sources.</li>
              <li><strong>Meta Pixel</strong> to measure page views and inquiry conversions and to evaluate advertising performance.</li>
              <li><strong>Cloudflare Turnstile</strong> to distinguish legitimate form submissions from automated abuse.</li>
              <li><strong>Google Translate</strong> to provide optional machine translation and remember language preferences.</li>
            </ul>
            <p>
              These providers may collect device identifiers, IP address, browser information, usage data,
              and cookie identifiers under their own privacy policies. You can control cookies through your
              browser settings and use provider-level controls such as Google Analytics opt-out tools and
              Meta ad preferences. Blocking some technologies may affect language, form, or other Site features.
            </p>
          </PolicySection>

          <PolicySection id="sharing" number={6} title="How we share information">
            <p>We may disclose personal information to:</p>
            <ul>
              <li>Service providers supporting hosting, email delivery, spreadsheets and business records, analytics, advertising measurement, translation, security, and website operations.</li>
              <li>Our employees, contractors, advisers, and affiliated business partners who need the information for the purposes described in this policy.</li>
              <li>Authorities, courts, regulators, or other parties when required by law or reasonably necessary to protect rights, safety, property, or Site integrity.</li>
              <li>A buyer, successor, or adviser in connection with a merger, financing, restructuring, sale of assets, or similar corporate transaction.</li>
            </ul>
            <p>
              We do not sell personal information for money. Some analytics and advertising activity may be
              treated as "sharing," "targeted advertising," or a "sale" under certain privacy laws. You may
              contact us to exercise any applicable opt-out right.
            </p>
          </PolicySection>

          <PolicySection id="transfers" number={7} title="International transfers">
            <p>
              JCZCARE is based in Nantong, Jiangsu, China, and serves customers internationally. Your
              information may be processed in China and in countries where our service providers operate.
              Those countries may have different data protection laws from your country. Where required,
              we use appropriate contractual or other safeguards for cross-border transfers.
            </p>
          </PolicySection>

          <PolicySection id="retention" number={8} title="Data retention">
            <p>
              We retain personal information only for as long as reasonably necessary for the purposes in
              this policy, including managing inquiries and business relationships, maintaining account and
              transaction records, resolving disputes, enforcing agreements, and meeting legal obligations.
              Retention periods depend on the type of information, the status of the business relationship,
              legal requirements, and security needs. We delete or anonymize information when it is no
              longer required, unless continued retention is permitted or required by law.
            </p>
          </PolicySection>

          <PolicySection id="security" number={9} title="Data security">
            <p>
              We use reasonable administrative, technical, and organizational measures designed to protect
              personal information against unauthorized access, loss, misuse, alteration, or disclosure.
              No internet transmission or storage system is completely secure, so we cannot guarantee
              absolute security. Please do not send sensitive personal information that is not necessary
              for your business inquiry.
            </p>
          </PolicySection>

          <PolicySection id="rights" number={10} title="Your rights and choices">
            <p>
              Depending on where you live, you may have rights to request access, correction, deletion,
              restriction, portability, objection to processing, withdrawal of consent, or an opt-out from
              certain advertising-related disclosures. You may also have the right to complain to your
              local data protection authority. We will not discriminate against you for exercising a legal
              privacy right.
            </p>
            <p>
              To submit a request, email <a href="mailto:hengtuo@nthengtuo.com">hengtuo@nthengtuo.com</a>.
              Please describe your request and the information or interaction involved. We may need to
              verify your identity and authority before completing a request. Authorized agents may submit
              requests where permitted by law, subject to verification.
            </p>
          </PolicySection>

          <PolicySection id="children" number={11} title="Children's privacy">
            <p>
              The Site is intended for business users and is not directed to children under 16. We do not
              knowingly collect personal information from children under 16. If you believe a child has
              provided personal information to us, please contact us so we can review and delete it as appropriate.
            </p>
          </PolicySection>

          <PolicySection id="changes" number={12} title="Changes to this policy">
            <p>
              We may update this policy to reflect changes in our practices, technology, services, or legal
              requirements. We will post the updated version on this page and revise the effective date.
              Material changes may be communicated through an additional notice where required by law.
            </p>
          </PolicySection>

          <PolicySection id="contact" number={13} title="Contact us">
            <address className="privacy-contact">
              <strong>Nantong JINCHENG ZENCARE Technology Company</strong>
              <span>Nantong, Jiangsu, China</span>
              <a href="mailto:hengtuo@nthengtuo.com">hengtuo@nthengtuo.com</a>
              <a href="https://wa.me/8618962944556" target="_blank" rel="noopener noreferrer">WhatsApp: +86 189 6294 4556</a>
            </address>
          </PolicySection>
        </article>
      </div>
    </div>
  );
}
