<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

#$dbstr =”(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.0.3)(PORT=1521))(CONNECT_DATA=(SID=prd)))”;
#if($conn = oci_connect(‘logix’,’logix’, $dbstr)):
#print “CONNECTED OK!!”;
#else:
#print “WE HAVE A PROBLEM”;
#endif;



$dbstr ="(DESCRIPTION =(ADDRESS = (PROTOCOL = TCP)(HOST =192.168.0.3)(PORT = 1521))
(CONNECT_DATA =
(SERVER = DEDICATED)
(SERVICE_NAME = logix)
(INSTANCE_NAME = PRD)))";

if(!@($conn = oci_connect('logix','logix',$dbstr))):
print 'CONECTADO';
else:
print 'ERRO '+ocierror();
endif;
?>