/* script.js
   Shared logic for pivot.html & fibonacci.html
   - theme toggle
   - pivot calc (classic, woodie, camarilla)
   - fibonacci up/down (retracement & projection)
   - autofill history rows (and auto-calc)
   - row animations (staggered)
*/

(function(){
  'use strict';

  const EASE = 'cubic-bezier(.25,.8,.25,1)';
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const fmt = v => (typeof v === 'number' && !isNaN(v)) ? v.toFixed(2) : '0.00';

  /* THEME TOGGLE */
  function initTheme(){
    const btns = $$('#themeToggle');
    const dark = localStorage.getItem('ewf-dark') === '1';
    if(dark) document.documentElement.classList.add('dark');

    btns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('ewf-dark', isDark ? '1' : '0');
      });
    });
  }

  /* PIVOT CALC */
  function initPivot(){
    const btn = $('#pivotCalc');
    if(!btn) return;

    btn.addEventListener('click', ()=>{
      const open = parseFloat($('#p-open').value);
      const high = parseFloat($('#p-high').value);
      const low = parseFloat($('#p-low').value);
      const close = parseFloat($('#p-close').value);
      if([open,high,low,close].some(v=>isNaN(v))){
        alert('Isi Open, High, Low, Close terlebih dahulu.');
        return;
      }

      // Classic
      const P = (high + low + close)/3;
      const classic = {
        R4: 0,
        R3: high + 2*(P - low),
        R2: P + (high - low),
        R1: 2*P - low,
        P: P,
        S1: 2*P - high,
        S2: P - (high - low),
        S3: low - 2*(high - P),
        S4: 0
      };

      // Woodie
      const Pw = (high + low + 2*close)/4;
      const woodie = {
        R4: 0,
        R3: Pw + (high - low),
        R2: Pw + (high - low)/2,
        R1: 2*Pw - low,
        P: Pw,
        S1: 2*Pw - high,
        S2: Pw - (high - low)/2,
        S3: Pw - (high - low),
        S4: 0
      };

      // Camarilla
      const range = high - low;
      const cf = [1.1/2, 1.1/4, 1.1/6, 1.1/12];
      const cam = {
        R4: close + range*cf[0],
        R3: close + range*cf[1],
        R2: close + range*cf[2],
        R1: close + range*cf[3],
        P: P,
        S1: close - range*cf[3],
        S2: close - range*cf[2],
        S3: close - range*cf[1],
        S4: close - range*cf[0]
      };

      const order = ['R4','R3','R2','R1','P','S1','S2','S3','S4'];
      const tbody = $('#pivotResultBody');
      const pivotResults = document.querySelector('.pivot-results');
      if(pivotResults) pivotResults.classList.remove('has-results');
      tbody.innerHTML = '';
      order.forEach((k,i)=>{
        const label = (k === 'P') ? 'Pivot' : k;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${label}</td><td class="value">${fmt(classic[k])}</td><td class="value">${fmt(woodie[k])}</td><td class="value">${fmt(cam[k])}</td>`;
        tbody.appendChild(tr);
        // animate row
        tr.style.animationDelay = `${i * 40}ms`;
        tr.classList.add('reveal-row');
      });
      // mark results present so styles switch from muted to colored
      if(pivotResults) pivotResults.classList.add('has-results');
    });
  }

  /* FIBONACCI */
  function initFibo(){
    const retrace = [0.236,0.382,0.5,0.618,0.786];
    const proj = [1.382,1.5,1.618,2.0,2.382,2.618];

    const upBtn = $('#fiboUpCalc');
    if(upBtn){
      upBtn.addEventListener('click', ()=>{
        const a = parseFloat($('#fu-a').value);
        const b = parseFloat($('#fu-b').value);
        if(isNaN(a) || isNaN(b) || b <= a){
          alert('Uptrend: pastikan A (low) < B (high).');
          return;
        }
        const diff = b - a;
        const tbRet = $('#fu-ret'); const tbProj = $('#fu-proj');
        tbRet.innerHTML = ''; tbProj.innerHTML = '';

        retrace.forEach((r,i)=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${(r*100).toFixed(2)}%</td><td style="text-align:right">${fmt(b - diff*r)}</td>`;
          tr.style.animationDelay = `${i*40}ms`; tr.classList.add('reveal-row');
          tbRet.appendChild(tr);
        });

        proj.forEach((m,i)=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${(m*100).toFixed(2)}%</td><td style="text-align:right">${fmt(b + diff*m)}</td>`;
          tr.style.animationDelay = `${(i+retrace.length)*30}ms`; tr.classList.add('reveal-row');
          tbProj.appendChild(tr);
        });
      });
    }

    const downBtn = $('#fiboDownCalc');
    if(downBtn){
      downBtn.addEventListener('click', ()=>{
        const a = parseFloat($('#fd-a').value);
        const b = parseFloat($('#fd-b').value);
        if(isNaN(a) || isNaN(b) || a <= b){
          alert('Downtrend: pastikan A (high) > B (low).');
          return;
        }
        const diff = a - b;
        const tbRet = $('#fd-ret'); const tbProj = $('#fd-proj');
        tbRet.innerHTML = ''; tbProj.innerHTML = '';

        // retrace from high->low: levels descending typical (show 78.6..23.6)
        const retrDown = [0.786,0.618,0.5,0.382,0.236];
        retrDown.forEach((r,i)=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${(r*100).toFixed(2)}%</td><td style="text-align:right">${fmt(b + diff*r)}</td>`;
          tr.style.animationDelay = `${i*40}ms`; tr.classList.add('reveal-row');
          tbRet.appendChild(tr);
        });

        proj.forEach((m,i)=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${(m*100).toFixed(2)}%</td><td style="text-align:right">${fmt(b - diff*m)}</td>`;
          tr.style.animationDelay = `${(i+retrDown.length)*30}ms`; tr.classList.add('reveal-row');
          tbProj.appendChild(tr);
        });
      });
    }
  }

  /* HISTORY autofill & dataset switch */
  function initHistory(){
    const tbody = $('#historyTable tbody');
    if(!tbody) return;

    function rowClickHandler(tr){
      tr.addEventListener('click', ()=>{
        const cells = tr.querySelectorAll('td');
        if(cells.length < 5) return;
        const open = parseFloat(cells[1].textContent);
        const high = parseFloat(cells[2].textContent);
        const low = parseFloat(cells[3].textContent);
        const close = parseFloat(cells[4].textContent);

        if($('#p-open')) $('#p-open').value = open;
        if($('#p-high')) $('#p-high').value = high;
        if($('#p-low')) $('#p-low').value = low;
        if($('#p-close')) $('#p-close').value = close;

        if($('#fu-a')) $('#fu-a').value = low;
        if($('#fu-b')) $('#fu-b').value = high;
        if($('#fd-a')) $('#fd-a').value = high;
        if($('#fd-b')) $('#fd-b').value = low;

        // auto-calc if present
        if($('#pivotCalc')) $('#pivotCalc').click();
        if($('#fiboUpCalc')) $('#fiboUpCalc').click();
        if($('#fiboDownCalc')) $('#fiboDownCalc').click();
      });
    }

    // Track deleted rows for undo
    let deletedRows = [];
    let undoTimeout = null;

    // Load saved history from localStorage
    function loadSavedHistory(){
      const saved = localStorage.getItem('ewf-history');
      if(saved){
        const history = JSON.parse(saved);
        history.forEach(r=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td>`;
          tr.setAttribute('data-saved', 'true');
          tbody.insertBefore(tr, tbody.firstChild);
          rowClickHandler(tr);
          addDeleteRowHandler(tr);
        });
      }
    }

    // Add delete row handler
    function addDeleteRowHandler(tr){
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '✕';
      deleteBtn.className = 'row-delete-btn';
      deleteBtn.title = 'Hapus baris (undo dalam 5 detik)';
      deleteBtn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const rowData = [];
        tr.querySelectorAll('td').forEach(td => rowData.push(td.textContent));
        deletedRows.push({tr, data: rowData});
        tr.style.opacity = '0.5';
        deleteBtn.disabled = true;

        // Show undo notification
        showUndoNotification(rowData, ()=>{
          deletedRows = deletedRows.filter(r => r.data !== rowData);
          tr.style.opacity = '1';
          deleteBtn.disabled = false;
          if(undoTimeout) clearTimeout(undoTimeout);
        });

        // Auto-save after 5 seconds
        if(undoTimeout) clearTimeout(undoTimeout);
        undoTimeout = setTimeout(()=>{
          tr.remove();
          deletedRows = deletedRows.filter(r => r.data !== rowData);
          saveToLocalStorage();
        }, 5000);
      });

      const cell = tr.insertCell(0);
      cell.appendChild(deleteBtn);
      cell.style.width = '30px';
    }

    // Show undo notification
    function showUndoNotification(rowData, undoFn){
      let existing = document.getElementById('undoNotif');
      if(existing) existing.remove();
      
      const notif = document.createElement('div');
      notif.id = 'undoNotif';
      notif.className = 'undo-notification';
      notif.innerHTML = `
        <span>Baris dihapus</span>
        <button id="undoBtn" class="undo-btn">Undo</button>
      `;
      document.body.appendChild(notif);
      
      const undoBtn = notif.querySelector('#undoBtn');
      undoBtn.addEventListener('click', ()=>{
        undoFn();
        notif.remove();
        if(undoTimeout) clearTimeout(undoTimeout);
      });

      setTimeout(()=>{
        if(notif.parentNode) notif.remove();
      }, 5000);
    }

    // Save to localStorage
    function saveToLocalStorage(){
      const savedRows = $$('#historyTable tbody tr[data-saved="true"]');
      const history = [];
      savedRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const data = [];
        for(let i = 1; i < cells.length; i++) {
          data.push(cells[i].textContent);
        }
        history.push(data);
      });
      localStorage.setItem('ewf-history', JSON.stringify(history));
    }

    // Save history to localStorage
    function saveToHistory(){
      const open = $('#p-open')?.value;
      const high = $('#p-high')?.value;
      const low = $('#p-low')?.value;
      const close = $('#p-close')?.value;

      if(!open || !high || !low || !close) return;

      const today = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
      const newRow = [today, open, high, low, close];

      let history = [];
      const saved = localStorage.getItem('ewf-history');
      if(saved) history = JSON.parse(saved);

      history.unshift(newRow);
      if(history.length > 20) history.pop();
      localStorage.setItem('ewf-history', JSON.stringify(history));

      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${newRow[0]}</td><td>${newRow[1]}</td><td>${newRow[2]}</td><td>${newRow[3]}</td><td>${newRow[4]}</td>`;
      tr.setAttribute('data-saved', 'true');
      tbody.insertBefore(tr, tbody.firstChild);
      rowClickHandler(tr);
      addDeleteRowHandler(tr);
    }

    // attach to existing rows
    $$('#historyTable tbody tr').forEach(tr => {
      tr.setAttribute('data-saved', 'false');
      rowClickHandler(tr);
    });

    // Load saved history
    loadSavedHistory();

    // Add save button click listener
    const saveBtn = $('#historySave');
    if(saveBtn){
      saveBtn.addEventListener('click', saveToHistory);
    }

    // Add clear history button click listener
    const clearBtn = $('#historyClear');
    if(clearBtn){
      clearBtn.addEventListener('click', ()=>{
        if(confirm('Yakin ingin menghapus semua history? Tindakan ini tidak dapat dibatalkan.')){
          localStorage.removeItem('ewf-history');
          // Remove saved rows from table (keep sample data rows)
          const allRows = $$('#historyTable tbody tr');
          allRows.forEach(row => {
            if(row.getAttribute('data-saved') === 'true') {
              row.remove();
            }
          });
        }
      });
    }

    // dataset switch demo
    const select = $('#historySelect');
    if(select){
      select.addEventListener('change', ()=>{
        const dataset = select.value;
        const samples = {
          'LGD Daily': [
            ['10 Dec 2025','4207.79','4238.65','4182.01','4226.17'],
            ['09 Dec 2025','4189.59','4221.32','4169.99','4209.98'],
            ['08 Dec 2025','4197.69','4218.92','4175.89','4190.58']
          ],
          'BCO Daily': [
            ['10 Dec 2025','33.12','34.10','32.88','33.95'],
            ['09 Dec 2025','32.80','33.50','32.20','33.10']
          ],
          'USD/CHF': [
            ['10 Dec 2025','0.915','0.919','0.912','0.918'],
            ['09 Dec 2025','0.912','0.916','0.909','0.915']
          ],
          'USD/JPY': [
            ['10 Dec 2025','149.12','150.05','148.50','149.80'],
            ['09 Dec 2025','148.50','149.00','147.80','148.90']
          ],
          'LSI Daily': [['10 Dec 2025','7200','7250','7150','7230']],
          'HSI Daily': [['10 Dec 2025','18000','18200','17900','18150']],
          'SNI Daily': [['10 Dec 2025','2300','2350','2280','2335']],
          'GBP/USD': [['10 Dec 2025','1.2580','1.2620','1.2550','1.2605']],
          'AUD/USD': [['10 Dec 2025','0.642','0.648','0.640','0.646']]
        };
        tbody.innerHTML = '';
        const rows = samples[dataset] || samples['LGD Daily'];
        rows.forEach(r=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td>`;
          tr.setAttribute('data-saved', 'false');
          tbody.appendChild(tr);
          rowClickHandler(tr);
        });
      });
    }
  }

  /* FEATURES: EXPORT, HELP, MARKET DATA */
  function initFeatures(){
    // Help Modal
    const helpModal = $('#helpModal');
    const helpBtns = $$('#pivotHelp, #fiboHelp');
    const closeModal = $('#closeModal');

    helpBtns.forEach(btn => {
      if(btn) btn.addEventListener('click', () => {
        helpModal?.classList.add('show');
      });
    });

    if(closeModal) {
      closeModal.addEventListener('click', () => {
        helpModal?.classList.remove('show');
      });
    }

    // Close modal on background click
    if(helpModal) {
      helpModal.addEventListener('click', (e) => {
        if(e.target === helpModal) helpModal.classList.remove('show');
      });
    }

    // Export Data
    const exportBtn = $('#pivotExport');
    if(exportBtn) {
      exportBtn.addEventListener('click', () => {
        const open = $('#p-open')?.value || '0';
        const high = $('#p-high')?.value || '0';
        const low = $('#p-low')?.value || '0';
        const close = $('#p-close')?.value || '0';
        
        if(open === '0' && high === '0' && low === '0' && close === '0') {
          alert('Isi data terlebih dahulu sebelum export!');
          return;
        }

        const date = new Date().toLocaleString('id-ID');
        const csv = `Pivot Calculator Export\nTanggal,${date}\n\nInput Data\nOpen,High,Low,Close\n${open},${high},${low},${close}\n\nHasil Kalkulasi\nLevel,Classic,Woodie,Camarilla\n`;
        
        const rows = $$('#pivotResultBody tr');
        let data = csv;
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          const level = cells[0].textContent;
          const classic = cells[1].textContent;
          const woodie = cells[2].textContent;
          const camarilla = cells[3].textContent;
          data += `${level},${classic},${woodie},${camarilla}\n`;
        });

        downloadCSV(data, `pivot_${Date.now()}.csv`);
      });
    }

    // Real-time Market Data (simulated)
    function updateMarketData() {
      const marketData = $('#marketData');
      if(marketData) {
        const now = new Date().toLocaleTimeString('id-ID');
        const value = marketData.querySelector('.data-value');
        if(value) value.textContent = now;
      }
    }

    // Update every 5 seconds
    setInterval(updateMarketData, 5000);
    updateMarketData();
  }

  // Helper: Download CSV
  function downloadCSV(data, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function initAIChat(){
    const aiChat = $('#aiChat');
    const aiToggle = $('#aiToggle');
    const aiHeader = aiChat.querySelector('.ai-header');
    const aiSend = $('#aiSend');
    const aiInput = $('#aiInput');
    const aiMessages = $('#aiMessages');
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    // Toggle open/close chat
    aiHeader.addEventListener('click', (e)=>{
      if(e.target !== aiToggle) {
        aiChat.classList.toggle('open');
      }
    });

    // Toggle minimize
    if(aiToggle){
      aiToggle.addEventListener('click', ()=>{
        aiChat.classList.toggle('minimized');
        aiToggle.textContent = aiChat.classList.contains('minimized') ? '+' : '−';
      });
    }

    // Drag functionality
    aiHeader.addEventListener('mousedown', (e)=>{
      if(e.target === aiToggle) return;
      isDragging = true;
      const rect = aiChat.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      aiChat.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e)=>{
      if(!isDragging) return;
      aiChat.style.bottom = 'auto';
      aiChat.style.right = 'auto';
      aiChat.style.left = Math.max(0, e.clientX - offsetX) + 'px';
      aiChat.style.top = Math.max(0, e.clientY - offsetY) + 'px';
    });

    document.addEventListener('mouseup', ()=>{
      isDragging = false;
      aiChat.style.cursor = 'default';
    });

    // Send message function
    function sendMessage(){
      const text = aiInput.value.trim();
      if(!text) return;

      // User message
      const userMsg = document.createElement('div');
      userMsg.className = 'ai-message user';
      userMsg.innerHTML = `<div class="ai-avatar">👤</div><div class="ai-text">${text}</div>`;
      aiMessages.appendChild(userMsg);

      // Clear input
      aiInput.value = '';

      // AI response (simple pattern matching)
      setTimeout(()=>{
        const botMsg = document.createElement('div');
        botMsg.className = 'ai-message bot';
        let response = 'Maaf, saya belum bisa menjawab itu. 😔 Coba tanya tentang Pivot atau Fibonacci!';

        const lower = text.toLowerCase();
        if(lower.includes('pivot')) {
          response = '💡 Pivot Point adalah level support/resistance berdasarkan price action kemarin. Gunakan Open, High, Low, Close kemarin untuk kalkulasi.';
        } else if(lower.includes('fibonacci')) {
          response = '🎯 Fibonacci adalah level retracement/projection berdasarkan price difference. Masukkan Low dan High untuk uptrend, atau High dan Low untuk downtrend.';
        } else if(lower.includes('bantuan') || lower.includes('help')) {
          response = '📚 Saya bisa membantu dengan:\n• Penjelasan Pivot Point\n• Penjelasan Fibonacci\n• Tips trading\n• Interpretasi hasil kalkulasi';
        } else if(lower.includes('terima kasih') || lower.includes('thanks')) {
          response = '😊 Sama-sama! Semoga sukses dengan trading Anda!';
        }

        botMsg.innerHTML = `<div class="ai-avatar">🤖</div><div class="ai-text">${response}</div>`;
        aiMessages.appendChild(botMsg);
        aiMessages.scrollTop = aiMessages.scrollHeight;
      }, 300);

      // Scroll to bottom
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    // Send button click
    if(aiSend){
      aiSend.addEventListener('click', sendMessage);
    }

    // Enter key to send
    if(aiInput){
      aiInput.addEventListener('keypress', (e)=>{
        if(e.key === 'Enter') sendMessage();
      });
    }
  }


  /* init all */
  function init(){
    initTheme();
    initPivot();
    initFibo();
    initHistory();
    initAIChat();
    initFeatures();
    // Initialize translations (if i18n loaded)
    if(window.i18n && typeof window.i18n.init === 'function'){
      try{ window.i18n.init(); }catch(e){ console.warn('i18n init failed', e); }
    }

    // small enhancement: add subtle entrance for top title + header
    const title = document.querySelector('.section-title');
    if(title) title.classList.add('fade-up');
  }

  // run
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
