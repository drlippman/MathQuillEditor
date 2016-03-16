<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="mathquill.css" type="text/css"/>
<link rel="stylesheet" href="mathquilled.css" type="text/css"/>
<!--[if lte IE 7]>
<style style="text/css">
.mathquill-editable.empty { width: 0.5em; }
.mathquill-rendered-math { min-width: 1.0em;}
.mathquill-rendered-math .numerator.empty, .mathquill-rendered-math .empty { padding: 0 0.25em;}
.mathquill-rendered-math sup { line-height: .9em; }
.mathquill-rendered-math .numerator {float: left; padding: 0; margin-bottom: 0;}
.mathquill-rendered-math .denominator { clear: both;width: auto;float: left;}
.mathquill-rendered-math .sqrt-prefix { margin-right: 0px !important;}
</style>
<![endif]-->
<script type="text/javascript" src="support/jquery-1.7.2.js"></script>
<script src="mathquill.js" type="text/javascript"></script>
<script src="AMtoMQ.js" type="text/javascript"></script>
<script src="mathquilled.js" type="text/javascript"></script>
</head>
<body>
<p>Click in the box, click the yellow arrow to open MathQuill</p>
<p><input type="text" class="use-mathquill" id="qn01" onfocus="showeedd('qn01',4,'int');" onblur="hideeedd()" />  </p>
<p style="font-family: Symbola">Whee</p>
<?php
require("mathquilled.html");
?>
</body>
</html>
