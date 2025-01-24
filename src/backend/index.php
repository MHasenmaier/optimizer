<?php
include_once("routing.php");

	if(!routing())
	{
		statuscode(500);
	}