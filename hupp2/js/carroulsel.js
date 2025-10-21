document.addEventListener('DOMContentLoaded', () => {
    const galleryWrapper = document.querySelector('.gallery-wrapper');
    const gallery = document.querySelector('.gallery');
    const arrowLeft = document.querySelector('.arrow-left');
    const arrowRight = document.querySelector('.arrow-right');
    const cardItems = document.querySelectorAll('.item');

    // O tempo de transição em milissegundos (0.3s = 300ms)
    const TRANSITION_DURATION = 300; 
    
    // Obter as dimensões
    const cardWidth = cardItems[0].offsetWidth; // 550px
    const cardGap = 25; // Gap do CSS
    const scrollDistance = cardWidth + cardGap; // Distância total de um movimento

    // --- Configuração para Loop Infinito (Clonagem) ---
    const numToClone = 3; 
    
    // Clonagem (mantemos igual)
    for (let i = 0; i < numToClone; i++) {
        const clone = cardItems[cardItems.length - 1 - i].cloneNode(true);
        gallery.prepend(clone);
    }
    for (let i = 0; i < numToClone; i++) {
        const clone = cardItems[i].cloneNode(true);
        gallery.appendChild(clone);
    }

    // O índice do primeiro item real após os clones
    const firstRealItemIndex = numToClone;
    const totalOriginalItems = cardItems.length;

    // --- CÁLCULO DE CENTRALIZAÇÃO INICIAL ---

    // 1. Posição inicial do primeiro card real (lado esquerdo)
    const initialOffset = firstRealItemIndex * scrollDistance; 

    // 2. Deslocamento para Centralizar o Card
    // (Largura da Área Visível / 2) - (Largura do Card / 2)
    const wrapperCenter = galleryWrapper.offsetWidth / 2;
    const cardCenter = cardWidth / 2;
    const centeringAdjustment = wrapperCenter - cardCenter;

    // 3. Posição FINAL de Início (Centralizada)
    // Deslocamento para o primeiro item + ajuste de centralização
    const startingTransform = initialOffset - centeringAdjustment;

    // --- Posicionamento Inicial ---
    
    // Define a posição inicial para o primeiro item real CENTRADO
    gallery.style.transition = 'none'; // Desativa temporariamente
    gallery.style.transform = `translateX(-${startingTransform}px)`;

    // Reativa a transição após o posicionamento inicial
    setTimeout(() => {
        gallery.style.transition = ''; // Volta a usar o CSS
    }, 50);

    // --- Estado do Carrossel ---
    let currentIndex = 0;
    let isTransitioning = false;

    // --- Função de Movimento ---
    const moveGallery = (direction) => {
        if (isTransitioning) return;
        isTransitioning = true;

        currentIndex += direction;

        // Calcula o transform para o item alvo
        // Aqui usamos o índice do card (currentIndex + firstRealItemIndex)
        // multiplicado pela distância de rolagem, e APLICAMOS o ajuste de centralização.
        const targetCardIndex = currentIndex + firstRealItemIndex;
        const targetOffset = (targetCardIndex * scrollDistance) - centeringAdjustment;
        
        gallery.style.transform = `translateX(-${targetOffset}px)`;

        // --- Lógica de Teletransporte (Infinito) ---
        setTimeout(() => {
            let shouldTeleport = false;
            let newTransformOffset = 0;

            // Se moveu para a direita (alcançou o clone final)
            if (currentIndex >= totalOriginalItems) {
                currentIndex = 0;
                shouldTeleport = true;
                // O novo offset é a posição inicial (primeiro card real)
                newTransformOffset = initialOffset; 

            // Se moveu para a esquerda (alcançou o clone inicial)
            } else if (currentIndex < 0) {
                currentIndex = totalOriginalItems - 1;
                shouldTeleport = true;
                // O novo offset é a posição do último card real
                const lastRealItemIndex = totalOriginalItems - 1 + firstRealItemIndex;
                newTransformOffset = lastRealItemIndex * scrollDistance;
            }

            if (shouldTeleport) {
                // Aplica o teletransporte e o ajuste de centralização
                gallery.style.transition = 'none';
                gallery.style.transform = `translateX(-${newTransformOffset - centeringAdjustment}px)`;
            }

            // Reativa a transição e permite o próximo clique
            setTimeout(() => {
                gallery.style.transition = '';
                isTransitioning = false;
            }, 50);
        }, TRANSITION_DURATION);
    };

    // --- Event Listeners ---
    arrowRight.addEventListener('click', () => moveGallery(1));
    arrowLeft.addEventListener('click', () => moveGallery(-1));
});