document.addEventListener('DOMContentLoaded', () => {
    // MUDANÇA: Seletores com o prefixo 'hupp-'
    const galleryWrapper = document.querySelector('.hupp-carousel-wrapper');
    const gallery = document.querySelector('.hupp-gallery');
    const cardItems = document.querySelectorAll('.hupp-item');

    // --- Configurações ---
    const TRANSITION_DURATION = 800; // Duração da animação (0.8s)
    const AUTO_SLIDE_INTERVAL = 4000; // Tempo de espera entre os slides (4 segundos)
    const numToClone = 3; 

    // Obter dimensões após o DOM estar pronto
    const cardWidth = cardItems[0].offsetWidth; 
    const cardGap = 25; 
    const scrollDistance = cardWidth + cardGap; 

    const totalOriginalItems = cardItems.length;

    // --- 1. Clonagem para o Efeito Infinito ---
    // Clonagem (lógica mantida)
    for (let i = 0; i < numToClone; i++) {
        const clone = cardItems[cardItems.length - 1 - i].cloneNode(true);
        gallery.prepend(clone);
    }
    for (let i = 0; i < numToClone; i++) {
        const clone = cardItems[i].cloneNode(true);
        gallery.appendChild(clone);
    }

    // --- 2. Centralização Inicial ---
    
    const firstRealItemIndex = numToClone;
    
    // Cálculo do ajuste de centralização
    const wrapperCenter = galleryWrapper.offsetWidth / 2;
    const cardCenter = cardWidth / 2;
    const centeringAdjustment = wrapperCenter - cardCenter;

    // Posição inicial: (Índice do 1º card real * Distância) - Ajuste
    const startingTransform = (firstRealItemIndex * scrollDistance) - centeringAdjustment;

    // Posicionamento Inicial SEM transição
    gallery.style.transition = 'none'; 
    gallery.style.transform = `translateX(-${startingTransform}px)`;

    // Reativa a transição após um pequeno atraso (sincronizando com o CSS)
    setTimeout(() => {
        gallery.style.transition = `transform ${TRANSITION_DURATION / 1000}s cubic-bezier(0.42, 0, 0.58, 1)`;
    }, 50);

    // --- 3. Lógica do Carrossel Automático ---

    let currentIndex = 0; 
    let isTransitioning = false;
    
    const moveGallery = () => {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex += 1; // Move para o próximo

        // Calcula a posição física alvo
        const targetCardIndex = currentIndex + firstRealItemIndex;
        const targetOffset = (targetCardIndex * scrollDistance) - centeringAdjustment;
        
        gallery.style.transform = `translateX(-${targetOffset}px)`;

        // --- Lógica de Teletransporte ---
        setTimeout(() => {
            if (currentIndex >= totalOriginalItems) {
                
                // Reseta o índice lógico
                currentIndex = 0;
                
                // Posição de teletransporte (volta para o primeiro card real, centralizado)
                const newTransformOffset = (firstRealItemIndex * scrollDistance) - centeringAdjustment;

                // Teleporta Sem Transição
                gallery.style.transition = 'none';
                gallery.style.transform = `translateX(-${newTransformOffset}px)`;
            }

            // Reativa a transição e permite o próximo movimento
            setTimeout(() => {
                gallery.style.transition = '';
                isTransitioning = false;
            }, 50);
        }, TRANSITION_DURATION);
    };

    // --- Inicialização do Slide Automático ---
    setInterval(moveGallery, AUTO_SLIDE_INTERVAL);
});