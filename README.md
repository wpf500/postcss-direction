Transform direction aware CSS properties and values.

```css
.foo {
    color: red;
    padding-inline-start: 10px;
}
```

becomes

```css
.foo {
    color: red;
}

html[dir=ltr] .foo {
    padding-left: 10px;
}

html[dir=rtl] .foo {
    padding-right: 10px;
}

```
