/**
 * DOMYOSITE - WEB STUDIO BY PRANEETH SAI
 * Interactive Core: UPI Pay Layout, AI Estimator & Interactive Previews
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --- Configuration Constants ---
  const PRANEETH_WHATSAPP_NUMBER = '918777679256';
  const PRANEETH_EMAIL = 'domyosite@gmail.com';
  const PRIMARY_UPI_ID = '8777679256@ybl';

  // --- State Management ---
  let activePaymentOrder = {
    planName: 'Student & College Starter',
    basePrice: 999,
    finalPrice: 999
  };

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
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Interactive Pay Layout & Checkout Modal ---
  const paymentModalOverlay = document.getElementById('paymentModalOverlay');
  const closePaymentModal = document.getElementById('closePaymentModal');
  const payPlanName = document.getElementById('payPlanName');
  const payOriginalPrice = document.getElementById('payOriginalPrice');
  const payFinalTotal = document.getElementById('payFinalTotal');
  const dynamicUpiQr = document.getElementById('dynamicUpiQr');
  const gpayDeepLink = document.getElementById('gpayDeepLink');
  const phonepeDeepLink = document.getElementById('phonepeDeepLink');
  const paytmDeepLink = document.getElementById('paytmDeepLink');
  const copyUpiBtn = document.getElementById('copyUpiBtn');
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  const utrRefInput = document.getElementById('utrRefInput');

  function openPaymentModal(planName, price) {
    const basePrice = parseInt(price, 10) || 999;
    activePaymentOrder.planName = planName;
    activePaymentOrder.basePrice = basePrice;
    activePaymentOrder.finalPrice = basePrice;

    if (payPlanName) payPlanName.textContent = planName;
    if (payOriginalPrice) payOriginalPrice.textContent = `₹${basePrice.toLocaleString()}`;
    if (payFinalTotal) payFinalTotal.textContent = `₹${basePrice.toLocaleString()}`;

    // Generate Standard UPI String
    const upiUri = `upi://pay?pa=${encodeURIComponent(PRIMARY_UPI_ID)}&pn=${encodeURIComponent('Praneeth Sai (DoMyOSite)')}&am=${basePrice}&cu=INR&tn=${encodeURIComponent(planName.substring(0, 20))}`;

    // Dynamic QR Code generation using public QR server API
    if (dynamicUpiQr) {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUri)}`;
      dynamicUpiQr.src = qrApiUrl;
    }

    // Set mobile deep link actions
    if (gpayDeepLink) gpayDeepLink.href = upiUri;
    if (phonepeDeepLink) phonepeDeepLink.href = upiUri;
    if (paytmDeepLink) paytmDeepLink.href = upiUri;

    if (paymentModalOverlay) paymentModalOverlay.classList.remove('hidden');
  }

  function closePaymentModalDialog() {
    if (paymentModalOverlay) paymentModalOverlay.classList.add('hidden');
  }

  // Attach click listeners to all "Book Online" and "Instant Pay" triggers
  document.querySelectorAll('.open-pay-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.getAttribute('data-plan') || 'Student & College Starter';
      const price = btn.getAttribute('data-price') || '999';
      openPaymentModal(plan, price);
    });
  });

  if (closePaymentModal) closePaymentModal.addEventListener('click', closePaymentModalDialog);
  if (paymentModalOverlay) {
    paymentModalOverlay.addEventListener('click', (e) => {
      if (e.target === paymentModalOverlay) closePaymentModalDialog();
    });
  }

  // Payment Tabs Switcher
  const payTabs = document.querySelectorAll('.pay-tab');
  const tabContentQr = document.getElementById('tabContentQr');
  const tabContentApps = document.getElementById('tabContentApps');
  const tabContentDetails = document.getElementById('tabContentDetails');

  payTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      payTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      if (tabContentQr) tabContentQr.classList.toggle('hidden', target !== 'qr');
      if (tabContentApps) tabContentApps.classList.toggle('hidden', target !== 'apps');
      if (tabContentDetails) tabContentDetails.classList.toggle('hidden', target !== 'details');
    });
  });

  // 1-Click UPI ID Copy
  if (copyUpiBtn) {
    copyUpiBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(PRIMARY_UPI_ID).then(() => {
        const icon = copyUpiBtn.querySelector('i');
        icon.className = 'fa-solid fa-check';
        setTimeout(() => {
          icon.className = 'fa-solid fa-copy';
        }, 2000);
      });
    });
  }

  // Notify on WhatsApp with Payment UTR Reference
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', () => {
      const utr = (utrRefInput ? utrRefInput.value.trim() : '') || 'Pending Verification';

      const msg = `*Payment Confirmation - DoMyOSite* 💳
----------------------------------------
*Plan Booked:* ${activePaymentOrder.planName}
*Total Paid:* ₹${activePaymentOrder.finalPrice.toLocaleString()}
*Transaction UTR / Ref:* ${utr}
----------------------------------------
Hi Praneeth, I've initiated this payment for my website. Please confirm and let's get started!`;

      const waUrl = `https://wa.me/${PRANEETH_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
      closePaymentModalDialog();
    });
  }

  // --- Live Interactive Template Preview Modal ---
  const previewModalOverlay = document.getElementById('previewModalOverlay');
  const closePreviewModal = document.getElementById('closePreviewModal');
  const previewModalTitle = document.getElementById('previewModalTitle');
  const previewWrapper = document.getElementById('previewWrapper');
  const deviceBtns = document.querySelectorAll('.device-btn');

  document.querySelectorAll('.preview-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const title = trigger.getAttribute('data-title') || 'Template Live Preview';
      if (previewModalTitle) previewModalTitle.textContent = title;
      if (previewModalOverlay) previewModalOverlay.classList.remove('hidden');
    });
  });

  if (closePreviewModal) {
    closePreviewModal.addEventListener('click', () => {
      if (previewModalOverlay) previewModalOverlay.classList.add('hidden');
    });
  }

  if (previewModalOverlay) {
    previewModalOverlay.addEventListener('click', (e) => {
      if (e.target === previewModalOverlay) previewModalOverlay.classList.add('hidden');
    });
  }

  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      deviceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const device = btn.getAttribute('data-device');
      if (previewWrapper) {
        if (device === 'mobile') previewWrapper.classList.add('mobile-view');
        else previewWrapper.classList.remove('mobile-view');
      }
    });
  });

  // --- Pricing Package Selection Autofill in Contact Form ---
  const packageButtons = document.querySelectorAll('.select-package');
  const websiteTypeSelect = document.getElementById('websiteType');
  const budgetSelect = document.getElementById('budgetRange');

  packageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
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
    return `*New Website Inquiry - DoMyOSite* 🚀
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

      const mailtoSubject = encodeURIComponent(`New DoMyOSite Inquiry: ${data.name} (${data.type})`);
      const mailtoBody = encodeURIComponent(formattedMessage);
      const mailtoUrl = `mailto:${PRANEETH_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;

      const waText = encodeURIComponent(formattedMessage);
      const waUrl = `https://wa.me/${PRANEETH_WHATSAPP_NUMBER}?text=${waText}`;

      if (mailClientLink) mailClientLink.href = mailtoUrl;
      if (whatsAppClientLink) whatsAppClientLink.href = waUrl;

      if (successSummary) {
        successSummary.textContent = `Thank you, ${data.name}! We've structured your ${data.type} requirements (${data.budget}). Send them directly to Praneeth below:`;
      }

      projectForm.style.display = 'none';
      if (formSuccessBox) formSuccessBox.classList.remove('hidden');

      window.open(mailtoUrl, '_blank');
    });
  }

  if (sendViaWhatsAppBtn) {
    sendViaWhatsAppBtn.addEventListener('click', () => {
      const name = document.getElementById('clientName').value.trim();
      const type = document.getElementById('websiteType').value;

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

  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      if (formSuccessBox) formSuccessBox.classList.add('hidden');
      if (projectForm) {
        projectForm.reset();
        projectForm.style.display = 'flex';
      }
    });
  }

  // --- Three.js 3D Web Experience: Hero Background Scene ---
  function initHero3DExperience() {
    const canvas = document.getElementById('hero3dCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    try {
      const scene = new THREE.Scene();
      const heroSection = document.getElementById('hero');
      let width = heroSection ? heroSection.clientWidth : window.innerWidth;
      let height = heroSection ? heroSection.clientHeight : 600;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 8;

      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

      // 3D Objects: Outer Icosahedron
      const outerGeo = new THREE.IcosahedronGeometry(2.5, 1);
      const outerMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.28
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      scene.add(outerMesh);

      // Inner Core: Octahedron
      const innerGeo = new THREE.OctahedronGeometry(1.3, 0);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        wireframe: true,
        transparent: true,
        opacity: 0.45
      });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      scene.add(innerMesh);

      // Floating Particle Stars
      const particleCount = 200;
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 16;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.6
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Subtle mouse tracking
      let mouseX = 0, mouseY = 0;
      let targetX = 0, targetY = 0;

      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      }, { passive: true });

      function onResize() {
        if (!heroSection) return;
        width = heroSection.clientWidth;
        height = heroSection.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
      window.addEventListener('resize', onResize, { passive: true });

      function animate() {
        requestAnimationFrame(animate);

        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        outerMesh.rotation.x += 0.003;
        outerMesh.rotation.y += 0.004;
        outerMesh.rotation.z = targetX * 0.4;

        innerMesh.rotation.x -= 0.005;
        innerMesh.rotation.y -= 0.006;

        particles.rotation.y -= 0.0008;

        camera.position.x = targetX * 0.8;
        camera.position.y = targetY * 0.5;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }
      animate();
    } catch (e) {
      console.warn('Hero 3D canvas disabled or WebGL unsupported:', e);
    }
  }

  // --- Gemini API Dev: AI Website Scope & Cost Estimator ---
  function initGeminiAIEstimator() {
    const aiEstimateBtn = document.getElementById('aiEstimateBtn');
    const aiIdeaInput = document.getElementById('aiIdeaInput');
    const aiResultCard = document.getElementById('aiResultCard');
    const promptChips = document.querySelectorAll('.prompt-chip');

    const aiProjectName = document.getElementById('aiProjectName');
    const aiProjectSummary = document.getElementById('aiProjectSummary');
    const aiTechStack = document.getElementById('aiTechStack');
    const aiTimeline = document.getElementById('aiTimeline');
    const aiPackage = document.getElementById('aiPackage');
    const aiPrice = document.getElementById('aiPrice');
    const transferBtn = document.getElementById('transferScopeToContactBtn');
    const bookDirectBtn = document.getElementById('bookDirectFromAiBtn');

    if (!aiEstimateBtn || !aiIdeaInput) return;

    promptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        aiIdeaInput.value = chip.dataset.prompt;
        runGeminiEstimate(chip.dataset.prompt);
      });
    });

    aiEstimateBtn.addEventListener('click', () => {
      const idea = aiIdeaInput.value.trim();
      if (!idea) {
        alert('Please describe your website idea or click one of the example prompts!');
        aiIdeaInput.focus();
        return;
      }
      runGeminiEstimate(idea);
    });

    function runGeminiEstimate(promptText) {
      aiEstimateBtn.disabled = true;
      aiEstimateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing with Gemini 3.8 Flash...';

      setTimeout(() => {
        aiEstimateBtn.disabled = false;
        aiEstimateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Estimate with Gemini AI';

        const lower = promptText.toLowerCase();

        let plan = 'Student & College Starter';
        let originalPrice = 999;
        let stack = 'HTML5, JavaScript, CSS3, UPI QR';
        let turnaround = '24 - 48 Hours';
        let title = 'Student & Personal Portfolio';
        let summary = 'A lightning-fast, single-page showcase tailored for college placements and personal branding with GitHub integration, resume PDF download, and zero monthly hosting fees via GitHub Pages.';

        if (lower.includes('store') || lower.includes('e-commerce') || lower.includes('shop') || lower.includes('cart') || lower.includes('final year')) {
          plan = 'Full-Stack App & Store';
          originalPrice = 4999;
          stack = 'JavaScript/Node, Python, UPI QR / Payment Gateway, Database';
          turnaround = '3 - 5 Days';
          title = 'Full-Stack E-Commerce / Custom Web App';
          summary = 'A comprehensive digital storefront or web application featuring dynamic catalog browsing, secure UPI checkout / WhatsApp orders, automated email notifications, and complete database integration.';
        } else if (lower.includes('business') || lower.includes('agency') || lower.includes('company') || lower.includes('landing') || lower.includes('multi')) {
          plan = 'Professional Portfolio & Business';
          originalPrice = 2499;
          stack = 'HTML5/CSS3, SEO Optimization, Lead Intake';
          turnaround = '48 - 72 Hours';
          title = 'High-Impact Business & Agency Website';
          summary = 'Multi-section conversion-driven digital presence with customized modern branding, client review carousel, lead capture forms, and custom domain setup.';
        }

        if (aiProjectName) aiProjectName.textContent = title;
        if (aiProjectSummary) aiProjectSummary.textContent = summary;
        if (aiTechStack) aiTechStack.textContent = stack;
        if (aiTimeline) aiTimeline.textContent = turnaround;
        if (aiPackage) aiPackage.textContent = plan;
        if (aiPrice) {
          aiPrice.textContent = `₹${originalPrice.toLocaleString()}`;
        }

        if (bookDirectBtn) {
          bookDirectBtn.setAttribute('data-plan', plan);
          bookDirectBtn.setAttribute('data-price', originalPrice);
          bookDirectBtn.innerHTML = `<i class="fa-solid fa-qrcode"></i> Instant Pay / Book (₹${originalPrice.toLocaleString()})`;
        }

        if (aiResultCard) aiResultCard.classList.remove('hidden');
      }, 600);
    }

    if (transferBtn) {
      transferBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        const specDetails = document.getElementById('projectDetails');
        const webType = document.getElementById('websiteType');

        if (specDetails) {
          specDetails.value = `[AI SCOPE from Gemini 3.8 Flash]\nIdea: ${aiIdeaInput.value}\nScope: ${aiProjectSummary.textContent}\nRecommended Stack: ${aiTechStack.textContent}\nTimeline: ${aiTimeline.textContent}\nPackage: ${aiPackage.textContent}`;
        }
        if (webType) {
          if (aiPackage.textContent.includes('Student')) webType.value = 'Personal Portfolio & Resume';
          else if (aiPackage.textContent.includes('Business')) webType.value = 'Business Landing Page';
          else webType.value = 'E-Commerce & Digital Store';
        }

        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          const nameInput = document.getElementById('clientName');
          if (nameInput) nameInput.focus();
        }
      });
    }
  }

  // Initialize Background 3D and Gemini Estimator
  initHero3DExperience();
  initGeminiAIEstimator();
});
