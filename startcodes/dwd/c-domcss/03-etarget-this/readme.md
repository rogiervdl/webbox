## Opdracht

Gegeven is een horizontaal menu met in elke `li` een geneste `a`, en een class `selected` die de actieve knop toont.

1. Definieer een click event handler voor alle `li`-elementen met `forEach`.
2. In de handler:
   - voorkom de standaardactie van de link met `preventDefault`
   - haal de geklikte link en de bijhorende `li` op (gebruik `e.target` voor de link en `this` voor de `li`)
   - toon de tekst van de aangeklikte link in de paragraaf eronder
   - verwijder de class `selected` van alle `li`-elementen
   - voeg de class `selected` toe aan de geklikte `li`
