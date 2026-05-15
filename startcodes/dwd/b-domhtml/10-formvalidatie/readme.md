## Opdracht

Vang het `submit`-event op het formulier af, voer validaties uit en toon foutmeldingen in `.errors`.

Voer volgende validaties uit:

- het e-mailveld mag niet leeg zijn
- het e-mailveld moet een `@` bevatten
- er moet een optie in de dropdown gekozen zijn (tip: gebruik `value`)
- het textarea moet minstens een paar tekens bevatten
- de checkbox moet aangevinkt zijn

Als alle validaties slagen, dien je het formulier in met `form.submit()`.

Basisschema:

```js
function handleFormSubmit(e) {
   e.preventDefault();
   const errors = [];

   // validaties...
   if (...) errors.push('...');

   divErrors.innerHTML = errors.join('<br>');
   if (errors.length === 0) {
      frm.submit();
   }
}
```
