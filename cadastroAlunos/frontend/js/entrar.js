// js/entrar.js
(function () {
  const formLogin = document.getElementById('formLogin');
  const raInput = document.getElementById('ra');
  const msg = document.getElementById('msg');

  // Teste: se este log não aparecer no console, o JS NÃO está carregando
  console.log('[entrar.js] carregado');

  if (!formLogin || !raInput || !msg) {
    alert('Erro: elementos do formulário não foram encontrados no DOM.');
    return;
  }

  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ra = raInput.value.trim();

    if (!ra) {
      msg.textContent = 'Por favor, digite seu RA.';
      msg.style.color = '#ef4444';
      return;
    }

    msg.textContent = 'Verificando...';
    msg.style.color = '#60a5fa';

    try {
      const url = `http://localhost:3000/alunos/${encodeURIComponent(ra)}`;
      console.log('[entrar.js] requisitando:', url);

      const res = await fetch(url);
      const contentType = res.headers.get('content-type') || '';
      let data = null;
      try { data = contentType.includes('application/json') ? await res.json() : await res.text(); }
      catch(_) { /* ignore */ }

      if (!res.ok) {
        console.warn('[entrar.js] resposta não OK', res.status, data);
        if (res.status === 404) {
          msg.textContent = 'RA não encontrado.';
        } else {
          msg.textContent = 'Erro ao buscar aluno (HTTP ' + res.status + ').';
        }
        msg.style.color = '#ef4444';
        return;
      }

      // Se veio texto puro, trata como erro
      if (typeof data !== 'object' || !data) {
        msg.textContent = 'Resposta inesperada do servidor.';
        msg.style.color = '#ef4444';
        return;
      }

      if (!data.id || !data.ra) {
        msg.textContent = 'Aluno inválido ou não encontrado.';
        msg.style.color = '#ef4444';
        return;
      }

      // Guarda sessão simples
      localStorage.setItem('alunoRA', data.ra);
      localStorage.setItem('alunoNome', data.nome || '');

      msg.style.color = '#22c55e';
      msg.textContent = 'Login OK! Redirecionando...';

      // Redireciona
      window.location.href = 'livros.html';
    } catch (err) {
      console.error('[entrar.js] erro fetch', err);
      msg.textContent = 'Erro de conexão com o servidor.';
      msg.style.color = '#ef4444';
    }
  });
})();
