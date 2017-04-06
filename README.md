# lib.js
Javascript library with generic functions set for web-based apps development

###Installation
```
npm i lib-js
```

Include lib.js into your webpage / singlepage app
```
<script src="lib.js"></script>
```

###Examples

Generate UUID-like string
```
lib.uuid();
```

Obtain current timestamp in SQL datetime format
```
lib.ts_to_sqldate()
```

Query dom elements by selector
```
lib.qsa('.active').forEach(function(el) {
 L('#el', el)
});
```

Render JSON-formatted view into DOM
```
var els = lib.id('root').inflate_view([ 
{tag:'CANVAS', atr:{width:100,height:100,style:'background:#000'}}
]);
```