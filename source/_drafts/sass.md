---
title: sass
tags:
---

## What is Sass?
Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.

Sass is a stylesheet language that’s compiled to CSS. It allows you to use `variables`, `nested rules`, `mixins`, `functions`, and more, all with a fully CSS-compatible syntax. Sass helps keep large stylesheets well-organized and makes it easy to share design within and across projects.

## Variables

Sas uses the $ symbol to make something a variable

```scss
$primary-color: #333;

body {
  color: $primary-color;
}
```

### Default Values

Variables defined with !default can be configured when loading a module with the @use rule. Sass libraries often use !default variables to allow their users to configure the library’s CSS.

```scss
// _library.scss
$black: #000 !default;
$border-radius: 0.25rem !default;
$box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

code {
  border-radius: $border-radius;
  box-shadow: $box-shadow;
}
```

```scss
// style.scss
@use 'library' with (
  $black: #222,
  $border-radius: 0.1rem
);
```

### Scope
#### Shadowing

```scss
$variable: global value; // 全局变量

.content {
  $variable: local value; // 局部变量
  value: $variable; // css=> local value
}

.sidebar {
  value: $variable; // css=> global value
}
```

如果你希望在局部作用域中修改全局变量的值可在后面添加 `!global` （前提是该全局变量在前面已经声明过）
```scss
$variable: global value;
.content2 {
  $variable: second global value !global;
  value: $variable; // css=> second global value
}
.sidebar2 {
  value: $variable; // css=> second global value
}
```

#### Flow Control Scope

Variables in flow control scope can assign to existing variables in the outer scope, but they can’t declare new variables there. Make sure the variable is already declared before you assign to it, even if you need to declare it as null. 

```scss
$dark-theme: true !default;
$primary-color: #f8bbd0 !default;

@if $dark-theme {
  $primary-color: darken($primary-color, 60%); // 可以直接给外部作用域变量赋值
}

.button {
  background-color: $primary-color; //css=> #750c30
}
```

### Advanced Variable Functions
+ meta.variable-exists()
  - returns whether a variable with the given name exists in the current scope
+ meta.global-variable-exists()
  - does the same but only for the global scope.


Users occasionally want to use interpolation to define a variable name based on another variable. Sass doesn’t allow this, because it makes it much harder to tell at a glance which variables are defined where.

```scss
@use "sass:map";
$color: (
  primary: #005DFF,
  accent: #FFF5BB
);

body {
  // Instead of $theme-color-#{primary}
  background-color: map-get($color, primary); 
}
```

## Nesting

Sass will let you nest your CSS selectors in a way that follows the same visual hierarchy of your HTML.Sass makes this easier and less redundant by allowing property declarations to be nested. The outer property names are added to the inner, separated by a hyphen.

```scss
nav {
  ul {
    margin: 0;
    padding: 0;
  }
}
```

Many CSS properties start with the same prefix that acts as a kind of namespace. For example, font-family, font-size, font-weight all start with font-.

```scss
.info-page {

  transition: {
    property: font-size;
    duration: 4s;
    delay: 2s;
  }

  margin: auto {
    bottom: 10px;
    top: 2px;
  }
}
```


## Partials

You can create partial Sass files that contain little snippets of CSS that you can include in other Sass files.

+ You might name it something like `_partial.scss`.
+ Sass partials are used with the `@use` rule

```scss
// _base.scss
$font-stack: Helvetiaca, sans-serif;
$primary-color: #333

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

## Mixins
A mixin lets you make groups of CSS declacrations that you want to reuse throughout your site. You can even pass in values to make your mixin more flexible. A good use of a mixin is for vendor prefixes.

```scss
@mixin tranform($property) {
  -webkit-transform: $property;
  -ms-transform: $property;
  transform: $property;
}
.box { @include tansform(rotate(30deg)); }
```

## Extend/Inheritance

Using `@extend` lets you share a set of CSS properties from one selector to another.

```scss
// %message-shared is a Placeholder Selector, it's not included in the CSS output
%message-shared {
  border: 1px solid #ccc;
  padding 10px;
  color: #333;
}

.success {
  @extend %message-shared;
  border-color: green;
}

.error {
  @extend %message-shared;
  border-color: red;
}
```

## Operators

Sass has a handful of standard math opertors like +,-,*,/,and%.

```scss
article[role="main"] {
  float: left;
  width: 600px / 960px * 100%;
}

aside[role="complementary"] {
  float: right;
  width: 300px / 960px * 100%;
}
```

```scss
// styles.scss
@use 'base';

.inverse {
  background-color: base.$primary-color;
}
```

## Comments

```scss
// This comment won't be included in the CSS.

/* But this comment will, except in compressed mode. */

/* It can also contain interpolation:
 * 1 + 1 = #{1 + 1} */

/*! This comment will be included even in compressed mode. */

