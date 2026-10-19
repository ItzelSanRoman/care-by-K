const baseAlimentos = [
    {
        keywords: ['cerdo', 'puerco', 'carnitas', 'chicharron', 'tocino', 'longaniza', 'chorizo'],
        estado: '<i class="fa-solid fa-ban text-red-500"></i> PROHIBIDO <i class="fa-solid fa-ban text-red-500"></i>',
        tipo: 'red',
        motivo: 'El cerdo es alto en grasas saturadas y dificulta el trabajo del hígado con Dotbal. Solo se permiten cortes 100% magros (como lomo magro) cocinados al vapor o asados sin aceite, pero evita fritos y carnitas.'
    },
    {
        keywords: ['tacos', 'taco', 'pastor', 'suadero', 'barbacoa', 'birria'],
        estado: '<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> PRECAUCIÓN <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>',
        tipo: 'yellow',
        motivo: 'Si son de pechuga de pollo o carne asada magra con tortillas a la plancha, son permitidos. Evita tacos grasosos (suadero, pastor, carnitas) y salsas demasiado irritantes.'
    },
    {
        keywords: ['leche', 'queso', 'yogurt', 'crema', 'lacteos', 'licuado'],
        estado: '🔴 **PROHIBIDO EN EL ALMUERZO** / <i class="fa-solid fa-triangle-exclamation text-amber-500"></i> SOLO EN CENA <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>',
        tipo: 'red',
        motivo: 'El calcio de los lácteos bloquea totalmente la absorción del Moxifloxacino. Prohibido consumir lácteos entre 12:00 PM y 6:00 PM. Consúmelos únicamente en la cena.'
    },
    {
        keywords: ['cerveza', 'vino', 'tequila', 'mezcal', 'rum', 'alcohol', 'margarita', 'michelada'],
        estado: '🔴 **PROHIBIDO ABSOLUTO**',
        tipo: 'red',
        motivo: 'Cero tolerancia a bebidas alcohólicas. La combinación de alcohol con Dotbal puede causar hepatitis fulminante o daño hepático severo.'
    },
    {
        keywords: ['cafe', 'cafecito', 'espresso', 'cappuccino'],
        estado: '<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> PRECAUCIÓN <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>',
        tipo: 'yellow',
        motivo: 'El Moxifloxacino reduce la eliminación de cafeína y puede causarte taquicardia o ansiedad. Limítalo a máximo 1 taza pequeña por la mañana.'
    },
    {
        keywords: ['pollo', 'pechuga', 'caldo de pollo', 'pollo asado'],
        estado: '🟢 **PERMITIDO**',
        tipo: 'green',
        motivo: 'Es una de las mejores proteínas para tu recuperación. Consúmelo a la plancha, hervido o en caldo sin piel.'
    },
    {
        keywords: ['pescado', 'atun', 'filete', 'salmon', 'mariscos'],
        estado: '🟢 **PERMITIDO**',
        tipo: 'green',
        motivo: 'Excelente fuente de proteína magra de fácil digestión. Prepáralo a la plancha o al vapor (evita empanizados o fritos en aceite).'
    },
    {
        keywords: ['huevo', 'huevos', 'blanquillo'],
        estado: '🟢 **PERMITIDO**',
        tipo: 'green',
        motivo: 'Muy saludable. Prepáralo cocido, tibio o revuelto con poco aceite en el desayuno o cena.'
    },
    {
        keywords: ['frijoles', 'lentejas', 'garbanzos', 'habas'],
        estado: '🟢 **PERMITIDO**',
        tipo: 'green',
        motivo: 'Altos en fibra y nutrientes. Consúmelos de olla o guisados sin manteca de cerdo.'
    },
    {
        keywords: ['tortilla', 'tortillas', 'maiz'],
        estado: '🟢 **PERMITIDO**',
        tipo: 'green',
        motivo: 'La tortilla de maíz es una fuente saludable de carbohidratos. Evita totopos o tortillas fritas en aceite.'
    },
    {
        keywords: ['arroz', 'sopa de arroz'],
        estado: '🟢 **PERMITIDO**',
        tipo: 'green',
        motivo: 'Fácil de digerir y suave para el estómago. De preferencia arroz blanco o integral cocido.'
    },
    {
        keywords: ['aguacate', 'guacamole'],
        estado: '🟢 **PERMITIDO**',
        tipo: 'green',
        motivo: 'Grasa saludable protectora para tu cuerpo. Consúmelo con moderación.'
    },
    {
        keywords: ['fruta', 'manzana', 'platano', 'papaya', 'fresa', 'melon', 'sandia', 'naranja', 'limon'],
        estado: '🟢 **PERMITIDO**',
        tipo: 'green',
        motivo: 'Llenas de vitaminas y antioxidantes esenciales para tu sistema inmune.'
    },
    {
        keywords: ['verduras', 'ensalada', 'nopal', 'nopales', 'calabacita', 'brocoli', 'zanahoria', 'jitomate'],
        estado: '🟢 **PERMITIDO**',
        tipo: 'green',
        motivo: 'Excelente base alimenticia para proteger tu hígado y mejorar la digestión.'
    },
    {
        keywords: ['refresco', 'coca', 'soda', 'coca cola', 'pepsi'],
        estado: '<i class="fa-solid fa-ban text-red-500"></i> PROHIBIDO <i class="fa-solid fa-ban text-red-500"></i>',
        tipo: 'red',
        motivo: 'Su alto contenido de azúcar y quimicos sobrecarga los riñones y causa irritación gástrica con tus medicamentos.'
    },
    {
        keywords: ['pan', 'pan dulce', 'galletas', 'pastel'],
        estado: '<i class="fa-solid fa-triangle-exclamation text-amber-500"></i> PRECAUCIÓN <i class="fa-solid fa-triangle-exclamation text-amber-500"></i>',
        tipo: 'yellow',
        motivo: 'Consumir con moderación. El exceso de azúcares y grasas refinadas puede causar pesadez estomacal.'
    },
    {
        keywords: ['agua', 'agua pura', 'jamaica', 'horchata'],
        estado: '🟢 **PERMITIDO**',
        tipo: 'green',
        motivo: 'El agua pura es fundamental. Toma mínimo 2 litros al día para ayudar a filtrar los medicamentos.'
    }
];

