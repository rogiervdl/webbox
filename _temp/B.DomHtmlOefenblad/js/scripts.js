// === Oefening 1: querySelector() ===
{
	console.log('\n%c=== querySelector ===', 'color: #0c0');
	const hdrTekoop = document.querySelector('#ex1-html h3');
	const imgVaas = document.querySelector('#ex1-html #vaas');
	const lstKenmerken = document.querySelector('#ex1-html .kenmerken');
	const itmTweedeItem = document.querySelector('#ex1-html .kenmerken li:nth-child(2)');
	const lnkDatum = document.querySelector('#ex1-html .kenmerken span.date');
	const lnkMeerInfo = document.querySelector('#ex1-html .kenmerken a');
	const tblNietGevonden = document.querySelector('#ex1-html table');
	console.log(hdrTekoop);
	console.log(imgVaas);
	console.log(lstKenmerken);
	console.log(itmTweedeItem);
	console.log(lnkDatum);
	console.log(lnkMeerInfo);
	console.log(tblNietGevonden);
}

// === Oefening 2: querySelectorAll() ===
{
	console.log('\n%c=== querySelectorAll ===', 'color: #0c0');
	const items = document.querySelectorAll('#ex2-html .item');
	console.log(`Aantal elementen met class item: ${ items.length}`);

	items.forEach(itm => {
		console.log(itm.innerText);
	});

	const receptenMetEi = [...items].map(itm => itm.innerText).filter(txt => txt.includes(' ei'));
	console.log(receptenMetEi);
}

// === Oefening 3: addEventListener() ===
{
	console.log('\n%c=== addEventListener() ===', 'color: #0c0');

   // declaraties
	const btn1 = document.querySelector('#ex3-html .btn-1');
	const btn2 = document.querySelector('#ex3-html .btn-2');
	const selKeuze = document.querySelector('#ex3-html #opties');
	const imgVaas = document.querySelector('#ex3-html img');

	// event handler functies
	function handleBtn1Click() {
		console.log('er is op button 1 geklikt');
	}
	function handleBtn2Click() {
		console.log('er is op button 2 geklikt');
	}
	function handleSelKeuzeChange() {
		console.log('nieuwe waarde gekozen');
	}
	function handleImgVaasMouseover() {
		console.log('muis over de afbeelding');
	}
	function handleImgVaasMouseout() {
		console.log('muis uit de afbeelding');
	}

	// events koppelen
	btn1.addEventListener('click', handleBtn1Click);
	btn2.addEventListener('click', handleBtn2Click);
	selKeuze.addEventListener('change', handleSelKeuzeChange);
	imgVaas.addEventListener('mouseover', handleImgVaasMouseover);
	imgVaas.addEventListener('mouseout', handleImgVaasMouseout);
}

// === Oefening 4: innerHTML en innerText ===
{
	// DOBBELSTEEN OEFENING

	// declaraties
	const btnDice = document.querySelector('#ex4-html1 #btn-dice');
	const uitvoerDice = document.querySelector('#ex4-html1 #uitvoer-dice');

	// event handler functies
	function handleBtnDiceClick() {
		const getal = Math.floor(Math.random() * 6) + 1;
		uitvoerDice.innerText = getal;
	}
	function handleBtnDiceMouseout() {
		uitvoerDice.innerText = '?';
	}

	// events koppelen
	btnDice.addEventListener('click', handleBtnDiceClick);
	btnDice.addEventListener('mouseout', handleBtnDiceMouseout);

   // AANTAL TEKENS OEFENING

	// declaraties
	const txtBericht = document.querySelector('#ex4-html2 #txt-bericht');
	const uitvoerTekensEm = document.querySelector('#ex4-html2 #uitvoer-tekens em');

	// event handler functies
	function handleTxtBerichtInput() {
		const aantal = txtBericht.value.length;
		uitvoerTekensEm.innerHTML = `${aantal} ${(aantal === 1 ? 'teken' : 'tekens')}`;
	}

	// events koppelen
	txtBericht.addEventListener('input', handleTxtBerichtInput);
}

// === Oefening 5: HTML-attributen lezen en schrijven ===
{
	// declaraties
	const imgAttribuut = document.querySelector('#ex5-html img');
	const btnVolgende = document.querySelector('#ex5-html #btn-next');
	const parBestandsnaam = document.querySelector('#ex5-html .message em');

	const blazers = ['altsax.jpg', 'bastrompet.jpg', 'bugel.jpg', 'hoorn.jpg'];
	let index = 0;

	// uitvoer bij laden
	parBestandsnaam.innerText = blazers[index];

	// event handler functies
	function handleBtnVolgendeClick() {
		index++;
		if (index >= blazers.length) index = 0;
		imgAttribuut.src = `img/${blazers[index]}`;
		parBestandsnaam.innerText = blazers[index];
	}

	// events koppelen
	btnVolgende.addEventListener('click', handleBtnVolgendeClick);
}

