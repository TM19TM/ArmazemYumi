const API_URL = "http://localhost:3000/produtos";

// ... (mantenha as funções de Modal e ajustarCampos anteriores)

// Função para converter link do Google Drive em link direto de imagem
function formatarLinkDrive(link) {
    if (link.includes('drive.google.com')) {
        // Extrai o ID do arquivo do link do Drive
        const match = link.match(/\/d\/(.+?)\/(view|edit)?/);
        if (match && match[1]) {
            return `https://lh3.googleusercontent.com/u/0/d/${match[1]}`;
        }
    }
    return link; // Retorna o link original se não for Drive
}

// Salvar no MongoDB
document.getElementById("formProduto").onsubmit = async (e) => {
    e.preventDefault();
    const data = {
        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoriaSelect").value,
        classe: document.getElementById("classe")?.value || null,
        tamanho: document.getElementById("tamanho")?.value || null,
        quantidade: document.getElementById("quantidade").value,
        valor: document.getElementById("valor").value,
        imagem: document.getElementById("nome").value // Campo imagem agora recebe o link
    };

    // Pegamos o valor direto do input de imagem para tratar
    data.imagem = formatarLinkDrive(document.getElementById("imagem").value);

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        if(res.ok) { 
            modal.style.display = "none";
            renderizar();
        }
    } catch (err) { alert("Erro ao salvar!"); }
};

// Função para remover item do MongoDB
async function remover(id) {
    if (confirm("Deseja realmente excluir este item?")) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) renderizar();
        } catch (err) { alert("Erro ao remover!"); }
    }
}

async function renderizar() {
    const container = document.getElementById("catalogoCompleto");
    try {
        const res = await fetch(API_URL);
        const produtos = await res.json();
        const categorias = ["Boneco", "Brinco", "Caneta", "Chaveiro", "Colar", "Fotocard", "PhoneStrap", "Pulseira"];
        
        container.innerHTML = categorias.map(cat => {
            const itens = produtos.filter(p => p.categoria === cat);
            if (itens.length === 0) return '';
            
            return `
                <section id="sec-${cat}" class="categoria-group">
                    <h2>${cat}s</h2>
                    <div class="grid-container">
                        ${itens.map(p => `
                            <div class="card-produto">
                                <img src="${p.imagem}" alt="${p.nome}" onerror="this.src='https://via.placeholder.com/110x140?text=Erro+Imagem'">
                                <div class="info">
                                    <h4>${p.nome}</h4>
                                    <p class="price">R$ ${parseFloat(p.valor).toFixed(2)}</p>
                                    <p>Qnt - ${p.quantidade}</p>
                                    <p><small>${p.classe || p.tamanho || ''}</small></p>
                                    <button class="btn-remover-card" onclick="remover('${p._id}')">Remover</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = "<h3>Erro ao carregar catálogo.</h3>";
    }
}

window.onload = renderizar;