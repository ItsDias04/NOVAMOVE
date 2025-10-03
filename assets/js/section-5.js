    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const accordion = header.parentElement;
        accordion.classList.toggle('open');
        
        const content = accordion.querySelector('.accordion-content');
        const span = header.querySelector('span');
        
        if (accordion.classList.contains('open')) {
          content.style.maxHeight = content.scrollHeight + "px";
          span.classList.toggle('rotate');
        } else {
          content.style.maxHeight = 0;
          span.classList.toggle('rotate');
        }
      });
    });

    // Табы
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });

      function setActive(btn) {
    const buttons = document.querySelectorAll('.switch button');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }