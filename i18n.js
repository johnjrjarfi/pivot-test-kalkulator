(function(){
  'use strict';

  const translations = {
    en: {
      'nav.pivot': 'Pivot',
      'nav.fibo': 'Fibonacci',
      'theme.title': 'Toggle theme',
      'section.pivot.title': 'Pivot Calculator',
      'card.pivot.title': 'Pivot Calculator',
      'btn.help': '?',
      'btn.export': '⬇',
      'label.open': 'Open',
      'label.high': 'High',
      'label.low': 'Low',
      'label.close': 'Close',
      'ph.open': 'Open',
      'ph.high': 'High',
      'ph.low': 'Low',
      'ph.close': 'Close',
      'btn.calculate': 'Calculate',
      'market.lastupdate': 'Last Update:',
      'table.classic': 'Classic',
      'table.woodie': 'Woodie',
      'table.camarilla': 'Camarilla',
      'history.note': 'Select sample data to autofill and calculate',
      'btn.save_history': 'Save History',
      'btn.clear_history': 'Clear All',
      'help.title.pivot': '📚 Pivot Point Guide',
      'help.classic': 'Classic: P = (H+L+C)/3 → Basic support/resistance levels',
      'help.woodie': 'Woodie: Pw = (H+L+2C)/4 → Focuses on close',
      'help.camarilla': 'Camarilla: Range-based → Useful for intraday',
      'help.tip': 'Tip: Use previous day data for today\'s calculation!',
      'ai.greeting': 'Hello! 👋 How can I help with Pivot or Fibonacci?',
      'ai.placeholder': 'Ask something...',
      'ai.send': 'Send',
      'footer.brand': 'PT. Equityworld Futures',
      'fibo.title': 'Fibonacci Retracement & Projection',
      'help.title.fibo': '📚 Fibonacci Guide',
      'fibo.retrace': 'Retracement',
      'fibo.proj': 'Projection'
    },
    id: {
      'nav.pivot': 'Pivot',
      'nav.fibo': 'Fibonacci',
      'theme.title': 'Ganti tema',
      'section.pivot.title': 'Kalkulator Pivot',
      'card.pivot.title': 'Kalkulator Pivot',
      'btn.help': '?',
      'btn.export': '⬇',
      'label.open': 'Open',
      'label.high': 'High',
      'label.low': 'Low',
      'label.close': 'Close',
      'ph.open': 'Open',
      'ph.high': 'High',
      'ph.low': 'Low',
      'ph.close': 'Close',
      'btn.calculate': 'Hitung',
      'market.lastupdate': 'Terakhir Update:',
      'table.classic': 'Classic',
      'table.woodie': 'Woodie',
      'table.camarilla': 'Camarilla',
      'history.note': 'Pilih data sampel untuk autofill dan kalkulasi',
      'btn.save_history': 'Simpan History',
      'btn.clear_history': 'Hapus Semua',
      'help.title.pivot': '📚 Panduan Pivot Point',
      'help.classic': 'Classic: P = (H+L+C)/3 → Level support/resistance dasar',
      'help.woodie': 'Woodie: Pw = (H+L+2C)/4 → Lebih fokus pada harga close',
      'help.camarilla': 'Camarilla: Berbasis range → Berguna untuk intraday',
      'help.tip': '💡 Gunakan data kemarin untuk kalkulasi level hari ini!',
      'ai.greeting': 'Halo! 👋 Ada yang bisa saya bantu dengan Pivot atau Fibonacci?',
      'ai.placeholder': 'Tanya sesuatu...',
      'ai.send': 'Kirim',
      'footer.brand': 'PT. Equityworld Futures',
      'fibo.title': 'Fibonacci Retracement & Projection',
      'help.title.fibo': '📚 Panduan Fibonacci',
      'fibo.retrace': 'Retracement',
      'fibo.proj': 'Projection'
    }
  };

  function translatePage(lang){
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr') || 'text';
      const val = (translations[lang] && translations[lang][key]) ? translations[lang][key] : (translations['en'][key] || key);
      if(attr === 'placeholder') el.placeholder = val;
      else el.textContent = val;
    });
  }

  function setLanguage(lang){
    localStorage.setItem('ewf-lang', lang);
    // do a small visual fade while translating
    const container = document.querySelector('.container') || document.body;
    container.classList.add('lang-changing');
    // perform translation after short delay so the fade shows
    setTimeout(()=>{
      translatePage(lang);
      container.classList.remove('lang-changing');
    }, 180);
    const sel = document.getElementById('langSelect');
    if(sel){
      // update active state if using buttons
      Array.from(sel.querySelectorAll('.lang-btn')).forEach(b=> b.classList.toggle('active', b.getAttribute('data-lang') === lang));
    }
  }

  function init(){
    const saved = localStorage.getItem('ewf-lang') || (navigator.language && navigator.language.startsWith('id') ? 'id' : 'en');
    // flag button switch (if present)
    const switcher = document.getElementById('langSelect');
    if(switcher){
      switcher.addEventListener('click', (e)=>{
        const btn = e.target.closest('.lang-btn');
        if(!btn) return;
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
        // visual active state
        Array.from(switcher.querySelectorAll('.lang-btn')).forEach(b=>b.classList.toggle('active', b===btn));
      });
      // set initial active
      const activeBtn = switcher.querySelector(`.lang-btn[data-lang="${saved}"]`);
      if(activeBtn) activeBtn.classList.add('active');
    }
    translatePage(saved);
  }

  window.i18n = { init, setLanguage, t: (key, lang) => (translations[lang||localStorage.getItem('ewf-lang')||'en'][key] || key) };

})();
