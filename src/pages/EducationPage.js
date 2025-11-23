import React from 'react';
import { useTranslation } from 'react-i18next';

const EducationPage = () => {
  const { t } = useTranslation();

  // --- MOCK DATA: SCHOLARSHIPS ---
  const scholarships = [
    {
      id: 1,
      title: "ICAR National Talent Scholarship",
      amount: "₹3,000/month",
      description: "For students pursuing agriculture degrees in universities outside their home state.",
      link: "https://education.icar.gov.in/"
    },
    {
      id: 2,
      title: "PM Scholarship Scheme (PMSS)",
      amount: "₹30,000/year",
      description: "Scholarship for wards of ex-servicemen pursuing professional courses in agriculture.",
      link: "https://ksb.gov.in/"
    },
    {
      id: 3,
      title: "Nabard Student Internship Scheme",
      amount: "Stipend Available",
      description: "Summer internship opportunities for students in agriculture and rural development.",
      link: "https://www.nabard.org/"
    }
  ];

  // --- MOCK DATA: EDUCATIONAL RESOURCES ---
  const resources = [
    {
      id: 1,
      category: "Online Training",
      title: "AgriMOOCs (Massive Open Online Courses)",
      description: "Free online courses on organic farming, dairy management, and crop science.",
      link: "https://agmoocs.in/"
    },
    {
      id: 2,
      category: "Government Portal",
      title: "Krishi Vigyan Kendra (KVK) Portal",
      description: "Find training centers near you and access scientific farming advice.",
      link: "https://kvk.icar.gov.in/"
    },
    {
      id: 3,
      category: "Library",
      title: "e-Granth Library",
      description: "Digital library for agricultural research and thesis papers.",
      link: "https://egranth.ac.in/"
    }
  ];

  return (
    <div style={styles.container}>
      {/* --- HERO / QUOTE SECTION --- */}
      <div style={styles.heroSection}>
        <h1 style={styles.mainTitle}>🎓 {t('education') || "Education & Knowledge"}</h1>
        <div style={styles.quoteCard}>
          <p style={styles.quoteText}>
            "Agriculture is the most healthful, most useful, and most noble employment of man."
          </p>
          <p style={styles.quoteAuthor}>- George Washington</p>
        </div>
      </div>

      {/* --- SCHOLARSHIPS SECTION --- */}
      <h2 style={styles.sectionTitle}>💰 Scholarships & Financial Aid</h2>
      <div style={styles.grid}>
        {scholarships.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.badge}>Scholarship</div>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.highlight}>{item.amount}</p>
            <p style={styles.desc}>{item.description}</p>
            <a href={item.link} target="_blank" rel="noreferrer" style={styles.button}>
              Apply Now
            </a>
          </div>
        ))}
      </div>

      <hr style={styles.divider} />

      {/* --- KNOWLEDGE HUB SECTION --- */}
      <h2 style={styles.sectionTitle}>📚 Knowledge Hub & Training</h2>
      <div style={styles.grid}>
        {resources.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={{...styles.badge, backgroundColor: '#007bff'}}>
                {item.category}
            </div>
            <h3 style={styles.cardTitle}>{item.title}</h3>
            <p style={styles.desc}>{item.description}</p>
            <a href={item.link} target="_blank" rel="noreferrer" style={{...styles.button, backgroundColor: '#007bff'}}>
              Start Learning
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- INTERNAL STYLES ---
const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif'
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  mainTitle: {
    color: '#2e7d32',
    fontSize: '2.5rem',
    marginBottom: '20px'
  },
  quoteCard: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    borderLeft: '5px solid #ff9800'
  },
  quoteText: {
    fontSize: '1.2rem',
    fontStyle: 'italic',
    color: '#555'
  },
  quoteAuthor: {
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right'
  },
  sectionTitle: {
    color: '#333',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '20px',
    marginTop: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '40px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    transition: 'transform 0.2s',
  },
  badge: {
    backgroundColor: '#2e7d32',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '15px',
    fontSize: '0.8rem',
    marginBottom: '15px',
    fontWeight: 'bold'
  },
  cardTitle: {
    fontSize: '1.2rem',
    margin: '0 0 10px 0',
    color: '#333'
  },
  highlight: {
    color: '#e65100',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    margin: '0 0 10px 0'
  },
  desc: {
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '20px',
    flexGrow: 1
  },
  button: {
    backgroundColor: '#2e7d32',
    color: 'white',
    padding: '10px 20px',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    alignSelf: 'flex-start'
  },
  divider: {
    border: '0',
    height: '1px',
    background: '#ccc',
    margin: '40px 0'
  }
};

export default EducationPage;