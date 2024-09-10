<?php
require_once "config.php";
header('Content-Type: text/html; charset=utf-8');
$valido['success']=array('success'=>false,'mensaje'=>"");

if($_SERVER['REQUEST_METHOD']==='POST'){ 

 $action=$_REQUEST['action'];

switch($action){
    case "addMenu":
    
    $a=$_POST['descripcion']; 
    $b=$_POST['costo']; 


    $sql="INSERT INTO menu VALUES (null,'$a','$b')";
    if($cx->query($sql)){ 
       $valido['success']=true;
       $valido['mensaje']="SE GUARDÓ CORRECTAMENTE"; 
    }else{ 
        $valido['success']=false; 
       $valido['mensaje']="ERROR AL GUARDAR EN BD"; 
    }
    

echo json_encode($valido);

break;


case "selectAll":

    $sql = "SELECT * FROM menu"; //

$registros=array('data'=>array());
$res=$cx->query($sql);
if($res->num_rows>0){
    while($row=$res->fetch_array()){
        $registros['data'][]=array($row[0],$row[1],$row[2]);
    }
}

echo json_encode($registros);

break;



case "delete":

    if($_POST){
    $id_m=$_POST['id_m'];

    $sql="DELETE FROM menu WHERE id_m=$id_m";
    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="SE ELIMINÓ CORRECTAMENTE";
    }else{
        $valido['success']=false;
       $valido['mensaje']="ERROR AL ELIMINAR EN BD"; 
    }

}else{
$valido['success']=false;
$valido['mensaje']="ERROR AL ELIMINAR";
}
echo json_encode($valido);

break;
case "select":
    header('Content-Type: text/html; charset=utf-8');
            $valido['success']=array('success'=>false,
            'mensaje'=>"",
            'id'=>"",
            'descripcion'=>"",
            'costo'=>"",
            'categoria'=>"");
            if ($_POST) {
                $id = $_POST['id'];

                $sql = "SELECT co.id, co.descripcion, co.costo, c.categoria
                FROM control co
                INNER JOIN categoria c ON co.id_c = c.id_c
                WHERE co.id = $id";


                $res = $cx->query($sql);
                $row = $res->fetch_array();
            
                $valido['success'] = true;
                $valido['mensaje'] = "SE ENCONTRÓ GASTO";
            
                $valido['id'] = $row[0];
                $valido['descripcion'] = $row[1];
                $valido['costo'] = $row[2];
                $valido['categoria'] = $row[3];
            } else {
                $valido['success'] = false;
                $valido['mensaje'] = "ERROR AL ENCONTRAR GASTO";
            }
            

echo json_encode($valido);

break;

}

}else{
 echo json_encode(["error" => "Método no permitido"]);
}

?>