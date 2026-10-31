import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
    Activity, ArrowDownRight, ArrowUpRight, BookOpen, Check, ChevronRight,
    CircleHelp, CloudSun, FileText, FlaskConical, LayoutDashboard, Leaf,
    LogOut, Menu, MessageSquareText, Plus, Search, Sprout, Star, Trash2,
    TrendingUp, X,
} from "lucide-react";
import "./SubAdminDashboard.css";

const initialCrops = [
    { id: 1, name: "Wheat", category: "Cereals", season: "Rabi", water: "Moderate", area: "North fields" },
    { id: 2, name: "Rice", category: "Cereals", season: "Kharif", water: "High", area: "East fields" },
    { id: 3, name: "Cotton", category: "Cash crops", season: "Kharif", water: "Moderate", area: "South fields" },
    { id: 4, name: "Tomato", category: "Vegetables", season: "All year", water: "Moderate", area: "Greenhouse 1" },
];
const initialPrices = [
    { id: 1, crop: "Wheat", market: "Pune APMC", price: 2425, unit: "quintal", trend: "up" },
    { id: 2, crop: "Onion", market: "Nashik APMC", price: 1800, unit: "quintal", trend: "down" },
    { id: 3, crop: "Tomato", market: "Pune APMC", price: 2200, unit: "quintal", trend: "up" },
    { id: 4, crop: "Cotton", market: "Nagpur APMC", price: 6850, unit: "quintal", trend: "up" },
];
const guidanceItems = [
    { category: "Crop care", title: "Protecting young crops from heavy rain", description: "Keep field drains clear, avoid working saturated soil, and inspect roots for standing water after rainfall.", read: "4 min read", icon: CloudSun },
    { category: "Soil health", title: "Build healthier soil with crop rotation", description: "Rotate cereal crops with legumes to support soil structure and maintain balanced nutrient levels.", read: "6 min read", icon: Sprout },
    { category: "Pest management", title: "A practical integrated pest-management checklist", description: "Scout fields weekly, identify pests before treatment, and prefer targeted, locally approved controls.", read: "5 min read", icon: FlaskConical },
];
const initialEnquiries = [
    { id: 1, farmer: "Ramesh Patil", topic: "Wheat leaf spots", date: "Today, 9:20 AM", status: "Open", message: "There are brown spots appearing on the lower leaves. What should I check first?" },
    { id: 2, farmer: "Sunita Jadhav", topic: "Market access", date: "Yesterday", status: "Open", message: "Which nearby market is accepting onions this week?" },
    { id: 3, farmer: "Amit Shinde", topic: "Irrigation advice", date: "Oct 28, 2026", status: "Resolved", message: "How often should I water my tomato crop at this stage?" },
];
const feedbackItems = [
    { id: 1, farmer: "Kavita More", date: "Oct 30, 2026", rating: 5, text: "The crop guidance was clear and helped us plan this week's field work." },
    { id: 2, farmer: "Nilesh Pawar", date: "Oct 29, 2026", rating: 4, text: "Market prices are useful. It would be great to see more local markets." },
    { id: 3, farmer: "Prakash Kale", date: "Oct 27, 2026", rating: 5, text: "The soil report explanation was easy to understand." },
];
const initialSoilReports = [
    { id: "SR-1048", farmer: "Vijay Deshmukh", location: "Baramati, Pune", date: "Oct 30, 2026", ph: 6.8, nitrogen: "Medium", phosphorus: "Low", potassium: "Good", status: "Reviewed" },
    { id: "SR-1047", farmer: "Meena Gaikwad", location: "Sinnar, Nashik", date: "Oct 29, 2026", ph: 7.4, nitrogen: "Low", phosphorus: "Good", potassium: "Medium", status: "New" },
    { id: "SR-1046", farmer: "Rahul Bhosale", location: "Hingna, Nagpur", date: "Oct 27, 2026", ph: 6.2, nitrogen: "Good", phosphorus: "Medium", potassium: "Low", status: "Reviewed" },
];
const navigation = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "crops", label: "Agriculture info", icon: Leaf },
    { id: "prices", label: "Market prices", icon: TrendingUp },
    { id: "guidance", label: "Guidance", icon: BookOpen },
    { id: "enquiries", label: "Enquiries", icon: MessageSquareText },
    { id: "feedback", label: "Feedback", icon: Star },
    { id: "soil", label: "Soil reports", icon: FlaskConical },
];