p /* Multi-line comments can be written anywhere
   * whitespace is allowed. */ .sans {
  font: Helvetica, // So can single-line commments.
        sans-serif;
}
```

### Documentation Comments

```scss
/// Computes an exponent.
///
/// @param {number} $base
///   The number to multiply by itself.
/// @param {integer (unitless)} $exponent
///   The number of `$base`s to multiply together.
/// @return {number} `$base` to the power of `$exponent`.
@function pow($base, $exponent) {
  $result: 1;
  @for $_ from 1 through $exponent {
    $result: $result * $base;
  }
  @return $result;
}
```

## Interpolation

#{} 的使用场景
+ Selectors in style rules

```scss
@mixin define-emoji($name, $glyph) {
  span.emoji-#{$name} {
    font-family: IconFont;
    font-variant: normal;
    font-weight: normal;
    content: $glyph;
  }
}

@include define-emoji("women-holding-hands", "👭");
```

+ Property name in declarations

```scss
@mixin prefix($property, $value, $prefixes) {
  @each $prefix in $prefixes {
    -#{$prefix}-#{$property}: $value;
  }
  #{$property}: $value;
}

.gray {
  @include prefix(filter, grayscale(50%), moz webkit);
}
```

+ Cunstom property values
  - css 中通过var() 调用的自定义属性

```scss
$primary: #81899b;
$accent: #302e24;
$warn: #dfa612;

:root {
  --primary: #{$primary}; // css=> --primary: #81899b;
  --accent: #{$accent};
  --warn: #{$warn};

  // Even though this looks like a Sass variable, it's valid CSS so it's not
  // evaluated.
  --consumed-by-js: $primary; // css=> --consumed-by-js: $primary;
}
```

+ CSS at-rules

 A CSS at-rule is written `@<name> <value>`, `@<name> { ... }`, or `@<name> <value> { ... }`. The name must be an identifier, and the value (if one exists) can be pretty much anything. Both the name and the value can contain interpolation.

 ```scss
@namespace svg url(http://www.w3.org/2000/svg);

@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2");
}

@counter-style thumbs {
  system: cyclic;
  symbols: "\1F44D";
}

// @supports
@mixin sticky-position {
  position: fixed;
  @supports (position: sticky) {
    position: sticky;
  }
}

.banner {
  @include sticky-position;
}

// @keyframes
@keyframes slide-in {
  from {
    margin-left: 100%;
    width: 300%;
  }

  70% {
    margin-left: 90%;
    width: 150%;
  }

  to {
    margin-left: 0%;
    width: 100%;
  }
}
 ```





Unfortunately,interpolation removes quotes from strings, which makes it difficult to use quoted strings as values for custom properties when they come from Sass variables. As a workaround, you can use the meta.inspect() function to preserve the quotes. 

```scss
@use "sass:meta";

$font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
$font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas;

:root {
  --font-family-sans-serif: #{meta.inspect($font-family-sans-serif)};
  --font-family-monospace: #{meta.inspect($font-family-monospace)};
}
```
### url()

The url() function is commonly used in CSS, but its syntax is different than other functions: it can take either a quoted or unquoted URL. Because an unquoted URL isn’t a valid SassScript expression, Sass needs special logic to parse it.

```scss
$roboto-font-path: "../fonts/roboto";

@font-face {
    // This is parsed as a normal function call that takes a quoted string.
    src: url("#{$roboto-font-path}/Roboto-Thin.woff2") format("woff2");

    font-family: "Roboto";
    font-weight: 100;
}

@font-face {
    // This is parsed as a normal function call that takes an arithmetic
    // expression.
    src: url($roboto-font-path + "/Roboto-Light.woff2") format("woff2");

    font-family: "Roboto";
    font-weight: 300;
}

@font-face {
    // This is parsed as an interpolated special function.
    src: url(#{$roboto-font-path}/Roboto-Regular.woff2) format("woff2");

    font-family: "Roboto";
    font-weight: 400;
}
```

### min() and max()

If a min() or max() function call is valid plain CSS, it will be compiled to a CSS min() or max() call. “Plain CSS” includes nested calls to calc(), env(), var(), min(), or max(), as well as interpolation. As soon as any part of the call contains a SassScript feature like variables or function calls, though, it’s parsed as a call to Sass’s core min() or max() function instead.

```scss
$padding: 12px;

.post {
  // Since these max() calls don't use any Sass features other than
  // interpolation, they're compiled to CSS max() calls.
  padding-left: max(#{$padding}, env(safe-area-inset-left)); //css => padding-left: max(12px, env(safe-area-inset-left));
  padding-right: max(#{$padding}, env(safe-area-inset-right));
}

.sidebar {
  // Since these refer to a Sass variable without interpolation, they call
  // Sass's built-in max() function.
  padding-left: max($padding, 20px); 
  padding-right: max($padding, 20px); //css=> padding-left: 20px;
}
```









