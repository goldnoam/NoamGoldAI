import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Linkedin, Github, X, Shield, FileText, Eye } from 'lucide-react';
import { Translation } from '../types';

interface FooterProps {
  t: Translation;
}

type LegalModalType = 'terms' | 'privacy' | 'accessibility' | null;

const Footer: React.FC<FooterProps> = ({ t }) => {
  const [activeModal, setActiveModal] = useState<LegalModalType>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };
    if (activeModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  return (
    <footer className="w-full glass-dark border-t border-white/10 mt-auto py-12 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Brand & Rights */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <h2 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.title}
            </h2>
            <div className="flex flex-col gap-1 text-center md:text-start">
              <p className="text-muted-foreground text-sm font-bold">
                &copy; Noam Gold AI 2026
              </p>
              <p className="text-muted-foreground text-xs opacity-60">
                All Rights Reserved &bull; כל הזכויות שמורות
              </p>
            </div>
          </div>

          {/* Quick Links & Mandatory Compliance Links */}
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href="https://noamgoldai.vercel.app/" 
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {t.moreSites}
              </a>
              <a 
                href="https://noam-gold-games.vercel.app/" 
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {t.moreGames}
              </a>
              <a 
                href="#blog" 
                className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              >
                {t.blog}
              </a>
            </div>

            {/* MANDATORY COMPLIANCE FOOTER LINKS */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-white/10 w-full" dir="rtl">
              <button
                type="button"
                onClick={() => setActiveModal('terms')}
                className="text-xs font-medium text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary rounded"
              >
                תנאי שימוש
              </button>
              <span className="text-white/20 select-none">&bull;</span>
              <button
                type="button"
                onClick={() => setActiveModal('privacy')}
                className="text-xs font-medium text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary rounded"
              >
                מדיניות פרטיות
              </button>
              <span className="text-white/20 select-none">&bull;</span>
              <button
                type="button"
                onClick={() => setActiveModal('accessibility')}
                className="text-xs font-medium text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary rounded"
              >
                הצהרת נגישות
              </button>
            </div>
          </div>

          {/* Social and Contact */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex items-center gap-6">
              <motion.a 
                whileHover={{ scale: 1.1, color: "#0077b5" }}
                href="https://www.linkedin.com/in/noamgold" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={26} />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, color: "#ffffff" }}
                href="https://github.com/goldnoam" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github size={26} />
              </motion.a>
            </div>

            <a
              href="mailto:goldnoamai@gmail.com"
              className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors group"
            >
              <Mail className="w-4 h-4 group-hover:animate-bounce text-primary" />
              <span className="font-bold text-xs uppercase tracking-widest">goldnoamai@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* COMPLIANCE ACCESSIBLE MODALS SYSTEM */}
      <AnimatePresence>
        {activeModal && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-modal-title"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              dir="rtl"
              className="relative w-full max-w-2xl max-h-[85vh] glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col bg-slate-950/95 text-foreground"
            >
              {/* Modal Top Bar */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-slate-950/90 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  {activeModal === 'terms' && <FileText className="text-primary w-6 h-6" />}
                  {activeModal === 'privacy' && <Shield className="text-primary w-6 h-6" />}
                  {activeModal === 'accessibility' && <Eye className="text-primary w-6 h-6" />}
                  <h3 id="legal-modal-title" className="text-xl font-black text-foreground">
                    {activeModal === 'terms' && 'תנאי שימוש'}
                    {activeModal === 'privacy' && 'מדיניות פרטיות'}
                    {activeModal === 'accessibility' && 'הצהרת נגישות'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-full glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="סגור חלון"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
                {activeModal === 'terms' && (
                  <div className="space-y-4 text-start">
                    <p className="font-semibold text-foreground">
                      ברוכים הבאים לאתר נועם גולד AI ([שם האתר / החברה]). השימוש באתר, בתכנים וביישומי ה-WebGL המוצגים בו כפוף לתנאים המפורטים להלן:
                    </p>
                    
                    <h4 className="text-base font-bold text-foreground">1. קניין רוחני וזכויות יוצרים</h4>
                    <p>
                      כל זכויות הקניין הרוחני, לרבות עיצובי הממשק, קוד המקור, הדמיות ה-WebGL, הטקסטים והגרפיקה, שייכים באופן בלעדי ל-[שם האתר / החברה] או לצדדים שלישיים שהתירו את שימושם. אין להעתיק, לשכפל או להפיץ תכנים ללא אישור מראש ובכתב.
                    </p>

                    <h4 className="text-base font-bold text-foreground">2. הגבלת אחריות</h4>
                    <p>
                      התכנים והשירותים באתר ניתנים כפי שהם ("AS IS"). מפעילי האתר אינם נושאים באחריות לכל נזק ישיר או עקיף שייגרם כתוצאה משימוש באתר, קישורים חיצוניים, סימולציות גרפיות או אי-זמינות זמנית של השירות.
                    </p>

                    <h4 className="text-base font-bold text-foreground">3. שימוש הוגן ובטוח</h4>
                    <p>
                      חל איסור על ביצוע פעולות העלולות לשבש את פעילות האתר, לבצע הנדסה לאחור או להעמיס באופן חריג על השרתים ותשתיות הרשת.
                    </p>

                    <h4 className="text-base font-bold text-foreground">4. יצירת קשר</h4>
                    <p>
                      לשאלות והבהרות בנוגע לתנאי השימוש, ניתן לפנות אלינו בכתובת: <span className="text-primary font-bold">[דוא"ל ליצירת קשר: goldnoamai@gmail.com]</span>.
                    </p>
                  </div>
                )}

                {activeModal === 'privacy' && (
                  <div className="space-y-4 text-start">
                    <p className="font-semibold text-foreground">
                      אנו ב-[שם האתר / החברה: נועם גולד AI] מכבדים את פרטיות המשתמשים ומחויבים להגנה על המידע האישי שלכם.
                    </p>

                    <h4 className="text-base font-bold text-foreground">1. איסוף מידע וטכנולוגיות אחסון</h4>
                    <p>
                      האתר עשוי להשתמש בקובצי עוגיות (Cookies) ובאחסון מקומי (LocalStorage) לצורך שמירת העדפות ממשק המשתמש (כגון מצב תצוגה אור/חושך, בחירת שפה) ולשיפור ביצועי הרינדור הגרפי.
                    </p>

                    <h4 className="text-base font-bold text-foreground">2. שימוש במידע</h4>
                    <p>
                      מידע סטטיסטי שנאסף בעת הגלישה נועד לניתוח ביצועים ולשיפור חוויית המשתמש בלבד. איננו סוחרים במידע ואיננו מעבירים נתונים מזהים לצדדים שלישיים, למעט במקרים הנדרשים על פי דין.
                    </p>

                    <h4 className="text-base font-bold text-foreground">3. אבטחת מידע</h4>
                    <p>
                      האתר מיישם פרוטוקולי תקשורת מאובטחים (HTTPS) ואמצעי אבטחה מודרניים לשמירה על שלמות המערכת.
                    </p>

                    <h4 className="text-base font-bold text-foreground">4. פניות בנושאי פרטיות</h4>
                    <p>
                      בכל עניין הנוגע למדיניות זו או למימוש זכויות המשתמש, ניתן לפנות אל: <span className="text-primary font-bold">[דוא"ל ליצירת קשר: goldnoamai@gmail.com]</span>.
                    </p>
                  </div>
                )}

                {activeModal === 'accessibility' && (
                  <div className="space-y-4 text-start">
                    <p className="font-semibold text-foreground">
                      אנו רואים חשיבות עליונה במתן שירות שוויוני ומכבד לכלל המשתמשים ומשקיעים מאמצים רבים בהנגשת האתר לאנשים עם מוגבלויות.
                    </p>

                    <h4 className="text-base font-bold text-foreground">1. עמידה בתקנים</h4>
                    <p>
                      אתר זה הותאם בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג-2013, ומותאם לתקן הישראלי ת"י 5568 ברמה AA, המבוסס על הנחיות הנגישות הבינלאומיות WCAG 2.1 Level AA.
                    </p>

                    <h4 className="text-base font-bold text-foreground">2. התאמות הנגישות שבוצעו באתר</h4>
                    <ul className="list-disc list-inside space-y-1.5 pr-2">
                      <li>ניווט מלא באמצעות מקלדת (מקש Tab למעבר, Enter/Space להפעלה, Esc לסגירת חלונות).</li>
                      <li>הטמעת מבנה סמנטי תקני (כותרות H1-H6, סמנטיקה מבנית, אלמנטי כפתור ברורים).</li>
                      <li>תמיכה בתגיות ARIA עבור קוראי מסך וטכנולוגיות מסייעות.</li>
                      <li>ניגודיות צבעים תקנית המאפשרת קריאה נוחה במצב בהיר ובמצב כהה.</li>
                      <li>התאמה רספונסיבית לכל גדלי המסכים (מחשבים ניידים, טאבלטים וסמארטפונים).</li>
                      <li>אפשרות לעצירה והפחתת אנימציות ותנועות גרפיות.</li>
                    </ul>

                    <h4 className="text-base font-bold text-foreground">3. פרטי רכז/ת הנגישות ודרכי התקשרות</h4>
                    <p>
                      אם נתקלתם בקושי בגלישה או שיש לכם הצעה לשיפור הנגישות, נשמח לעמוד לרשותכם:
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1 text-sm">
                      <p><span className="font-bold text-foreground">רכז נגישות:</span> [נועם גולד / רכז נגישות]</p>
                      <p><span className="font-bold text-foreground">דוא"ל לפניות נגישות:</span> <a href="mailto:goldnoamai@gmail.com" className="text-primary underline">goldnoamai@gmail.com</a> [דוא"ל ליצירת קשר]</p>
                      <p><span className="font-bold text-foreground">טלפון / ערוץ הודעות:</span> [טלפון ליצירת קשר / זמין באמצעות דוא"ל]</p>
                      <p><span className="font-bold text-foreground">תאריך עדכון הצהרה:</span> נובמבר 2026</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-6 border-t border-white/10 flex justify-end bg-slate-950/80">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  סגור
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;