const readLocal = (key, fallback) => {
    try {
        const saved = localStorage.getItem(key);
        if (!saved) return fallback;
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
        console.error(`Could not read ${key} from local storage.`, error);
        return fallback;
    }
};
const emptyCropForm = { name: "", category: "Cereals", season: "Kharif", water: "Moderate", area: "", image: "" };
const emptyPriceForm = { crop: "", market: "", price: "", unit: "quintal" };
const formatCurrency = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
}).format(value);
const today = () => new Date().toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
});

export default function SubAdminDashboard() {
    const navigate = useNavigate();
    const [section, setSection] = useState("overview");
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [crops, setCrops] = useState(() => readLocal("homesteaderSubAdminCrops", initialCrops));
    const [prices, setPrices] = useState(() => readLocal("homesteaderSubAdminPrices", initialPrices));
    const [soilReports, setSoilReports] = useState(() => readLocal("homesteaderSubAdminSoilReports", initialSoilReports));
    const [enquiries, setEnquiries] = useState(() => readLocal("homesteaderSubAdminEnquiries", initialEnquiries));
    const [editingCropId, setEditingCropId] = useState(null);
    const [editingPriceId, setEditingPriceId] = useState(null);
    const [cropForm, setCropForm] = useState(emptyCropForm);
    const [priceForm, setPriceForm] = useState(emptyPriceForm);
    const [replyDrafts, setReplyDrafts] = useState({});
    const [notice, setNotice] = useState("");
    const admin = useMemo(() => {
        try {
            const saved = JSON.parse(sessionStorage.getItem("subAdmin") || "{}");
            return saved && typeof saved === "object" ? saved : {};
        } catch (error) {
            console.error("Could not read the sub-admin profile.", error);
            return {};
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("homesteaderSubAdminCrops", JSON.stringify(crops));
        } catch (error) {
            console.error("Could not save crop information locally.", error);
            setNotice("Could not save crop changes in this browser.");
        }
    }, [crops]);
    useEffect(() => {
        try {
            localStorage.setItem("homesteaderSubAdminPrices", JSON.stringify(prices));
        } catch (error) {
            console.error("Could not save market prices locally.", error);
            setNotice("Could not save market prices in this browser.");
        }
    }, [prices]);
    useEffect(() => {
        try {
            localStorage.setItem("homesteaderSubAdminSoilReports", JSON.stringify(soilReports));
        } catch (error) {
            console.error("Could not save soil report review status locally.", error);
            setNotice("Could not save soil report updates in this browser.");
        }
    }, [soilReports]);
    useEffect(() => {
        try {
            localStorage.setItem("homesteaderSubAdminEnquiries", JSON.stringify(enquiries));
        } catch (error) {
            console.error("Could not save enquiry replies locally.", error);
            setNotice("Could not save enquiry replies in this browser.");
        }
    }, [enquiries]);

    const currentSection = navigation.find((item) => item.id === section) || navigation[0];
    const filteredCrops = crops.filter((crop) =>
        [crop.name, crop.category, crop.season, crop.area].join(" ").toLowerCase().includes(search.toLowerCase())
    );
    const filteredPrices = prices.filter((price) =>
        [price.crop, price.market].join(" ").toLowerCase().includes(search.toLowerCase())
    );
    const openEnquiries = enquiries.filter((enquiry) => enquiry.status === "Open").length;
    const newSoilReports = soilReports.filter((report) => report.status === "New").length;
    const title = admin.sname || admin.name || admin.sa_name || "Sub Admin";

    const logout = () => {
        sessionStorage.removeItem("subAdmin");
        navigate("/superadmin-login", { replace: true });
    };
    const chooseSection = (nextSection) => {
        setSection(nextSection);
        setSearch("");
        setMenuOpen(false);
        setNotice("");
    };
    const saveCrop = (event) => {
        event.preventDefault();
        const entry = { ...cropForm, id: editingCropId || Date.now() };
        setCrops((current) => editingCropId
            ? current.map((crop) => crop.id === editingCropId ? entry : crop)
            : [entry, ...current]);
        setCropForm(emptyCropForm);
        setEditingCropId(null);
        setNotice("Agriculture information saved in this browser.");
    };
    const editCrop = (crop) => {
        setCropForm({ ...emptyCropForm, ...crop });
        setEditingCropId(crop.id);
    };
    const chooseCropImage = (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setNotice("Choose a JPG, PNG, or WebP crop image.");
            return;
        }
        if (file.size > 1024 * 1024) {
            setNotice("Crop images must be 1 MB or smaller to save in this browser.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result !== "string") {
                setNotice("Could not read the selected crop image.");
                return;
            }
            setCropForm((current) => ({ ...current, image: reader.result }));
            setNotice("");
        };
        reader.onerror = () => setNotice("Could not read the selected crop image.");
        reader.readAsDataURL(file);
    };
    const savePrice = (event) => {
        event.preventDefault();
        const existingPrice = prices.find((price) => price.id === editingPriceId);
        const entry = { ...priceForm, id: editingPriceId || Date.now(), price: Number(priceForm.price), trend: existingPrice?.trend || "neutral", updated: today() };
        setPrices((current) => editingPriceId
            ? current.map((price) => price.id === editingPriceId ? entry : price)
            : [entry, ...current]);
        setPriceForm(emptyPriceForm);
        setEditingPriceId(null);
        setNotice("Market price saved in this browser.");
    };
    const editPrice = (price) => {
        setPriceForm({ crop: price.crop, market: price.market, price: String(price.price), unit: price.unit });
        setEditingPriceId(price.id);
    };
    const markResolved = (id) => {
        setEnquiries((current) => current.map((enquiry) =>
            enquiry.id === id ? { ...enquiry, status: "Resolved" } : enquiry
        ));
        setNotice("Enquiry marked as resolved for this session.");
    };
    const markSoilReviewed = (id) => {
        setSoilReports((current) => current.map((report) =>
            report.id === id ? { ...report, status: "Reviewed" } : report
        ));
        setNotice("Soil report marked as reviewed.");
    };
    const sendEnquiryReply = (id) => {
        const reply = (replyDrafts[id] || "").trim();
        if (!reply) {
            setNotice("Write a reply before sending.");
            return;
        }
        setEnquiries((current) => current.map((enquiry) =>
            enquiry.id === id
                ? { ...enquiry, replies: [...(enquiry.replies || []), { message: reply, date: today() }] }
                : enquiry
        ));
        setReplyDrafts((current) => ({ ...current, [id]: "" }));
        setNotice("Reply saved in this browser. It has not been delivered to the farmer.");
    };

    if (!sessionStorage.getItem("subAdmin")) return <Navigate to="/superadmin-login" replace />;

    return (
        <div className="subdash">
            <aside className={`subdash-sidebar ${menuOpen ? "subdash-sidebar-open" : ""}`}>
                <div className="subdash-brand"><span className="subdash-brand-mark"><Sprout size={22} /></span><span>homesteader<span className="subdash-brand-dot">.</span></span></div>
                <div className="subdash-workspace"><span className="subdash-workspace-icon">🌱</span><span><small>WORKSPACE</small><strong>Farm operations</strong></span><ChevronRight size={16} /></div>
                <p className="subdash-nav-label">MANAGE</p>
                <nav className="subdash-nav" aria-label="Sub-admin sections">
                    {navigation.map(({ id, label, icon: Icon }) => (
                        <button type="button" key={id} onClick={() => chooseSection(id)} className={section === id ? "active" : ""}>
                            <Icon size={18} /><span>{label}</span>
                            {id === "enquiries" && openEnquiries > 0 && <span className="subdash-nav-count">{openEnquiries}</span>}
                        </button>
                    ))}
                </nav>
                <div className="subdash-sidebar-bottom">
                    <div className="subdash-help"><CircleHelp size={18} /><span><strong>Need a hand?</strong><small>Check the team guidance</small></span><ChevronRight size={15} /></div>
                    <button type="button" className="subdash-logout" onClick={logout}><LogOut size={18} />Sign out</button>
                </div>
            </aside>

            <div className="subdash-main">
                <header className="subdash-topbar">
                    <button type="button" className="subdash-mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
                    <div className="subdash-breadcrumb">Farm operations <ChevronRight size={15} /> <span>{currentSection.label}</span></div>
                    <div className="subdash-topbar-right"><span className="subdash-today">{today()}</span><div className="subdash-user-avatar">{title.trim().charAt(0).toUpperCase()}</div><div className="subdash-user"><strong>{title}</strong><small>Sub Admin</small></div></div>
                </header>

                <main className="subdash-content">
                    <div className="subdash-page-heading">
                        <div><p className="subdash-overline">FARM OPERATIONS</p><h1>{section === "overview" ? `Good day, ${title.split(" ")[0]}` : currentSection.label}</h1><p>{section === "overview" ? "Here’s what’s happening across your agriculture workspace." : section === "prices" ? "Keep local market information up to date for farmers." : section === "crops" ? "Maintain the crop and field information shared with farmers." : "Review the latest information submitted by your farming community."}</p></div>
                        <div className="subdash-date-chip"><CloudSun size={18} /><span>Field season</span><strong>Kharif 2026</strong></div>
                    </div>
                    <div className="subdash-preview-note"><CircleHelp size={15} /><span>Frontend preview: crop details, images, market price edits, and enquiry replies are saved in this browser. Replies are not delivered to farmers; guidance, enquiries, feedback, and soil reports are sample data.</span></div>
                    {notice && <div className="subdash-notice" role="status"><Check size={16} />{notice}<button type="button" aria-label="Dismiss" onClick={() => setNotice("")}><X size={15} /></button></div>}

                    {section === "overview" && (
                        <>
                            <div className="subdash-stats">
                                <StatCard label="Crop information" value={crops.length} detail="Active crop records" icon={Leaf} tone="green" />
                                <StatCard label="Market prices" value={prices.length} detail="Local listings" icon={TrendingUp} tone="blue" />
                                <StatCard label="Open enquiries" value={openEnquiries} detail="Waiting for review" icon={MessageSquareText} tone="orange" />
                                <StatCard label="Soil reports" value={soilReports.length} detail={`${newSoilReports} need review`} icon={FlaskConical} tone="purple" />
                            </div>
                            <div className="subdash-overview-grid">
                                <section className="subdash-panel"><PanelHeading title="Latest market prices" subtitle="Local rates, per listed unit" action={() => chooseSection("prices")} actionLabel="View all" /><div className="subdash-mini-list">{prices.slice(0, 4).map((price) => <div className="subdash-mini-row" key={price.id}><span className="subdash-crop-icon"><Leaf size={17} /></span><span className="subdash-mini-name"><strong>{price.crop}</strong><small>{price.market}</small></span><strong className="subdash-mini-price">{formatCurrency(price.price)}</strong><span className={`subdash-trend ${price.trend === "down" ? "down" : ""}`}>{price.trend === "down" ? <ArrowDownRight size={15} /> : price.trend === "up" ? <ArrowUpRight size={15} /> : <Activity size={15} />}</span></div>)}</div></section>
                                <section className="subdash-panel"><PanelHeading title="Farmer enquiries" subtitle={`${openEnquiries} need your attention`} action={() => chooseSection("enquiries")} actionLabel="View all" /><div className="subdash-mini-list">{enquiries.slice(0, 3).map((enquiry) => <div className="subdash-enquiry-mini" key={enquiry.id}><span className={`subdash-status-dot ${enquiry.status === "Open" ? "open" : ""}`} /><span><strong>{enquiry.topic}</strong><small>{enquiry.farmer} · {enquiry.date}</small></span><span className={`subdash-pill ${enquiry.status === "Open" ? "pending" : "done"}`}>{enquiry.status}</span></div>)}</div></section>
                            </div>
                            <section className="subdash-panel"><PanelHeading title="Quick access" subtitle="Common tasks for your workspace" /><div className="subdash-quick-actions"><QuickAction icon={Leaf} label="Update crop information" onClick={() => chooseSection("crops")} /><QuickAction icon={TrendingUp} label="Add a market price" onClick={() => chooseSection("prices")} /><QuickAction icon={FlaskConical} label="Review soil reports" onClick={() => chooseSection("soil")} /><QuickAction icon={BookOpen} label="Open farmer guidance" onClick={() => chooseSection("guidance")} /></div></section>
                        </>
                    )}

                    {section === "crops" && (
                        <div className="subdash-section-layout">
                            <section className="subdash-panel subdash-form-panel"><PanelHeading title={editingCropId ? "Edit crop information" : "Add agriculture information"} subtitle="Crop and field details" />{renderCropForm(cropForm, setCropForm, saveCrop, editingCropId, chooseCropImage, () => { setEditingCropId(null); setCropForm(emptyCropForm); })}</section>
                            <section className="subdash-panel"><PanelHeading title="Crop directory" subtitle={`${crops.length} crop records`} /><SearchBar value={search} onChange={setSearch} placeholder="Search crops..." /><div className="subdash-crop-grid">{filteredCrops.map((crop) => <article className="subdash-crop-card" key={crop.id}><div className="subdash-crop-card-top">{crop.image ? <img className="subdash-crop-photo" src={crop.image} alt={`${crop.name} crop`} /> : <span className="subdash-crop-icon large"><Leaf size={19} /></span>}<span className="subdash-pill done">{crop.category}</span></div><h3>{crop.name}</h3><div className="subdash-crop-facts"><span><small>Season</small><strong>{crop.season}</strong></span><span><small>Water</small><strong>{crop.water}</strong></span></div><p className="subdash-crop-area">{crop.area || "Field area not specified"}</p><div className="subdash-card-actions"><button type="button" onClick={() => editCrop(crop)}>Edit details</button><button type="button" aria-label={`Delete ${crop.name}`} onClick={() => { setCrops((current) => current.filter((entry) => entry.id !== crop.id)); setNotice("Crop record removed from this browser."); }}><Trash2 size={15} /></button></div></article>)}</div>{filteredCrops.length === 0 && <EmptyState text="No crop records match your search." />}</section>
                        </div>
                    )}

                    {section === "prices" && (
                        <>
                            <section className="subdash-panel subdash-form-panel"><PanelHeading title={editingPriceId ? "Edit market price" : "Add market price"} subtitle="Prices are shown to farmers in your workspace" />{renderPriceForm(priceForm, setPriceForm, savePrice, editingPriceId, () => { setEditingPriceId(null); setPriceForm(emptyPriceForm); })}</section>
                            <section className="subdash-panel"><div className="subdash-table-heading"><PanelHeading title="Market price listings" subtitle={`${prices.length} current listing${prices.length === 1 ? "" : "s"}`} /><SearchBar value={search} onChange={setSearch} placeholder="Search crop or market..." /></div><div className="subdash-table-wrap"><table className="subdash-table"><thead><tr><th>Crop</th><th>Market</th><th>Price</th><th>Unit</th><th>Updated</th><th>Action</th></tr></thead><tbody>{filteredPrices.map((price) => <tr key={price.id}><td><strong>{price.crop}</strong></td><td>{price.market}</td><td className="subdash-price-cell">{formatCurrency(price.price)}</td><td>per {price.unit}</td><td>{price.updated || "Oct 31, 2026"}</td><td><button className="subdash-text-action" type="button" onClick={() => editPrice(price)}>Edit price</button></td></tr>)}</tbody></table>{filteredPrices.length === 0 && <EmptyState text="No prices match your search." />}</div></section>
                        </>
                    )}

                    {section === "guidance" && <div className="subdash-guidance-grid">{guidanceItems.map(({ category, title, description, read, icon: Icon }) => <article className="subdash-panel subdash-guidance-card" key={title}><div className="subdash-guidance-icon"><Icon size={21} /></div><span className="subdash-overline">{category}</span><h2>{title}</h2><p>{description}</p><div className="subdash-guidance-footer"><span>{read}</span><span>Farmer resource</span></div></article>)}</div>}

                    {section === "enquiries" && <section className="subdash-panel"><PanelHeading title="Farmer enquiries" subtitle={`${openEnquiries} open conversation${openEnquiries === 1 ? "" : "s"}`} /><SearchBar value={search} onChange={setSearch} placeholder="Search farmer or topic..." /><div className="subdash-enquiry-list">{enquiries.filter((item) => [item.farmer, item.topic, item.message].join(" ").toLowerCase().includes(search.toLowerCase())).map((item) => <article className="subdash-enquiry-card" key={item.id}><div className="subdash-enquiry-card-header"><div><span className="subdash-overline">{item.topic}</span><h3>{item.farmer}</h3></div><span className={`subdash-pill ${item.status === "Open" ? "pending" : "done"}`}>{item.status}</span></div><p>{item.message}</p>{item.replies?.map((reply, index) => <div className="subdash-reply" key={`${item.id}-reply-${index}`}><strong>Your reply <small>{reply.date}</small></strong><p>{reply.message}</p></div>)}<form className="subdash-reply-form" onSubmit={(event) => { event.preventDefault(); sendEnquiryReply(item.id); }}><label htmlFor={`reply-${item.id}`}>Reply to {item.farmer}</label><textarea id={`reply-${item.id}`} rows="3" maxLength="1000" value={replyDrafts[item.id] || ""} onChange={(event) => setReplyDrafts((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="Write a helpful response..." required /><div className="subdash-enquiry-card-footer"><span>{item.date}</span><div className="subdash-enquiry-actions"><button type="submit" className="subdash-reply-button"><MessageSquareText size={15} /> Save reply</button>{item.status === "Open" && <button type="button" className="subdash-secondary-button" onClick={() => markResolved(item.id)}><Check size={15} /> Mark resolved</button>}</div></div></form></article>)}</div></section>}

                    {section === "feedback" && <section className="subdash-panel"><PanelHeading title="Farmer feedback" subtitle="Recent comments from the community" /><div className="subdash-feedback-list">{feedbackItems.map((item) => <article className="subdash-feedback-card" key={item.id}><div className="subdash-feedback-avatar">{item.farmer.charAt(0)}</div><div className="subdash-feedback-content"><div className="subdash-feedback-heading"><strong>{item.farmer}</strong><span>{item.date}</span></div><div className="subdash-stars" aria-label={`${item.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < item.rating ? "currentColor" : "none"} />)}</div><p>{item.text}</p></div></article>)}</div></section>}

                    {section === "soil" && <section className="subdash-panel"><PanelHeading title="Soil reports" subtitle={`${soilReports.length} reports · ${newSoilReports} awaiting review`} /><div className="subdash-table-wrap"><table className="subdash-table subdash-soil-table"><thead><tr><th>Report</th><th>Farmer / location</th><th>Date</th><th>pH</th><th>Nitrogen</th><th>Phosphorus</th><th>Potassium</th><th>Status</th><th>Action</th></tr></thead><tbody>{soilReports.map((report) => <tr key={report.id}><td><strong>{report.id}</strong></td><td><strong>{report.farmer}</strong><small className="subdash-table-subtext">{report.location}</small></td><td>{report.date}</td><td><strong>{report.ph}</strong></td><td>{report.nitrogen}</td><td>{report.phosphorus}</td><td>{report.potassium}</td><td><span className={`subdash-pill ${report.status === "New" ? "pending" : "done"}`}>{report.status}</span></td><td>{report.status === "New" ? <button className="subdash-review-button" type="button" onClick={() => markSoilReviewed(report.id)}><Check size={15} />Review</button> : <span className="subdash-reviewed-label">Reviewed</span>}</td></tr>)}</tbody></table></div><p className="subdash-data-note"><FileText size={15} /> Soil report examples are sample frontend data and are not laboratory advice.</p></section>}
                    <footer className="subdash-footer"><span>© 2026 Homesteader Agriculture Management</span><span><Activity size={14} /> Frontend preview · browser-only edits</span></footer>
                </main>
            </div>
            {menuOpen && <button type="button" className="subdash-mobile-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
        </div>
    );
}

function StatCard({ label, value, detail, icon: Icon, tone }) {
    return <article className="subdash-stat-card"><span className={`subdash-stat-icon ${tone}`}><Icon size={19} /></span><span className="subdash-stat-label">{label}</span><strong className="subdash-stat-value">{value}</strong><span className="subdash-stat-detail">{detail}</span></article>;
}
function PanelHeading({ title, subtitle, action, actionLabel }) {
    return <div className="subdash-panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div>{action && <button type="button" className="subdash-text-action" onClick={action}>{actionLabel}<ChevronRight size={15} /></button>}</div>;
}
function QuickAction({ icon: Icon, label, onClick }) {
    return <button type="button" className="subdash-quick-action" onClick={onClick}><span><Icon size={18} /></span><strong>{label}</strong><ChevronRight size={16} /></button>;
}
function SearchBar({ value, onChange, placeholder }) {
    return <label className="subdash-search"><Search size={16} /><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}
function EmptyState({ text }) {
    return <div className="subdash-empty">{text}</div>;
}
function renderCropForm(form, setForm, onSubmit, editingId, onImageChange, onCancel) {
    return <form className="subdash-edit-form" onSubmit={onSubmit}>
        <label>Crop name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Soybean" required /></label>
        <label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Cereals</option><option>Vegetables</option><option>Cash crops</option><option>Fruits</option><option>Pulses</option></select></label>
        <label>Growing season<select value={form.season} onChange={(event) => setForm({ ...form, season: event.target.value })}><option>Kharif</option><option>Rabi</option><option>All year</option><option>Zaid</option></select></label>
        <label>Water requirement<select value={form.water} onChange={(event) => setForm({ ...form, water: event.target.value })}><option>Low</option><option>Moderate</option><option>High</option></select></label>
        <label className="subdash-full-field">Field / area<input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="e.g. North fields" /></label>
        <div className="subdash-full-field">
            <label className="subdash-upload-label" htmlFor="crop-image">Crop image <span>Optional · JPG, PNG or WebP · up to 1 MB</span></label>
            <div className="subdash-image-upload">
                {form.image ? <img src={form.image} alt="Selected crop preview" /> : <span className="subdash-image-placeholder"><Leaf size={22} />No image selected</span>}
                <div className="subdash-image-upload-actions">
                    <label className="subdash-secondary-button" htmlFor="crop-image">Choose image</label>
                    {form.image && <button type="button" className="subdash-secondary-button" onClick={() => setForm({ ...form, image: "" })}>Remove image</button>}
                </div>
                <input id="crop-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={onImageChange} />
            </div>
        </div>
        <div className="subdash-form-buttons"><button type="submit" className="subdash-primary-button"><Check size={16} />{editingId ? "Save changes" : "Add crop"}</button>{editingId && <button type="button" className="subdash-secondary-button" onClick={onCancel}>Cancel</button>}</div>
    </form>;
}
function renderPriceForm(form, setForm, onSubmit, editingId, onCancel) {
    return <form className="subdash-inline-form" onSubmit={onSubmit}>
        <label>Crop<input value={form.crop} onChange={(event) => setForm({ ...form, crop: event.target.value })} placeholder="Crop name" required /></label>
        <label>Market<input value={form.market} onChange={(event) => setForm({ ...form, market: event.target.value })} placeholder="Market name" required /></label>
        <label>Price (₹)<input type="number" min="1" step="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="0" required /></label>
        <label>Unit<select value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value })}><option value="quintal">Quintal</option><option value="kg">Kilogram</option><option value="tonne">Tonne</option></select></label>
        <button type="submit" className="subdash-primary-button"><Plus size={16} />{editingId ? "Save price" : "Add price"}</button>
        {editingId && <button type="button" className="subdash-secondary-button" onClick={onCancel}>Cancel</button>}
    </form>;
}