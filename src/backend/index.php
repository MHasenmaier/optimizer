<?php
include_once("routing.php");

	if(!routing())
	{
		errormessage(500);
	}