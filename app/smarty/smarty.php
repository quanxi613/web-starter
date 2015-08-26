<?php
	include ("./smarty/libs/Smarty.class.php");

	$smarty=new Smarty();

	$smarty->template_dir='e:/shixibao_fe_2.0/app/templates';
	$smarty->config_dir='e:/shixibao_fe_2.0/app/configs';
	$smarty->cache_dir='e:/shixibao_fe_2.0/app/cache';
	$smarty->compile_dir='e:/shixibao_fe_2.0/app/templates_c';
	$smarty->caching=false;
	$smarty->left_delimiter="<%";
	$smarty->right_delimiter="%>";
?>