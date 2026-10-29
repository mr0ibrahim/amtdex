/**
 * AMTDEX Interactive Frontend Logic
 * Standalone JavaScript decoupled from Backend
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyNavbar();
  initMobileNav();
  initFaqAccordions();
  initChatWidget();
  initWhatsAppTrigger();
  initCalculator();
  initTabs();
  initToast();
  initActiveLinks();
  initInteractiveCards();
});

function initMobileNav() {
  // The exported dashboard has no collapsed link group; its sidebar stays visible.
  document.querySelectorAll('[data-pencil-name="Sidebar"] .amtdex-nav-toggle').forEach(button => button.remove());
  const navs = document.querySelectorAll('[data-pencil-name$="Page"] > [data-pencil-name="Nav"]');
  navs.forEach((nav, index) => {
    const links = nav.querySelector('[data-pencil-name="Links"]');
    let btn = nav.querySelector('.amtdex-nav-toggle');
    if (!links) { btn?.remove(); return; }
    btn ||= document.createElement('button');
    btn.className = 'amtdex-nav-toggle';
    btn.type = 'button';
    btn.removeAttribute('onclick');
    btn.setAttribute('aria-label', 'فتح القائمة');
    btn.setAttribute('aria-expanded', 'false');
    links.id ||= `amtdex-menu-${index}`;
    btn.setAttribute('aria-controls', links.id);
    btn.innerHTML = '<span></span>';
    const setOpen = open => {
      nav.classList.toggle('nav-open', open);
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
    };
    btn.addEventListener('click', () => setOpen(!nav.classList.contains('nav-open')));
    nav.appendChild(btn);
    nav.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('nav-open')) {
        setOpen(false);
        btn.focus();
      }
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', event => {
      if (!nav.contains(event.target)) setOpen(false);
    });
    matchMedia('(min-width: 768px)').addEventListener('change', () => setOpen(false));
  });
}

window.toggleMobileNav = function() {
  const nav = document.querySelector('[data-pencil-name="Nav"]');
  const btn = document.querySelector('.amtdex-nav-toggle');
  if (nav) {
    const open = nav.classList.toggle('nav-open');
    if (btn) {
      btn.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    }
  }
};

// 1. Sticky Glass Navbar scroll effect
function initStickyNavbar() {
  const navbars = document.querySelectorAll('[data-pencil-name="Nav"]');
  window.addEventListener('scroll', () => {
    navbars.forEach(nav => {
      if (window.scrollY > 20) {
        nav.classList.add('glass-nav', 'scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  });
}

// 2. Interactive FAQ Accordion
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('[data-pencil-name="FAQ Item"], [data-pencil-name="Item"]');
  faqItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const answer = item.querySelector('[data-pencil-name="Answer"], [data-pencil-name="A"]');
      if (answer) {
        const isHidden = answer.style.display === 'none';
        answer.style.display = isHidden ? 'block' : 'none';
        item.classList.toggle('faq-expanded', isHidden);
      }
    });
  });
}

// 3. Floating Chat Widget
function initChatWidget() {
  const chatButtons = document.querySelectorAll('[data-pencil-name="Chat Widget"], [data-pencil-name="Help CTA"]');
  chatButtons.forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('جاري فتح المحادثة المباشرة مع خدمة العملاء...');
    });
  });
}

// 4. WhatsApp Direct Link
function initWhatsAppTrigger() {
  const waButtons = document.querySelectorAll('[data-pencil-name="WhatsApp"]');
  waButtons.forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://wa.me/966500000000?text=' + encodeURIComponent('مرحباً، أود الاستفسار عن خدمات AMTDEX'), '_blank');
    });
  });
}

// 5. Interactive Pricing Calculator (if present)
function initCalculator() {
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
      const display = document.querySelector('[data-pencil-name="Calculated Price"], [data-pencil-name="Total"]');
      if (display) {
        const val = parseInt(e.target.value, 10);
        display.textContent = `$${(val * 150).toLocaleString()}`;
      }
    });
  });
}

// 6. Project & Service Filter Tabs
function initTabs() {
  const tabButtons = document.querySelectorAll('[data-pencil-name="Tab"], [data-pencil-name="Filter"]');
  tabButtons.forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active-tab'));
      btn.classList.add('active-tab');
      showToast(`تمت تصفية النتائج: ${btn.textContent.trim()}`);
    });
  });
}

// 7. Toast Notification Utility
function initToast() {
  if (!document.getElementById('amtdex-toast')) {
    const toast = document.createElement('div');
    toast.id = 'amtdex-toast';
    toast.className = 'amtdex-toast';
    document.body.appendChild(toast);
  }
}

window.showToast = function(message, duration = 3000) {
  const toast = document.getElementById('amtdex-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
};

// 8. Dynamic Navigation Routing & Active Links
function initActiveLinks() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('[data-site-header] a[href]').forEach(link => {
    const target = new URL(link.href);
    const targetPath = target.pathname.replace(/\/$/, '') || '/';
    if (!target.hash && targetPath === currentPath) link.setAttribute('aria-current', 'page');
  });
  const links = document.querySelectorAll('a, [data-pencil-name="Nav Link"], [data-pencil-name="المنتج"], [data-pencil-name="الخدمات"], [data-pencil-name="المشاريع"], [data-pencil-name="تواصل معنا"]');
  const path = window.location.pathname;

  links.forEach(link => {
    link.style.cursor = 'pointer';
    const text = link.textContent.trim();
    if (text === 'الرئيسية' && path === '/') link.style.color = '#0A66FF';
    if (text === 'الخدمات' && path.includes('services')) link.style.color = '#0A66FF';
    if (text === 'المشاريع' && path.includes('projects')) link.style.color = '#0A66FF';
    if (text === 'تواصل معنا' && path.includes('contact')) link.style.color = '#0A66FF';
    if (text === 'لوحة التحكم' && path.includes('dashboard')) link.style.color = '#0A66FF';
  });
}

// 9. Interactive Card Animations
function initInteractiveCards() {
  const cards = document.querySelectorAll('[data-pencil-name="Card"], [data-pencil-name="Project Card"], [data-pencil-name="Service Card"]');
  cards.forEach(card => {
    card.classList.add('interactive-hover');
  });
}
