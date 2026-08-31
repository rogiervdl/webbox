## Theorie

De **next sibling selector** `+` selecteert het element dat onmiddellijk op een ander element **volgt**, op hetzelfde niveau. Zo geef je bijvoorbeeld enkel de eerste paragraaf na een titel een afwijkende opmaak.

```css
p + ul { /* elke ul die direct op een p volgt */
   margin-top: 10px;
}
```

Staat er nog iets tussen de twee elementen, dan selecteert `+` niets meer.

## Opdracht

Selecteer het element dat onmiddellijk op een ander element volgt.

1. Maak de paragrafen die onmiddellijk op een &lt;h3&gt; volgen rood met `color: red`.
