/* eslint-disable no-magic-numbers */
/* eslint-disable no-lone-blocks */

// Oefening 1 – Console meldingen
console.log('\n%c=== Console meldingen ===', 'color: #0c0');
{
   console.log('Console opdracht zegt: test');
   console.warn('Console opdracht zegt: let op');
   console.error('Console opdracht zegt: fout');
}

// Oefening 2 – Console opmaak
console.log('\n%c=== Console opmaak ===', 'color: #0c0');
{
   console.log('%cDit is rood', 'color: red');
   console.log('%cDit is 24px groot', 'font-size: 24px');
   console.log('%cDit is blauw op geel met padding', 'color: blue; background-color: #ff9; padding: 10px');
   console.log('Deze tekst bevat een %cpaars%c woord', 'color: #ff00ff', 'color: white');
}

// Oefening 3 – Variabelen
console.log('\n%c=== Variabelen ===', 'color: #0c0');
{
   const vak = 'DWD';
   let punten = 8;
   punten += 5;
   const MAX_PUNTEN = 20;
   console.log('Vak: ' + vak + '}; score: ' + punten + '}; dit is ' + (MAX_PUNTEN - punten) + ' onder het maximum');
}

// Oefening 4 – String interpolatie
console.log('\n%c=== String interpolatie ===', 'color: #0c0');
{
   const product = 'bananen';
   const aantal = 9;
   const stukprijs = 0.35;
   console.log(`Ik koop ${aantal} ${product} voor ${aantal * stukprijs} euro.`);

   const basis = 6;
   const hoogte = 4;
   console.log(`Een driehoek met basis ${basis} m en hoogte ${hoogte} m heeft oppervlakte ${basis * hoogte / 2} m².`);
}

// Oefening 5 – Multiline strings
console.log('\n%c=== Multiline strings ===', 'color: #0c0');
{
   const naam = 'Yasmin Al-Hassan';
   const telefoon = '012 34 56 78';
   const kaartje = `+------------------+
| Contact
|
| ${naam}
| ${telefoon}
+------------------+`;
   console.log(kaartje);
}

// Oefening 6 – Speciale waarden
console.log('\n%c=== Speciale waarden ===', 'color: #0c0');
{
   let test;
   console.log(test); // undefined
   const b = null;
   console.log(b); // null
   console.log(parseInt('twaalf')); // NaN
   console.log(Math.pow(10, 10000)); // Infinity
}

// Oefening 7 – Arrays
console.log('\n%c=== Arrays ===', 'color: #0c0');
{
   const vakken = ['Javascript', 'HTML', 'CSS'];
   console.log(`Tweede element: ${vakken[1]}`); // HTML

   vakken.push('PHP');
   console.log(`Aantal vakken: ${vakken.length}`); // 4

   const laatste = vakken.pop(); // gebruik als stack
   console.log(`Laatste verwijderd: ${laatste}`); // PHP

   const eerste = vakken.shift(); // gebruik als queue
   console.log(`Eerste verwijderd: ${eerste}`); // Javascript
}

// Oefening 8 – Objecten
console.log('\n%c=== Objecten ===', 'color: #0c0');
{
   const auto = {
      merk: 'Toyota',
      model: 'Corolla',
      jaar: 2022,
      prijs: 25000
   };

   console.log(`Auto: ${auto.merk} ${auto.model}`);

   auto.kleur = 'blauw';
   console.log(auto);
}

// Oefening 9 – Datatypes
console.log('\n%c=== Datatypes ===', 'color: #0c0');
{
   const prijs = 19.99;
   const product = 'laptop';
   const inStock = true;
   const persoon = { naam: 'Jan', leeftijd: 44 };
   const namen = [ 'Jan', 'Anissa' ];

   console.log(`prijs is van type: ${typeof prijs}`);
   console.log(`product is van type: ${typeof product}`);
   console.log(`inStock is van type: ${typeof inStock}`);
   console.log(`persoon is van type: ${typeof persoon}`);
   console.log(`namen is van type: ${typeof namen}`);
}

// Oefening 10 – Type conversie
console.log('\n%c=== Type conversie ===', 'color: #0c0');
{
   const input1 = '25.2';
   const input2 = '17';
   const som = parseFloat(input1) + parseFloat(input2);
   console.log(`Som: ${som}`); // 42

   let resultaat = 100;
   resultaat = resultaat.toString();
   console.log(`Type van resultaat: ${typeof resultaat}`); // string
}

