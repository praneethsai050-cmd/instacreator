/**
 * DOMYOSITE - WEB STUDIO BY PRANEETH SAI
 * Interactive Core: Google Auth, @juitsolan.in Campus Discount, UPI Pay Layout & Previews
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
  const PRIMARY_UPI_ID = '8777679256@okaxis';
  const JUIT_DISCOUNT_PERCENT = 25; // 25% Flat Discount for JUIT Waknaghat students

  // --- State Management ---
  let currentUser = JSON.parse(localStorage.getItem('domyosite_user')) || null;
  let activePaymentOrder = {
    planName: 'Student & College Starter',
    basePrice: 999,
    finalPrice: 999,
    isJuitDiscount: false
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

  // --- JUIT Solan Promo Banner & Claim Button ---
  const juitBanner = document.getElementById('juitBanner');
  const closeJuitBanner = document.getElementById('closeJuitBanner');
  const juitClaimBtn = document.getElementById('juitClaimBtn');

  if (closeJuitBanner && juitBanner) {
    closeJuitBanner.addEventListener('click', () => {
      juitBanner.classList.add('hidden');
    });
  }

  // --- Google Authentication & JUIT Campus Discount System ---
  const loginBtn = document.getElementById('loginBtn');
  const signOutBtn = document.getElementById('signOutBtn');
  const authModalOverlay = document.getElementById('authModalOverlay');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const demoJuitLoginBtn = document.getElementById('demoJuitLoginBtn');
  const submitEmailAuthBtn = document.getElementById('submitEmailAuthBtn');
  const authEmailInput = document.getElementById('authEmailInput');

  const userProfilePill = document.getElementById('userProfilePill');
  const navUserName = document.getElementById('navUserName');
  const navUserAvatar = document.getElementById('navUserAvatar');
  const navJuitBadge = document.getElementById('navJuitBadge');

  const googleQuickLoginBtn = document.getElementById('googleQuickLoginBtn');
  const continueAsGuestBtn = document.getElementById('continueAsGuestBtn');

  function openAuthModal() {
    if (authModalOverlay) authModalOverlay.classList.remove('hidden');
  }

  function closeAuthModalDialog() {
    if (authModalOverlay) authModalOverlay.classList.add('hidden');
  }

  if (loginBtn) loginBtn.addEventListener('click', openAuthModal);
  if (juitClaimBtn) juitClaimBtn.addEventListener('click', openAuthModal);
  if (closeAuthModal) closeAuthModal.addEventListener('click', closeAuthModalDialog);

  if (continueAsGuestBtn) {
    continueAsGuestBtn.addEventListener('click', () => {
      sessionStorage.setItem('domyosite_guest_dismissed', 'true');
      closeAuthModalDialog();
    });
  }

  if (authModalOverlay) {
    authModalOverlay.addEventListener('click', (e) => {
      if (e.target === authModalOverlay) closeAuthModalDialog();
    });
  }

  // Google Quick Sign-In Handler
  if (googleQuickLoginBtn) {
    googleQuickLoginBtn.addEventListener('click', () => {
      // If user clicks Google login, prompt for email with suggestion
      const promptEmail = prompt("Sign In with Google Account:\nEnter your email (e.g. rahul@juitsolan.in for 25% discount, or @gmail.com):", "rahul@juitsolan.in");
      if (promptEmail && promptEmail.trim()) {
        const email = promptEmail.trim();
        const name = email.split('@')[0];
        applyUserSession({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          email: email
        });
      }
    });
  }

  // Automatically present the enhanced login gate first for new visitors
  if (!currentUser && sessionStorage.getItem('domyosite_guest_dismissed') !== 'true') {
    setTimeout(() => {
      openAuthModal();
    }, 350);
  }

  function applyUserSession(user) {
    currentUser = user;
    localStorage.setItem('domyosite_user', JSON.stringify(user));

    if (loginBtn) loginBtn.style.display = 'none';
    if (userProfilePill) userProfilePill.classList.remove('hidden');

    if (navUserName) navUserName.textContent = user.name.split(' ')[0];
    if (navUserAvatar) navUserAvatar.textContent = user.name.charAt(0).toUpperCase();

    // Check if user has a verified JUIT Solan email
    const isJuit = user.email.toLowerCase().endsWith('@juitsolan.in');
    currentUser.isJuit = isJuit;

    if (isJuit) {
      if (navJuitBadge) navJuitBadge.classList.remove('hidden');
      applyJuitPricingDiscount(true);
      // Pre-fill email in contact form
      const emailInput = document.getElementById('clientEmail');
      if (emailInput) emailInput.value = user.email;

      showJuitCelebrationToast(user.name);
    } else {
      if (navJuitBadge) navJuitBadge.classList.add('hidden');
      applyJuitPricingDiscount(false);
    }

    closeAuthModalDialog();
  }

  function applyJuitPricingDiscount(enable) {
    const plans = [
      { cardId: 'planCard1', original: 999, savingsId: 'savings1', discounted: 749 },
      { cardId: 'planCard2', original: 2499, savingsId: 'savings2', discounted: 1874 },
      { cardId: 'planCard3', original: 4999, savingsId: 'savings3', discounted: 3749 }
    ];

    plans.forEach(plan => {
      const card = document.getElementById(plan.cardId);
      const savings = document.getElementById(plan.savingsId);
      if (card) {
        const valSpan = card.querySelector('.price-value');
        const payBtn = card.querySelector('.open-pay-trigger');
        if (enable) {
          if (valSpan) valSpan.innerHTML = `<del style="font-size:1.6rem; opacity:0.5;">₹${plan.original.toLocaleString()}</del> ₹${plan.discounted.toLocaleString()}`;
          if (savings) savings.classList.remove('hidden');
          if (payBtn) {
            payBtn.setAttribute('data-price', plan.discounted);
            payBtn.innerHTML = `<i class="fa-solid fa-qrcode"></i> Book with JUIT 25% Off (₹${plan.discounted.toLocaleString()})`;
          }
        } else {
          if (valSpan) valSpan.textContent = plan.original.toLocaleString();
          if (savings) savings.classList.add('hidden');
          if (payBtn) {
            payBtn.setAttribute('data-price', plan.original);
            payBtn.innerHTML = `<i class="fa-solid fa-qrcode"></i> Instant Pay / Book (₹${plan.original.toLocaleString()})`;
          }
        }
      }
    });

    // Update Bento highlight tag
    const bentoPricePill = document.querySelector('.juit-calc-badge');
    if (bentoPricePill) {
      if (enable) bentoPricePill.classList.remove('hidden');
      else bentoPricePill.classList.add('hidden');
    }
  }

  function showJuitCelebrationToast(name) {
    const bannerText = document.querySelector('.juit-banner-text');
    if (bannerText) {
      bannerText.innerHTML = `<span class="juit-tag">🎉 Verified JUITian</span> <span>Welcome <strong>${name}</strong>! Flat 25% campus discount has been applied to all packages!</span>`;
      const claimBtn = document.getElementById('juitClaimBtn');
      if (claimBtn) claimBtn.style.display = 'none';
    }
  }

  // Quick 1-Click Demo Login for JUIT Solan ID
  if (demoJuitLoginBtn) {
    demoJuitLoginBtn.addEventListener('click', () => {
      applyUserSession({
        name: 'Praneeth (JUITian)',
        email: 'praneeth@juitsolan.in',
        isJuit: true
      });
    });
  }

  // Custom email login handler
  if (submitEmailAuthBtn && authEmailInput) {
    submitEmailAuthBtn.addEventListener('click', () => {
      const email = authEmailInput.value.trim();
      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      const name = email.split('@')[0];
      applyUserSession({ name, email });
    });
  }

  // Sign out handler
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      currentUser = null;
      localStorage.removeItem('domyosite_user');
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (userProfilePill) userProfilePill.classList.add('hidden');
      applyJuitPricingDiscount(false);
      alert('Signed out successfully.');
    });
  }

  // Check saved session on startup
  if (currentUser) {
    applyUserSession(currentUser);
  }

  // --- Interactive Pay Layout & Checkout Modal ---
  const paymentModalOverlay = document.getElementById('paymentModalOverlay');
  const closePaymentModal = document.getElementById('closePaymentModal');
  const payPlanName = document.getElementById('payPlanName');
  const payOriginalPrice = document.getElementById('payOriginalPrice');
  const payDiscountRow = document.getElementById('payDiscountRow');
  const payDiscountAmount = document.getElementById('payDiscountAmount');
  const payFinalTotal = document.getElementById('payFinalTotal');
  const dynamicUpiQr = document.getElementById('dynamicUpiQr');
  const gpayDeepLink = document.getElementById('gpayDeepLink');
  const phonepeDeepLink = document.getElementById('phonepeDeepLink');
  const paytmDeepLink = document.getElementById('paytmDeepLink');
  const copyUpiBtn = document.getElementById('copyUpiBtn');
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  const utrRefInput = document.getElementById('utrRefInput');

  function openPaymentModal(planName, price) {
    const basePrice = parseInt(price, 10);
    const isJuit = currentUser && currentUser.isJuit;
    let finalPrice = basePrice;
    let discount = 0;

    if (isJuit) {
      discount = Math.round(basePrice * 0.25);
      finalPrice = basePrice - discount;
    }

    activePaymentOrder = {
      planName,
      basePrice,
      finalPrice,
      isJuitDiscount: isJuit
    };

    if (payPlanName) payPlanName.textContent = planName;
    if (payOriginalPrice) payOriginalPrice.textContent = `₹${basePrice.toLocaleString()}`;

    if (payDiscountRow) {
      if (isJuit) {
        payDiscountRow.classList.remove('hidden');
        if (payDiscountAmount) payDiscountAmount.textContent = `- ₹${discount.toLocaleString()}`;
      } else {
        payDiscountRow.classList.add('hidden');
      }
    }

    if (payFinalTotal) payFinalTotal.textContent = `₹${finalPrice.toLocaleString()}`;

    // Generate Standard UPI String
    const upiUri = `upi://pay?pa=${encodeURIComponent(PRIMARY_UPI_ID)}&pn=${encodeURIComponent('Praneeth Sai (DoMyOSite)')}&am=${finalPrice}&cu=INR&tn=${encodeURIComponent(planName.substring(0, 20))}`;

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
      const clientName = (currentUser ? currentUser.name : 'Valued Client');
      const clientEmail = (currentUser ? currentUser.email : 'Not logged in');

      const msg = `*Payment Confirmation - DoMyOSite* 💳
----------------------------------------
*Client:* ${clientName} (${clientEmail})
*Plan Booked:* ${activePaymentOrder.planName}
*Total Paid:* ₹${activePaymentOrder.finalPrice.toLocaleString()}
*JUIT Discount:* ${activePaymentOrder.isJuitDiscount ? 'Yes (25% Applied)' : 'No'}
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
    const isJuit = (currentUser && currentUser.isJuit) || email.toLowerCase().endsWith('@juitsolan.in');

    return { name, email, phone, type, budget, timeline, details, isJuit };
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
*JUIT Student Discount:* ${data.isJuit ? 'Verified 25% Off Eligible' : 'Standard'}

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
});
