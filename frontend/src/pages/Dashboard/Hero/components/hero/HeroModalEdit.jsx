// frontend/src/pages/Dashboard/Hero/components/hero/HeroModalEdit.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  X,
  UploadCloud,
  AlertCircle,
  Check,
  CaseSensitive,
  Tag,
  FileText,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useDashboardLanguage } from "../../../../../context/DashboardLanguageContext";

const LanguageTab = ({ lang, activeLang, setActiveLang, children }) => (
  <button
    type="button"
    onClick={() => setActiveLang(lang)}
    className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-md flex-1 ${
      activeLang === lang
        ? "bg-blue-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-gray-200 hover:text-black"
    }`}
  >
    {children}
  </button>
);
const GradientDirectionPicker = ({ value, onChange }) => {
  const directions = [
    "to top",
    "to top right",
    "to right",
    "to bottom right",
    "to bottom",
    "to bottom left",
    "to left",
    "to top left",
  ];
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Direction
      </label>
      <select
        value={value}
        onChange={onChange}
        className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        {directions.map((dir) => (
          <option key={dir} value={dir}>
            {dir}
          </option>
        ))}
      </select>
    </div>
  );
};
const FormFields = ({ formData, handleInputChange, activeLang }) => {
  const { t } = useDashboardLanguage();
  return (
    <>
      {" "}
      <div dir={activeLang === "ar" ? "rtl" : "ltr"}>
        <label className="block text-sm font-medium text-gray-700">
          {t("hero_control.modal_edit.label_title")}
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 rtl:left-auto rtl:right-0 rtl:pr-3">
            <CaseSensitive size={16} className="text-blue-500" />
          </span>
          <input
            type="text"
            name="title"
            value={formData.title[activeLang] || ""}
            onChange={handleInputChange}
            className="pl-10 rtl:pr-10 w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>{" "}
      <div dir={activeLang === "ar" ? "rtl" : "ltr"}>
        <label className="block text-sm font-medium text-gray-700">
          {t("hero_control.modal_edit.label_category")}
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 rtl:left-auto rtl:right-0 rtl:pr-3">
            <Tag size={16} className="text-blue-500" />
          </span>
          <input
            type="text"
            name="category"
            value={formData.category[activeLang] || ""}
            onChange={handleInputChange}
            className="pl-10 rtl:pr-10 w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>{" "}
      <div dir={activeLang === "ar" ? "rtl" : "ltr"}>
        <label className="block text-sm font-medium text-gray-700">
          {t("hero_control.modal_edit.label_description")}
        </label>
        <div className="relative mt-1">
          <span className="absolute top-3 left-0 flex items-center pl-3 rtl:left-auto rtl:right-0 rtl:pr-3">
            <FileText size={16} className="text-blue-500" />
          </span>
          <textarea
            name="description"
            rows="4"
            value={formData.description[activeLang] || ""}
            onChange={handleInputChange}
            className="pl-10 rtl:pr-10 w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md resize-none shadow-sm focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
      </div>{" "}
    </>
  );
};
const PngBackgroundOptions = ({
  backgroundType,
  setBackgroundType,
  color1,
  setColor1,
  color2,
  setColor2,
  direction,
  setDirection,
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="p-4 rounded-lg bg-gray-100 border border-gray-200 space-y-4"
  >
    {" "}
    <div className="p-1 bg-gray-200 rounded-lg grid grid-cols-2 gap-1">
      <button
        type="button"
        onClick={() => setBackgroundType("solid")}
        className={`py-1.5 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${
          backgroundType === "solid"
            ? "bg-blue-600 text-white shadow"
            : "text-gray-700 hover:bg-gray-300"
        }`}
      >
        {backgroundType === "solid" && <Check size={16} />} Solid
      </button>
      <button
        type="button"
        onClick={() => setBackgroundType("gradient")}
        className={`py-1.5 rounded-md font-semibold text-sm flex items-center justify-center gap-2 ${
          backgroundType === "gradient"
            ? "bg-blue-600 text-white shadow"
            : "text-gray-700 hover:bg-gray-300"
        }`}
      >
        {backgroundType === "gradient" && <Check size={16} />} Gradient
      </button>
    </div>{" "}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Color 1
        </label>
        <div className="relative mt-1">
          <input
            type="text"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className="w-full pl-12 pr-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
          />
          <input
            type="color"
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
          />
        </div>
      </div>
      <AnimatePresence>
        {backgroundType === "gradient" && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Color 2
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-full pl-12 pr-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
              />
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>{" "}
    {backgroundType === "gradient" && (
      <GradientDirectionPicker
        value={direction}
        onChange={(e) => setDirection(e.target.value)}
      />
    )}{" "}
  </motion.div>
);

const HeroModalEdit = ({ slide, isOpen, onClose, onSave, isSaving }) => {
  const { t, dir } = useDashboardLanguage();
  const [step, setStep] = useState(1);
  const [activeLang, setActiveLang] = useState("en");
  const [formData, setFormData] = useState({
    title: {},
    category: {},
    description: {},
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [backgroundType, setBackgroundType] = useState("solid");
  const [color1, setColor1] = useState("#e5e7eb");
  const [color2, setColor2] = useState("#6366F1");
  const [direction, setDirection] = useState("to right");
  const [isPng, setIsPng] = useState(false);
  const inputFileRef = useRef(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (isOpen && slide) {
      setStep(1);
      setFormData({
        title: slide.title || {},
        category: slide.category || {},
        description: slide.description || {},
      });
      setImagePreview(slide.imageUrl || "");
      setImageFile(null);
      const slideIsPng = slide.imageType === "png";
      setIsPng(slideIsPng);
      setBackgroundType(slide.background?.type || "solid");
      setColor1(slide.background?.color1 || "#e5e7eb");
      setColor2(slide.background?.color2 || "#6366F1");
      setDirection(slide.background?.direction || "to right");
      setActiveLang("en");
      setValidationError(null);
    }
  }, [isOpen, slide]);
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: { ...prev[e.target.name], [activeLang]: e.target.value },
    }));
    if (validationError) setValidationError(null);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setIsPng(file.type === "image/png");
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setValidationError(null);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError(null);
    if (!imagePreview)
      return setValidationError(
        t("hero_control.modal_edit.error_asset_required")
      );
    const languages = { en: "English", fr: "Français", ar: "العربية" };
    const missing = [];
    for (const lang in languages) {
      if (
        !formData.title[lang]?.trim() ||
        !formData.category[lang]?.trim() ||
        !formData.description[lang]?.trim()
      ) {
        missing.push(languages[lang]);
      }
    }
    if (missing.length > 0)
      return setValidationError(
        `Please complete all fields for: ${missing.join(", ")}`
      );
    const data = new FormData();
    Object.keys(formData.title).forEach((lang) =>
      data.append(`title_${lang}`, formData.title[lang])
    );
    Object.keys(formData.category).forEach((lang) =>
      data.append(`category_${lang}`, formData.category[lang])
    );
    Object.keys(formData.description).forEach((lang) =>
      data.append(`description_${lang}`, formData.description[lang])
    );
    if (imageFile) data.append("image", imageFile);
    if (isPng) {
      data.append("backgroundType", backgroundType);
      data.append("backgroundColor1", color1);
      if (backgroundType === "gradient") {
        data.append("backgroundColor2", color2);
        data.append("backgroundDirection", direction);
      }
    }
    onSave(slide._id, data);
  };

  const previewStyle = isPng
    ? backgroundType === "gradient"
      ? {
          backgroundImage: `linear-gradient(${direction}, ${color1}, ${color2})`,
        }
      : { backgroundColor: color1 }
    : { backgroundColor: "#f3f4f6" };
  const commonProps = {
    backgroundType,
    setBackgroundType,
    color1,
    setColor1,
    color2,
    setColor2,
    direction,
    setDirection,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          dir={dir}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full h-full md:max-w-6xl md:h-[90vh] bg-white text-black rounded-none md:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-black">
                {t("hero_control.modal_edit.title")}
                <span className="md:hidden"> - Step {step} of 2</span>
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-grow min-h-0 md:flex">
              <div
                className={`bg-gray-50 md:w-1/2 ${
                  step === 1 ? "flex" : "hidden"
                } md:flex flex-col`}
              >
                <div className="flex-grow p-4 sm:p-6 md:p-8 flex items-center justify-center overflow-y-auto">
                  <div>
                    <label
                      className="relative w-full aspect-video shadow-inner rounded-xl flex items-center justify-center cursor-pointer bg-white/50 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors"
                      style={previewStyle}
                    >
                      {!imagePreview ? (
                        <div className="text-center text-gray-500 p-4">
                          <UploadCloud
                            size={48}
                            className="mx-auto text-blue-500"
                          />
                          <p className="mt-2 font-semibold text-gray-800">
                            {t("hero_control.modal_edit.button_change")}
                          </p>
                        </div>
                      ) : (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-full max-w-full object-contain p-2 drop-shadow-lg"
                        />
                      )}
                      <input
                        type="file"
                        ref={inputFileRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                    <AnimatePresence>
                      {isPng && (
                        <div className="mt-6">
                          <PngBackgroundOptions {...commonProps} />
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              <div
                className={`md:w-1/2 ${
                  step === 2 ? "flex" : "hidden"
                } md:flex flex-col`}
              >
                <div className="overflow-y-auto p-4 sm:p-6 space-y-5 flex-grow">
                  <div className="md:hidden mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Image Preview:
                    </p>
                    <div
                      className="w-full aspect-video rounded-lg shadow-inner"
                      style={previewStyle}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                    <LanguageTab
                      lang="en"
                      activeLang={activeLang}
                      setActiveLang={setActiveLang}
                    >
                      English
                    </LanguageTab>
                    <LanguageTab
                      lang="fr"
                      activeLang={activeLang}
                      setActiveLang={setActiveLang}
                    >
                      Français
                    </LanguageTab>
                    <LanguageTab
                      lang="ar"
                      activeLang={activeLang}
                      setActiveLang={setActiveLang}
                    >
                      العربية
                    </LanguageTab>
                  </div>
                  <FormFields
                    formData={formData}
                    handleInputChange={handleInputChange}
                    activeLang={activeLang}
                  />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
              <AnimatePresence>
                {validationError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-3 p-3 mb-3 text-sm text-red-700 bg-red-50 border border-red-300 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{validationError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex md:hidden justify-between items-center gap-4">
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    {t("hero_control.modal_edit.button_cancel")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Previous
                  </button>
                )}
                {step === 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      imagePreview
                        ? setStep(2)
                        : setValidationError("An image is required.")
                    }
                    disabled={!imagePreview}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center min-w-[120px]"
                  >
                    {isSaving ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      t("hero_control.modal_edit.button_commit")
                    )}
                  </button>
                )}
              </div>
              <div className="hidden md:flex justify-end items-center gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  {t("hero_control.modal_edit.button_cancel")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center min-w-[120px]"
                >
                  {isSaving ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    t("hero_control.modal_edit.button_commit")
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeroModalEdit;
