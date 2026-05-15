// === Oefening 1: manipulatie via style property (Tekststijl) ===
{
   // declaraties
   const btnToggleCase = document.querySelector('#ex1-btnToggleCase');
   const selBgColor = document.querySelector('#ex1-selBgColor');
   const inpSize = document.querySelector('#ex1-inpSize');
   const lblSize = document.querySelector('#ex1-lblSize');
   const inpColor = document.querySelector('#ex1-inpColor');
   const inpItalic = document.querySelector('#ex1-inpItalic');
   const parText = document.querySelector('#ex1-txt');

   // event handlers
   function handleBtnToggleCaseClick() {
      if (btnToggleCase.innerText === 'zet aan') {
         parText.style.textTransform = 'uppercase';
         btnToggleCase.innerText = 'zet uit';
      } else {
         btnToggleCase.innerText = 'zet aan';
         parText.style.textTransform = 'inherit';
      }
   }

   function handleSelBgColorChange(e) {
      parText.style.backgroundColor = selBgColor.value;
   }

   function handleInpSizeInput() {
      parText.style.fontSize = `${this.value}px`;
      lblSize.innerText = this.value;
   }

   function handleInpColorInput() {
      parText.style.color = this.value;
   }

   function handleInpItalicChange() {
      parText.style.fontStyle = inpItalic.checked ? 'italic' : 'normal';
   }

   // events
   btnToggleCase.addEventListener('click', handleBtnToggleCaseClick);
   selBgColor.addEventListener('change', handleSelBgColorChange);
   inpSize.addEventListener('input', handleInpSizeInput);
   inpColor.addEventListener('input', handleInpColorInput);
   inpItalic.addEventListener('change', handleInpItalicChange);
}

// === Oefening 2: classList (twee deeloefeningen) ===
{
   // Deeloefening 1: één knop
   const imgVaas = document.querySelector('#ex2-html1 img');
   const btnToggle = document.querySelector('#ex2-html1 button');
   function handleBtnToggleClick() {
      imgVaas.classList.toggle('bordered');
   }
   btnToggle.addEventListener('click', handleBtnToggleClick);

   // Deeloefening 2: drie knoppen
   const imgVaas2 = document.querySelector('#ex2-html2 img');
   const buttons = document.querySelectorAll('#ex2-html2 .stylebutton');

   function handleBtnStijlClick(e) {
      // huidige stijl verwijderen
      const stijlen = [...buttons].map(b => b.dataset.stijl);
      imgVaas2.classList.remove(...stijlen);

      // nieuwe stijl toekennne
      const nieuweStijl = e.target.dataset.stijl;
      imgVaas2.classList.add(nieuweStijl);

      // active aanpassen
      e.target.classList.add('active');
      document.querySelector('.stylebutton.active').classList.remove('active');
   }

   buttons.forEach(b => b.addEventListener('click', handleBtnStijlClick))
}

// === Oefening 3: menu (e.target vs this) ===
{
   const lisMenu = document.querySelectorAll('#ex3-html .ex3-menu li');
   const spnMenuKeuze = document.querySelector('#ex3-html .message span');

   function handleLiMenuClick(e) {
      e.preventDefault();
      const lnkClicked = e.target; // A 
      const liClicked = this; // LI
      spnMenuKeuze.innerText = lnkClicked.innerText;
      lisMenu.forEach(li => li.classList.remove('selected'));
      liClicked.classList.add('selected');
   }

   lisMenu.forEach(li => li.addEventListener('click', handleLiMenuClick));
}

// === Oefening 4: dataset (pralines) ===
{
   const lisPralines = document.querySelectorAll('#ex4-html .ex4-pralines li');
   const ddName = document.querySelector('#ex4-html .name');
   const ddCals = document.querySelector('#ex4-html .cals');
   const ddDesc = document.querySelector('#ex4-html .desc');

   function handlePrClick(e) {
      // aangeklikte LI en geneste IMG
      const listItem = this; // of e.target.parentNode
      const img = listItem.querySelector('img'); // of e.target, maar controleer dan e.target.nodeName == 'IMG'

      // pas selected aan
      const geselecteerd = document.querySelector('#ex4-html .ex4-pralines .selected');
      if (geselecteerd) geselecteerd.classList.remove('selected');
      listItem.classList.add('selected');

      // toon gegevens
      ddName.textContent = listItem.dataset.name;
      ddCals.textContent = listItem.dataset.cal;
      ddDesc.textContent = img.alt;
   }

   lisPralines.forEach(liPr => {
      liPr.addEventListener('click', handlePrClick);
   });
}

// === Oefening 5: rekeningnummer validator ===
{
   // declaraties
   const inpRekening = document.querySelector('#ex5-html input');
   const btnWis = document.querySelector('#ex5-btnWis');

   // functies
   function valideerNummer(nr) {
      nr = nr.replace(/\D/g, '');
      if (nr.length != 12) return false;
      const eerste10 = parseInt(nr.slice(0, 10), 10);
      const controle = parseInt(nr.slice(10, 12), 10);
      return eerste10 % 97 === controle;
   }

   // handlers
   function handleInpRekeningKeydown(e) {
      const toets = e.key;
      if (!/[0-9]/.test(toets) || inpRekening.value.length >= 14) e.preventDefault();
   }

   function handleInpRekeningInput() {
      // streepjes bijzetten
      const waarde = inpRekening.value;
      if (waarde.length == 3 || waarde.length == 11) inpRekening.value += '-';

      // valideren
      inpRekening.classList.remove('right', 'wrong');
      if (waarde.length === 14) {
         inpRekening.classList.add(valideerNummer(waarde) ? 'right' : 'wrong');
      }

      // wissen knop tonen
      btnWis.classList.toggle('hidden', inpRekening.value.length === 0);
   }

   function handleBtnWisClick() {
      inpRekening.value = '';
      inpRekening.classList.remove('right', 'wrong');
      btnWis.classList.add('hidden');
   }

   // events koppelen
   inpRekening.addEventListener('keydown', handleInpRekeningKeydown);
   inpRekening.addEventListener('input', handleInpRekeningInput);
   btnWis.addEventListener('click', handleBtnWisClick);
}
