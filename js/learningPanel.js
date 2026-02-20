// js/learningPanel.js - WOFA AI Courses & Lessons Panel (Fixed Version Feb 2026)
// Works fully without MongoDB
// Saves selected Course + Lesson titles for AI context (Groq / OpenAI / Any Backend)

document.addEventListener("DOMContentLoaded", () => {
  const coursesList = document.getElementById("coursesList");
  const chatBox = document.getElementById("chatBox");
  const questionInput = document.getElementById("questionInput");

  if (!coursesList) {
    console.error("WOFA AI Error: coursesList element not found.");
    return;
  }

  /* ───────────────────────────────────────────────
     COURSE & LESSON DATA
     ─────────────────────────────────────────────── */
  const coursesData = [
    {
      id: "general-knowledge",
      title: "General Knowledge",
      lessons: [
        { id: "gk001", title: "World History & Major Events" },
        { id: "gk002", title: "Geography & Countries of the World" },
        { id: "gk003", title: "Science & Nature" },
        { id: "gk004", title: "Technology & Modern Innovations" },
        { id: "gk005", title: "Politics & Government Systems" },
        { id: "gk006", title: "Economics & Money Systems" },
        { id: "gk007", title: "Health & Human Body Knowledge" },
        { id: "gk008", title: "Famous People & Leaders" },
        { id: "gk009", title: "Religion & Global Beliefs" },
        { id: "gk010", title: "Culture, Traditions & Society" },
        { id: "gk011", title: "Sports & Global Competitions" },
        { id: "gk012", title: "Arts, Music & Entertainment" },
        { id: "gk013", title: "Current Affairs & Trending Topics" },
        { id: "gk014", title: "General Intelligence & Brain Training" },
        { id: "gk015", title: "Everyday Life Skills & Practical Knowledge" }
      ]
    },

    {
      id: "bba",
      title: "Bachelor of Business Administration (BBA)",
      lessons: [
        { id: "bba101", title: "Introduction to Business" },
        { id: "bba102", title: "Principles of Management" },
        { id: "bba103", title: "Financial Accounting" },
        { id: "bba104", title: "Business Mathematics" }
      ]
    },

    {
      id: "entrepreneurship",
      title: "Entrepreneurship",
      lessons: [
        { id: "ent101", title: "What is Entrepreneurship?" },
        { id: "ent102", title: "Business Ideas and Opportunity Identification" },
        { id: "ent103", title: "Business Plan Writing" },
        { id: "ent104", title: "Startup Funding in Ghana" },
        { id: "ent105", title: "Marketing Strategies for Small Businesses" },
        { id: "ent106", title: "Customer Service and Business Growth" },
        { id: "ent107", title: "Managing Risk in Business" }
      ]
    },

    {
      id: "theology-christian",
      title: "Theology – Christian Studies",
      lessons: [
        { id: "act101", title: "Biblical Interpretation in African Cultures" },
        { id: "act103", title: "African Church History" },
        { id: "act104", title: "Contextual Christian Ethics in Africa" },
        { id: "act105", title: "Missions and Evangelism in African Contexts" },
        { id: "act106", title: "Prophecy and African Prophets" },
        { id: "act108", title: "Church Leadership & Administration in Africa" }
      ]
    },

    {
      id: "theology-ucc",
      title: "THEOLOGY UCC",
      lessons: [
        { id: "ucc1001", title: "Introduction to Religion and Human Values" },
        { id: "ucc1002", title: "Introduction to Religions in the World" },
        { id: "ucc1003", title: "Communicative Skills / Academic Writing" },

        { id: "ucc2001", title: "African Traditional Religion" },
        { id: "ucc2002", title: "Comparative Study of Religion" },
        { id: "ucc2003", title: "Ethics and Human Values" },

        { id: "ucc3001", title: "Myths and Symbols in African Traditional Religion" },
        { id: "ucc3002", title: "Religion in Contemporary Society" },
        { id: "ucc3003", title: "Religion and Medicine in Traditional Africa" },
        { id: "ucc3004", title: "Religion and Chieftaincy" },

        { id: "ucc4001", title: "Traditional African Taboos in Public Life" },
        { id: "ucc4002", title: "Socio-economic Roles of Religion" },
        { id: "ucc4003", title: "Long Essay / Capstone Project" }
      ]
    },

    {
      id: "prophetic-work",
      title: "Prophetic Work & Spiritual Authority",
      lessons: [
        { id: "pw101", title: "The Seven Spirits of God (Isaiah 11:2)" },
        { id: "pw102", title: "Ways to Hear the Voice of God" },
        { id: "pw103", title: "Power (Dunamis) and Spiritual Strength" },
        { id: "pw104", title: "Meditation and Spiritual Sensitivity" },
        { id: "pw105", title: "Tithes, Offerings, and Sacrifices" },
        { id: "pw106", title: "Healing Ministry and Divine Health" },
        { id: "pw107", title: "Deliverance (Exorcism) and Spiritual Warfare" },
        { id: "pw108", title: "The Fivefold Ministries (Ephesians 4:11)" },
        { id: "pw109", title: "Prophetic Prayer and Intercession" }
      ]
    },

    {
      id: "ict",
      title: "Information & Communication Technology (ICT)",
      lessons: [
        { id: "ict101", title: "Computer Fundamentals & Digital Literacy" },
        { id: "ict102", title: "Networking & Internet Technologies" },
        { id: "ict103", title: "Database Management Systems" },
        { id: "ict104", title: "Cybersecurity Basics" },
        { id: "ict105", title: "Cloud Computing & Virtualization" }
      ]
    },

    {
      id: "futureverse",
      title: "FUTUREVERSE (Learning Today, Leading Tomorrow)",
      lessons: [
        { id: "fv001", title: "Artificial Intelligence & Machine Learning" },
        { id: "fv002", title: "Ethical AI & Responsible Technology" },
        { id: "fv003", title: "Quantum Computing & Next-Gen Computing" },
        { id: "fv004", title: "Metaverse, VR & AR Learning" },
        { id: "fv005", title: "Personalized Adaptive Learning Systems" },
        { id: "fv006", title: "Cybersecurity & Digital Safety" },
        { id: "fv007", title: "Coding & Computer Science (Python, Java, Web Dev)" },
        { id: "fv008", title: "Future Work & Gig Economy Skills" },
        { id: "fv009", title: "Career Preparation & Interview Mastery" },
        { id: "fv010", title: "Research Skills, Thesis & Academic Writing" },
        { id: "fv011", title: "Climate Change & Sustainability" },
        { id: "fv012", title: "Climate Solutions & Green Innovation Careers" },
        { id: "fv013", title: "Environmental Technology & Clean Energy" },
        { id: "fv014", title: "Eco-Anxiety & Climate Mental Wellness" },
        { id: "fv015", title: "Social Movements & Youth Activism" },
        { id: "fv016", title: "Mental Health & Student Wellness" },
        { id: "fv017", title: "Global Health & Pandemic Preparedness" },
        { id: "fv018", title: "Health & Medicine Research Topics" },
        { id: "fv019", title: "Human Ethics in Society & Technology" },
        { id: "fv020", title: "Study Abroad, Scholarships & Global Education" }
      ]
    },

    {
      id: "montessori",
      title: "Montessori Education (Ages 2–6)",
      lessons: [
        { id: "mon101", title: "Introduction to Montessori Learning" },
        { id: "mon102", title: "Practical Life Activities (Daily Skills)" },
        { id: "mon103", title: "Sensorial Activities (Learning Through Senses)" },
        { id: "mon104", title: "Montessori Numbers & Counting" },
        { id: "mon105", title: "Montessori Alphabet & Phonics" },
        { id: "mon106", title: "Montessori Storytelling and Language Development" },
        { id: "mon107", title: "Shapes, Colors, and Patterns" },
        { id: "mon108", title: "Montessori Classroom Rules & Discipline" },
        { id: "mon109", title: "Early Writing Skills (Tracing & Pencil Control)" },
        { id: "mon110", title: "Montessori Science: Plants, Animals & Nature" }
      ]
    },

    {
      id: "primary-education-international",
      title: "Primary Education (International Standard)",
      lessons: [
        { id: "pri101", title: "English Grammar Basics (Nouns, Verbs, Adjectives)" },
        { id: "pri102", title: "Reading Comprehension and Story Analysis" },
        { id: "pri103", title: "Creative Writing (Paragraph Writing)" },
        { id: "pri104", title: "Mathematics: Addition, Subtraction, Multiplication, Division" },
        { id: "pri105", title: "Fractions and Decimals for Primary Level" },
        { id: "pri106", title: "Basic Science: Human Body and Health" },
        { id: "pri107", title: "Basic Science: Plants and Animals" },
        { id: "pri108", title: "Social Studies: Community and Citizenship" },
        { id: "pri109", title: "Geography: Continents, Oceans and Maps" },
        { id: "pri110", title: "ICT for Kids: Computer Basics and Typing Skills" },
        { id: "pri111", title: "Moral Education and Good Behaviour" },
        { id: "pri112", title: "Creative Arts: Drawing, Coloring and Craftwork" }
      ]
    },

    {
      id: "secondary-education-africa",
      title: "Secondary School Education (Africa - WAEC/BECE/SHS)",
      lessons: [
        { id: "sec101", title: "English Language: Grammar, Comprehension & Essay Writing" },
        { id: "sec102", title: "Mathematics: Algebra, Geometry & Statistics" },
        { id: "sec103", title: "Integrated Science: Biology, Chemistry & Physics Basics" },
        { id: "sec104", title: "Social Studies: Governance, Culture & Development" },
        { id: "sec105", title: "ICT: Microsoft Office, Internet, and Digital Literacy" },
        { id: "sec106", title: "Economics: Demand & Supply, Inflation and GDP" },
        { id: "sec107", title: "Government: Constitution and Political Systems" },
        { id: "sec108", title: "History: African Civilizations and Colonialism" },
        { id: "sec109", title: "Elective Mathematics: Trigonometry and Calculus Intro" },
        { id: "sec110", title: "Biology: Cells, Reproduction and Ecology" },
        { id: "sec111", title: "Chemistry: Periodic Table and Chemical Reactions" },
        { id: "sec112", title: "Physics: Motion, Energy and Electricity" },
        { id: "sec113", title: "Literature: Poetry, Drama and Prose Analysis" },
        { id: "sec114", title: "Business Management: Entrepreneurship and Accounting Basics" }
      ]
    },

    {
      id: "ashanti-empire",
      title: "The Ashanti Empire (Ghana History & Civilization)",
      lessons: [
        { id: "ash101", title: "Origins of the Ashanti Kingdom" },
        { id: "ash102", title: "The Golden Stool and Ashanti Spiritual Beliefs" },
        { id: "ash103", title: "Osei Tutu and the Formation of the Empire" },
        { id: "ash104", title: "Komfo Anokye and Religious Authority" },
        { id: "ash105", title: "Ashanti Political System and Governance" },
        { id: "ash106", title: "Ashanti Military Power and Wars" },
        { id: "ash107", title: "Ashanti Economy: Trade, Gold and Markets" },
        { id: "ash108", title: "Ashanti Culture: Festivals, Language and Traditions" },
        { id: "ash109", title: "Ashanti and European Contact (British & Dutch)" },
        { id: "ash110", title: "The Anglo-Ashanti Wars Explained" },
        { id: "ash111", title: "Yaa Asantewaa and the War of 1900" },
        { id: "ash112", title: "Decline of the Ashanti Empire and Colonial Rule" },
        { id: "ash113", title: "Modern Ashanti Influence in Ghana Today" }
      ]
    },

    {
      id: "business-communication",
      title: "Business Communication",
      lessons: [
        { id: "bc101", title: "Introduction to Business Communication" },
        { id: "bc102", title: "Formal Letters and Email Writing" },
        { id: "bc103", title: "Business Report Writing" },
        { id: "bc104", title: "Presentation Skills and Public Speaking" },
        { id: "bc105", title: "Negotiation and Conflict Resolution" },
        { id: "bc106", title: "Professional Communication Etiquette" }
      ]
    },

    {
      id: "ghana-law-constitution",
      title: "Ghana Law & Constitution",
      lessons: [
        { id: "glc101", title: "Introduction to Ghana’s Legal System" },
        { id: "glc102", title: "The 1992 Constitution Explained" },
        { id: "glc103", title: "Fundamental Human Rights in Ghana" },
        { id: "glc104", title: "Branches of Government (Executive, Legislature, Judiciary)" },
        { id: "glc105", title: "Citizenship and National Duties" },
        { id: "glc106", title: "Rule of Law and Democracy in Ghana" },
        { id: "glc107", title: "Key Constitutional Bodies in Ghana" }
      ]
    },

    {
      id: "procurement",
      title: "Procurement & Supply Chain",
      lessons: [
        { id: "pro101", title: "Introduction to Procurement" },
        { id: "pro102", title: "Procurement Cycle and Procedures" },
        { id: "pro103", title: "Public Procurement Law in Ghana (Act 663 & Amendments)" },
        { id: "pro104", title: "Tendering, Bidding and Contract Award" },
        { id: "pro105", title: "Supplier Evaluation and Vendor Management" },
        { id: "pro106", title: "Ethics in Procurement" },
        { id: "pro107", title: "Logistics and Inventory Management" }
      ]
    },

    {
      id: "demand-supply",
      title: "Demand & Supply (Economics)",
      lessons: [
        { id: "ds101", title: "Introduction to Demand and Supply" },
        { id: "ds102", title: "Law of Demand and Demand Curve" },
        { id: "ds103", title: "Law of Supply and Supply Curve" },
        { id: "ds104", title: "Market Equilibrium" },
        { id: "ds105", title: "Factors Affecting Demand and Supply" },
        { id: "ds106", title: "Price Elasticity of Demand and Supply" },
        { id: "ds107", title: "Practical Market Examples in Ghana" }
      ]
    },

    {
      id: "practical-business",
      title: "Practical Business (Real-Life Skills)",
      lessons: [
        { id: "pb101", title: "Starting a Small Business in Ghana" },
        { id: "pb102", title: "How to Register a Business (GRA, Registrar General, SSNIT)" },
        { id: "pb103", title: "Pricing Strategy and Profit Calculation" },
        { id: "pb104", title: "Basic Accounting for Small Businesses" },
        { id: "pb105", title: "Sales and Customer Relationship Management" },
        { id: "pb106", title: "How to Advertise Online (WhatsApp, Facebook, Instagram)" },
        { id: "pb107", title: "Business Risk and Fraud Prevention" },
        { id: "pb108", title: "Managing Employees and Workplace Discipline" }
      ]
    },

    {
      id: "computer-science",
      title: "Computer Science Fundamentals",
      lessons: [
        { id: "cs101", title: "Introduction to Programming Concepts" },
        { id: "cs102", title: "Data Structures & Algorithms" },
        { id: "cs103", title: "Operating Systems & Architecture" },
        { id: "cs104", title: "Software Engineering Principles" },
        { id: "cs105", title: "Artificial Intelligence & Machine Learning Intro" }
      ]
    },

    {
      id: "coding",
      title: "Coding & Programming",
      lessons: [
        { id: "cod101", title: "Python for Beginners" },
        { id: "cod102", title: "JavaScript & Web Development" },
        { id: "cod103", title: "Java Programming" },
        { id: "cod104", title: "Mobile App Development (Flutter/React Native)" },
        { id: "cod105", title: "Full-Stack Development Project" }
      ]
    },

    {
      id: "robotics",
      title: "Robotics Program with Basic Sciences",
      lessons: [
        { id: "rob-montessori", title: "Montessori Level: Sensory Robotics & Basic Physics (Ages 3–6)" },
        { id: "rob-primary", title: "Primary Level: Simple Machines, Logic & Intro Coding (Ages 6–12)" },
        { id: "rob-secondary", title: "Secondary Level: Electronics, Sensors, Arduino & Chemistry Basics (Ages 12–18)" },
        { id: "rob-university", title: "University Level: AI Robotics, Automation, Advanced Physics & Engineering" }
      ]
    },

    {
      id: "african-history-dev",
      title: "African History & Development",
      lessons: [
        { id: "ahd101", title: "Pre-Colonial African Societies" },
        { id: "ahd102", title: "Colonialism & Its Lasting Impact" },
        { id: "ahd103", title: "Pan-Africanism & Independence Movements" },
        { id: "ahd104", title: "Modern African Political Economy" }
      ]
    },

    {
      id: "public-health-africa",
      title: "Public Health in Africa",
      lessons: [
        { id: "pha101", title: "Tropical Diseases & Epidemiology" },
        { id: "pha102", title: "HIV/AIDS & Infectious Disease Control" },
        { id: "pha103", title: "Maternal & Child Health in Africa" },
        { id: "pha104", title: "Health Systems Strengthening" }
      ]
    },

    {
      id: "sustainable-dev-africa",
      title: "Sustainable Development in Africa",
      lessons: [
        { id: "sda101", title: "SDGs Localization in Africa" },
        { id: "sda102", title: "Climate Resilience & Adaptation" },
        { id: "sda103", title: "Renewable Energy Solutions" },
        { id: "sda104", title: "Food Security & Agriculture" }
      ]
    },

    {
      id: "bible-reading",
      title: "Bible Reading (Books & Chapters Study)",
      lessons: [
        { id: "br001", title: "How to Read the Bible Correctly (Understanding Context)" },
        { id: "br002", title: "Genesis 1–3: Creation, Fall, and Spiritual Authority" },
        { id: "br003", title: "Genesis 12: Abraham and Covenant Relationship" },
        { id: "br004", title: "Exodus 12: The Passover Mystery and Deliverance" },
        { id: "br005", title: "Exodus 14: Crossing the Red Sea (Faith and Power)" }
      ]
    },

    {
      id: "jesus-course",
      title: "JESUS (The Mystery of Christ & The Holy Spirit)",
      lessons: [
        { id: "jes001", title: "Who is Jesus Christ? (The Foundation of Faith)" },
        { id: "jes002", title: "Jesus as the Son of God (Meaning and Revelation)" },
        { id: "jes003", title: "Jesus as the Word of God (John 1 Explained)" },
        { id: "jes004", title: "Jesus as God in Human Form (Divinity of Christ)" },
        { id: "jes005", title: "Jesus as the Soul of God (Mystery Teaching)" }
      ]
    },

    {
      id: "cosmetology",
      title: "Cosmetology (Beauty & Skincare Professional Course)",
      lessons: [
        { id: "cos101", title: "Introduction to Cosmetology & Beauty Industry" },
        { id: "cos102", title: "Skin Anatomy & Skin Types Explained" },
        { id: "cos103", title: "Facials: Step-by-Step Professional Facial Treatment" },
        { id: "cos104", title: "Cleansing, Toning & Moisturizing Techniques" },
        { id: "cos105", title: "Exfoliation Methods (Scrubs, Chemical Peels, Steaming)" },
        { id: "cos106", title: "Acne Treatment & Dark Spot Removal Methods" },
        { id: "cos107", title: "Hyperpigmentation & Skin Lightening Safety" },
        { id: "cos108", title: "Natural Skincare Remedies & Organic Products" },
        { id: "cos109", title: "Makeup Basics (Foundation, Concealer, Powder)" },
        { id: "cos110", title: "Makeup for Different Skin Tones (African Skin Focus)" },
        { id: "cos111", title: "Bridal Makeup Training (Full Professional Steps)" },
        { id: "cos112", title: "Eyebrow Shaping, Tinting & Threading" },
        { id: "cos113", title: "Eyelash Extension & Lash Lifting Training" },
        { id: "cos114", title: "Manicure & Pedicure Training" },
        { id: "cos115", title: "Nail Art & Gel/ Acrylic Nails Training" },
        { id: "cos116", title: "Hair Treatment: Shampooing & Conditioning Techniques" },
        { id: "cos117", title: "Hair Relaxing, Coloring & Hair Dyes Safety" },
        { id: "cos118", title: "Wig Installation, Frontal & Closure Fixing" },
        { id: "cos119", title: "Braiding & Natural Hair Styling" },
        { id: "cos120", title: "Spa Therapy & Body Massage Training" },
        { id: "cos121", title: "Body Scrub & Body Polishing Techniques" },
        { id: "cos122", title: "Beauty Business: Pricing, Branding & Customer Service" },
        { id: "cos123", title: "How to Start a Beauty Salon in Ghana" },
        { id: "cos124", title: "Professional Hygiene & Safety in Beauty Work" }
      ]
    },

    {
      id: "digital-marketing",
      title: "Digital Marketing & Social Media Growth",
      lessons: [
        { id: "dm101", title: "Introduction to Digital Marketing" },
        { id: "dm102", title: "Facebook Marketing & Ads Strategy" },
        { id: "dm103", title: "Instagram Growth & Content Strategy" },
        { id: "dm104", title: "WhatsApp Business Marketing" },
        { id: "dm105", title: "TikTok Marketing & Viral Content Strategy" },
        { id: "dm106", title: "Google Business Profile Setup" },
        { id: "dm107", title: "SEO Basics (Search Engine Optimization)" },
        { id: "dm108", title: "Email Marketing & Campaign Building" },
        { id: "dm109", title: "Brand Building and Online Reputation" },
        { id: "dm110", title: "How to Sell Products Online (E-commerce)" }
      ]
    },

    {
      id: "graphic-design",
      title: "Graphic Design & Branding",
      lessons: [
        { id: "gd101", title: "Introduction to Graphic Design" },
        { id: "gd102", title: "Color Theory and Branding Psychology" },
        { id: "gd103", title: "Logo Design Principles" },
        { id: "gd104", title: "Flyer and Poster Design" },
        { id: "gd105", title: "Social Media Design (Instagram, Facebook Ads)" },
        { id: "gd106", title: "Typography and Font Selection" },
        { id: "gd107", title: "Canva Masterclass" },
        { id: "gd108", title: "Adobe Photoshop Basics" },
        { id: "gd109", title: "Adobe Illustrator Basics" },
        { id: "gd110", title: "Brand Identity Creation (Full Project)" }
      ]
    },

    {
      id: "english-speaking",
      title: "English Speaking & Confidence Training",
      lessons: [
        { id: "es101", title: "Speaking English with Confidence" },
        { id: "es102", title: "Correct Pronunciation and Accent Training" },
        { id: "es103", title: "Public Speaking and Presentation Skills" },
        { id: "es104", title: "Interview Speaking Skills" },
        { id: "es105", title: "Debate and Argument Skills" },
        { id: "es106", title: "Vocabulary Building and Daily Practice" },
        { id: "es107", title: "How to Speak Fluent English in 30 Days" }
      ]
    }
  ];

  /* ───────────────────────────────────────────────
     HELPERS
     ─────────────────────────────────────────────── */
  function scrollChatToBottom() {
    if (!chatBox) return;
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function clearActive(selector) {
    document.querySelectorAll(selector).forEach((el) =>
      el.classList.remove("active")
    );
  }

  function saveSelection(courseTitle, lessonTitle) {
    localStorage.setItem("wofaActiveCourse", courseTitle);
    localStorage.setItem("wofaActiveLesson", lessonTitle);
  }

  /* ───────────────────────────────────────────────
     DISPLAY SELECTED LESSON MESSAGE
     ─────────────────────────────────────────────── */
  function showLessonSelected(courseTitle, lessonTitle) {
    if (!chatBox) return;

    const message = document.createElement("div");
    message.className = "message ai";
    message.innerHTML = `
      <strong>Selected Lesson:</strong><br>
      <b>Course:</b> ${courseTitle}<br>
      <b>Lesson:</b> ${lessonTitle}<br><br>
      I am ready to help you learn this topic.<br>
      <em>Ask any question about it now.</em>
    `;

    chatBox.appendChild(message);
    scrollChatToBottom();

    if (questionInput) questionInput.focus();

    if (typeof window.autoTeachLesson === "function") {
      window.autoTeachLesson(courseTitle, lessonTitle);
    }
  }

  /* ───────────────────────────────────────────────
     RENDER COURSES & LESSONS
     ─────────────────────────────────────────────── */
  function renderCourses() {
    coursesList.innerHTML = "";

    coursesData.forEach((course) => {
      const courseLi = document.createElement("li");
      courseLi.className = "course-item";
      courseLi.textContent = course.title;

      const lessonUl = document.createElement("ul");
      lessonUl.className = "lesson-list";

      course.lessons.forEach((lesson) => {
        const lessonLi = document.createElement("li");
        lessonLi.className = "lesson-item";
        lessonLi.textContent = lesson.title;

        lessonLi.addEventListener("click", (e) => {
          e.stopPropagation();

          clearActive(".lesson-item");
          lessonLi.classList.add("active");

          saveSelection(course.title, lesson.title);
          showLessonSelected(course.title, lesson.title);
        });

        lessonUl.appendChild(lessonLi);
      });

      courseLi.addEventListener("click", () => {
        clearActive(".course-item");
        courseLi.classList.add("active");
        lessonUl.classList.toggle("open");
      });

      coursesList.appendChild(courseLi);
      coursesList.appendChild(lessonUl);
    });
  }

  renderCourses();
});
