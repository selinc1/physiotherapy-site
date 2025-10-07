// Kullanıcı hangi sayfadaysa (signin.html ya da booking.html), dönüş adresi orası olsun
const ORIGIN = location.origin;
const INDEX_URL = `${ORIGIN}/signin.html`;
const RETURN_URL = `${location.origin}${location.pathname}`;
const AFTER_LOGOUT = `${INDEX_URL}?loggedout=1&nosplash=1&_=${Date.now()}`;

/* ============ 0) CLIENT REVIEWS ============ */
const fakeComments = [
  { name: "Emily R.", text: "My therapist instantly understood where the tension was — magic hands!" },
  { name: "Michael T.", text: "I could finally move my shoulder without pain after just one session." },
  { name: "Sophie L.", text: "He listened carefully and explained every stretch. Super professional!" },
  { name: "Daniel M.", text: "The therapist was kind, focused, and really helped my lower back pain." },
  { name: "Olivia P.", text: "I felt relaxed and energized at the same time. Perfect balance!" },
  { name: "Chris W.", text: "He noticed issues even I didn't realize I had — amazing attention to detail." },
  { name: "Ava G.", text: "So gentle yet effective. My posture already feels better." },
  { name: "Noah B.", text: "I've tried several therapists before, but this one truly stands out." },
  { name: "Liam K.", text: "Professional, respectful, and results you can feel immediately." },
  { name: "Chloe S.", text: "He made me feel totally comfortable and tailored every move to my needs." }
];

function loadReviews() {
  const container = document.getElementById('reviewsContainer');
  console.log('Loading reviews, container found:', !!container);
  if (!container) {
    console.log('Reviews container not found');
    return;
  }
  
  // Shuffle the reviews for variety
  const shuffledReviews = [...fakeComments].sort(() => Math.random() - 0.5);
  
  // Display 6 random reviews
  const reviewsToShow = shuffledReviews.slice(0, 6);
  console.log('Displaying reviews:', reviewsToShow.length);
  
  container.innerHTML = reviewsToShow.map(review => `
    <div class="review-card">
      <div class="review-text">${review.text}</div>
      <div class="review-author">
        <div class="review-author-avatar">${review.name.charAt(0)}</div>
        <div class="review-author-info">
          <div class="review-author-name">${review.name}</div>
          <div class="review-author-title">Client</div>
        </div>
      </div>
    </div>
  `).join('');
}

// Load reviews when DOM is ready
document.addEventListener('DOMContentLoaded', loadReviews);

// Also try to load reviews after a short delay to ensure DOM is ready
setTimeout(loadReviews, 100);

/* ============ GUEST BOOKING ============ */
function initGuestBooking() {
  const showGuestBtn = document.getElementById('showGuestBooking');
  const showRegularBtn = document.getElementById('showRegularBooking');
  const guestSection = document.getElementById('guestBooking');
  const regularForm = document.getElementById('regularBookingForm');
  
  // Check if guest parameter is in URL
  const urlParams = new URLSearchParams(window.location.search);
  const isGuest = urlParams.get('guest') === '1';
  
  if (isGuest && guestSection && regularForm) {
    // Auto-show guest booking if guest=1 in URL
    guestSection.style.display = 'block';
    regularForm.style.display = 'none';
    if (showGuestBtn) showGuestBtn.style.display = 'none';
    if (showRegularBtn) showRegularBtn.style.display = 'inline-block';
  }
  
  if (showGuestBtn && showRegularBtn && guestSection && regularForm) {
    showGuestBtn.addEventListener('click', () => {
      guestSection.style.display = 'block';
      regularForm.style.display = 'none';
      showGuestBtn.style.display = 'none';
      showRegularBtn.style.display = 'inline-block';
    });
    
    showRegularBtn.addEventListener('click', () => {
      guestSection.style.display = 'none';
      regularForm.style.display = 'block';
      showGuestBtn.style.display = 'inline-block';
      showRegularBtn.style.display = 'none';
    });
  }
  
  // Guest booking form submission
  const guestBookBtn = document.getElementById('guestBookBtn');
  if (guestBookBtn) {
    guestBookBtn.addEventListener('click', handleGuestBooking);
  }
}