// === Oefening 6: validatie tekstinvoer ===
{
   // ALLEEN LETTERS EN SPATIES OEFENING

	const inpLetters = document.querySelector('#ex6-html1 input');

   function handleInpLettersInput() {
		inpLetters.value = inpLetters.value.replace(/[^a-zA-Z\s]/g, '');
	}

	inpLetters.addEventListener('input', handleInpLettersInput );

   // WACHWOORD VALIDATIE OEFENING

   // declaraties
	const inpWachtwoord = document.querySelector('#ex6-html2 [type="password"]');
	const parFout = document.querySelector('#ex6-html2 .error');

	// event handler functies
	function handleInpWachtwoordInput() {
		const w = inpWachtwoord.value;
		parFout.innerText = '';
		if (!w.length) return;
		if (w.length > 0 && w.length < 8) {
			parFout.innerText = 'moet minstens 8 tekens bevatten';
		}
		else if (!/[A-Z]/.test(w)) {
			parFout.innerText = 'moet minstens één hoofdletter bevatten';
		}
		else if (!/[0-9]/.test(w)) {
			parFout.innerText = 'moet minstens één cijfer bevatten';
		}
	}

	// events koppelen
	inpWachtwoord.addEventListener('input', handleInpWachtwoordInput);
}

// === Oefening 7: e.target ===
{
   // declaraties
   const elementen = document.querySelectorAll('#ex7-html .items > *');
   const parOutput = document.querySelector('#ex7-output');

   // event handler functie
   function handleItemsClick(e) {
      const el = e.target;
      parOutput.innerHTML = `<strong>element</strong>: ${el.nodeName}<br><strong>id</strong>: ${el.id}<br><strong>innerHTML</strong>: ${el.innerHTML ?? '—'}`;
   }

   // event koppelen aan elk element
   elementen.forEach(el => el.addEventListener('click', handleItemsClick));
}

// === Oefening 8: e.preventDefault() ===
{
   // declaraties
	const spnUitvoer = document.querySelector('#ex8-html .uitvoer span');
	const lnksCursussen = document.querySelectorAll('#ex8-html a');

   // event handler functie
   function handleLinkClick(e) {
      e.preventDefault();
      const lnk = e.target;
      spnUitvoer.innerHTML = `<strong>${lnk.innerText}</strong> (url: <a href="${lnk.href}">${lnk.href}</a>)`;
   }
   
   // events koppelen
   lnksCursussen.forEach(lnk => lnk.addEventListener('click', handleLinkClick));
}

// === Oefening 9: event bubbling ===
{
   // declaraties
	const divKleuren = document.querySelector('#ex9-html .kleuren');
	const parUitvoer = document.querySelector('#ex9-html .uitvoer span');
	const parBericht = document.querySelector('#ex9-html .bericht');
	const juisteVolgorde = ['zwart', 'geel', 'rood'];
	let volgorde = [];

	// event handler functie
	function handleDivKleurenClick(e) {
		if (!e.target.classList.contains('kleur')) return;
		const kleur = e.target.id;
      if (volgorde.length === 3) {
         parBericht.innerHTML = '&nbsp;';
         volgorde = [];
      }
		volgorde.push(kleur);
		parUitvoer.innerText = volgorde.join(', ');
		if (volgorde.length === 3) {
			const juist = volgorde[0] === juisteVolgorde[0] && volgorde[1] === juisteVolgorde[1] && volgorde[2] === juisteVolgorde[2];
			parBericht.innerText = juist ? 'Juist!' : 'Fout. Probeer opnieuw.';
		}
	}

	// event koppelen
	divKleuren.addEventListener('click', handleDivKleurenClick);
}

// === Oefening 10: formvalidatie ===
{
   // declaraties
	const frm = document.querySelector('#ex10-form');
	const inpEmail = document.querySelector('#ex10-form [type="email"]');
	const selOnderwerp = document.querySelector('#ex10-form select');
	const txtBericht = document.querySelector('#ex10-form textarea');
	const chkVoorwaarden = document.querySelector('#ex10-form [type="checkbox"]');
	const divFouten = document.querySelector('#ex10-form .errors');

   // event handler functie
   function handleFrmSubmit(e) {
		e.preventDefault();
		const errors = [];
      divFouten.innerHTML = '';

		if (!inpEmail.value.trim()) {
			errors.push('E-mailadres moet ingevuld zijn.');
		}
		if (!inpEmail.value.trim().includes('@')) {
			errors.push('E-mailadres moet een @ bevatten.');
		}
		if (!selOnderwerp.value) {
			errors.push('Kies een onderwerp.');
		}
		if (txtBericht.value.trim().length < 5) {
			errors.push('Het bericht moet minstens 5 tekens bevatten.');
		}
		if (!chkVoorwaarden.checked) {
			errors.push('Je moet akkoord gaan met de voorwaarden.');
		}

      divFouten.innerHTML = errors.join('<br>');
		if (errors.length === 0) {
			frm.submit();
		}
	}

   // events koppelen
   frm.addEventListener('submit', handleFrmSubmit);
}
