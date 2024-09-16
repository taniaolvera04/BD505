<?php
require_once "config.php";
header('Content-Type: application/json; charset=utf-8');

if($_SERVER['REQUEST_METHOD']==='POST'){ 

 $action=$_REQUEST['action'];

switch($action){

    case "addCa":
    $a=$_POST['categoria']; 
    $b=$_POST['actividad']; 
    $c = $_POST['caloria']; 

    
    $sql="INSERT INTO calorias VALUES (null,'$a','$b','$c')";
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
    $res = $cx->query("SELECT * FROM calorias");
    $rows = array();

    while ($row = $res->fetch_assoc()) {
        $rows[] = $row;
    }

    echo json_encode($rows);
    break;


case "delete":
 $valido['success']=array('success'=>false,'mensaje'=>"");
    $id=$_POST['id'];

    $sql="DELETE FROM calorias WHERE id_ca=$id";
    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="SE ELIMINÓ CORRECTAMENTE";
    }else{
        $valido['success']=false;
       $valido['mensaje']="ERROR AL ELIMINAR EN BD"; 
    }


echo json_encode($valido);

break;


case "select":
    header('Content-Type: text/html; charset=utf-8');
            $valido['success']=array('success'=>false,
            'mensaje'=>"",
            'id_ca'=>"",
            'categoria'=>"",
            'actividad'=>"",
            'caloria'=>"");
           
                $id = $_POST['id'];

                $sql = "SELECT id_ca, categoria, actividad, caloria  FROM calorias WHERE id_ca=$id";
                $res = $cx->query($sql);
                $row = $res->fetch_array();

            
                $valido['success'] = true;
                $valido['mensaje'] = "SE ENCONTRÓ GASTO";
            
                $valido['id_ca'] = $row[0];
                $valido['categoria'] = $row[1];
                $valido['actividad'] = $row[2];
                $valido['caloria'] = $row[3];
           
echo json_encode($valido);

break;

case "update":
    $valido['success']=array('success'=>false,'mensaje'=>"");

    $id=$_POST['id'];
    $a=$_POST['categoria'];
    $b=$_POST['actividad'];
    $c=$_POST['caloria'];


    $sql="UPDATE calorias SET categoria='$a', actividad='$b', caloria='$c' WHERE id_ca=$id";

    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="SE ACTUALIZÓ CORRECTAMENTE EL PRODUCTO";
    }else{
        $valido['success']=false;
       $valido['mensaje']="ERROR AL ACTUALIZAR EN BD"; 
    }
    
    echo json_encode($valido);
    break;
}

}else{
 echo json_encode(["error" => "Método no permitido"]);
}

?>