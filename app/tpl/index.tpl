<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="initial-scale=1.0, width=device-width, user-scalable=no">
  <title>Document</title>
  <link rel="stylesheet" href="../src/css/main.css">
  <link rel="stylesheet" href="../src/css/moye/Button.css">
</head>
<body>

<style>

</style>

<span class="btn">btn test</span>

<div id="hbs"></div>

<script src="../src/js/require.js"></script>

<script>
require.config({
  baseUrl: '../src/js',
  paths: {
    'handlebars': 'handlebars.amd'
  }
});


require(['jquery', 'moye/Button', 'jstpl/foo', 'handlebars']
, function ($, Button, foo) {
    new Button({
        main: $('.btn')
    })
    .render();

  var data = {name: 'quanxi'};
  var html = foo(data); 
  $('#hbs').html(html);
});

</script>

</body>
</html>
