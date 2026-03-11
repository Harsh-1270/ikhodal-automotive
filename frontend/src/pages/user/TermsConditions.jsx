import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserNavbar from "../../components/common/UserNavbar";
import "./TermsConditions.css";

const TermsConditions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const sectionRefs = useRef([]);
  const footerRef = useRef(null);

  /* ==========================================
       SVG ICONS COMPONENT
       ========================================== */
  const Icons = {
    Scroll: ({ className = "", color = "currentColor" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
        <path d="M19 3H8a2 2 0 0 0-2 2v14" />
      </svg>
    ),
    Clipboard: ({ className = "", color = "#3b82f6" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    ),
    Wrench: ({ className = "", color = "#f59e0b" }) => (
      <svg className={className} viewBox="0 0 24 24" fill={color}>
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
    DollarSign: ({ className = "", color = "#10b981" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    CreditCard: ({ className = "", color = "#6366f1" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    Gear: ({ className = "", color = "#64748b" }) => (
      <svg className={className} viewBox="0 0 24 24" fill={color}>
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
    ),
    AlertTriangle: ({ className = "", color = "#f59e0b" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    Plug: ({ className = "", color = "#8b5cf6" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22v-5" />
        <path d="M9 8V2" />
        <path d="M15 8V2" />
        <path d="M18 8v5a6 6 0 0 1-6 6v0a6 6 0 0 1-6-6V8z" />
      </svg>
    ),
    Smartphone: ({ className = "", color = "#0ea5e9" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    Clock: ({ className = "", color = "#ef4444" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    CheckCircle: ({ className = "", color = "#10b981" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    Shield: ({ className = "", color = "#1e3a8a" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    Camera: ({ className = "", color = "#ec4899" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    Scale: ({ className = "", color = "#64748b" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="3" x2="12" y2="21" />
        <polyline points="1 12 5 8 9 12" />
        <polyline points="15 12 19 8 23 12" />
        <path d="M1 12h8" />
        <path d="M15 12h8" />
      </svg>
    ),
    Refresh: ({ className = "", color = "#3b82f6" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    Phone: ({ className = "", color = "#1e3a8a" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    ChevronDown: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    ChevronUp: ({ className = "" }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6 15 12 9 18 15" />
      </svg>
    ),
  };

  useEffect(() => {
    // Remove delay - immediate load
    setInitialLoadComplete(true);
  }, []);

  const termsData = [
    {
      id: 1,
      title: "General",
      icon: <Icons.Clipboard />,
      summary:
        "By booking or using services from I Khodal Automotive, you agree to the following terms and conditions. These apply to all mechanical, diagnostic, electrical, and accessory-fitment services provided.",
      details: [
        "These terms constitute a legally binding agreement between you (the customer) and I Khodal Automotive.",
        "By engaging our services, you acknowledge that you have read, understood, and agreed to be bound by these terms.",
        "These terms apply to all services including but not limited to repairs, maintenance, diagnostics, and installations.",
        "We reserve the right to refuse service to anyone for any reason at our discretion.",
        "Any modifications to these terms must be agreed upon in writing by both parties.",
      ],
    },
    {
      id: 2,
      title: "Services",
      icon: <Icons.Wrench />,
      summary:
        "We provide mobile automotive repair, servicing, diagnostics, and accessory installation. Services are carried out based on visible inspection and customer-provided information. Additional faults may be identified during or after the service.",
      details: [
        "Our mobile service operates within designated service areas. Additional travel fees may apply for locations outside our standard coverage.",
        "Service appointments are scheduled based on availability and must be confirmed at least 24 hours in advance.",
        "All services are performed by qualified technicians using industry-standard tools and equipment.",
        "We conduct thorough visual inspections and diagnostics based on the information you provide about your vehicle.",
        "Hidden or underlying issues may not be apparent during initial inspection and may require additional investigation.",
        "If additional problems are discovered during service, we will notify you immediately and provide recommendations.",
        "Emergency or urgent repairs may be prioritized based on safety considerations and vehicle operability.",
      ],
    },
    {
      id: 3,
      title: "Quotes & Pricing",
      icon: <Icons.DollarSign />,
      summary:
        "All quotes are estimates only unless stated otherwise. Final pricing may change if additional parts or labour are required, or hidden/pre-existing issues are discovered. Any major price changes will be discussed before proceeding.",
      details: [
        "Initial quotes are provided as good-faith estimates based on the information available at the time.",
        "Quotes are valid for 30 days from the date of issue, after which pricing may be subject to change.",
        "Final pricing may differ from the initial quote due to unforeseen complications, additional repairs needed, or parts availability.",
        "We will always contact you for approval before proceeding with any work that exceeds the quoted price by more than 10%.",
        "Parts pricing is subject to supplier availability and market fluctuations.",
        "Labour rates are calculated based on industry standards and the complexity of the work required.",
        "Any customer-requested changes to the scope of work may result in additional charges.",
        "Diagnostic fees are separate from repair costs and are payable regardless of whether repairs are undertaken.",
      ],
    },
    {
      id: 4,
      title: "Payments",
      icon: <Icons.CreditCard />,
      summary:
        "Payment is due upon completion of work unless agreed in writing. Accepted payment methods: cash, bank transfer, or other agreed methods. Unpaid invoices may incur follow-up fees or legal recovery costs.",
      details: [
        "Full payment is required immediately upon completion of service unless alternative arrangements have been made in writing.",
        "We accept cash, bank transfer, credit/debit cards, and digital payment methods.",
        "A valid payment method must be provided before commencement of work.",
        "For larger jobs, we may require a deposit of up to 50% of the quoted amount before starting work.",
        "Invoices are provided upon completion and must be paid within the agreed timeframe.",
        "Late payments beyond 7 days may incur interest charges at a rate of 2% per month.",
        "Unpaid invoices beyond 30 days may be referred to debt collection agencies, with all associated costs passed to the customer.",
        "We reserve the right to retain your vehicle until full payment is received.",
        "Receipts and tax invoices will be provided for all transactions.",
      ],
    },
    {
      id: 5,
      title: "Parts & Warranty",
      icon: <Icons.Gear />,
      summary:
        "New parts supplied are covered by the manufacturer's warranty only. No warranty is provided on customer-supplied parts or second-hand/used parts (unless stated). Labour warranty applies only to work performed, not related or pre-existing faults.",
      details: [
        "All new parts supplied by us come with the manufacturer's standard warranty, typically ranging from 3 to 12 months.",
        "Warranty claims on parts must be made directly through us and will be processed according to the manufacturer's terms.",
        "Customer-supplied parts are installed at the customer's risk with no warranty provided.",
        "Used, refurbished, or aftermarket parts may have limited or no warranty unless explicitly stated.",
        "Labour warranty covers workmanship for 30 days from the date of service completion.",
        "Warranty does not cover failures caused by normal wear and tear, misuse, accidents, or lack of maintenance.",
        "To maintain warranty validity, you must follow all recommended maintenance schedules.",
        "Warranty is void if unauthorized repairs or modifications are made to the vehicle or parts.",
        "Any warranty claim must be accompanied by the original invoice and proof of purchase.",
        "We reserve the right to inspect the vehicle and parts before honoring any warranty claim.",
      ],
    },
    {
      id: 6,
      title: "Pre-Existing Conditions",
      icon: <Icons.AlertTriangle />,
      summary:
        "I Khodal Automotive is not responsible for existing mechanical or electrical faults, or failures caused by worn, aged, or previously damaged components. Older vehicles may experience unrelated failures after service.",
      details: [
        "We are not liable for pre-existing faults, defects, or damage that existed prior to our service.",
        "Older vehicles (typically 10+ years) may have worn components that could fail independently of our work.",
        "Working on one system may reveal other unrelated issues that require attention.",
        "We do not guarantee that addressing one issue will prevent other age-related failures.",
        "Corroded, seized, or damaged components may break during removal or installation despite proper care.",
        "Rust, corrosion, and wear are natural processes that we cannot prevent or be held responsible for.",
        "Vehicles with high mileage may experience cascading failures where fixing one issue puts stress on other worn components.",
        "We will advise you of any concerning conditions discovered during service, but cannot predict future failures.",
        "It is the customer's responsibility to maintain their vehicle in accordance with manufacturer recommendations.",
      ],
    },
    {
      id: 7,
      title: "Electrical & Diagnostic Work",
      icon: <Icons.Plug />,
      summary:
        "Diagnostic scans identify fault codes, not guaranteed root causes. Electrical repairs may require multiple steps or follow-up work. No guarantee that a single repair will resolve all warning lights or faults.",
      details: [
        "Diagnostic scans read stored fault codes but do not always pinpoint the exact root cause of the problem.",
        "Modern vehicles have complex electrical systems that may require multiple diagnostic steps.",
        "Some intermittent faults may not be present during testing and may require extended monitoring.",
        "Clearing fault codes does not mean the underlying issue is resolved.",
        "Multiple related faults may be caused by a single component, or may require separate repairs.",
        "Electrical diagnostics may reveal issues in multiple systems requiring prioritization based on severity.",
        "Some manufacturer-specific faults may require dealer-level diagnostic tools beyond our capabilities.",
        "Software-related issues may require updates or reprogramming that can only be performed by authorized dealers.",
        "We charge diagnostic fees based on time spent, which are separate from repair costs.",
        "Follow-up diagnostics may be required if initial repairs do not fully resolve the issue.",
      ],
    },
    {
      id: 8,
      title: "Accessory Installation (Dashcams, Audio, Electrical)",
      icon: <Icons.Smartphone />,
      summary:
        "Installations are performed to industry standards. We are not responsible for manufacturer software issues or vehicle system updates affecting accessories. Customer is responsible for legality of installed accessories.",
      details: [
        "All accessory installations are performed according to industry best practices and safety standards.",
        "We ensure proper wiring, mounting, and integration with vehicle systems where applicable.",
        "Warranty on installation workmanship is provided for 30 days from installation date.",
        "We are not responsible for product defects, software bugs, or firmware issues with the accessories themselves.",
        "Vehicle software updates performed by dealers may affect aftermarket accessory functionality.",
        "Some vehicles may not be compatible with certain accessories due to manufacturer restrictions.",
        "It is the customer's responsibility to ensure installed accessories comply with local traffic and safety regulations.",
        "Modifications to vehicle electrical systems may affect manufacturer warranty - customers should check with their dealer.",
        "We do not provide support for accessories purchased and installed elsewhere.",
        "Removal of accessories may leave visible marks or require restoration work at additional cost.",
      ],
    },
    {
      id: 9,
      title: "Cancellations & No-Shows",
      icon: <Icons.Clock />,
      summary:
        "Please provide minimum 2 hours notice for cancellations. Late cancellations or no-shows may attract a call-out fee.",
      details: [
        "We require at least 2 hours advance notice for appointment cancellations.",
        "Cancellations made with less than 2 hours notice may incur a cancellation fee of up to 50% of the quoted service cost.",
        "No-shows without any notice will be charged a full call-out fee.",
        "Call-out fees cover travel time, fuel, and lost opportunity to service other customers.",
        "Repeated cancellations or no-shows may result in requirement of prepayment for future bookings.",
        "Rescheduling within the 2-hour window is subject to availability and may incur additional fees.",
        "Emergency cancellations due to genuine emergencies will be considered on a case-by-case basis.",
        "Weather-related cancellations initiated by us will not incur any fees.",
        "You may reschedule appointments without penalty if done more than 24 hours in advance.",
      ],
    },
    {
      id: 10,
      title: "Customer Responsibility",
      icon: <Icons.CheckCircle />,
      summary:
        "Customers must ensure vehicle is accessible and safe to work on, provide correct vehicle information, and disclose any known issues before service.",
      details: [
        "You must provide a safe, accessible location for our technicians to perform mobile service.",
        "The work area must be on level ground with adequate space and lighting.",
        "You are responsible for providing accurate vehicle information including make, model, year, and VIN.",
        "All known issues, previous repairs, or modifications must be disclosed before we commence work.",
        "You must inform us of any aftermarket parts, modifications, or non-standard features installed on your vehicle.",
        "If the vehicle has been in an accident, you must disclose this as it may affect our ability to diagnose or repair.",
        "You must ensure the vehicle has adequate fuel/charge for testing and diagnosis.",
        "Any pets or children must be kept away from the work area for safety reasons.",
        "You must notify us immediately if you notice any issues after service is completed.",
        "Failure to provide accurate information may result in incorrect diagnosis and is not our responsibility.",
      ],
    },
    {
      id: 11,
      title: "Limitation of Liability",
      icon: <Icons.Shield />,
      summary:
        "We are not liable for indirect or consequential losses, loss of income, time, or vehicle use. Liability is limited to the cost of the service provided.",
      details: [
        "Our liability is limited to the direct cost of the service provided, not exceeding the invoice amount.",
        "We are not liable for any indirect, incidental, special, or consequential damages.",
        "This includes but is not limited to loss of income, loss of business, loss of vehicle use, or inconvenience.",
        "We are not responsible for delays caused by parts availability, supplier issues, or unforeseen circumstances.",
        "We recommend maintaining adequate vehicle insurance to cover any potential losses.",
        "Any claims must be made in writing within 14 days of service completion.",
        "We are not liable for damage caused by pre-existing conditions or normal wear and tear.",
        "Our liability does not cover rental vehicle costs or alternative transportation expenses.",
        "Force majeure events (natural disasters, pandemics, etc.) are beyond our control and exclude us from liability.",
        "This limitation applies to the fullest extent permitted by law.",
      ],
    },
    {
      id: 12,
      title: "Photos & Media",
      icon: <Icons.Camera />,
      summary:
        "Photos or videos of work may be used for marketing or records. No personal details or number plates will be shown without consent.",
      details: [
        "We may take photos or videos of vehicles and work performed for quality control and record-keeping purposes.",
        "These images may be used for marketing, advertising, social media, or training purposes.",
        "We will blur or remove number plates and any personally identifiable information before public sharing.",
        "If you do not wish your vehicle to be photographed, please notify us in writing before service begins.",
        "Photos are stored securely and in compliance with privacy regulations.",
        "Customer testimonials and reviews may be featured on our website and social media with permission.",
        "You retain ownership of any photos you provide to us for diagnostic purposes.",
        "We may share before/after photos with parts suppliers or manufacturers for warranty claims.",
        "Request to remove your photos from public use can be made at any time in writing.",
      ],
    },
    {
      id: 13,
      title: "Governing Law",
      icon: <Icons.Scale />,
      summary: "These terms are governed by the laws of Victoria, Australia.",
      details: [
        "These terms and conditions are governed by and construed in accordance with the laws of Victoria, Australia.",
        "Any disputes arising from these terms or services provided will be subject to the exclusive jurisdiction of Victorian courts.",
        "Both parties agree to submit to the jurisdiction of courts located in Victoria for resolution of any disputes.",
        "These terms comply with Australian Consumer Law and your statutory rights are not affected.",
        "If any provision of these terms is found to be invalid, the remaining provisions remain in full effect.",
        "These terms take precedence over any verbal agreements or representations made.",
        "In case of dispute, mediation will be attempted before legal proceedings are initiated.",
        "All communications regarding these terms should be in writing for legal validity.",
      ],
    },
    {
      id: 14,
      title: "Changes to Terms",
      icon: <Icons.Refresh />,
      summary:
        "I Khodal Automotive reserves the right to update these terms at any time without notice.",
      details: [
        "We reserve the right to modify, update, or change these terms and conditions at any time.",
        "Changes may be made to reflect changes in law, industry standards, or business practices.",
        "Updated terms will be posted on our website and take effect immediately upon posting.",
        "It is your responsibility to review these terms periodically for any changes.",
        "Continued use of our services after changes constitutes acceptance of the updated terms.",
        "Significant changes may be communicated via email to customers with active bookings.",
        "Previous versions of terms are archived and available upon request.",
        "For any questions about changes to terms, please contact us directly.",
      ],
    },
  ];

  /* ==========================================
       INTERSECTION OBSERVER - OPTIMIZED
       ========================================== */
  useEffect(() => {
    if (!initialLoadComplete) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -20% 0px", // Trigger earlier - when 80% visible
      threshold: 0.1, // Lower threshold for faster trigger
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.dataset.sectionId;
          // Immediate - show all sections when they enter viewport
          setVisibleSections((prev) => new Set([...prev, sectionId]));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const sectionRefsSnapshot = sectionRefs.current;
    sectionRefsSnapshot.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Add footer to observer
    const footerRefSnapshot = footerRef.current;
    if (footerRefSnapshot) {
      observer.observe(footerRefSnapshot);
    }

    return () => {
      sectionRefsSnapshot.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      if (footerRefSnapshot) {
        observer.unobserve(footerRefSnapshot);
      }
    };
  }, [initialLoadComplete]);

  const toggleSection = (id) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      // Redirect based on auth state
      if (user) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, user]);

  return (
    <div className="terms-container">
      <UserNavbar />

      <div className="terms-main">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              <span className="title-icon">
                <Icons.Shield color="#ffffff" />
              </span>
              Terms & Conditions
            </h1>
            <div className="last-updated">Last Updated: January 2025</div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="terms-list">
          {termsData.map((term, index) => (
            <div
              key={term.id}
              ref={(el) => (sectionRefs.current[index] = el)}
              data-section-id={term.id}
              className={`term-card ${visibleSections.has(term.id.toString()) ? "visible" : ""}`}
              style={{
                animationDelay: visibleSections.has(term.id.toString())
                  ? `${index * 0.03}s`
                  : "0s",
              }}
            >
              <div className="term-header">
                <div className="term-icon">{term.icon}</div>
                <div className="term-title-section">
                  <h2 className="term-title">
                    {term.id}. {term.title}
                  </h2>
                </div>
              </div>

              <div className="term-summary">{term.summary}</div>

              <div
                className={`term-details ${expandedSections.has(term.id) ? "expanded" : ""}`}
              >
                <ul className="details-list">
                  {term.details.map((detail, idx) => (
                    <li key={idx} className="detail-item">
                      <span className="detail-bullet">•</span>
                      <span className="detail-text">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className="see-more-btn"
                onClick={() => toggleSection(term.id)}
              >
                {expandedSections.has(term.id) ? (
                  <>
                    <span>See Less</span>
                    <span className="arrow up">
                      <Icons.ChevronUp />
                    </span>
                  </>
                ) : (
                  <>
                    <span>See More</span>
                    <span className="arrow down">
                      <Icons.ChevronDown />
                    </span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