async function handleGuestBooking() {
  const email = document.getElementById('guestEmail')?.value;
  const name = document.getElementById('guestName')?.value;
  const district = document.getElementById('guestDistrict')?.value;
  const service = document.getElementById('guestService')?.value;
  const date = document.getElementById('guestDate')?.value;
  const time = document.getElementById('guestTime')?.value;
  const notes = document.getElementById('guestNotes')?.value;
  const msgEl = document.getElementById('guestMsg');
  
  if (!email || !name || !district || !service || !date || !time) {
    if (msgEl) {
      msgEl.textContent = 'Please fill in all required fields.';
      msgEl.style.color = 'red';
    }
    return;
  }
  
  if (msgEl) {
    msgEl.textContent = 'Processing your guest booking...';
    msgEl.style.color = 'var(--muted)';
  }
  
  try {
    // 1. Generate booking ID and save to localStorage (temporary solution)
    const bookingId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const bookingData = {
      id: bookingId,
      email: email,
      name: name,
      district: district,
      service: service,
      date: date,
      time: time,
      notes: notes || '',
      is_guest: true,
      status: 'pending_payment',
      created_at: new Date().toISOString()
    };
    
    // Save to localStorage for now
    localStorage.setItem('guest_booking_' + bookingId, JSON.stringify(bookingData));
    
    console.log('Guest booking saved to localStorage:', bookingData);
    
    // 2. Simulate payment success (temporary solution)
    if (msgEl) {
      msgEl.textContent = `Thank you ${name}! Your booking has been confirmed. We've sent details to ${email}.`;
      msgEl.style.color = 'var(--baby-blue)';
    }
    
    // 3. Redirect to success page
    setTimeout(() => {
      window.location.href = `booking-success.html?booking_id=${bookingId}`;
    }, 2000);
    
  } catch (error) {
    console.error('Booking error:', error);
    if (msgEl) {
      msgEl.textContent = 'An error occurred. Please try again.';
      msgEl.style.color = 'red';
    }
  }
}

// Initialize guest booking when DOM is ready
document.addEventListener('DOMContentLoaded', initGuestBooking);


/* ============ BOOKING MODAL ============ */
function initBookingModal() {
  const bookNowBtn = document.getElementById('bookNowBtn');
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('closeModal');
  
  if (bookNowBtn && modal) {
    bookNowBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  }
  
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }
  
  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

// Initialize booking modal when DOM is ready
document.addEventListener('DOMContentLoaded', initBookingModal);

/* ============ TIME SLOTS ============ */
function initTimeSlots() {
  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');
  const guestDateInput = document.getElementById('guestDate');
  const guestTimeSelect = document.getElementById('guestTime');
  
  // Regular booking time slots
  if (dateInput && timeSelect) {
    dateInput.addEventListener('change', () => {
      updateTimeSlots(timeSelect, dateInput.value);
    });
  }
  
  // Guest booking time slots
  if (guestDateInput && guestTimeSelect) {
    guestDateInput.addEventListener('change', () => {
      updateTimeSlots(guestTimeSelect, guestDateInput.value);
    });
  }
}

function updateTimeSlots(timeSelect, selectedDate) {
  if (!timeSelect) return;
  
  // Clear existing options
  timeSelect.innerHTML = '';
  
  if (!selectedDate) {
    timeSelect.innerHTML = '<option value="">Select a date first</option>';
    return;
  }
  
  // Generate time slots (9 AM to 6 PM, every hour)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  
  timeSelect.innerHTML = '<option value="">Select time</option>';
  
  timeSlots.forEach(time => {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    timeSelect.appendChild(option);
  });
}

// Initialize time slots when DOM is ready
document.addEventListener('DOMContentLoaded', initTimeSlots);

/* ============ 0) MOBILE MENU ============ */
function toggleMobileMenu() {
  const nav = document.getElementById('mobile-nav');
  const btn = document.querySelector('.mobile-menu-btn');
  
  if (nav && btn) {
    nav.classList.toggle('show');
    btn.classList.toggle('active');
  }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const nav = document.getElementById('mobile-nav');
  const btn = document.querySelector('.mobile-menu-btn');
  
  if (nav && btn && !nav.contains(event.target) && !btn.contains(event.target)) {
    nav.classList.remove('show');
    btn.classList.remove('active');
  }
});

// Close mobile menu when clicking on a link
document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('#mobile-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const nav = document.getElementById('mobile-nav');
      const btn = document.querySelector('.mobile-menu-btn');
      if (nav && btn) {
        nav.classList.remove('show');
        btn.classList.remove('active');
      }
    });
  });
});

