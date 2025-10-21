/**
 * Script para aplicar o efeito fade-in (surgimento suave) 
 * quando os elementos entram na viewport.
 * * O Intersection Observer é inerentemente leve e performático, 
 * por ser assíncrono e não depender do evento 'scroll'.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona todos os elementos com a classe 'hupp-fade-in-element' (Novo nome para evitar conflito)
    const fadeElements = document.querySelectorAll('.hupp-fade-in-element');

    // Se não houver elementos, sai.
    if (fadeElements.length === 0) return;

    // 2. Define as opções para o Intersection Observer
    const observerOptions = {
        root: null, 
        // rootMargin ajustado: 100px para que o elemento comece a carregar um pouco antes de chegar ao fim da tela.
        rootMargin: '0px 0px -100px 0px', 
        // threshold: 0 significa que o callback é executado assim que 1 pixel do elemento for visível.
        threshold: 0 
    };

    // 3. Cria o callback
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Adiciona a classe que deve usar SÓ 'opacity' e 'transform' no CSS
                entry.target.classList.add('hupp-faded-in');
                
                // OTIMIZAÇÃO: Para de observar o elemento para liberar recursos
                observer.unobserve(entry.target); 
            }
        });
    };

    // 4. Cria o Intersection Observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // 5. Inicia a observação em cada elemento
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});