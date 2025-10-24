// backend/models/footer.model.js
import mongoose from 'mongoose';

// Reusable schema for multilingual strings
const multiLanguageStringSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  fr: { type: String, default: '' },
  ar: { type: String, default: '' },
}, { _id: false });


const linkSchema = new mongoose.Schema({
  title: { type: multiLanguageStringSchema, required: true },
  href: { type: String, required: true },
});

const linkSectionSchema = new mongoose.Schema({
  title: { type: multiLanguageStringSchema, required: true },
  links: [linkSchema],
});

const socialLinkSchema = new mongoose.Schema({
  href: { type: String, required: true },
  icon: { type: String, required: true }, // e.g., 'FaTwitter', 'FaGithub'
});

const footerSchema = new mongoose.Schema({
  linkSections: [linkSectionSchema],
  socialLinks: [socialLinkSchema],
}, { timestamps: true });

const Footer = mongoose.model('Footer', footerSchema);

export default Footer;