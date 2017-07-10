Transform logical properties to their physical property equivalents, wrapped
by direction detection.

See https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties
for more details

## Example

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
