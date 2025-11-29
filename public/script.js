document.addEventListener('DOMContentLoaded', () => {
    const tabelaBody = document.querySelector('#devolucoes-tabela tbody');
    const atualizarBtn = document.getElementById('atualizar-btn');

    /**
     * Função para formatar a data
     */
    function formatarData(dataString) {
        if (!dataString) return '';
        // Converte a string de data (que pode vir com fuso horário) para o formato local
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR'); 
    }

    /**
     * Função para buscar os dados da API e preencher a tabela
     */
    async function carregarLivros() {
        tabelaBody.innerHTML = ''; 
        const COL_SPAN = 4; // 🚨 ATUALIZADO: Total de colunas agora é 4

        try {
            const response = await fetch('/api/livros_devolvidos');
            
            if (!response.ok) {
                throw new Error(`Erro HTTP! Status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                data.data.forEach(livro => {
                    const row = tabelaBody.insertRow();
                    
                    // Coluna 1: Código Livro
                    row.insertCell(0).textContent = livro.codigo_livro;

                    // Coluna 2: Nome do Livro
                    row.insertCell(1).textContent = livro.nome_livro;

                    // Coluna 3: Nome do Aluno
                    row.insertCell(2).textContent = livro.nome_aluno; 

                    // Coluna 4: Data de Devolução
                    row.insertCell(3).textContent = formatarData(livro.data_devolucao);

                    // 🚨 A coluna 'quantidade_devolvido' foi removida.
                });
            } else {
                const row = tabelaBody.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = COL_SPAN; 
                cell.textContent = 'Nenhum livro devolvido encontrado.';
                cell.style.textAlign = 'center';
            }

        } catch (error) {
            console.error('Falha ao carregar os livros:', error);
            const row = tabelaBody.insertRow();
            const cell = row.insertCell(0);
            cell.colSpan = COL_SPAN;
            cell.textContent = 'Erro ao conectar ao servidor.';
            cell.style.color = 'red';
            cell.style.textAlign = 'center';
        }
    }

    carregarLivros();
    atualizarBtn.addEventListener('click', carregarLivros);
});