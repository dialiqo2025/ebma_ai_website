import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pagesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../pages");

const policyUpdated = "13 October 2026";

const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

function sectionHtml(section, index) {
  const num = String(index + 1).padStart(2, "0");
  const border = index > 0 ? "mt-12 border-t border-[#e1ddeb] pt-12" : "";
  const paras =
    section.paragraphs
      ?.map(
        (p) =>
          `<p class="mt-4 first:mt-0 text-[14px] leading-[1.85] text-[#626a7f]">${escapeHtml(p)}</p>`,
      )
      .join("\n                ") ?? "";
  const bullets = section.bullets
    ? `<ul class="mt-5 grid gap-3">${section.bullets
        .map(
          (b) =>
            `<li class="flex gap-3 text-[14px] leading-[1.75] text-[#626a7f]"><span class="mt-1.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#eeeaff] text-[#6542e8]">${checkSvg}</span><span>${escapeHtml(b)}</span></li>`,
        )
        .join("")}</ul>`
    : "";

  return `
            <section id="${section.id}" class="scroll-mt-28 ${border}">
              <div class="flex items-baseline gap-4">
                <span class="font-mono text-[11px] font-bold text-[#9b8fc1]">${num}</span>
                <h2 class="font-heading text-[26px] font-semibold tracking-[-0.035em] text-[#16182c]">${escapeHtml(section.title)}</h2>
              </div>
              <div class="ml-[38px] mt-5 max-[620px]:ml-0">
                ${paras}
                ${bullets}
              </div>
            </section>`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function navLink(section, index) {
  const num = String(index + 1).padStart(2, "0");
  return `<a href="#${section.id}" class="group flex items-start gap-2.5 rounded-lg px-2 py-2 text-[12px] font-semibold leading-[1.4] text-[#626a7f] transition hover:bg-[#f5f2ff] hover:text-[#6542e8]"><span class="mt-px font-mono text-[10px] text-[#aaa3bb] group-hover:text-[#8a6cf1]">${num}</span>${escapeHtml(section.title)}</a>`;
}

function legalPage({ title, metaTitle, eyebrow, description, security, sections }) {
  const heroIcon = security
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`;

  return `<!-- title: ${metaTitle} -->
{{HEADER}}
<main class="overflow-x-clip bg-[#f7f8fc]">
  <section class="relative border-b border-[#ddd6f5] pt-20 max-[820px]:pt-[68px]">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(101,66,232,.15),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(167,95,218,.09),transparent_27%)]"></div>
    <div class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)] relative py-[76px] max-[820px]:py-[56px]">
      <div class="flex max-w-[820px] items-start gap-5 max-[560px]:gap-4">
        <span class="grid size-14 shrink-0 place-items-center rounded-[18px] border border-[#d8d2ee] bg-white text-[#6542e8] shadow-[0_10px_30px_rgba(53,41,112,.09)] max-[560px]:size-12">${heroIcon}</span>
        <div>
          <p class="text-[11px] font-extrabold uppercase tracking-[0.13em] text-[#6542e8]">${escapeHtml(eyebrow)}</p>
          <h1 class="mt-3 font-heading text-[clamp(42px,6vw,70px)] font-semibold leading-[1.02] tracking-[-0.055em] text-[#121528]">${escapeHtml(title)}</h1>
          <p class="mt-5 max-w-[720px] text-[16px] leading-[1.75] text-[#5c6478]">${escapeHtml(description)}</p>
          <p class="mt-5 text-[12px] font-semibold text-[#7a8299]">Last updated: ${policyUpdated}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto w-[min(1180px,calc(100%-48px))] max-[820px]:w-[calc(100%-32px)] grid grid-cols-[250px_1fr] items-start gap-16 py-[72px] max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[820px]:py-[52px]">
    <aside class="sticky top-[112px] rounded-[18px] border border-[#e0dbea] bg-white p-5 shadow-[0_8px_30px_rgba(18,21,40,.045)] max-[900px]:static">
      <p class="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#8a82a0]">On this page</p>
      <nav aria-label="${escapeHtml(title)} sections" class="mt-4 grid gap-1">
        ${sections.map(navLink).join("\n        ")}
      </nav>
    </aside>

    <article class="min-w-0 max-w-[780px]">
      ${sections.map(sectionHtml).join("\n")}
      <div class="mt-14 rounded-[22px] border border-[#d9d2ef] bg-[linear-gradient(135deg,#f0ecff,#faf9ff)] p-7 max-[560px]:p-5">
        <p class="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#6542e8]">Questions or requests</p>
        <h2 class="mt-2 font-heading text-[25px] font-semibold tracking-[-0.035em] text-[#15172b]">Talk to the ebma AI team.</h2>
        <p class="mt-3 max-w-[570px] text-[13px] leading-[1.7] text-[#687086]">Use our contact form for privacy requests, legal questions, security concerns, or general support. Your message will be routed to the configured contact address.</p>
        <a href="{{ROOT}}contact.html?topic=general" class="mt-5 inline-flex items-center justify-center gap-2 rounded-[11px] min-h-[42px] px-[18px] text-[13px] font-bold border-0 text-white bg-brand-gradient hover:-translate-y-px transition duration-[250ms]">
          Contact us
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </article>
  </section>
