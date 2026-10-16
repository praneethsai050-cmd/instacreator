/**
 * PRANEETH SAI - CLIENT PORTFOLIO & INTAKE INTERACTIVITY
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Mobile Navigation Menu ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close mobile menu on clicking any navigation link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // --- Portfolio Filter Functionality ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Pricing Package Selection Autofill ---
  const packageButtons = document.querySelectorAll('.select-package');
  const websiteTypeSelect = document.getElementById('websiteType');
  const budgetSelect = document.getElementById('budgetRange');

  packageButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedPkg = btn.getAttribute('data-package') || '';
      if (websiteTypeSelect) {
        if (selectedPkg.includes('Student') || selectedPkg.includes('Starter')) {
          websiteTypeSelect.value = 'College Project / Event Landing Page';
          if (budgetSelect) budgetSelect.value = 'Under ₹1,500';
        } else if (selectedPkg.includes('Professional')) {
          websiteTypeSelect.value = 'Personal Portfolio & Resume';
          if (budgetSelect) budgetSelect.value = '₹1,500 - ₹3,500';
        } else if (selectedPkg.includes('Store') || selectedPkg.includes('App')) {
          websiteTypeSelect.value = 'Custom Web Application';
          if (budgetSelect) budgetSelect.value = '₹3,500 - ₹7,500';
        }
      }
    });
  });

  // --- Project Requirement Form Submission ---
  const projectForm = document.getElementById('projectForm');
  const formSuccessBox = document.getElementById('formSuccessMessage');
  const successSummary = document.getElementById('successSummary');
  const mailClientLink = document.getElementById('mailClientLink');
  const whatsAppClientLink = document.getElementById('whatsAppClientLink');
  const resetFormBtn = document.getElementById('resetFormBtn');
  const sendViaWhatsAppBtn = document.getElementById('sendViaWhatsAppBtn');

  // Actual contact credentials
  const PRANEETH_WHATSAPP_NUMBER = '918777679256';
  const PRANEETH_EMAIL = 'domyosite@gmail.com';

  function buildInquiryPayload() {
    const name = document.getElementById('clientName').value.trim();
    const email = document.getElementById('clientEmail').value.trim();
    const phone = document.getElementById('clientPhone').value.trim() || 'Not provided';
    const type = document.getElementById('websiteType').value;
    const budget = document.getElementById('budgetRange').value;
    const timeline = document.getElementById('timeline').value;
    const details = document.getElementById('projectDetails').value.trim();

    return { name, email, phone, type, budget, timeline, details };
  }

  function generateFormattedMessage(data) {
    return `*New Website Inquiry from Portfolio Site* 🚀
----------------------------------------
*Name:* ${data.name}
*Email:* ${data.email}
*Phone/WhatsApp:* ${data.phone}
*Website Type:* ${data.type}
*Estimated Budget:* ${data.budget}
*Desired Timeline:* ${data.timeline}

*Project Requirements & Notes:*
${data.details}
----------------------------------------`;
  }

  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = buildInquiryPayload();
      const formattedMessage = generateFormattedMessage(data);

      // Prepare Mailto Link
      const mailtoSubject = encodeURIComponent(`New Website Project Inquiry: ${data.name} (${data.type})`);
      const mailtoBody = encodeURIComponent(formattedMessage);
      const mailtoUrl = `mailto:${PRANEETH_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Prepare WhatsApp Link
      const waText = encodeURIComponent(formattedMessage);
      const waUrl = `https://wa.me/${PRANEETH_WHATSAPP_NUMBER}?text=${waText}`;

      // Update CTA links
      if (mailClientLink) mailClientLink.href = mailtoUrl;
      if (whatsAppClientLink) whatsAppClientLink.href = waUrl;

      if (successSummary) {
        successSummary.textContent = `Thank you, ${data.name}! We've structured your ${data.type} requirements (${data.budget}). Choose your preferred way to transmit them directly to Praneeth below:`;
      }

      // Show success container and hide form
      projectForm.style.display = 'none';
      if (formSuccessBox) formSuccessBox.classList.remove('hidden');

      // Auto trigger mail client as default convenience
      window.open(mailtoUrl, '_blank');
    });
  }

  // Quick "Send via WhatsApp Instead" button inside form
  if (sendViaWhatsAppBtn) {
    sendViaWhatsAppBtn.addEventListener('click', () => {
      const name = document.getElementById('clientName').value.trim();
      const type = document.getElementById('websiteType').value;
      const details = document.getElementById('projectDetails').value.trim();

      if (!name || !type) {
        alert('Please fill in at least your Name and Website Type before sending to WhatsApp.');
        document.getElementById('clientName').focus();
        return;
      }

      const data = buildInquiryPayload();
      const formattedMessage = generateFormattedMessage(data);
      const waUrl = `https://wa.me/${PRANEETH_WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedMessage)}`;

      window.open(waUrl, '_blank');
    });
  }

  // Reset Button handler
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      if (formSuccessBox) formSuccessBox.classList.add('hidden');
      if (projectForm) {
        projectForm.reset();
        projectForm.style.display = 'flex';
      }
    });
  }
});
