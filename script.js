async function buscarAlimentoIA() {
    const input = document.getElementById('foodSearch');
    const alimento = input ? input.value.trim() : '';

    if (!alimento) {
        alert("Por favor escribe un alimento o platillo.");
        return;
    }

    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
        alert("Por favor configura tu API Key de OpenRouter primero.");
        return;
    }

    const resultDiv = document.getElementById('ia-result');
    if (resultDiv) {
        resultDiv.innerHTML = '<div class="text-center p-4"><i class="fas fa-spinner fa-spin text-2xl text-pink-500"></i><p class="mt-2 text-sm text-gray-600">Consultando con IA...</p></div>';
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "openrouter/auto",
                "messages": [
                    {
                        "role": "system",
                        "content": "Eres un asistente médico experto y amable. Analiza si el alimento es seguro para el tratamiento (Dotbal, Moxifloxacino, Azitromicina). Reglas: Prohibido alcohol y lácteos; carnes grasosas o fritas prohibidas por sobrecarga hepática. Responde de forma BREVE y amable. Inicia obligatoriamente con el semáforo y emoji correspondiente: 🟢 **PERMITIDO**, 🟡 **PRECAUCIÓN** o 🔴 **PROHIBIDO**, seguido de una explicación corta y directa del porqué."
                    },
                    {
                        "role": "user",
                        "content": `¿Es seguro consumir: ${alimento}?`
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.choices && data.choices.length > 0) {
            const respuesta = data.choices[0].message.content;
            if (resultDiv) {
                resultDiv.innerHTML = `
                    <div class="bg-pink-50 border-l-4 border-pink-500 p-3.5 rounded-2xl shadow-sm mt-3 text-xs">
                        <p class="text-slate-700 whitespace-pre-line leading-relaxed">${respuesta}</p>
                    </div>`;
            }
        } else {
            throw new Error(data.error?.message || "Respuesta no válida");
        }
    } catch (error) {
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="bg-red-50 border-l-4 border-red-500 p-3.5 rounded-2xl text-red-700 mt-3 text-xs">
                    <p class="font-bold">Error de consulta</p>
                    <p>${error.message}. Revisa que tu clave de OpenRouter sea correcta.</p>
                </div>`;
        }
    }
}

const defaultSchedule = [
    { id: 'item-1', time: '07:00', title: 'Dotbal (4 tabletas)', desc: 'Estrictamente en ayunas con agua pura. No comer nada en 1 hora.', icon: 'fa-pills' },
    { id: 'item-2', time: '08:00', title: 'Desayuno Ligero', desc: '100% libre de grasas pesadas para asegurar la absorción.', icon: 'fa-egg' },
    { id: 'item-3', time: '14:00', title: 'Almuerzo Principal', desc: 'Rico en vegetales. ⚠️ Prohibido consumir lácteos.', icon: 'fa-bowl-rice' },
    { id: 'item-4', time: '15:00', title: 'Azitromicina + Moxifloxacino + Comp. B', desc: 'Tomar post-almuerzo con abundante agua.', icon: 'fa-capsules' }
];

let currentSchedule = [];
let checkedState = {};
let notifiedItems = {};

window.onload = function() {
    loadScheduleData();
    loadCheckedState();
    renderRoutine();
    renderEditForm();
    updateNextItemCountdown();
    
    const savedKey = localStorage.getItem('gemini_api_key');
    if(savedKey) {
        document.getElementById('geminiApiKeyInput').value = savedKey;
    }

    setInterval(verificarAlarmas, 10000);
    setInterval(updateNextItemCountdown, 30000);
};

function loadScheduleData() {
    const stored = localStorage.getItem('bf_care_schedule');
    currentSchedule = stored ? JSON.parse(stored) : [...defaultSchedule];
    sortSchedule();
}

function saveScheduleData() {
    sortSchedule();
    localStorage.setItem('bf_care_schedule', JSON.stringify(currentSchedule));
    renderRoutine();
    renderEditForm();
    updateNextItemCountdown();
}

function sortSchedule() {
    currentSchedule.sort((a, b) => a.time.localeCompare(b.time));
}

function loadCheckedState() {
    const today = new Date().toISOString().split('T')[0];
    const storedState = localStorage.getItem('bf_care_checks');
    if (storedState) {
        const parsed = JSON.parse(storedState);
        checkedState = (parsed.date === today) ? (parsed.items || {}) : {};
    }
}

function toggleCheck(id) {
    checkedState[id] = !checkedState[id];
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('bf_care_checks', JSON.stringify({ date: today, items: checkedState }));
    updateNextItemCountdown();
}

function resetCheckboxes() {
    checkedState = {};
    notifiedItems = {};
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('bf_care_checks', JSON.stringify({ date: today, items: {} }));
    renderRoutine();
    updateNextItemCountdown();
}

function renderRoutine() {
    const container = document.getElementById('routineList');
    container.innerHTML = '';
    currentSchedule.forEach(item => {
        const isChecked = checkedState[item.id] ? 'checked' : '';
        container.innerHTML += `
            <div class="glass-card rounded-3xl p-4 shadow-sm relative overflow-hidden transition">
                <div class="absolute top-0 right-0 bg-pinkish-300 text-white px-3.5 py-1 rounded-bl-2xl font-bold text-xs">
                    ${formatTime12h(item.time)}
                </div>
                <h3 class="title-font text-base text-pinkish-600 font-bold mb-1 flex items-center gap-2 pr-16">
                    <i class="fa-solid ${item.icon || 'fa-prescription-bottle-medical'} text-pinkish-400"></i> ${item.title}
                </h3>
                <p class="text-xs text-slate-600 mb-3 bg-white/70 p-2.5 rounded-xl border border-pinkish-100">${item.desc}</p>
                <div class="flex items-center gap-2">
                    <input type="checkbox" id="${item.id}" ${isChecked} onchange="toggleCheck('${item.id}')" class="custom-checkbox w-5 h-5 accent-pinkish-500 rounded cursor-pointer">
                    <label for="${item.id}" class="text-xs font-bold text-slate-700 cursor-pointer">¡Completado / Tomado!</label>
                </div>
            </div>
        `;
    });
}

function renderEditForm() {
    const container = document.getElementById('editScheduleList');
    container.innerHTML = '';
    currentSchedule.forEach((item, index) => {
        container.innerHTML += `
            <div class="bg-white/80 p-3 rounded-2xl border border-pinkish-200 text-xs space-y-2">
                <div class="flex items-center justify-between gap-2">
                    <input type="text" value="${item.title}" onchange="updateItemField(${index}, 'title', this.value)" class="font-bold text-slate-800 bg-transparent border-b border-pinkish-200 focus:outline-none w-full">
                    <input type="time" value="${item.time}" onchange="updateItemField(${index}, 'time', this.value)" class="bg-pinkish-50 px-2 py-1 rounded-lg border font-bold text-slate-700">
                    <button onclick="deleteItem(${index})" class="text-rose-400 hover:text-rose-600 px-1"><i class="fa-solid fa-trash"></i></button>
                </div>
                <input type="text" value="${item.desc}" onchange="updateItemField(${index}, 'desc', this.value)" class="text-slate-600 text-[11px] w-full bg-transparent border-b border-pinkish-100 focus:outline-none">
            </div>
        `;
    });
}

function updateItemField(index, key, value) {
    currentSchedule[index][key] = value;
    saveScheduleData();
}

function deleteItem(index) {
    currentSchedule.splice(index, 1);
    saveScheduleData();
}

function addCustomItem() {
    const title = document.getElementById('newTitle').value.trim();
    const time = document.getElementById('newTime').value;
    const desc = document.getElementById('newDesc').value.trim();
    if (!title || !time) {
        alert('Por favor escribe al menos un nombre y un horario 💕');
        return;
    }
    currentSchedule.push({ id: 'custom-' + Date.now(), time, title, desc: desc || 'Recordatorio personalizado.', icon: 'fa-heart' });
    saveScheduleData();
    document.getElementById('newTitle').value = '';
    document.getElementById('newTime').value = '';
    document.getElementById('newDesc').value = '';
}

function restoreDefaults() {
    if (confirm('¿Restablecer los horarios a sus valores originales?')) {
        currentSchedule = JSON.parse(JSON.stringify(defaultSchedule));
        saveScheduleData();
    }
}

function updateNextItemCountdown() {
    if (!currentSchedule.length) return;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    let next = null;
    for (let item of currentSchedule) {
        const [h, m] = item.time.split(':').map(Number);
        if ((h * 60 + m) >= currentMinutes && !checkedState[item.id]) {
            next = item;
            break;
        }
    }
    if (!next) next = currentSchedule.find(i => !checkedState[i.id]) || currentSchedule[0];
    document.getElementById('nextItemName').innerText = next.title;
    document.getElementById('nextItemTime').innerText = formatTime12h(next.time);
}

function formatTime12h(time24) {
    if (!time24) return '';
    let [h, m] = time24.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m < 10 ? '0' + m : m} ${ampm}`;
}

function switchTab(tabName) {
    ['horarios', 'config', 'comida', 'alertas'].forEach(t => {
        document.getElementById('sec-' + t).classList.add('hidden');
        const btn = document.getElementById('tab-' + t);
        btn.classList.remove('bg-pinkish-400', 'text-white', 'shadow-sm');
        btn.classList.add('text-pinkish-500');
    });
    document.getElementById('sec-' + tabName).classList.remove('hidden');
    const activeBtn = document.getElementById('tab-' + tabName);
    activeBtn.classList.add('bg-pinkish-400', 'text-white', 'shadow-sm');
    activeBtn.classList.remove('text-pinkish-500');
}

function guardarApiKey(key) {
    localStorage.setItem("gemini_api_key", key.trim());
    alert("¡API Key de OpenRouter guardada con éxito! 💕");
}

let alarmAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
function solicitarPermisoNotificaciones() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

function verificarAlarmas() {
    const ahora = new Date();
    const horaActual = String(ahora.getHours()).padStart(2, '0') + ":" + String(ahora.getMinutes()).padStart(2, '0');
    currentSchedule.forEach(task => {
        if (task.time === horaActual && !notifiedItems[task.id] && !checkedState[task.id]) {
            alarmAudio.play().catch(e => console.log(e));
            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("¡Hora de tu medicina! 💕", { body: `Es momento de: ${task.title}. ¡Tómatelo con agüita y amor!` });
            }
            alert(`🚨 ¡ALARMA DE AMOR! 🚨\n\nEs hora de: ${task.title}`);
            notifiedItems[task.id] = true;
        }
    });
}
