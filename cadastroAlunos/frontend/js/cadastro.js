const form = document.getElementById('formAluno');
const msg = document.getElementById('msg');

const $ = (id) => document.getElementById(id);

function maskTelefone(value) {
  // mantém só dígitos
  let d = value.replace(/\D/g, '');

  // garante DDD 19 no começo
  if (!d.startsWith('19')) d = '19' + d;

  // limita a 11 dígitos depois do DDD (celular com 9)
  d = d.slice(0, 13); // '19' + 11 dígitos máx

  const ddd = d.slice(0, 2); // 19
  const rest = d.slice(2);   // restante

  // formata: (19) 9####-#### ou (19) ####-####
  if (rest.length >= 9) {
    const p1 = rest.length === 9 ? rest.slice(0, 5) : rest.slice(0, 5);
    const p2 = rest.slice(5, 9);
    const p3 = rest.slice(9, 13);
    // quando 11 dígitos após DDD => (19) 9####-####
    return `(19) ${rest.slice(0, 5)}-${rest.slice(5, 9)}${p3 ? p3 : ''}`.trim();
  } else if (rest.length >= 8) {
    // quando 10 dígitos após DDD => (19) ####-####
    return `(19) ${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
  } else if (rest.length > 4) {
    return `(19) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  } else if (rest.length > 0) {
    return `(19) ${rest}`;
  }
  return '(19) ';
}

function validateEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@puccampinas\.edu\.br$/.test(email);
}

function validateRA(ra) {
  return /^\d{8}$/.test(ra);
}

function validateTelefone(tel) {
  return /^\(19\)\s?\d{4,5}-\d{4}$/.test(tel);
}

// máscara em tempo real
$('telefone').addEventListener('input', (e) => {
  const cur = e.target.selectionStart;
  e.target.value = maskTelefone(e.target.value);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = $('nome').value.trim();
  const ra = $('ra').value.trim();
  const curso = $('curso').value.trim();
  const email = $('email').value.trim();
  const telefone = $('telefone').value.trim();

  // validações de preenchimento
  if (!nome || !ra || !curso || !email || !telefone) {
    msg.style.color = '#ef4444';
    msg.textContent = 'Preencha todos os campos obrigatórios.';
    return;
  }

  // validações específicas
  if (!validateRA(ra)) {
    msg.style.color = '#ef4444';
    msg.textContent = 'RA deve ter exatamente 8 números.';
    $('ra').focus();
    return;
  }

  if (!validateEmail(email)) {
    msg.style.color = '#ef4444';
    msg.textContent = 'Use seu email institucional @puccampinas.edu.br.';
    $('email').focus();
    return;
  }

  if (!validateTelefone(telefone)) {
    msg.style.color = '#ef4444';
    msg.textContent = 'Telefone deve estar no formato (19) 9####-#### ou (19) ####-####.';
    $('telefone').focus();
    return;
  }

  msg.textContent = 'Enviando...';
  msg.style.color = '#60a5fa';

  const aluno = { nome, ra, curso, email, telefone };

  try {
    const res = await fetch('http://localhost:3000/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(aluno)
    });

    const data = await res.json();

    if (res.ok) {
      msg.style.color = '#22c55e';
      msg.textContent = 'Aluno cadastrado com sucesso! Redirecionando...';

      // "login" automático
      localStorage.setItem('alunoRA', ra);
      localStorage.setItem('alunoNome', nome);

      setTimeout(() => {
        window.location.href = 'livros.html';
      }, 900);
    } else {
      msg.style.color = '#ef4444';
      msg.textContent = data.error || 'Erro ao cadastrar aluno.';
    }
  } catch (err) {
    console.error('Erro no cadastro:', err);
    msg.style.color = '#ef4444';
    msg.textContent = 'Falha de conexão com o servidor.';
  }
});