/* ============ 1) SPLASH ============ */
(() => {
  const splash = document.getElementById('splash');
  if (!splash) return;

  const params = new URLSearchParams(location.search);
  const skip = params.has('nosplash'); // ?nosplash ise atla

  if (skip) { document.body.classList.add('no-splash'); return; }

  document.body.classList.remove('no-splash');
  document.body.classList.add('noscroll');

  const hideSplash = () => {
    splash.classList.add('dismissed');                // pointer-events:none
    document.body.classList.remove('noscroll');
    splash.addEventListener('transitionend', () => splash.remove(), { once:true });
  };

  splash.addEventListener('click', hideSplash);
  splash.addEventListener('touchstart', hideSplash, { passive:true });
})();


/* ============ 2) AUTH (Supabase) — BASİT & ÇALIŞAN ============ */
(() => {

  function initAuth() {
    const sb = window.sb;
    if (!sb) { console.error('No Supabase client'); return; }

    // DOM elemanları
    const emailEl   = document.getElementById('auth-email');
    const pwEl      = document.getElementById('auth-pw');
    const signupBtn = document.getElementById('btn-signup');
    const loginBtn  = document.getElementById('btn-login');
    const googleBtn = document.getElementById('btn-google');
    const forgotLnk = document.getElementById('link-forgot');
    const logoutEls = Array.from(document.querySelectorAll('#btn-logout'));
    const msgEl     = document.getElementById('auth-msg');
    const whoamiEl  = document.getElementById('whoami');
    const whoamiSigninEl = document.getElementById('whoami-signin');
    const outView   = document.getElementById('signedOutView');
    const inView    = document.getElementById('signedInView');
    const resetView = document.getElementById('resetView');
    const resetBtn  = document.getElementById('btn-reset');
    const resetPw   = document.getElementById('reset-pw');
    const resetPw2  = document.getElementById('reset-pw2');
    const resetMsg  = document.getElementById('reset-msg');
    let isRecoveryMode = false;

    // Register form elements
    const regName     = document.getElementById('reg-name');
    const regEmail    = document.getElementById('reg-email');
    const regPhone    = document.getElementById('reg-phone');
    const regAddress  = document.getElementById('reg-address');
    const regPassword = document.getElementById('reg-password');
    const regPassword2= document.getElementById('reg-password2');
    const regBtn      = document.getElementById('btn-register');
    const regMsg      = document.getElementById('reg-msg');

    // Kullanıcının rezervasyonlarını (varsa) listele
    async function fetchAndRenderMyBookings(userId){
      const container = document.getElementById('myBookings');
      const mineSection = document.getElementById('mine');
      if (!container) return;
      
      // Show the "Your Bookings" section
      if (mineSection) {
        mineSection.classList.add('show');
      }
      
      container.textContent = 'Loading your bookings…';
      const { data, error } = await sb
        .from('bookings')
        .select('id, date, time, service_minutes, district, notes')
        .eq('user_id', userId)
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      if (error){
        console.error('[myBookings] fetch error', error);
        container.textContent = 'Could not load your bookings.';
        return;
      }
      if (!data || data.length === 0){
        container.textContent = 'You have no bookings yet.';
        return;
      }
      const list = document.createElement('ul');
      data.forEach(b => {
        const li = document.createElement('li');
        const parts = [
          `${b.date} ${b.time}`,
          `${b.service_minutes} min`,
          b.district ? `(${b.district})` : ''
        ].filter(Boolean).join(' ');
        li.textContent = parts;
        list.appendChild(li);
      });
      container.innerHTML = '';
      container.appendChild(list);
    }
    
    // Hide "Your Bookings" section when user is not logged in
    function hideMyBookings() {
      const mineSection = document.getElementById('mine');
      if (mineSection) {
        mineSection.classList.remove('show');
      }
    }
    // ---- Tek noktadan görünüm değiştir
    function showSignedIn(isIn){
      if (isRecoveryMode){
        if (outView) outView.style.setProperty('display','none','important');
        if (inView) inView.style.setProperty('display','none','important');
        if (resetView) resetView.style.setProperty('display','block','important');
        return;
      }
      if (outView) outView.style.setProperty('display', isIn ? 'none' : 'block', 'important');
      if (inView) inView.style.setProperty('display', isIn ? 'block' : 'none', 'important');
      if (resetView) resetView.style.setProperty('display', 'none', 'important');
    }

    // ---- UI güncelle
    async function refreshAuthUI(){
      console.log('refreshAuthUI called');
      const { data: { user } } = await sb.auth.getUser();
      console.log('User:', user);
      if (user){
        showSignedIn(true);
        // Show user's full name from metadata, fallback to email
        const displayName = user.user_metadata?.full_name || user.email || user.id;
        if (whoamiEl) whoamiEl.textContent = displayName;
        if (whoamiSigninEl) whoamiSigninEl.textContent = displayName;
        logoutEls.forEach(el => el.style.setProperty('display','inline-block','important'));
        fetchAndRenderMyBookings(user.id).catch(console.warn);
      } else {
        showSignedIn(false);
        if (whoamiEl) whoamiEl.textContent = '—';
        if (whoamiSigninEl) whoamiSigninEl.textContent = '—';
        logoutEls.forEach(el => el.style.setProperty('display','none','important'));
        hideMyBookings(); // Hide "Your Bookings" section when not logged in
      }
    }
	

    // --- SIGN UP ---
    signupBtn?.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!emailEl?.value || !pwEl?.value){ if (msgEl) msgEl.textContent = 'Enter email & password.'; return; }
      msgEl && (msgEl.textContent = 'Signing up…');
      const { error } = await sb.auth.signUp({ email: emailEl.value.trim(), password: pwEl.value });
      msgEl && (msgEl.textContent = error ? error.message : 'Check your email to confirm.');
    });

    // --- LOGIN ---
    loginBtn?.addEventListener('click', async (e) => {
      e.preventDefault();
      console.log('[login] click'); // teşhis
      if (!emailEl?.value || !pwEl?.value){ if (msgEl) msgEl.textContent = 'Enter email & password.'; return; }
      msgEl && (msgEl.textContent = 'Signing in…');
      const { error } = await sb.auth.signInWithPassword({ email: emailEl.value.trim(), password: pwEl.value });
      if (error){ msgEl && (msgEl.textContent = error.message); }
      else { msgEl && (msgEl.textContent = 'Signed in.'); await refreshAuthUI(); }
    });

	// buton handler
	googleBtn?.addEventListener('click', async (e) => {
	  e.preventDefault();
	  msgEl && (msgEl.textContent = 'Redirecting to Google…');
	  const RETURN_URL = `${location.origin}${location.pathname}`; // bulunduğun sayfaya geri dön
	  const { error } = await sb.auth.signInWithOAuth({
	    provider: 'google',
	    options: { redirectTo: RETURN_URL } // BUNUN Supabase Redirect URLs listesinde birebir olmasına dikkat et
	  });
	  if (error) msgEl && (msgEl.textContent = error.message);
	});


    // --- FORGOT PASSWORD ---
    forgotLnk?.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = (emailEl?.value || '').trim();
      if (!email){ if (msgEl) msgEl.textContent = 'Enter your email first.'; return; }
      if (msgEl) msgEl.textContent = 'Sending reset link…';
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: RETURN_URL
      });
      if (error){ if (msgEl) msgEl.textContent = error.message; }
      else { if (msgEl) msgEl.textContent = 'Check your email for reset link.'; }
    });

    // --- Handle recovery link landing ---
    (async () => {
      const params = new URLSearchParams(location.hash.slice(1) || location.search.slice(1));
      const type = params.get('type');
      if (type === 'recovery' || type === 'password_reset'){
        // Show reset form
        isRecoveryMode = true;
        if (outView) outView.style.setProperty('display','none','important');
        if (inView) inView.style.setProperty('display','none','important');
        if (resetView) resetView.style.setProperty('display','block','important');
      }
    })();

    // --- Submit new password ---
    resetBtn?.addEventListener('click', async () => {
      const p1 = resetPw?.value || '';
      const p2 = resetPw2?.value || '';
      if (!p1 || p1.length < 6){ if (resetMsg) resetMsg.textContent = 'Password must be at least 6 characters.'; return; }
      if (p1 !== p2){ if (resetMsg) resetMsg.textContent = 'Passwords do not match.'; return; }
      if (resetMsg) resetMsg.textContent = 'Updating password…';
      const { error } = await sb.auth.updateUser({ password: p1 });
      if (error){ if (resetMsg) resetMsg.textContent = error.message; return; }
      if (resetMsg) resetMsg.textContent = 'Password updated. You can now sign in.';
      isRecoveryMode = false;
      if (outView) outView.style.setProperty('display','block','important');
      if (resetView) resetView.style.setProperty('display','none','important');
    });

    // --- REGISTER ---
    regBtn?.addEventListener('click', async () => {
      const name = (regName?.value || '').trim();
      const email = (regEmail?.value || '').trim();
      const phone = (regPhone?.value || '').trim();
      const address = (regAddress?.value || '').trim();
      const password = regPassword?.value || '';
      const password2 = regPassword2?.value || '';

      if (!name || !email || !password) {
        if (regMsg) regMsg.textContent = 'Please fill in all required fields.';
        return;
      }
      if (password.length < 6) {
        if (regMsg) regMsg.textContent = 'Password must be at least 6 characters.';
        return;
      }
      if (password !== password2) {
        if (regMsg) regMsg.textContent = 'Passwords do not match.';
        return;
      }

      if (regMsg) regMsg.textContent = 'Checking email...';
      
      // First check if email already exists by trying to sign in
      const { error: checkError } = await sb.auth.signInWithPassword({
        email,
        password: 'dummy_check'
      });
      
      // If no error or error is not "Invalid login credentials", email exists
      if (!checkError || (checkError && !checkError.message.includes('Invalid login credentials'))) {
        if (regMsg) regMsg.textContent = 'This email is already registered. Please sign in instead.';
        return;
      }

      if (regMsg) regMsg.textContent = 'Creating account...';
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
            address: address
          }
        }
      });

      if (authError) {
        if (regMsg) {
          console.log('Auth error:', authError);
          if (authError.message.includes('already registered') || 
              authError.message.includes('already exists') ||
              authError.message.includes('User already registered')) {
            regMsg.textContent = 'This email is already registered. Please sign in instead.';
          } else {
            regMsg.textContent = authError.message;
          }
        }
        return;
      }

      if (regMsg) regMsg.textContent = 'Account created! Please check your email to confirm.';
      
      // Clear form
      if (regName) regName.value = '';
      if (regEmail) regEmail.value = '';
      if (regPhone) regPhone.value = '';
      if (regAddress) regAddress.value = '';
      if (regPassword) regPassword.value = '';
      if (regPassword2) regPassword2.value = '';
    });

	
	// --- LOGOUT --- tüm olası buton/anchor'lara bağla
	logoutEls.forEach((el) => {
	  el.addEventListener('click', async (e) => {
	    e.preventDefault();
	    try {
	      await sb.auth.signOut({ scope: 'global' });
	    } catch (err) {
	      console.warn('signOut error:', err);
	    } finally {
	      location.replace(AFTER_LOGOUT);
	      setTimeout(() => (location.href = AFTER_LOGOUT), 50);
	    }
	  });
	});
	// Başlangıç + auth olaylarında UI güncelle (tek merkez)
	refreshAuthUI();
	sb.auth.onAuthStateChange((event) => {
	  if (event === 'SIGNED_OUT') {
	    location.replace(AFTER_LOGOUT);
	    setTimeout(() => (location.href = AFTER_LOGOUT), 50);
	    return;
	  }
	  if (!isRecoveryMode) refreshAuthUI();
	});

  
  }

  // DOM hazırsa hemen, değilse bekle
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
	