</main>
{{FOOTER}}
`;
}

// Sections mirrored from content/legal.ts
const privacySections = [
  {
    id: "scope",
    title: "Scope of this policy",
    paragraphs: [
      "This Privacy Policy explains how ebma AI collects, uses, shares, and protects personal information when you visit our website, create an account, use our dashboards, applications or APIs, or contact our team.",
      "If an organisation gives you access to ebma AI, that organisation may separately control the information it submits to our services. Its own privacy notice and agreement with ebma AI may also apply.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: [
      "The information we collect depends on how you interact with ebma AI. You do not have to provide personal information, but some services may not work without it.",
    ],
    bullets: [
      "Account and profile information, such as your name, email address, company, role, login details, and account preferences.",
      "Service content, including text, audio, prompts, transcripts, generated speech, outputs, and files you choose to submit for speech-to-text, text-to-speech, or language-model processing.",
      "Usage and technical information, such as API activity, credit consumption, feature interactions, device and browser details, IP address, timestamps, diagnostics, and security logs.",
      "Commercial information, including wallet top-ups, transaction references, invoices, and billing contact details. Payment-card details are handled by the relevant payment provider rather than stored in full by ebma AI.",
      "Communications you send through our contact form, support channels, custom-pricing requests, surveys, or feedback tools.",
      "Cookies and similar technologies needed to operate, secure, remember preferences for, and understand use of our website and services.",
    ],
  },
  {
    id: "how-we-use-information",
    title: "How we use information",
    bullets: [
      "Provide, maintain, personalise, and troubleshoot our websites, APIs, dashboards, and AI services.",
      "Authenticate users, administer accounts, meter usage, deduct credits, process payments, and provide transaction records.",
      "Respond to inquiries, deliver support, and communicate service, security, billing, and policy updates.",
      "Monitor performance, prevent abuse or fraud, investigate incidents, enforce our terms, and comply with legal obligations.",
      "Analyse aggregated or de-identified usage to improve product reliability, usability, and capacity planning.",
    ],
    paragraphs: [
      "We process information where needed to provide the service you request, with your consent where required, for legitimate operational and security purposes, or to comply with applicable law. We do not use submitted service content for a materially different purpose without an appropriate legal basis or notice.",
    ],
  },
  {
    id: "voice-and-ai-content",
    title: "Voice and AI content",
    paragraphs: [
      "Audio, text, prompts, and generated outputs can contain personal or sensitive information. Only submit content you are authorised to use. If content includes another person's voice or personal information, you are responsible for obtaining any consent required by law.",
      "We process submitted content to perform the requested service and related functions such as abuse prevention, quality assurance, debugging, and support. The exact handling may also be governed by your account settings or a separate enterprise agreement.",
    ],
  },
  {
    id: "sharing",
    title: "When information is shared",
    paragraphs: [
      "We do not sell personal information. We may share limited information with vendors that help us provide hosting, infrastructure, authentication, communications, analytics, support, billing, or security. They may process it only for the relevant service and under appropriate contractual obligations.",
      "We may also disclose information when required by law, to protect users or the service, to investigate misuse, or as part of a merger, financing, acquisition, reorganisation, or sale of assets subject to appropriate safeguards.",
    ],
  },
  {
    id: "retention",
    title: "Retention and deletion",
    paragraphs: [
      "We retain information only for as long as reasonably needed for the purposes described here, including providing the service, maintaining business and security records, resolving disputes, and meeting legal obligations. Retention can vary by information type, account settings, and contractual requirements.",
      "When information is no longer needed, we take reasonable steps to delete, anonymise, or securely isolate it. Backup copies may remain for a limited period before being overwritten through normal operations.",
    ],
  },
  {
    id: "rights",
    title: "Your choices and rights",
    paragraphs: [
      "Depending on where you live, you may have rights to access, correct, update, delete, restrict, or object to certain processing of your personal information, withdraw consent, or request a portable copy. You may also have a right to complain to a relevant data-protection authority.",
      "To make a request, use our contact form and include enough detail for us to understand and verify it. We may ask for additional information to protect your account and will respond in accordance with applicable law.",
    ],
  },
  {
    id: "security-and-transfers",
    title: "Security and international processing",
    paragraphs: [
      "We use administrative, technical, and organisational measures designed to protect information against unauthorised access, loss, alteration, or disclosure. No online service can guarantee absolute security, so you should keep credentials and API keys confidential and notify us promptly of suspected misuse.",
      "Our providers may process information in countries other than your own. Where required, we use appropriate safeguards for those transfers and handle information in accordance with applicable law.",
    ],
  },
  {
    id: "children-and-changes",
    title: "Children and policy changes",
    paragraphs: [
      "ebma AI is intended for business users and is not directed to children. If you believe a child has provided personal information without appropriate authorisation, contact us so we can review and act on the request.",
      "We may update this policy as our services or legal obligations change. We will post the revised version here, update the date above, and provide additional notice when required by law.",
    ],
  },
];

const termsSections = [
  {
    id: "agreement",
    title: "Agreement and eligibility",
    paragraphs: [
      "These Terms and Conditions govern your access to the ebma AI website, dashboards, APIs, models, tools, and related services. By creating an account, purchasing credits, or using a service, you agree to these terms and our Privacy Policy.",
      "You must be legally able to enter into this agreement. If you use ebma AI for an organisation, you confirm that you have authority to bind that organisation, and “you” includes that organisation.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts and access",
    bullets: [
      "Provide accurate account information and keep it up to date.",
      "Protect passwords, API keys, tokens, and other credentials; do not share individual credentials or expose secret keys in client-side code.",
      "Accept responsibility for activity under your account and notify us promptly if you suspect unauthorised access.",
      "Use service limits, access controls, and APIs only as documented; do not evade rate limits or technical protections.",
    ],
  },
  {
    id: "services-and-changes",
    title: "Services and availability",
    paragraphs: [
      "ebma AI provides speech-to-text, text-to-speech, language-model assistance, and related platform capabilities. Features, supported models, limits, and availability can change as the platform develops. We may modify, suspend, or discontinue a feature where reasonably necessary and will provide notice when appropriate.",
      "Beta, preview, or evaluation features may be less reliable and may change without notice. Do not use them for workloads that require production-level availability unless we agree otherwise in writing.",
    ],
  },
  {
    id: "credits-and-payment",
    title: "Credits, usage, and payment",
    paragraphs: [
      "ebma AI uses a pay-as-you-go credit model. Eligible new accounts may receive free credits, after which you can add credits to your account wallet. Credits are deducted according to actual use, the selected service or model, and the usage rates displayed in the platform at the time of processing.",
      "Credits are a limited right to use eligible ebma AI services. They are not cash, a bank deposit, or a transferable stored-value product, and cannot be sold or transferred between users unless we expressly allow it. Custom commercial terms may apply when agreed in writing.",
      "Pricing, taxes, minimum top-ups, and any applicable validity or refund terms are shown at checkout or in the relevant order. Except where applicable law requires otherwise, completed usage and promotional credits are not refundable. You are responsible for monitoring your balance and usage.",
    ],
  },
  {
    id: "content",
    title: "Your content and AI outputs",
    paragraphs: [
      "You retain your rights in text, audio, prompts, files, and other content you submit. You grant ebma AI and its service providers the limited rights necessary to host, process, transmit, and transform that content to provide, secure, support, and maintain the services.",
      "Subject to applicable law and third-party rights, you may use outputs generated for you. AI outputs may be inaccurate, incomplete, biased, or similar to outputs provided to others. You are responsible for reviewing outputs before relying on, publishing, or distributing them, especially in high-impact or regulated contexts.",
      "You confirm that you have all rights, notices, and consents needed for submitted content, including consent to process a person's voice, likeness, confidential information, or personal data where applicable.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    paragraphs: [
      "You must use ebma AI lawfully, responsibly, and in a way that does not harm others or compromise the platform.",
    ],
    bullets: [
      "Do not create deceptive impersonations, non-consensual voice replicas, fraud, harassment, exploitation, or content that violates another person's rights.",
      "Do not upload unlawful content, malware, or material you are not authorised to process.",
      "Do not reverse engineer, scrape, overload, disrupt, or bypass security, metering, access, or usage controls except where law expressly permits it.",
      "Do not misrepresent AI-generated content as authentic where disclosure is legally required or necessary to avoid deception.",
      "Do not use outputs as a substitute for qualified medical, legal, financial, or other professional advice.",
    ],
  },
  {
    id: "our-property",
    title: "Our technology and intellectual property",
    paragraphs: [
      "ebma AI and its licensors own the services, models, software, documentation, branding, and related intellectual property. These terms grant you a limited, non-exclusive, non-transferable, revocable right to access the services as intended; they do not transfer ownership of our technology.",
      "If you provide feedback, you allow us to use it without restriction or compensation, provided we do not identify you publicly without permission.",
    ],
  },
  {
    id: "suspension",
    title: "Suspension and termination",
    paragraphs: [
      "You may stop using the services at any time. We may restrict or suspend access when reasonably necessary to address a security risk, suspected fraud, unlawful activity, unpaid amounts, material breach, harm to users or the platform, or a legal requirement. Where practical, we will provide notice and an opportunity to resolve the issue.",
      "Sections that by their nature should survive termination—including payment obligations, intellectual property, disclaimers, liability, and dispute provisions—will continue to apply.",
    ],
  },
  {
    id: "disclaimers-liability",
    title: "Disclaimers and liability",
    paragraphs: [
      "Services and outputs are provided on an “as available” basis. To the maximum extent permitted by law, ebma AI disclaims implied warranties, including merchantability, fitness for a particular purpose, and non-infringement. We do not promise that outputs will be accurate, unique, error-free, or suitable for every use.",
      "To the maximum extent permitted by law, neither party will be liable for indirect, incidental, special, exemplary, punitive, or consequential loss, or for lost profits, revenues, goodwill, or data. ebma AI's total aggregate liability arising from the services will not exceed the amount you paid to ebma AI for the affected services during the 12 months before the event giving rise to the claim. These limits do not apply where liability cannot lawfully be limited.",
    ],
  },
  {
    id: "law-and-changes",
    title: "Applicable law and changes",
    paragraphs: [
      "These terms are governed by the laws of India, without regard to conflict-of-law principles. Before starting formal proceedings, each party agrees to try in good faith to resolve a dispute through written notice. Courts with competent jurisdiction in India will have jurisdiction, unless applicable law requires otherwise.",
      "We may update these terms to reflect service, legal, or security changes. The revised terms will be posted here with a new effective date, and additional notice will be provided where required. If a change materially affects your rights, you may stop using the services before it takes effect.",
    ],
  },
];

const securitySections = [
  {
    id: "approach",
    title: "Our security approach",
    paragraphs: [
      "Security is part of how we design, operate, and improve ebma AI. We use layered technical and organisational controls intended to protect customer accounts, service content, platform infrastructure, and availability. Controls may differ by product, deployment, and enterprise agreement.",
      "No system is immune from risk. We continually review the platform and prioritise improvements based on the sensitivity of data, likely threats, and impact to customers.",
    ],
  },
  {
    id: "access",
    title: "Identity and access",
    bullets: [
      "Authenticated access to protected account and platform functions.",
      "API credentials intended to keep server-to-server access separate from public client code.",
      "Account- and role-aware authorisation for administrative or privileged workflows.",
      "Logging and review of relevant authentication and service events to support troubleshooting and investigations.",
    ],
  },
  {
    id: "application-api",
    title: "Application and API protection",
    bullets: [
      "Input validation and bounded request sizes for public and authenticated endpoints.",
      "Rate limiting and abuse controls for exposed workflows, including public inquiry submissions.",
      "Controlled cross-origin access and secure handling of server-side secrets.",
      "Dependency, code-quality, and build checks as part of ongoing engineering work.",
      "Separation of public website functions, user workflows, and administrative capabilities.",
    ],
  },
  {
    id: "data",
    title: "Data handling",
    paragraphs: [
      "We seek to limit access to customer information to people and systems that need it to provide, support, secure, or improve the service. Service providers are selected for a defined operational purpose and are expected to handle information under contractual and confidentiality obligations.",
      "Retention depends on the service, account configuration, support needs, and legal requirements. Customers should avoid sending unnecessary sensitive information and should remove secrets from prompts, files, or support messages.",
    ],
  },
  {
    id: "operations",
    title: "Operational resilience",
    bullets: [
      "Monitoring and diagnostics designed to help identify availability, performance, and abuse issues.",
      "Backup and recovery processes appropriate to supported production systems.",
      "Incident assessment and response workflows that prioritise containment, investigation, recovery, and customer communication where required.",
      "Change review and production safeguards proportionate to the risk of the affected service.",
    ],
  },
  {
    id: "customer-responsibility",
    title: "Your role in security",
    bullets: [
      "Keep passwords, API keys, tokens, and recovery methods private; rotate credentials if exposure is suspected.",
      "Use least-privilege access, remove access for former team members, and keep account information current.",
      "Never place secret API keys in browser code, public repositories, mobile applications, or shared documents.",
      "Validate AI outputs and apply human review and domain-specific controls for sensitive or high-impact workflows.",
      "Promptly report suspected vulnerabilities, account compromise, fraud, or unauthorised use.",
    ],
  },
  {
    id: "reporting",
    title: "Report a security concern",
    paragraphs: [
      "If you believe you have found a vulnerability or security issue, contact us through the form below with “Security concern” at the start of your message. Include the affected service, clear reproduction steps, and potential impact. Do not access, modify, retain, or disclose other people's data, disrupt the service, or use destructive testing.",
      "We will review credible reports and coordinate next steps where appropriate. Please allow us reasonable time to investigate before public disclosure. This page does not claim a specific external certification; enterprise customers can contact us for current security and deployment information.",
    ],
  },
];

const pages = [
  {
    file: "privacy.html",
    metaTitle: "Privacy Policy | ebma AI",
    title: "Privacy Policy",
    eyebrow: "Legal",
    description:
      "A clear overview of the information we handle, why we need it, and the choices available to you when using ebma AI.",
    sections: privacySections,
  },
  {
    file: "terms.html",
    metaTitle: "Terms & Conditions | ebma AI",
    title: "Terms & Conditions",
    eyebrow: "Legal",
    description:
      "The rules that help keep ebma AI reliable, responsible, and fair for everyone who builds with the platform.",
    sections: termsSections,
  },
  {
    file: "security.html",
    metaTitle: "Security | ebma AI",
    title: "Security at ebma AI",
    eyebrow: "Trust & safety",
    description:
      "How we think about protecting accounts, service content, APIs, and the systems behind our voice and language platform.",
    security: true,
    sections: securitySections,
  },
];

for (const page of pages) {
  fs.writeFileSync(path.join(pagesDir, page.file), legalPage(page), "utf8");
  console.log("Wrote", page.file);
}
