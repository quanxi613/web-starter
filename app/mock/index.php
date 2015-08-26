<?php
/**
 * Example Application
 *
 * @package Example-application
 */

require('../configs/smarty.config.php');

$smarty->left_delimiter="<%";
$smarty->right_delimiter="%>";


$smarty->display('index.tpl');
?>
