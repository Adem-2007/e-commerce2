// backend/models/Info.model.js
import mongoose from 'mongoose';

// --- Reusable Sub-schemas ---

// FAQ Schema with multilingual question and answer
const faqSchema = new mongoose.Schema({
  question: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: '', ar: '', fr: '' }
  },
  answer: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: '', ar: '', fr: '' }
  },
});

// Form Labels Schema with multilingual labels
const formLabelsSchema = new mongoose.Schema({
  name: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: 'Full Name', ar: 'الاسم الكامل', fr: 'Nom complet' }
  },
  email: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: 'Email Address', ar: 'البريد الإلكتروني', fr: 'Adresse e-mail' }
  },
  message: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: 'Your Message', ar: 'رسالتك', fr: 'Votre message' }
  },
});

// "Our Values" Schema with multilingual title and description
const valueSchema = new mongoose.Schema({
  title: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: '', ar: '', fr: '' }
  },
  description: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: '', ar: '', fr: '' }
  },
});

// "Our Story" Milestone Schema with multilingual fields
const storyMilestoneSchema = new mongoose.Schema({
  title: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: '', ar: '', fr: '' }
  },
  year: { type: String, required: true, trim: true },
  description: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: '', ar: '', fr: '' }
  },
  achievements: [{
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: '', ar: '', fr: '' }
  }],
});

// "Our Team" Member Schema with multilingual name and role
const memberSchema = new mongoose.Schema({
  name: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: '', ar: '', fr: '' }
  },
  role: {
    type: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
      fr: { type: String, trim: true }
    },
    default: { en: '', ar: '', fr: '' }
  },
  image: { type: String, required: true },
});


// --- Main Info Schema ---

const infoSchema = new mongoose.Schema({
  // --- CONTACT PAGE ---
  heroTitle: {
    type: { en: { type: String, trim: true }, ar: { type: String, trim: true }, fr: { type: String, trim: true } },
    default: { en: 'Get in Touch', ar: 'ابقى على تواصل', fr: 'Contactez-nous' }
  },
  heroSubtitle: {
    type: { en: { type: String, trim: true }, ar: { type: String, trim: true }, fr: { type: String, trim: true } },
    default: {
      en: "We're here to help and answer any question you might have. We look forward to hearing from you.",
      ar: 'نحن هنا للمساعدة والإجابة على أي سؤال قد يكون لديك. نتطلع إلى الاستماع منك.',
      fr: "Nous sommes là pour vous aider et répondre à toutes vos questions. Nous avons hâte d'avoir de vos nouvelles."
    }
  },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  googleMapsUrl: { type: String, required: true, trim: true },
  formLabels: formLabelsSchema,
  faqs: [faqSchema],

  // --- ABOUT PAGE ---
  aboutHeroTitle: {
    type: { en: { type: String, trim: true }, ar: { type: String, trim: true }, fr: { type: String, trim: true } },
    default: { en: 'About Our Company', ar: 'حول شركتنا', fr: 'À propos de notre entreprise' }
  },
  aboutHeroSubtitle: {
    type: { en: { type: String, trim: true }, ar: { type: String, trim: true }, fr: { type: String, trim: true } },
    default: {
      en: 'Learn more about our mission, vision, and the team that makes it all happen.',
      ar: 'تعرف على المزيد حول مهمتنا ورؤيتنا والفريق الذي يجعل كل ذلك ممكنًا.',
      fr: 'Apprenez-en davantage sur notre mission, notre vision et l’équipe qui réalise tout cela.'
    }
  },
  values: {
    type: [valueSchema],
    default: []
  },
  story: {
    type: [storyMilestoneSchema],
    default: []
  },
  members: {
    type: [memberSchema],
    default: []
  },

}, { timestamps: true });

// Middleware to ensure there's only one document in this collection
infoSchema.pre('save', async function (next) {
  const count = await mongoose.model('Info').countDocuments();
  if (count > 0 && this.isNew) {
    next(new Error('Only one info document can exist. Please update the existing one.'));
  } else {
    next();
  }
});

const Info = mongoose.model('Info', infoSchema);
export default Info;