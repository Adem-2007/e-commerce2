// frontend/src/pages/Dashboard/Info/InfoControl.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  Loader,
  AlertCircle,
  LayoutTemplate,
  Star,
  Milestone,
  Users,
  CheckCircle,
} from "lucide-react";
import { useDashboardLanguage } from "../../../context/DashboardLanguageContext";

// Import all specialized panels
import HeroPanel from "./components/contact/hero/HeroPanel";
import ContactDetailsPanel from "./components/contact/coreContact/ContactDetailsPanel";
import FormLabelsPanel from "./components/contact/form/FormLabelsPanel";
import FaqPanel from "./components/contact/FaqPanel";
import HeroPanelAbout from "./components/about/hero/HeroPanelAbout";
import ValuesPanel from "./components/about/ValuesPanel";
import StoryPanel from "./components/about/StoryPanel";
import MembersPanel from "./components/about/MembersPanel";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/info`;

// --- NEW: Helper function to convert a file to a Base64 string ---
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const InfoControl = () => {
  const { t, dir } = useDashboardLanguage();
  
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("contact");
  const [activeAboutPanel, setActiveAboutPanel] = useState("hero");
  const [formData, setFormData] = useState(null);
  const [newFaqIndex, setNewFaqIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  // --- REMOVED: memberImageFiles state is no longer needed ---

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const response = await axios.get(API_URL);
        const data = response.data;

        setFormData({
          ...data,
          heroTitle: data.heroTitle || { en: '', ar: '', fr: '' },
          heroSubtitle: data.heroSubtitle || { en: '', ar: '', fr: '' },
          aboutHeroTitle: data.aboutHeroTitle || { en: '', ar: '', fr: '' },
          aboutHeroSubtitle: data.aboutHeroSubtitle || { en: '', ar: '', fr: '' },
          formLabels: data.formLabels || { name: {}, email: {}, message: {} },
          faqs: (data.faqs || []).map(faq => ({ ...faq, question: faq.question || {}, answer: faq.answer || {} })),
          values: (data.values || []).map(v => ({ ...v, title: v.title || {}, description: v.description || {} })),
          story: (data.story || []).map(ms => ({
            ...ms,
            title: ms.title || { en: '', ar: '', fr: '' },
            description: ms.description || { en: '', ar: '', fr: '' },
            achievements: (ms.achievements || []).map(ach => (typeof ach === 'object' && ach !== null ? (ach || {}) : ({ en: ach, ar: '', fr: '' })))
          })),
          members: (data.members || []).map(m => ({ ...m, name: m.name || {}, role: m.role || {}, image: m.image || '' })),
        });
      } catch (err) {
        setError(t('infoControl.errors.fetchFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfo();
  }, [t]);

  // --- GENERIC HANDLERS ---
  const handleInputChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleMultilingualChange = (e) => {
    const { name, value } = e.target;
    const [field, lang] = name.split('.');
    setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
  };
  const handleMultilingualFormLabelChange = (e) => {
    const { name, value } = e.target;
    const [field, lang] = name.split('.');
    setFormData(prev => ({ ...prev, formLabels: { ...prev.formLabels, [field]: { ...prev.formLabels[field], [lang]: value } } }));
  };

  // --- FAQ HANDLERS ---
  const handleFaqChange = (index, field, lang, value) => setFormData((prev) => ({ ...prev, faqs: prev.faqs.map((faq, i) => i === index ? { ...faq, [field]: { ...faq[field], [lang]: value } } : faq)}));
  const addFaq = () => {
    const newFaq = { question: { en: "", ar: "", fr: "" }, answer: { en: "", ar: "", fr: "" } };
    setFormData((prev) => ({ ...prev, faqs: [...(prev.faqs || []), newFaq] }));
  };
  const removeFaq = (index) => setFormData((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  const handleConfirmNewFaq = () => setNewFaqIndex(null);

  // --- VALUES HANDLERS ---
  const handleValueChange = (index, field, lang, value) => setFormData((prev) => ({ ...prev, values: prev.values.map((v, i) => i === index ? { ...v, [field]: { ...v[field], [lang]: value } } : v)}));
  const addValue = () => {
    const newValue = { title: { en: "", ar: "", fr: "" }, description: { en: "", ar: "", fr: "" } };
    setFormData((prev) => ({ ...prev, values: [...(prev.values || []), newValue] }));
  };
  const removeValue = (index) => setFormData((prev) => ({ ...prev, values: prev.values.filter((_, i) => i !== index) }));

  // --- STORY HANDLERS ---
  const addMilestone = (newMilestone) => setFormData((prev) => ({ ...prev, story: [...prev.story, newMilestone] }));
  const removeMilestone = (index) => setFormData((prev) => ({ ...prev, story: prev.story.filter((_, i) => i !== index) }));
  const handleMilestoneChange = (index, field, lang, value) => setFormData((prev) => ({ ...prev, story: prev.story.map((ms, i) => i === index ? { ...ms, [field]: { ...ms[field], [lang]: value } } : ms) }));
  const handleMilestoneYearChange = (index, value) => setFormData((prev) => ({ ...prev, story: prev.story.map((ms, i) => (i === index ? { ...ms, year: value } : ms)) }));
  const handleAchievementChange = (msIndex, achIndex, lang, value) => setFormData((prev) => ({ ...prev, story: prev.story.map((ms, i) => i === msIndex ? { ...ms, achievements: ms.achievements.map((ach, j) => j === achIndex ? { ...ach, [lang]: value } : ach) } : ms)}));
  const addAchievement = (msIndex) => setFormData((prev) => ({ ...prev, story: prev.story.map((ms, i) => i === msIndex ? { ...ms, achievements: [...ms.achievements, { en: '', ar: '', fr: '' }] } : ms)}));
  const removeAchievement = (msIndex, achIndex) => setFormData((prev) => ({ ...prev, story: prev.story.map((ms, i) => i === msIndex ? { ...ms, achievements: ms.achievements.filter((_, j) => j !== achIndex) } : ms) }));

  // --- MEMBERS HANDLERS ---
  const addMember = () => setFormData((prev) => ({ ...prev, members: [...(prev.members || []), { name: { en: '', ar: '', fr: '' }, role: { en: '', ar: '', fr: '' }, image: '' }] }));
  const removeMember = (index) => {
    setFormData((prev) => ({ ...prev, members: prev.members.filter((_, i) => i !== index) }));
  };
  const handleMemberChange = (index, field, lang, value) => setFormData((prev) => ({ ...prev, members: prev.members.map((m, i) => i === index ? { ...m, [field]: { ...m[field], [lang]: value } } : m)}));

  // --- UPDATED: Member image handler now converts file to Base64 ---
  const handleMemberImageChange = async (index, file) => {
    if (file) {
      try {
        const base64Image = await fileToBase64(file);
        setFormData(prev => ({
          ...prev,
          members: prev.members.map((m, i) => (i === index ? { ...m, image: base64Image } : m))
        }));
      } catch (error) {
        console.error("Error converting file to Base64", error);
        setError(t('infoControl.errors.imageConversionFailed'));
      }
    }
  };

  // --- UPDATED: FORM SUBMISSION now sends JSON, not FormData ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newFaqIndex !== null) { setError(t('infoControl.errors.confirmNewFaq')); return; }
    
    setIsSaving(true);
    setError(null);
    setSuccessMessage("");

    try {
      // Send the entire formData object as a JSON payload
      const response = await axios.put(API_URL, formData, {
        headers: { "Content-Type": "application/json" },
      });

      // Update the form state with the final data from the server
      setFormData(response.data); 
      setSuccessMessage(t('infoControl.saveButton.success'));
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || t('infoControl.errors.saveFailed');
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // --- RENDER LOGIC (No changes below this line) ---
  if (isLoading) { return <div className="flex justify-center items-center h-screen"><Loader className="w-10 h-10 animate-spin text-indigo-600" /></div>; }
  if (error && !formData) { return <div className="text-red-500 p-8 text-center">{error}</div>; }

  const isSaveDisabled = isSaving || newFaqIndex !== null || !!successMessage;
  
  const buttonMotion = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2 }
  };

  const aboutPanels = [
    { id: "hero", label: t('infoControl.aboutPanels.hero'), icon: <LayoutTemplate className="w-4 h-4 mr-2" /> },
    { id: "values", label: t('infoControl.aboutPanels.values'), icon: <Star className="w-4 h-4 mr-2" /> },
    { id: "story", label: t('infoControl.aboutPanels.story'), icon: <Milestone className="w-4 h-4 mr-2" /> },
    { id: "members", label: t('infoControl.aboutPanels.team'), icon: <Users className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8" dir={dir}>
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="pb-32">
          
          <div className="mb-10 flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tighter">{t('infoControl.title')}</h1>
              <p className="text-slate-500 mt-2 text-lg">{t('infoControl.subtitle')}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                type="submit"
                disabled={isSaveDisabled}
                className={`flex items-center justify-center gap-2.5 py-2.5 px-5 font-semibold text-white rounded-lg transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none w-44 h-12
                  ${successMessage 
                    ? 'bg-gradient-to-r from-green-500 to-green-400 shadow-[0_4px_15px_-5px_rgba(34,197,94,0.6)]' 
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-[0_4px_15px_-5px_rgba(79,70,229,0.6)]'}
                  hover:not(:disabled):-translate-y-0.5 
                  hover:not(:disabled):shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] 
                  active:not(:disabled):translate-y-0 
                  disabled:bg-slate-400 disabled:from-slate-400 disabled:shadow-none disabled:cursor-not-allowed`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isSaving ? (
                    <motion.div key="saving" {...buttonMotion}>
                      <Loader className="w-5 h-5 animate-spin" />
                    </motion.div>
                  ) : successMessage ? (
                    <motion.div key="success" {...buttonMotion} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>{successMessage}</span>
                    </motion.div>
                  ) : (
                    <motion.div key="save" {...buttonMotion} className="flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      <span>{t('infoControl.saveButton.default')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-sm text-red-600 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="relative mb-8">
            <div className="flex space-x-2 border-b border-slate-200">
              {["contact", "about"].map((tab) => (
                <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`relative py-3 px-4 font-semibold text-slate-600 transition-colors duration-300 ${activeTab === tab ? "text-indigo-600" : "hover:text-slate-800"}`}>
                  <span className="relative z-10 capitalize">{t(`infoControl.tabs.${tab}`)}</span>
                  {activeTab === tab && <motion.div className="absolute inset-0 bg-white rounded-t-lg shadow-sm" layoutId="active-pill" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "contact" && (
            <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-8">
              <HeroPanel t={t} heroData={formData} onFormChange={handleMultilingualChange} />
              <ContactDetailsPanel t={t} details={formData} onFormChange={handleInputChange} />
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-3">
                  <FaqPanel t={t} faqs={formData.faqs} onFaqChange={handleFaqChange} onAddFaq={addFaq} onRemoveFaq={removeFaq} newFaqIndex={newFaqIndex} onConfirmNewFaq={handleConfirmNewFaq} />
                </div>
                <div className="lg:col-span-2">
                  <FormLabelsPanel t={t} labels={formData.formLabels} onLabelChange={handleMultilingualFormLabelChange} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="relative mb-8 p-1.5 bg-slate-100 rounded-lg flex flex-wrap items-center gap-1">
                {aboutPanels.map((panel) => (
                  <button key={panel.id} type="button" onClick={() => setActiveAboutPanel(panel.id)} className={`relative flex items-center py-2 px-3 sm:px-4 text-sm font-semibold transition-colors duration-300 ${activeAboutPanel === panel.id ? "text-indigo-700" : "text-slate-600 hover:text-slate-800"}`}>
                    <span className="relative z-10 flex items-center">{panel.icon}<span className="hidden sm:inline">{panel.label}</span></span>
                    {activeAboutPanel === panel.id && <motion.div className="absolute inset-0 bg-white rounded-md shadow-sm" layoutId="about-panel-pill" transition={{ type: "spring", stiffness: 400, damping: 35 }} />}
                  </button>
                ))}
              </div>

              <motion.div key={activeAboutPanel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {activeAboutPanel === "hero" && <HeroPanelAbout t={t} heroData={formData} onFormChange={handleMultilingualChange} />}
                {activeAboutPanel === "values" && <ValuesPanel values={formData.values} onValueChange={handleValueChange} onAddValue={addValue} onRemoveValue={removeValue} t={t} dir={dir} />}
                {activeAboutPanel === "story" && (
                  <StoryPanel
                    story={formData.story}
                    onMilestoneChange={handleMilestoneChange}
                    onMilestoneYearChange={handleMilestoneYearChange}
                    onAddMilestone={addMilestone}
                    onRemoveMilestone={removeMilestone}
                    onAchievementChange={handleAchievementChange}
                    onAddAchievement={addAchievement}
                    onRemoveAchievement={removeAchievement}
                  />
                )}
                {activeAboutPanel === "members" && (
                  <MembersPanel
                    members={formData.members}
                    onMemberChange={handleMemberChange}
                    onAddMember={addMember}
                    onRemoveMember={removeMember}
                    onMemberImageChange={handleMemberImageChange}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InfoControl;