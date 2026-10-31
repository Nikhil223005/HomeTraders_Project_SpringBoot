
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Sprout,
  Menu,
  X,
  ArrowRight,
  Search,
  Leaf,
  TrendingUp,
  Droplets,
  Sun,
  GraduationCap,
  MessageCircle,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  Mail,
  MapPin,
  Globe2,
  Tractor,
} from "lucide-react";

import { copy, cropData } from "./data.js";
import {
  submitAgencyApplication,
  submitEnquiry as sendEnquiry,
} from "./Api/api.js";
import "./App.css";
import "./RequestForms.css";
import { Link } from "react-router-dom";

// Service icons
const serviceIcons = [
  TrendingUp,
  FlaskConical,
  Sun,
  MessageCircle,
  GraduationCap,
  BookOpen,
];

// Crop categories
const categoryKeys = [
  "All",
  "Cereals",
  "Vegetables",
  "Cash crops",
  "Fruits",
];

// Sample market prices
const demoPrices = [
  {
    crop: "Wheat",
    market: "Sample market",
    price: "₹2,425",
    unit: "per quintal",
  },
  {
    crop: "Onion",
    market: "Sample market",
    price: "₹1,800",
    unit: "per quintal",
  },
  {
    crop: "Tomato",
    market: "Sample market",
    price: "₹2,200",
    unit: "per quintal",
  },
];

