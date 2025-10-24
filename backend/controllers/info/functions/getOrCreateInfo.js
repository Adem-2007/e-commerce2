// controllers/info/functions/getOrCreateInfo.js
import Info from '../../../models/Info.model.js';

// --- Get (or create if not exists) the single info document ---
export const getOrCreateInfo = async (req, res) => {
  try {
    let info = await Info.findOne();
    if (!info) {
      info = await Info.create({
        heroTitle: {
          en: 'Get in Touch',
          ar: 'ابقى على تواصل',
          fr: 'Contactez-nous'
        },
        heroSubtitle: {
          en: "We're here to help and answer any question you might have. We look forward to hearing from you.",
          ar: 'نحن هنا للمساعدة والإجابة على أي سؤال قد يكون لديك. نتطلع إلى الاستماع منك.',
          fr: "Nous sommes là pour vous aider et répondre à toutes vos questions. Nous avons hâte d'avoir de vos nouvelles."
        },
        email: 'contact@yourbrand.com',
        phone: '(+1) 123 456 7890',
        address: '123 Design St, Creative City',
        googleMapsUrl: 'https://www.google.com/maps/place/Times+Square',
        formLabels: {
          name: {
            en: 'Full Name',
            ar: 'الاسم الكامل',
            fr: 'Nom complet'
          },
          email: {
            en: 'Email Address',
            ar: 'البريد الإلكتروني',
            fr: 'Adresse e-mail'
          },
          message: {
            en: 'Your Message',
            ar: 'رسالتك',
            fr: 'Votre message'
          }
        }
      });
    }
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching or creating info document', error: error.message });
  }
};