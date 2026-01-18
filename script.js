// ===== Popup utilitário =====
(function () {
  const overlay = document.getElementById('popup');
  const titleEl = document.getElementById('popup-title');
  const descEl  = document.getElementById('popup-desc');
  const btnClose = document.getElementById('popup-close');
  const btnOk    = document.getElementById('popup-ok');

  function show() {
    overlay.classList.add('show');
    setTimeout(() => btnOk && btnOk.focus(), 50);
  }
  function hide(e) {
    if (e) e.preventDefault();
    overlay.classList.remove('show');
  }

  // Expor função global para reuso
  window.openPopup = function (titleText, messageHtml) {
    if (titleEl) titleEl.textContent = titleText || 'Aviso';
    if (descEl)  descEl.innerHTML = messageHtml || '<p></p>';
    show();
  };

  // Listeners de fechamento
  btnClose && btnClose.addEventListener('click', hide);
  btnOk    && btnOk.addEventListener('click', hide);
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && overlay.classList.contains('show')) hide();
  });
  overlay.addEventListener('click', (ev) => {
    if (ev.target === overlay) hide();
  });

  // Ao abrir a página: popup "SEU ACESSO EXPIROU!"
  window.addEventListener('load', () => {
    openPopup('Aviso', '<p><strong>SEU ACESSO EXPIROU!</strong></p><p>Por segurança, faça login novamente ou aguarde novas instruções.</p>');
  });
})();

// ===== Progresso 120s (barra + % e liberação do botão) =====
(function startProgress() {
  const bar = document.getElementById('progressbar');
  const fill = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  const hint = document.getElementById('progress-hint');
  const action = document.getElementById('main-action');
  if (!bar || !fill || !label) return;

  const total = parseInt(bar.getAttribute('data-total-seconds') || '120', 10);
  let elapsed = 0;

  function render(pct){
    const pctClamped = Math.max(0, Math.min(100, pct));
    fill.style.width = pctClamped + '%';
    label.textContent = Math.round(pctClamped) + '%';
    bar.setAttribute('aria-valuenow', String(Math.round(pctClamped)));
    if (hint) hint.textContent = `Tempo estimado: ${Math.max(0, total - elapsed)}s`;
  }

  render(0);

  const tick = 1000; // 1s
  const intervalId = setInterval(() => {
    elapsed = Math.min(total, elapsed + 1);
    const pct = (elapsed / total) * 100;
    render(pct);

    if (elapsed >= total) {
      clearInterval(intervalId);
      // habilita botão
      if (action) {
        action.removeAttribute('disabled');
        action.setAttribute('aria-disabled', 'false');
      }
      // popup de pronto
      openPopup('Pronto', '<p><strong>Pronto, já pode tentar novamente.</strong></p>');
    }
  }, tick);
})();
