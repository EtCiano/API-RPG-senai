const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');

let allEquipment = [];

async function loadAllEquipment() {
    try {
        resultsDiv.innerHTML = '<div class="loading">Carregando equipamentos...</div>';
        const response = await fetch('https://www.dnd5eapi.co/api/equipment');
        const data = await response.json();
        allEquipment = data.results;
        displayResults(allEquipment);
    } catch (error) {
        resultsDiv.innerHTML = '<div>Erro ao carregar equipamentos</div>';
        console.error('Erro:', error);
    }
}

function displayResults(equipment) {
    if (equipment.length === 0) {
        resultsDiv.innerHTML = '<div>Nenhum equipamento encontrado</div>';
        return;
    }

    resultsDiv.innerHTML = equipment.map(item => `
        <div class="item">
            <h3>${item.name}</h3>
            <button onclick="getItemDetails('${item.index}')">Ver Detalhes</button>
        </div>
    `).join('');
}

async function getItemDetails(itemIndex) {
    try {
        resultsDiv.innerHTML = '<div class="loading">Carregando detalhes...</div>';
        const response = await fetch(`https://www.dnd5eapi.co/api/equipment/${itemIndex}`);
        const item = await response.json();
        
        if (item.equipment_category.index === 'weapon') {
            resultsDiv.innerHTML = `
            <div class="item">
                <h2>${item.name}</h2>
                <p><strong>Categoria:</strong> ${item.equipment_category?.name || 'N/A'}</p>
                <p><strong>Dano:</strong> ${item.damage.damage_dice} ${item.damage.damage_type.name}</p>
                <p><strong>Categoria da arma:</strong> ${item.weapon_category}</p>
                <p><strong>Alcançe normal:</strong> ${item.range.normal}</p>
                <p><strong>Alcançe longo:</strong> ${item.range.long}</p>
                <p><strong>Custo:</strong> ${item.cost?.quantity || 0} ${item.cost?.unit || ''}</p>
                <p><strong>Peso:</strong> ${item.weight || 0} lbs</p>
                <p><strong>Propriedades:</strong> ${item.properties?.map(prop => prop.name).join(', ') || 'Nenhuma'}</p>
                ${item.desc ? `<p><strong>Descrição:</strong> ${item.desc.join(' ')}</p>` : ''}
                <button onclick="loadAllEquipment()">Voltar para lista</button>
            </div>
        `;
        }
        else if (item.equipment_category.index === 'armor') {
            resultsDiv.innerHTML = `
            <div class="item">
                <h2>${item.name}</h2>
                <p><strong>Categoria:</strong> ${item.equipment_category?.name || 'N/A'}</p>
                <p><strong>Categoria da armadura:</strong> ${item.armor_category}</p>
                <p><strong>Classe de armadura:</strong> ${item.armor_class.base}</p>
                <p><strong>Bônus de destreza:</strong> ${item.armor_class.dex_bonus || 'Nenhum'}</p>
                <p><strong>Desvantagem de furtividade:</strong> ${item.armor_class.dex_bonus || 'Nenhuma'}</p>
                <p><strong>Mínimo de forca:</strong> ${item.str_minimum || 'Nenhum'}</p>
                <p><strong>Custo:</strong> ${item.cost?.quantity || 0} ${item.cost?.unit || ''}</p>
                <p><strong>Peso:</strong> ${item.weight || 0} lbs</p>
                <p><strong>Propriedades:</strong> ${item.properties?.map(prop => prop.name).join(', ') || 'Nenhuma'}</p>
                ${item.desc ? `<p><strong>Descrição:</strong> ${item.desc.join(' ')}</p>` : ''}
                <button onclick="loadAllEquipment()">Voltar para lista</button>
            </div>
        `;
        }
        else if (item.equipment_category.index === 'mounts-and-vehicles') {
            resultsDiv.innerHTML = `
            <div class="item">
                <h2>${item.name}</h2>
                <p><strong>Categoria:</strong> ${item.equipment_category?.name || 'N/A'}</p>
                <p><strong>Velocidade:</strong> ${item.speed.quantity || 0} ${item.speed.unit || ''}</p>
                <p><strong>Custo:</strong> ${item.cost?.quantity || 0} ${item.cost?.unit || ''}</p>
                <p><strong>Peso:</strong> ${item.weight || 0} lbs</p>
                ${item.desc ? `<p><strong>Descrição:</strong> ${item.desc.join(' ')}</p>` : ''}
                <button onclick="loadAllEquipment()">Voltar para lista</button>
            </div>
        `;}
        else {
        resultsDiv.innerHTML = `
            <div class="item">
                <h2>${item.name}</h2>
                <p><strong>Categoria:</strong> ${item.equipment_category?.name || 'N/A'}</p>
                <p><strong>Custo:</strong> ${item.cost?.quantity || 0} ${item.cost?.unit || ''}</p>
                <p><strong>Peso:</strong> ${item.weight || 0} lbs</p>
                ${item.desc ? `<p><strong>Descrição:</strong> ${item.desc.join(' ')}</p>` : ''}
                <button onclick="loadAllEquipment()">Voltar para lista</button>
            </div>
        `;}
    } catch (error) {
        resultsDiv.innerHTML = '<div>Erro ao carregar detalhes do item</div>';
        console.error('Erro:', error);
    }
}

searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredEquipment = allEquipment.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );
    displayResults(filteredEquipment);
});

loadAllEquipment();