/* ============ 3) BOOKING (yalnızca booking.html’de çalışır) ============ */
(() => {
  const sb = window.sb;
  if (!sb) return;

  // ---- DOM
  const serviceEl  = document.getElementById('service');   // <select id="service"> (30/60/90 gibi dakika)
  const timeEl     = document.getElementById('time');      // <select id="time">
  const dateEl     = document.getElementById('date');      // <input type="date" id="date">
  const districtEl = document.getElementById('district');  // <select id="district"> (opsiyonel)
  const msgEl      = document.getElementById('msg');       // <p id="msg">
  const bookBtn    = document.getElementById('bookBtn');   // <button id="bookBtn" type="button">
  if (!serviceEl || !timeEl || !dateEl || !bookBtn) {
    console.warn('[booking] UI elements missing');
    return;
  }

  // ---- Ayarlar
  const availability = {
    allowedWeekdays: [1,2,3,4,5],  // 1=Mon ... 5=Fri
    closedDates: [],
    bookedSlots: {},               // örn: {"2025-09-05": ["10:00","10:30"]}
    dayStartMin: 10 * 60,
    dayEndMin:   17 * 60,
    lunchStart:  13 * 60,
    lunchEnd:    14 * 60
  };

  // ---- Yardımcılar
  const isoToday = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${day}`;
  };

  // ISO tarihi local olarak güvenle oluştur (TZ hatasını önler)
  function dateFromISO(iso) {
    const [y,m,d] = iso.split('-').map(Number);
    return new Date(y, m-1, d);
  }

  const getWeekday = (iso) => dateFromISO(iso).getDay(); // 0=Sun...6=Sat
  const isClosedDate = (iso) => availability.closedDates.includes(iso);
  const isAllowedWeekday = (iso) => {
    const wd = getWeekday(iso);
    return availability.allowedWeekdays.includes(wd);
  };

  dateEl.min = isoToday();

  function makeTimes(stepMinutes = 30){
    const slots=[], start=availability.dayStartMin, end=availability.dayEndMin;
    for(let m=start; m<end; m+=stepMinutes){
      if (m>=availability.lunchStart && m<availability.lunchEnd) continue;
      const hh = String(Math.floor(m/60)).padStart(2,'0');
      const mm = String(m%60).padStart(2,'0');
      slots.push(`${hh}:${mm}`);
    }
    return slots;
  }

  function disableTimes(msg){
    timeEl.innerHTML = '';
    timeEl.appendChild(new Option(msg, ''));
    timeEl.disabled = true;
    bookBtn.setAttribute('disabled','disabled');
  }

  function fillTimes(){
    msgEl && (msgEl.textContent = '');
    const date = dateEl.value;

    if (!date) { disableTimes('Select a date first'); return; }
    if (date < isoToday()){ disableTimes('Past date not allowed'); return; }
    if (!isAllowedWeekday(date)){ disableTimes('No availability on this weekday'); return; }
    if (isClosedDate(date)){ disableTimes('Closed on this date'); return; }

    const step = Number(serviceEl.value);
    const stepMinutes = Number.isFinite(step) && step > 0 ? step : 30;

    const all = makeTimes(stepMinutes);
    const taken = availability.bookedSlots[date] || [];
    const free = all.filter(t => !taken.includes(t));

    timeEl.innerHTML = '';
    if (free.length === 0){
      disableTimes('No available times');
      return;
    }

    free.forEach(t => timeEl.appendChild(new Option(t, t)));
    timeEl.disabled = false;
    bookBtn.removeAttribute('disabled');
  }

  // ilk durum – mevcut tarih doluysa slotları hemen üret
  if (dateEl.value) { fillTimes(); }
  else { disableTimes('Select a date first'); }

  // değişiklikleri izle
  serviceEl.addEventListener('change', fillTimes);
  dateEl.addEventListener('change', fillTimes);
  timeEl.addEventListener('focus', fillTimes);
  timeEl.addEventListener('click', fillTimes);
  districtEl?.addEventListener('input', fillTimes);
  
  
  const PAYMENT_LINK_URL30 = "https://book.stripe.com/test_dRm4gAe5N1exfF9cwYdfG00";
  const PAYMENT_LINK_URL60 = "https://buy.stripe.com/test_3cI28sbXFcXf2Sn2WodfG01";


  // ---- Book click
  bookBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const { data: { user } } = await sb.auth.getUser();
    if (!user) { 
      msgEl && (msgEl.textContent = 'Please log in before booking.'); 
      return; 
    }

    if (!dateEl.value || !timeEl.value) {
      msgEl && (msgEl.textContent = 'Select date and time.'); 
      return; 
    }

    const service  = Number(serviceEl.value) || 30;
    const district = districtEl?.value || '';
    const date     = dateEl.value;
    const time     = timeEl.value;
    const notes    = document.getElementById('notes')?.value || null;

    msgEl && (msgEl.textContent = 'Saving...');
    const { data: inserted, error } = await sb
      .from('bookings')
      .insert([{ 
        user_id: user.id, 
		user_email: user.email, 
        service_minutes: service, 
        district, 
        date, 
        time, 
        notes
      }])
      .select('id')
      .single();

    if (error) {
      console.error(error);
      msgEl && (msgEl.textContent = 'Could not save booking.');
      return;
    }

    // slotu local olarak da kapat
    availability.bookedSlots[date] = (availability.bookedSlots[date] || []).concat(time);
    fillTimes();

    msgEl && (msgEl.textContent = 'Booking saved. Redirecting to payment...');

    // ödeme linkine yönlendir
    if (inserted?.id) {
      try { localStorage.setItem('last_booking_id', String(inserted.id)); } catch {}
    }
    if (service === 30) {
      window.location.href = PAYMENT_LINK_URL30;
    } else if (service === 60) {
      window.location.href = PAYMENT_LINK_URL60;
    } else {
      msgEl && (msgEl.textContent = 'No payment link defined for this service.');
    }
  });

	
			
			

})();
