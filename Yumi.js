const API_URL = "http://localhost:3000/produtos";

// Controlo do Modal
const modal = document.getElementById("modalOverlay");
document.getElementById("openModal").onclick = () => modal.style.display = "block";
document.querySelector(".close-btn").onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }

// Alterna entre campos de Classe ou Tamanho conforme a categoria
function ajustarCampos() {
    const cat = document.getElementById("categoriaSelect").value;
    const area = document.getElementById("areaDinâmica");
    area.innerHTML = "";

    if (["Boneco", "Chaveiro", "Caneta", "Colar", "PhoneStrap"].includes(cat)) {
        area.innerHTML = `<select id="classe" required>
            <option value="Bronze">Bronze</option>
            <option value="Prata">Prata</option>
            <option value="Ouro">Ouro</option>
        </select>`;
    } else if (cat === "Pulseira") {
        area.innerHTML = `<select id="tamanho" required>
            <option value="PP">PP</option><option value="P">P</option><option value="M">M</option><option value="G">G</option><option value="GG">GG</option>
        </select>`;
    } else {
        area.innerHTML = `<select id="tamanho" required>
            <option value="Pequeno">Pequeno</option><option value="Médio">Médio</option><option value="Grande">Grande</option>
        </select>`;
    }
}

// Converte link do Drive para link direto de imagem
function formatarLinkDrive(link) {
    if (link.includes('drive.google.com')) {
        const match = link.match(/\/d\/(.+?)\/(view|edit)?/);
        if (match && match[1]) {
            return `https://lh3.googleusercontent.com/u/0/d/${match[1]}`;
        }
    }
    return link; 
}

// Submeter formulário para o MongoDB
document.getElementById("formProduto").onsubmit = async (e) => {
    e.preventDefault();
    const data = {
        nome: document.getElementById("nome").value,
        categoria: document.getElementById("categoriaSelect").value,
        classe: document.getElementById("classe")?.value || null,
        tamanho: document.getElementById("tamanho")?.value || null,
        quantidade: document.getElementById("quantidade").value,
        valor: document.getElementById("valor").value,
        imagem: formatarLinkDrive(document.getElementById("imagem").value)
    };

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

// Remover produto do banco
async function remover(id) {
    if (confirm("Deseja realmente excluir este item?")) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) renderizar();
        } catch (err) { alert("Erro ao remover!"); }
    }
}

// Carregar e exibir produtos organizados
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
        container.innerHTML = "<h3>Ligue o servidor para carregar os produtos.</h3>";
    }
}

window.onload = renderizar;