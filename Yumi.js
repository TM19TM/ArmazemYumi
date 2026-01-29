const API_URL = "http://localhost:3000/produtos";

// Modal
const modal = document.getElementById("modalOverlay");
document.getElementById("openModal").onclick = () => modal.style.display = "block";
document.querySelector(".close-btn").onclick = () => modal.style.display = "none";

window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }

// Gerador de campos de Classe ou Tamanho
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
    } else { // Brinco, Fotocard
        area.innerHTML = `<select id="tamanho" required>
            <option value="Pequeno">Pequeno</option><option value="Médio">Médio</option><option value="Grande">Grande</option>
        </select>`;
    }
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
        imagem: document.getElementById("imagem").value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        if(res.ok) { 
            modal.style.display = "none";
            renderizar(); // Atualiza a lista sem recarregar a página
        }
    } catch (err) { alert("Erro ao salvar no servidor!"); }
};

// Renderizar todos os produtos organizados
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
                                <img src="${p.imagem}" onerror="this.src='https://via.placeholder.com/110x140'">
                                <div class="info">
                                    <h4>${p.nome}</h4>
                                    <p class="price">R$ ${p.valor.toFixed(2)}</p>
                                    <p>Qnt - ${p.quantidade}</p>
                                    <p><small>${p.classe || p.tamanho || ''}</small></p>
                                    <button class="btn-save" style="padding:5px; font-size:0.8rem" onclick="remover('${p._id}')">Remover</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = "<h3 style='text-align:center'>Ligue o servidor Node.js para carregar os itens.</h3>";
    }
}

window.onload = renderizar;