// Oefening 11 – String methodes
console.log('\n%c=== String methodes ===', 'color: #0c0');
{
   const email = '  Student@Odisee.BE  ';
   const trimmed = email.trim();
   const lowercase = trimmed.toLowerCase();
   const isOdisee = lowercase.includes('odisee');

   console.log(`Origineel: "${email}"`);
   console.log(`Na trim: "${trimmed}"`);
   console.log(`Kleine letters: "${lowercase}"`);
   console.log(`Is Odisee email: ${isOdisee}`);
}

// Oefening 12 – Array methodes
console.log('\n%c=== Array methodes ===', 'color: #0c0');
{
   let woorden = ['  appel  ', 'banaan', 'citroen', 'avocado', 'peer'];

   woorden = woorden.map(w => w.trim().toUpperCase());
   console.log('Getrimd en hoofdletters:', woorden);

   console.log('Bevat \'BANAAN\':', woorden.includes('BANAAN'));

   const eersteMetC = woorden.find(w => w.startsWith('C'));
   console.log('Eerste woord dat begint met C:', eersteMetC);

   const aantalZesOfMeer = woorden.map(w => w.length).filter(len => len >= 6).length;
   console.log('Aantal woorden met 6 of meer letters:', aantalZesOfMeer);
}

// Oefening 13 – Selecties
console.log('\n%c=== Selecties ===', 'color: #0c0');
{
   const temperatuur = 18;

   if (temperatuur < 0) {
      console.log('Vrieskou!');
   } else if (temperatuur < 15) {
      console.log('Koud weer');
   } else if (temperatuur < 25) {
      console.log('Aangenaam weer');
   } else {
      console.log('Warm weer');
   }
}

// Oefening 14 – Iteraties
console.log('\n%c=== Iteraties ===', 'color: #0c0');
{
   // for: log de getallen 1 tot en met 5
   for (let i = 1; i <= 5; i++) {
      console.log(`waarde is ${i}`);
   }

   // do-while: zoek eerste getal waarvan de derde macht groter is dan 100
   let j = 1;
   do {
      j++;
   } while (j * j * j <= 100);
   console.log(`de derde macht van ${j} is groter dan 100`);
}

// Oefening 15 – For-of en forEach
console.log('\n%c=== For-of en forEach ===', 'color: #0c0');
{
   const vakken = ['HTML', 'CSS', 'JavaScript'];

   console.log('For-of:');
   for (const vak of vakken) {
      console.log(vak);
   }

   console.log('\nForEach met volgnummer:');
   vakken.forEach((vak, index) => {
      console.log(`${index + 1}. ${vak}`);
   });
}

// Oefening 16 – Functies
console.log('\n%c=== Functies ===', 'color: #0c0');
{
   function berekenBTW(prijs) {
      return prijs * 0.21;
   }

   const isVolwassen = leeftijd => leeftijd >= 18;

   function herhaal(tekst, aantal) {
      return tekst.repeat(aantal);
   }

   // Testen
   console.log(`BTW van €100: €${berekenBTW(100)}`);
   console.log(`Is 20 jaar volwassen? ${isVolwassen(20)}`);
   console.log(`Is 15 jaar volwassen? ${isVolwassen(15)}`);
   console.log(`Herhaal 'ha' 3x: ${herhaal('ha', 3)}`);
}

// Oefening 17 – Math
console.log('\n%c=== Math ===', 'color: #0c0');
{
   const wortelAfgerond = Math.round(Math.sqrt(1234));
   console.log(`Wortel van 1234 afgerond: ${wortelAfgerond}`);
   const willekeurig = Math.ceil(Math.random() * 100);
   console.log(`Willekeurig getal tussen 1 en 100: ${willekeurig}`);
}

// Oefening 18 – Spread operator
console.log('\n%c=== Spread operator ===', 'color: #0c0');
{
   const getal = '2587';
   console.log('Hoogste cijfer:', Math.max(...getal)); // 8

   let vakken = ['HTML', 'CSS', 'JavaScript'];
   vakken = [...vakken, 'PHP', 'JSON'];
   console.log(vakken); // ['HTML', 'CSS', 'JavaScript', 'PHP', 'JSON']
}

