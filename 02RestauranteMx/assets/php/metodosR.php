<?php
require_once "config.php";

$valido['success']=array('success'=>false,'mensaje'=>"");

if($_SERVER['REQUEST_METHOD']==='POST'){ 

 $action=$_REQUEST["action"];

switch($action){

    case "addMenu":
    $valido['success']=array('success'=>false,'mensaje'=>"");
    
    $descripcion=$_POST['descripcion']; 
    $costo=$_POST['costo']; 

    $sql="INSERT INTO menu VALUES (null,'$descripcion','$costo')";
    if($cx->query($sql)){ 
       $valido['success']=true;
       $valido['mensaje']="SE GUARDÓ CORRECTAMENTE"; 
    }else{ 
        $valido['success']=false; 
       $valido['mensaje']="ERROR AL GUARDAR EN BD"; 
    }
    

echo json_encode($valido);

break;


case "add":
    
    $valido['success']=array('success'=>false,'mensaje'=>"");
    $id=$_POST['id']; 
    
    $result = $cx->query("SELECT * FROM orden WHERE id_m = $id");

    if ($result->num_rows > 0) {
        // Si ya existe, actualizar la cantidad
        $sql = "UPDATE orden SET cantidad = cantidad + 1 WHERE id_m = $id";
    } else {
        // Si no existe, insertar nuevo registro
        $sql = "INSERT INTO orden  VALUES (null,$id,1)";
    }

    if ($cx->query($sql)) {
        $valido['success'] = true;
        $valido['mensaje'] = "SE GUARDÓ CORRECTAMENTE";
    } else {
        $valido['success'] = false;
        $valido['mensaje'] = "ERROR AL GUARDAR EN BD";
    }
    echo json_encode($valido);
    break;



    case "selectAll":
        $res = $cx->query("SELECT * FROM menu");
        $rows = array();
    
        while ($row = $res->fetch_assoc()) {
            $rows[] = $row;
        }
    
        echo json_encode($rows);
        break;
    


case "selectOrden":
    $result = $cx->query("SELECT menu.descripcion, menu.costo, orden.cantidad, orden.id_o 
    FROM menu INNER JOIN orden ON menu.id_m = orden.id_m");

    $rows = array();
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    echo json_encode($rows);
    break;


case "deleteM":
    $valido['success']=array('success'=>false,'mensaje'=>"");
    $id=$_POST['id_m'];

    $sql="DELETE FROM menu WHERE id_m=$id";
    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="SE ELIMINÓ CORRECTAMENTE";
    }else{
        $valido['success']=false;
       $valido['mensaje']="ERROR AL ELIMINAR EN BD"; 
    }

echo json_encode($valido);

break;



case "deleteO":
    $valido['success']=array('success'=>false,'mensaje'=>"");
    $id=$_POST['id_m'];

    $sql="DELETE FROM orden WHERE id_o=$id";
    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="SE ELIMINÓ CORRECTAMENTE";
    }else{
        $valido['success']=false;
       $valido['mensaje']="ERROR AL ELIMINAR EN BD"; 
    }


echo json_encode($valido);

break;


case "reset":
    $valido['success']=array('success'=>false,'mensaje'=>"");

    $sql="DELETE FROM orden";
    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="SE ELIMINÓ CORRECTAMENTE";
    }else{
        $valido['success']=false;
       $valido['mensaje']="ERROR AL ELIMINAR EN BD"; 
    }


echo json_encode($valido);

break;


}

}else{
 echo json_encode(["error" => "Método no permitido"]);
}

?>