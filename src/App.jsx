import React, { useState, useEffect } from 'react';

export default function App() {
  const whatsappNumber = "+94717088630";
  const cleanedWaNumber = "94717088630";
  const profileUrl = "https://card.nadeesenanayake.com/";

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bio Show More/Less State
  const [showFullBio, setShowFullBio] = useState(false);

  // Animated Status Modal State
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // QR Modal State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Scroll Animation Observer Setup
  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    animatedElements.forEach(el => observer.observe(el));

    return () => {
      animatedElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Handle Form Submission via Formspree Endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/xqerdaea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatusModal({
          isOpen: true,
          type: 'success',
          title: 'Message Sent Successfully!',
          message: `Thank you ${formData.name}! Your message has been received. We will get back to you shortly.`
        });
        setFormData({ name: '', email: '', mobile: '', message: '' });
      } else {
        setStatusModal({
          isOpen: true,
          type: 'error',
          title: 'Submission Failed',
          message: 'Oops! There was a problem submitting your message. Please try again.'
        });
      }
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Network Error',
        message: 'Please check your internet connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to generate and download VCard (.vcf)
  const handleDownloadContact = () => {
    const vcardData = `BEGIN:VCARD
VERSION:3.0
FN:Nadee Senanayake
TITLE:Brand Strategist & Digital Community Intelligence Specialist
TEL;TYPE=WORK,VOICE:${whatsappNumber}
EMAIL;TYPE=PREF,INTERNET:info@nadeesenanayake.com
URL:https://nadeesenanayake.com/
NOTE:Brand Strategist and Digital Community Intelligence Specialist
END:VCARD`;

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Nadee_Senanayake.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setStatusModal({
      isOpen: true,
      type: 'success',
      title: 'Contact Downloaded',
      message: 'All contact details have been successfully downloaded as a vCard file.'
    });
  };

  // Function to download QR Code
  const handleDownloadQR = () => {
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;

    fetch(qrImageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Nadee_Senanayake_QR.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(() => {
        setStatusModal({
          isOpen: true,
          type: 'error',
          title: 'Download Failed',
          message: 'Could not download QR code. Please try again.'
        });
      });
  };

  // Dynamic Social Links List
  const socialLinks = [
    {
      name: 'WhatsApp',
      url: `https://wa.me/${cleanedWaNumber}`,
      display: whatsappNumber,
      icon: (
        <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.948 0c3.179.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.239 3.482 8.42-.003 6.597-5.341 11.945-11.892 11.945-2.008-.001-3.98-.515-5.725-1.498L0 24zm6.59-4.846c1.665.988 3.311 1.478 4.953 1.479 5.348 0 9.7-4.366 9.703-9.732a9.664 9.664 0 00-2.83-6.874 9.69 9.69 0 00-6.875-2.837c-5.352 0-9.704 4.367-9.706 9.733-.001 1.732.478 3.414 1.384 4.886l-.995 3.635 3.72-1.294zm11.365-6.877c-.29-.146-1.72-.85-1.987-.946-.266-.097-.461-.146-.655.146-.194.291-.75.946-.919 1.14-.169.194-.338.219-.628.073-.29-.146-1.227-.452-2.34-1.444-.866-.772-1.451-1.725-1.621-2.016-.17-.291-.018-.448.127-.592.131-.13.291-.34.436-.509.145-.17.194-.291.291-.485.097-.194.049-.364-.024-.509-.073-.146-.655-1.579-.897-2.161-.236-.57-.477-.492-.655-.501-.17-.008-.364-.01-.557-.01-.194 0-.509.073-.775.364-.266.291-1.017.994-1.017 2.427 0 1.432 1.042 2.815 1.187 3.009.145.194 2.051 3.132 4.969 4.388.694.299 1.237.478 1.661.612.698.222 1.334.19 1.837.115.56-.083 1.72-.704 1.962-1.385.243-.68.243-1.263.17-1.385-.073-.122-.266-.194-.557-.341z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61591658377815',
      display: 'facebook.com/nadeesenanayake',
      icon: (
        <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/nadee_samadhi',
      display: 'instagram.com/nadee_samadhi',
      icon: (
        <svg className="w-5 h-5 fill-[#E4405F]" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      )
    },
    {
      name: 'Email',
      url: 'mailto:info@nadeesenanayake.com',
      display: 'info@nadeesenanayake.com',
      icon: (
        <svg className="w-5 h-5 fill-[#EA4335]" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/',
      display: 'linkedin.com/in/nadeesenanayake',
      icon: (
        <svg className="w-5 h-5 fill-[#0A66C2]" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      )
    },
    {
      name: 'Website',
      url: 'https://nadeesenanayake.com/',
      display: 'nadeesenanayake.com',
      icon: (
        <svg className="w-5 h-5 fill-[#00A499]" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      )
    }
  ];

  // Dynamic Services List
  const servicesList = [
    {
      title: 'Consumer Insight Consulting',
      description: 'Comprehensive digital qualitative audit frameworks translating audience interactions into business performance indicators.',
      image: '/assets/your-image-1.jpg'
    },
    {
      title: 'Digital Business Strategy Architecture',
      description: 'Building cohesive brand positioning pathways leveraging organic audience touchpoints and modern digital channels.',
      image: '/assets/your-image-2.jpg'
    }
  ];

  // Dynamic Bio Paragraphs
  const bioParagraphs = [
    "I'm Nadee Senanayake, a Brand Strategist and Digital Community Intelligence Specialist passionate about understanding how people think, interact, and make decisions in digital environments.",
    "My expertise combines strategic marketing, consumer behavior research, brand intelligence, and digital community analysis to help businesses make informed decisions. Rather than focusing solely on campaign metrics, I uncover the conversations, emotions, and behavioral patterns that shape customer perceptions and influence business outcomes.",
    "Throughout my career, I have collaborated with organizations across education and consumer-focused industries, supporting digital marketing initiatives, community management, online reputation, consumer insight generation, and strategic communication. These experiences have strengthened my ability to transform digital data into practical business recommendations that create measurable value.",
    "Currently, I am pursuing an MSc in Digital Marketing, and PhD Candidate where I continue to deepen my expertise in consumer behavior, digital communities, and emerging marketing trends. My long-term vision is to contribute to both academia and industry by developing innovative research and practical strategic frameworks that help organizations navigate an increasingly digital world."
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] font-sans antialiased text-gray-800 relative overflow-x-hidden">
      <div className="max-w-full md:max-w-3xl mx-auto bg-transparent relative pb-24 md:pb-16">

        {/* TOP BANNER */}
        <div className="w-full aspect-[21/9] md:aspect-[30/9] md:rounded-b-3xl bg-black overflow-hidden relative z-0 shadow-sm animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
          <img
            src="/assets/bg.png"
            alt="Banner"
            className="w-full h-full object-cover opacity-90"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* CONTENT WRAPPER */}
        <div className="px-5 sm:px-10 -mt-16 md:-mt-20 relative z-10 flex flex-col gap-6 md:gap-8">

          {/* 1. PROFILE & BIO SECTION */}
          <div id="profile" className="bg-white p-6 sm:p-8 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 shadow-lg border-4 border-white -mt-14 mb-4">
              <img
                src="/assets/bg.webp"
                alt="Nadee Senanayake"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500'; }}
              />
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">Nadee Senanayake</h1>

            <p className="text-base md:text-lg font-semibold text-cyan-500 mt-2 tracking-wide">
              Brand Strategist & Digital Community Intelligence Specialist
            </p>

            {/* Quick Action Buttons */}
            <div className="flex gap-4 mt-5 mb-6 justify-center">
              <a
                href="https://www.instagram.com/nadee_samadhi"
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-[#f9fafb] flex items-center justify-center text-gray-700 shadow-sm border border-gray-200 hover:bg-white hover:text-gray-900 hover:border-gray-200 hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08)] transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>

              <a
                href={`https://wa.me/${cleanedWaNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-[#f9fafb] flex items-center justify-center text-gray-700 shadow-sm border border-gray-200 hover:bg-white hover:text-gray-900 hover:border-gray-200 hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08)] transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.948 0c3.179.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.239 3.482 8.42-.003 6.597-5.341 11.945-11.892 11.945-2.008-.001-3.98-.515-5.725-1.498L0 24zm6.59-4.846c1.665.988 3.311 1.478 4.953 1.479 5.348 0 9.7-4.366 9.703-9.732a9.664 9.664 0 00-2.83-6.874 9.69 9.69 0 00-6.875-2.837c-5.352 0-9.704 4.367-9.706 9.733-.001 1.732.478 3.414 1.384 4.886l-.995 3.635 3.72-1.294zm11.365-6.877c-.29-.146-1.72-.85-1.987-.946-.266-.097-.461-.146-.655.146-.194.291-.75.946-.919 1.14-.169.194-.338.219-.628.073-.29-.146-1.227-.452-2.34-1.444-.866-.772-1.451-1.725-1.621-2.016-.17-.291-.018-.448.127-.592.131-.13.291-.34.436-.509.145-.17.194-.291.291-.485.097-.194.049-.364-.024-.509-.073-.146-.655-1.579-.897-2.161-.236-.57-.477-.492-.655-.501-.17-.008-.364-.01-.557-.01-.194 0-.509.073-.775.364-.266.291-1.017.994-1.017 2.427 0 1.432 1.042 2.815 1.187 3.009.145.194 2.051 3.132 4.969 4.388.694.299 1.237.478 1.661.612.698.222 1.334.19 1.837.115.56-.083 1.72-.704 1.962-1.385.243-.68.243-1.263.17-1.385-.073-.122-.266-.194-.557-.341z" />
                </svg>
              </a>

              <a
                href={`tel:${cleanedWaNumber}`}
                className="w-12 h-12 rounded-full bg-[#f9fafb] flex items-center justify-center text-gray-700 shadow-sm border border-gray-200 hover:bg-white hover:text-gray-900 hover:border-gray-200 hover:shadow-[3px_3px_10px_rgba(0,0,0,0.08)] transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M21.384 17.791l-3.769-2.231c-.51-.302-1.154-.233-1.586.172l-1.451 1.36c-2.433-1.306-4.388-3.259-5.692-5.692l1.359-1.451c.405-.432.474-1.076.173-1.586l-2.23-3.769c-.317-.535-.945-.828-1.56-.723l-4.889.832c-.62.105-1.07.643-1.07 1.272 0 10.514 8.529 19.043 19.043 19.043.629 0 1.167-.45 1.273-1.07l.831-4.89c.105-.614-.188-1.242-.723-1.559z" />
                </svg>
              </a>
            </div>

            {/* About / Bio Text Section */}
            <div className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto text-left space-y-3">
              <p>{bioParagraphs[0]}</p>

              {showFullBio && (
                <>
                  <p>{bioParagraphs[1]}</p>
                  <p>{bioParagraphs[2]}</p>
                  <p>{bioParagraphs[3]}</p>
                </>
              )}
            </div>

            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="mt-4 px-5 py-2 text-sm font-bold text-cyan-500 border border-cyan-400 hover:bg-cyan-500 hover:text-white rounded-full transition-colors duration-300 ease-in-out flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>{showFullBio ? 'Show Less' : 'Show More'}</span>
              <svg className={`w-4 h-4 transform transition-transform duration-300 ${showFullBio ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* 2. SOCIAL LINKS SECTION */}
          <div id="socials" className="bg-white p-6 sm:p-8 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-6">Social Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                  className="bg-[#f9fafb] p-4 rounded-2xl flex items-center gap-4 border border-transparent hover:bg-white hover:border-gray-200 hover:shadow-[4px_4px_15px_rgba(0,0,0,0.08)] transition-all group animate-on-scroll opacity-0 translate-y-6 duration-500"
                >
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    {link.icon}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-900 leading-tight">{link.name}</p>
                    <p className="text-sm text-gray-400 truncate mt-0.5">{link.display}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 3. SERVICES SECTION */}
          <div id="services" className="bg-white p-6 sm:p-8 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-6">Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicesList.map((service, idx) => (
                <div
                  key={idx}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                  className="w-full bg-[#f9fafb] rounded-2xl overflow-hidden border border-gray-100 group cursor-pointer hover:border-gray-200 hover:shadow-[4px_4px_15px_rgba(0,0,0,0.08)] transition-all animate-on-scroll opacity-0 translate-y-6 duration-500"
                >
                  <div className="w-full aspect-[16/9] overflow-hidden rounded-t-2xl bg-gray-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 bg-white">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{service.title}</h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. BUSINESS HOURS SECTION */}
          <div id="hours" className="bg-white p-6 sm:p-8 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-6">Business Hours</h2>
            <div className="flex items-center gap-5 bg-[#f9fafb] p-5 rounded-2xl border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 rounded-full bg-[#25d366] animate-pulse shadow-lg shadow-cyan-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-lg text-gray-900 leading-tight">Always Open</h4>
                <p className="text-sm text-gray-500 mt-1">We're available 24/7 to serve you!</p>
              </div>
            </div>
          </div>

          {/* 5. CONTACT US SECTION */}
          <div id="contact" className="bg-white p-6 sm:p-8 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-6">Contact Us</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: 'Name', type: 'text', placeholder: 'Your Name', key: 'name' },
                { label: 'Email', type: 'email', placeholder: 'Your Email', key: 'email' },
                { label: 'Mobile Number', type: 'tel', placeholder: 'Your Mobile Number', key: 'mobile' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">{field.label}</label>
                  <input
                    name={field.key}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-sm md:text-base hover:border-gray-400 hover:shadow-sm focus:outline-none focus:border-gray-400 focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08)] transition-all text-gray-800 placeholder-gray-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-sm md:text-base hover:border-gray-400 hover:shadow-sm focus:outline-none focus:border-gray-400 focus:shadow-[3px_3px_10px_rgba(0,0,0,0.08)] transition-all text-gray-800 placeholder-gray-300 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-sm mx-auto mt-2 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-gray-400 active:scale-[0.98] transition-all text-center text-base tracking-wide flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-3 font-medium">Or reach out directly via messaging:</p>

              <a
                href={`https://wa.me/${cleanedWaNumber}`}
                target="_blank"
                rel="noreferrer"
                className="w-full max-w-xs mx-auto bg-[#25d366] hover:bg-[#20ba5a] text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-gray-400 active:scale-[0.98] transition-all text-center text-base tracking-wide flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.948 0c3.179.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.239 3.482 8.42-.003 6.597-5.341 11.945-11.892 11.945-2.008-.001-3.98-.515-5.725-1.498L0 24zm6.59-4.846c1.665.988 3.311 1.478 4.953 1.479 5.348 0 9.7-4.366 9.703-9.732a9.664 9.664 0 00-2.83-6.874 9.69 9.69 0 00-6.875-2.837c-5.352 0-9.704 4.367-9.706 9.733-.001 1.732.478 3.414 1.384 4.886l-.995 3.635 3.72-1.294zm11.365-6.877c-.29-.146-1.72-.85-1.987-.946-.266-.097-.461-.146-.655.146-.194.291-.75.946-.919 1.14-.169.194-.338.219-.628.073-.29-.146-1.227-.452-2.34-1.444-.866-.772-1.451-1.725-1.621-2.016-.17-.291-.018-.448.127-.592.131-.13.291-.34.436-.509.145-.17.194-.291.291-.485.097-.194.049-.364-.024-.509-.073-.146-.655-1.579-.897-2.161-.236-.57-.477-.492-.655-.501-.17-.008-.364-.01-.557-.01-.194 0-.509.073-.775.364-.266.291-1.017.994-1.017 2.427 0 1.432 1.042 2.815 1.187 3.009.145.194 2.051 3.132 4.969 4.388.694.299 1.237.478 1.661.612.698.222 1.334.19 1.837.115.56-.083 1.72-.704 1.962-1.385.243-.68.243-1.263.17-1.385-.073-.122-.266-.194-.557-.341z" />
                </svg>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* FOOTER SAVE & CONNECT BOX*/}
          <div className="hidden md:grid bg-white p-6 sm:p-8 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 grid-cols-3 gap-6 items-center text-left animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">

            {/* Column 1: QR & Title */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                <img
                  src="/assets/QR.png"
                  alt="QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(profileUrl)}`;
                  }}
                />
              </div>
              <div>
                <h4 className="font-extrabold text-gray-900 text-lg">Save and Connect</h4>
              </div>
            </div>

            {/* Column 2: Download Contacts Button */}
            <div className="flex justify-center w-full">
              <button
                onClick={handleDownloadContact}
                className="bg-[#f9fafb] hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold py-4 px-6 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer w-full h-[52px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {/* Text updated to 'Download Contacts' and truncate removed to ensure it displays fully on larger screens, will wrap on very small screens if needed */}
                <span className="leading-tight">Download Contacts</span>
              </button>
            </div>

            {/* Column 3: View QR Code Button */}
            <div className="flex justify-center w-full">
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="bg-[#f9fafb] hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold py-4 px-6 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2 cursor-pointer w-full h-[52px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                </svg>
                <span className="leading-tight">View QR Code</span>
              </button>
            </div>

          </div>

          {/*Footer*/}
          <div className="pt-2 text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              Copyright © Nadee Senanayake. All Rights Reserved.
            </p>
          </div>

        </div>
      </div>

      {/* FLOATING BOTTOM NAVIGATION BAR (Mobile Only) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm md:hidden animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
        <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-[24px] shadow-[0_10px_40px_rgb(0,0,0,0.1)] border border-[#00FFFF]/30 flex justify-between items-center gap-2">

          <a href="#profile" className="w-11 h-11 rounded-full bg-[#f9fafb] flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 hover:border-gray-200 transition-all active:scale-95 border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </a>

          <a href="#contact" className="w-11 h-11 rounded-full bg-[#f9fafb] flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 hover:border-gray-200 transition-all active:scale-95 border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 rotate-45 -translate-x-0.5 translate-y-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L6 12Zm0 0h7.5" />
            </svg>
          </a>

          <button
            onClick={handleDownloadContact}
            title="Download Contact"
            className="w-11 h-11 rounded-full bg-[#f9fafb] flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 hover:border-gray-200 transition-all active:scale-95 border border-gray-100 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>

          <button
            onClick={() => setIsQrModalOpen(true)}
            title="Show QR Code"
            className="w-11 h-11 rounded-full bg-[#f9fafb] flex items-center justify-center text-gray-600 hover:bg-white hover:text-gray-900 hover:border-gray-200 transition-all active:scale-95 border border-gray-100 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.875 12h.008v.008h-.008V12ZM19.875 12h.008v.008h-.008V12ZM13.5 13.5h.008v.008H13.5v-.008ZM16.875 13.5h.008v.008h-.008v-.008ZM19.875 13.5h.008v.008h-.008v-.008ZM13.5 16.875h.008v.008H13.5v-.008ZM16.875 16.875h.008v.008h-.008v-.008ZM13.5 19.875h.008v.008H13.5v-.008ZM16.875 19.875h.008v.008h-.008v-.008ZM19.875 19.875h.008v.008h-.008V19.875Z" />
            </svg>
          </button>

        </div>
      </div>

      {/* QR MODAL (QR Code Display) */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative transform animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">QR Code</h3>
            <p className="text-sm text-gray-500 mb-6">Scan with your camera to open profile</p>
            <div className="w-52 h-52 mx-auto bg-gray-50 border border-gray-200 rounded-2xl p-3 mb-6 flex items-center justify-center shadow-inner">
              <img
                src="/assets/QR.png"
                alt="QR Code"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(profileUrl)}`;
                }}
              />
            </div>
            <button
              onClick={handleDownloadQR}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all text-sm cursor-pointer"
            >
              Download QR Code
            </button>
          </div>
        </div>
      )}

      {/* STATUS MODAL (Success/Error Messages) */}
      {statusModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl relative transform animate-in zoom-in-95 duration-200">
            <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4 ${statusModal.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {statusModal.type === 'success' ? (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">{statusModal.title}</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{statusModal.message}</p>
            <button
              onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all text-sm cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}