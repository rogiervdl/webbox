## Theorie

De descendant selector kijkt hoe diep dan ook. Wil je enkel de **rechtstreekse** kinderen van een element, dan gebruik je `>`.

```css
.box > span { /* enkel de spans die direct in .box zitten */
   padding: 5px;
}
```

`.box span` selecteert dus ook de spans die nog een niveau dieper genest zitten, `.box > span` niet.

## Opdracht

Selecteer met `>` enkel de elementen die rechtstreeks in een ander element genest zijn.

1. Maak enkel de paragrafen direct genest in `.blok` groen met `color: #080`.
