const ITEM_KEY = 'naam';
localStorage.setItem(ITEM_KEY, 'Jan'); // opslaan

// === Oefening 1: clipboard ===
{
   // declaraties
   const txtTekst = document.querySelector('#ex1-html textarea');
   const btnCopy = document.querySelector('#ex1-html button');
   const parMsg = document.querySelector('#ex1-html .message');

   // event handler functies
   async function handleBtnCopyClick() {
      parMsg.textContent = '';
      await navigator.clipboard.writeText(txtTekst.value);
      parMsg.textContent = 'gekopieerd naar klembord.';
   }

   // events koppelen
   btnCopy.addEventListener('click', handleBtnCopyClick);
}

// === Oefening 2: localStorage ===
{
   // declaraties
   const inpNaam = document.querySelector('#ex2-inpNaam');
   const btnOpslaan = document.querySelector('#ex2-btnOpslaan');
   const btnLaden = document.querySelector('#ex2-btnLaden');
   const THE_KEY = 'spelernaam';

   // event handler functies
   function handleBtnOpslaanClick() {
      localStorage.setItem(THE_KEY, inpNaam.value);
   }
   function handleBtnLadenClick() {
      const opgeslagen = localStorage.getItem(THE_KEY);
      if (opgeslagen !== null) inpNaam.value = opgeslagen;
   }

   // events koppelen
   btnOpslaan.addEventListener('click', handleBtnOpslaanClick);
   btnLaden.addEventListener('click', handleBtnLadenClick);

   // startup
   const opgeslagen = localStorage.getItem(THE_KEY);
   if (opgeslagen !== null) inpNaam.value = opgeslagen;
}

// === Oefening 3: localStorage met JSON (todo-lijst) ===
{
   // declaraties
   const lstTaken = document.querySelector('#ex3-lijst');
   const inpTaak = document.querySelector('#ex3-inpTaak');
   const SLEUTEL = 'ex3-lijst';

   // gewone functies
   function loadLijst() {
      const opgeslagen = localStorage.getItem(SLEUTEL);
      if (opgeslagen === null) return;
      const items = JSON.parse(opgeslagen);
      lstTaken.innerHTML = items.map(tekst => `<li>${tekst}</li>`).join('');
   }

   function saveLijst() {
      const lis = lstTaken.querySelectorAll('li');
      const items = [...lis].map(li => li.innerText);
      localStorage.setItem(SLEUTEL, JSON.stringify(items));
   }

   // event handler functies
   function handleLijstClick(e) {
      if (e.target.tagName != 'LI') return;
      e.target.remove();
      saveLijst();
   }

   function handleInpTaakKeydown(e) {
      if (e.key != 'Enter') return;
      e.preventDefault();
      const tekst = inpTaak.value.trim();
      if (tekst === '') return;
      lstTaken.innerHTML += `<li>${tekst}</li>`;
      inpTaak.value = '';
      saveLijst();
   }

   // events koppelen
   lstTaken.addEventListener('click', handleLijstClick);
   inpTaak.addEventListener('keydown', handleInpTaakKeydown);

   // startup
   loadLijst();
}

// === Oefening 4: webcam + canvas ===
{
   // inits
   const vidWebcam = document.querySelector('#ex4-html video');
   const canvas = document.querySelector('#ex4-html canvas');
   const spnPercentage = document.querySelector('#ex4-html .message span');
   const prgPercentage = document.querySelector('#ex4-html progress');
   const btnStartWebcam = document.querySelector('#ex4-html .button');

   // functions
   function getLightnessFromCanvas(cnv) {
      const context = cnv.getContext('2d');
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let sumLightness = 0;
      const pixelCount = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
         const r = data[i];
         const g = data[i + 1];
         const b = data[i + 2];
         const lightness = (r + g + b) / 3;
         sumLightness += lightness;
      }
      const avgLightness = sumLightness / pixelCount; // 0–255
      const lightnessPercent = (avgLightness / 255 * 100).toFixed(2); // 0–100%
      return lightnessPercent;
   }

   // event handlers
   function takeSnapshot() {
      const context = canvas.getContext('2d');
      context.filter = getComputedStyle(vidWebcam).getPropertyValue('filter');
      context.drawImage(vidWebcam, 0, 0, 133, 100);
      const lightness = getLightnessFromCanvas(canvas);
      prgPercentage.value = lightness;
      spnPercentage.innerText = `${lightness}%`;
   }

   async function handleBtnStartWebcamClick() {
      vidWebcam.autoplay = true;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      vidWebcam.srcObject = stream;
      setInterval(takeSnapshot, 1000); // elke seconde een snapshot
   }

   // events koppelen
   btnStartWebcam.addEventListener('click', handleBtnStartWebcamClick);
}

// === Oefening 5: web speech ===
{
   // declaraties
   const inpTekst = document.querySelector('#ex5-inpTekst');
   const btnSpreek = document.querySelector('#ex5-btnSpreek');

   // event handler functies
   function handleBtnSpreekClick() {
      const tekst = inpTekst.value.trim();
      if (tekst === '') return;
      const u = new SpeechSynthesisUtterance(tekst);
      u.lang = 'nl-BE';
      speechSynthesis.speak(u);
   }

   // events koppelen
   btnSpreek.addEventListener('click', handleBtnSpreekClick);
}

// === Oefening 6: requestAnimationFrame ===
{
   // declaraties
   const divBlokje = document.querySelector('#ex6-html .blokje');
   const btnStartStop = document.querySelector('#ex6-html .btnStart');
   let isMoving = false;
   let xPosition = 0; 

   // gewone functies
   function doAnimate() {
      if (isMoving) {
         xPosition += 1;
         if (xPosition >= 300) {
            isMoving = false;
            xPosition = 0;
            btnStartStop.innerText = 'Start';
         }
         divBlokje.style.left = xPosition + 'px';
      }
      requestAnimationFrame(doAnimate);
   }

   // event handler functies
   function handleBtnClick() {
      isMoving = !isMoving;
      btnStartStop.innerText = isMoving ? 'Stop' : 'Start';
   }

   // events koppelen
   btnStartStop.addEventListener('click', handleBtnClick);

   // start loop
   doAnimate();
}