export default function App() {
  // Language settings
  const [lang, setLang] = useState("en");
  const t = copy[lang];
  const isMr = lang === "mr";

  // Navigation settings
  const [menu, setMenu] = useState(false);

  // Crop search and filtering
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  // Market price search
  const [priceQuery, setPriceQuery] = useState("");

  // Modal and notification settings
  const [modal, setModal] = useState("");
  const [notice, setNotice] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const noticeTimer = useRef(null);

  useEffect(() => () => {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  // Enquiry form data
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "Crop guidance",
    message: "",
  });
  const [agencyForm, setAgencyForm] = useState({
    agencyName: "",
    contactName: "",
    email: "",
    phone: "",
    serviceArea: "",
    description: "",
  });

  // Newsletter email
  const [email, setEmail] = useState("");

  // Filter crops based on category and search
  const visibleCrops = useMemo(() => {
    return cropData.filter((crop) => {
      const matchesCategory =
        category === "All" || crop.type === category;

      const searchableText =
        `${crop.name} ${crop.type} ${crop.season}`.toLowerCase();

      const matchesSearch = searchableText.includes(
        query.toLowerCase()
      );

      return matchesCategory && matchesSearch;
    });
  }, [category, query]);

  // Filter sample market prices
  const visiblePrices = demoPrices.filter((item) => {
    const searchableText =
      `${item.crop} ${item.market}`.toLowerCase();

    return searchableText.includes(priceQuery.toLowerCase());
  });

  // Display a notification
  const notify = (message) => {
    setNotice(message);

    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => {
      setNotice("");
      noticeTimer.current = null;
    }, 7000);
  };

  // Change website language
  const changeLanguage = () => {
    setLang((currentLanguage) =>
      currentLanguage === "en" ? "mr" : "en"
    );

    setMenu(false);
  };

  // Open enquiry form
  const openEnquiry = (
    topic = "Crop guidance",
    message = ""
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      topic,
      message,
    }));

    setModal("enquiry");
    setRequestError("");
  };

  // Submit enquiry
  const submitEnquiry = async (event) => {
    event.preventDefault();
    setRequestError("");
    setIsSubmittingRequest(true);
    try {
      await sendEnquiry(form);
      setModal("");
      notify(t.enquirySent);
      setForm({ name: "", email: "", topic: "Crop guidance", message: "" });
    } catch (error) {
      setRequestError(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          t.requestFailed
      );
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const submitAgencyRequest = async (event) => {
    event.preventDefault();
    setRequestError("");
    setIsSubmittingRequest(true);
    try {
      const response = await submitAgencyApplication(agencyForm);
      if (response.status < 200 || response.status >= 300) {
        throw new Error(t.requestFailed);
      }
      setModal("");
      notify(t.agencyApplicationSent);
      setAgencyForm({
        agencyName: "",
        contactName: "",
        email: "",
        phone: "",
        serviceArea: "",
        description: "",
      });
    } catch (error) {
      setRequestError(
        error.response?.data?.message ||
          (typeof error.response?.data === "string" ? error.response.data : "") ||
          t.requestFailed
      );
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const openAgencyApplication = () => {
    setRequestError("");
    setModal("agency");
  };

  // Update an individual enquiry field
  const updateFormField = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  return (
    <div className={`app ${isMr ? "marathi" : ""}`}>
      {/* Top information bar */}
      <div className="top">
        <div className="wrap top-inner">
          <span>
            <MapPin size={14} />
            {t.audience}
          </span>

          <span>{t.info}</span>
        </div>
      </div>

      {/* Website header and navigation */}
      <header className="header">
        <div className="wrap nav">
          <a href="#home" className="brand">
            <span className="brand-icon">
              <Sprout size={25} />
            </span>

            <span>
              <b>homesteader</b>

              <small>
                {isMr
                  ? "शेतीचा विश्वासू साथी"
                  : "GROW WITH CONFIDENCE"}
              </small>
            </span>
          </a>

          <button
            className="mobile"
            onClick={() => setMenu(!menu)}
            aria-label="Toggle menu"
          >
            {menu ? <X /> : <Menu />}
          </button>

          <nav className={menu ? "links open" : "links"}>
            {t.nav.map((label, index) => {
              const sections = [
                "#home",
                "#services",
                "#crops",
                "#market",
                "#about",
              ];

              return (
                <a
                  key={label}
                  href={sections[index]}
                  onClick={() => setMenu(false)}
                >
                  {label}
                </a>
              );
            })}

            <button
              className="language-btn"
              onClick={changeLanguage}
            >
              <Globe2 size={16} />
              {isMr ? "English" : "मराठी"}
            </button>

<Link to="/superadmin-login" className="nav-btn">
  {t.signIn}
  <ArrowRight size={15} />
</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="hero" id="home">
          <div className="hero-bg indian-farmer-bg" />
          <div className="hero-shade" />

          <div className="wrap hero-inner">
            <div className="hero-copy">
              <div className="eyebrow light">
                <i />
                {t.tagline}
              </div>

              <h1>
                {t.heroTitle1}
                <br />
                <em>{t.heroTitle2}</em>
              </h1>

              <p>{t.heroText}</p>

              <div className="actions">
                <a className="btn primary" href="#services">
                  {t.explore}
                  <ArrowRight size={17} />
                </a>

                <button
                  className="btn ghost"
                  onClick={() => openEnquiry()}
                >
                  {t.ask}
                  <MessageCircle size={17} />
                </button>
              </div>

              <div className="hero-note">
                <CheckCircle2 size={16} />
                {t.heroNote}
              </div>
            </div>

            <div className="hero-card">
              <span className="card-icon">
                <Sprout />
              </span>

              <div>
                <small>{t.next}</small>
                <b>{t.cardTitle}</b>
                <p>{t.cardText}</p>
              </div>

              <a href="#crops">
                <ArrowRight size={20} />
              </a>
            </div>
          </div>

          <div className="wrap hero-foot">
            <span>{t.audience}</span>
            <i />
            <span>{t.info}</span>
          </div>

          <div className="hero-badge">
            <span>
              <Tractor size={20} />
            </span>

            <div>
              <b>
                {isMr ? "शेतकऱ्यांसाठी" : "Made for farmers"}
              </b>

              <small>
                {isMr
                  ? "माहिती · मार्गदर्शन"
                  : "Information · Guidance"}
              </small>
            </div>
          </div>
        </section>

        {/* Trust and information highlights */}
        <section className="trust">
          <div className="wrap trust-grid">
            {[
              [Leaf, ...t.trust[0]],
              [TrendingUp, ...t.trust[1]],
              [Droplets, ...t.trust[2]],
              [GraduationCap, ...t.trust[3]],
            ].map(([Icon, title, subtitle]) => (
              <div className="trust-item" key={title}>
                <span>
                  <Icon />
                </span>

                <div>
                  <b>{title}</b>
                  <small>{subtitle}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services section */}
        <section className="section" id="services">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  <i />
                  {t.eyebrowServices}
                </div>

                <h2>
                  {t.servicesTitle1}
                  <br />
                  <em>{t.servicesTitle2}</em>
                </h2>
              </div>

              <p>{t.servicesIntro}</p>
            </div>

            <div className="service-grid">
              {t.serviceTitles.map((title, index) => {
                const Icon = serviceIcons[index];

                return (
                  <article className="service-card" key={title}>
                    <span className="service-icon">
                      <Icon />
                    </span>

                    <small className="number">
                      0{index + 1}
                    </small>

                    <h3>{title}</h3>
                    <p>{t.serviceTexts[index]}</p>

                    {index === 3 ? (
                      <button
                        className="text-link"
                        onClick={() => openEnquiry()}
                      >
                        {t.exploreFeature}
                        <ArrowRight size={15} />
                      </button>
                    ) : index === 4 ? (
                      <button
                        className="text-link"
                        onClick={openAgencyApplication}
                      >
                        {t.applyAgency}
                        <ArrowRight size={15} />
                      </button>
                    ) : (
                      <a href="#crops">
                        {t.exploreFeature}
                        <ArrowRight size={15} />
                      </a>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Crop library section */}
        <section className="section crops-section" id="crops">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="eyebrow">
                  <i />
                  {t.library}
                </div>

                <h2>
                  {t.cropTitle1}
                  <br />
                  <em>{t.cropTitle2}</em>
                </h2>
              </div>

              <p>{t.cropIntro}</p>
            </div>

            {/* Category filters and search */}
            <div className="tools">
              <div className="tabs">
                {categoryKeys.map((item) => (
                  <button
                    key={item}
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {t.categories[item]}
                  </button>
                ))}
              </div>

              <label className="search">
                <Search size={17} />

                <input
                  placeholder={t.searchCrop}
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                />
              </label>
            </div>

            {/* Crop cards */}
            <div className="crop-grid">
              {visibleCrops.map((crop) => (
                <article className="crop-card" key={crop.name}>
                  <div className="crop-image">
                    <img
                      src={crop.image}
                      alt={`${crop.name} crop`}
                      loading="lazy"
                    />

                    <span>
                      {t.categories[crop.type] || crop.type}
                    </span>

                    <button
                      onClick={() =>
                        openEnquiry(
                          `${crop.name} information`,
                          `I would like to know more about ${crop.name}.`
                        )
                      }
                      aria-label={`${t.askCrop}: ${crop.name}`}
                    >
                      <ArrowRight />
                    </button>
                  </div>

                  <div className="crop-body">
                    <small>
                      {t.season[crop.season]} · {t.cropGuide}
                    </small>

                    <h3>{crop.name}</h3>
                    <p>{crop.text[lang]}</p>

                    <button
                      className="text-link"
                      onClick={() =>
                        openEnquiry(
                          `${crop.name} information`,
                          `I would like to know more about ${crop.name}.`
                        )
                      }
                    >
                      {t.askCrop}
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </article>
              ))}

              {visibleCrops.length === 0 && (
                <div className="empty">{t.noCrop}</div>
              )}
            </div>

            <p className="disclaimer">{t.cropNote}</p>
          </div>
        </section>

        {/* Market prices section */}
        <section className="market section" id="market">
          <div className="wrap market-grid">
            <div>
              <div className="eyebrow light">
                <i />
                {t.market}
              </div>

              <h2>
                {t.marketTitle1}
                <br />
                <em>{t.marketTitle2}</em>
              </h2>

              <p>{t.marketIntro}</p>

              <ul>
                {t.marketBullets.map((item) => (
                  <li key={item}>
                    <CheckCircle2 />
                    {item}
                  </li>
                ))}
              </ul>

              <a className="btn light-btn" href="#contact">
                {t.ask}
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="price-panel">
              <div className="price-head">
                <div>
                  <small>{t.priceExplorer}</small>
                  <h3>{t.sampleRecords}</h3>
                </div>

                <b>{t.demo}</b>
              </div>

              <label className="price-search">
                <Search size={16} />

                <input
                  placeholder={t.searchPrice}
                  value={priceQuery}
                  onChange={(event) =>
                    setPriceQuery(event.target.value)
                  }
                />
              </label>

              <div className="price-row price-labels">
                <span>{t.crop}</span>
                <span>{t.marketName}</span>
                <span>{t.price}</span>
              </div>

              {visiblePrices.map((item) => (
                <div className="price-row" key={item.crop}>
                  <b>{item.crop}</b>
                  <span>{item.market}</span>

                  <strong>
                    {item.price}
                    <small>{item.unit}</small>
                  </strong>
                </div>
              ))}

              {visiblePrices.length === 0 && (
                <p className="empty-price">{t.noPrice}</p>
              )}

              <p className="price-disclaimer">
                ⓘ {t.demoOnly}
              </p>
            </div>
          </div>
        </section>

      </main>

      {modal && (
        <div
          className="request-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal("");
          }}
        >
          <section
            className="request-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-modal-title"
          >
            <button
              type="button"
              className="request-modal-close"
              onClick={() => setModal("")}
              aria-label={t.close}
            >
              <X size={20} />
            </button>
            <h2 id="request-modal-title">
              {modal === "agency" ? t.applyAgency : t.ask}
            </h2>
            <p>{modal === "agency" ? t.agencyFormIntro : t.enquiryFormIntro}</p>

            {modal === "agency" ? (
              <form className="request-form" onSubmit={submitAgencyRequest}>
                <label>
                  {t.agencyName}
                  <input
                    required
                    value={agencyForm.agencyName}
                    onChange={(event) =>
                      setAgencyForm({ ...agencyForm, agencyName: event.target.value })
                    }
                  />
                </label>
                <label>
                  {t.contactName}
                  <input
                    required
                    value={agencyForm.contactName}
                    onChange={(event) =>
                      setAgencyForm({ ...agencyForm, contactName: event.target.value })
                    }
                  />
                </label>
                <label>
                  {t.email}
                  <input
                    required
                    type="email"
                    value={agencyForm.email}
                    onChange={(event) =>
                      setAgencyForm({ ...agencyForm, email: event.target.value })
                    }
                  />
                </label>
                <label>
                  {t.phone}
                  <input
                    required
                    type="tel"
                    value={agencyForm.phone}
                    onChange={(event) =>
                      setAgencyForm({ ...agencyForm, phone: event.target.value })
                    }
                  />
                </label>
                <label>
                  {t.serviceArea}
                  <input
                    required
                    value={agencyForm.serviceArea}
                    onChange={(event) =>
                      setAgencyForm({ ...agencyForm, serviceArea: event.target.value })
                    }
                  />
                </label>
                <label>
                  {t.servicesOffered}
                  <textarea
                    required
                    rows="4"
                    value={agencyForm.description}
                    onChange={(event) =>
                      setAgencyForm({ ...agencyForm, description: event.target.value })
                    }
                  />
                </label>
                {requestError && <p className="request-error" role="alert">{requestError}</p>}
                <button className="btn primary" type="submit" disabled={isSubmittingRequest}>
                  {isSubmittingRequest ? t.submitting : t.submitApplication}
                </button>
              </form>
            ) : (
              <form className="request-form" onSubmit={submitEnquiry}>
                <label>
                  {t.contactName}
                  <input
                    required
                    value={form.name}
                    onChange={(event) => updateFormField("name", event.target.value)}
                  />
                </label>
                <label>
                  {t.email}
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => updateFormField("email", event.target.value)}
                  />
                </label>
                <label>
                  {t.topic}
                  <input
                    required
                    value={form.topic}
                    onChange={(event) => updateFormField("topic", event.target.value)}
                  />
                </label>
                <label>
                  {t.message}
                  <textarea
                    required
                    rows="4"
                    value={form.message}
                    onChange={(event) => updateFormField("message", event.target.value)}
                  />
                </label>
                {requestError && <p className="request-error" role="alert">{requestError}</p>}
                <button className="btn primary" type="submit" disabled={isSubmittingRequest}>
                  {isSubmittingRequest ? t.submitting : t.sendEnquiry}
                </button>
              </form>
            )}
          </section>
        </div>
      )}

      {notice && (
        <div className="request-toast" role="status">
          <CheckCircle2 size={21} aria-hidden="true" />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label={t.close}>
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