function buscarAlimentoLocal() {
    const input = document.getElementById('foodSearch');
    const busqueda = input ? input.value.trim().toLowerCase() : '';
    const resultDiv = document.getElementById('ia-result');

    if (!resultDiv) return;

    if (!busqueda) {
        resultDiv.innerHTML = '';
        return;
    }

    const encontrado = baseAlimentos.find(item => 
        item.keywords.some(kw => busqueda.includes(kw) || kw.includes(busqueda))
    );

    if (encontrado) {
        let borderClass = 'border-pink-500 bg-pink-50 text-pink-800';
        if (encontrado.tipo === 'green') borderClass = 'border-emerald-500 bg-emerald-50 text-emerald-800';
        if (encontrado.tipo === 'yellow') borderClass = 'border-amber-500 bg-amber-50 text-amber-800';
        if (encontrado.tipo === 'red') borderClass = 'border-red-500 bg-red-50 text-red-800';

        resultDiv.innerHTML = `
            <div class="border-l-4 ${borderClass} p-3.5 rounded-2xl shadow-sm mt-3 text-xs">
                <p class="font-bold text-sm mb-1">${encontrado.estado}</p>
                <p class="leading-relaxed">${encontrado.motivo}</p>
            </div>`;
    } else {
        resultDiv.innerHTML = `
            <div class="bg-white border-2 border-pinkish-200 p-3.5 rounded-2xl shadow-sm mt-3 text-xs text-center space-y-2">
                <p class="text-slate-600">Alimento no encontrado en la lista rápida de México.</p>
                <button onclick="buscarAlimentoIA()" class="bg-pinkish-400 hover:bg-pinkish-500 text-white px-4 py-2 rounded-xl font-bold shadow-sm inline-flex items-center gap-1.5">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Consultar a la IA
                </button>
            </div>`;
    }
}
