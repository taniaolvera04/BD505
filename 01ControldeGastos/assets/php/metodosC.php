<?php
require_once "config.php";
header('Content-Type: text/html; charset=utf-8');
$valido['success']=array('success'=>false,'mensaje'=>"");

if($_SERVER['REQUEST_METHOD']==='POST'){ //Verifica que se haya recibido una respuesta del servidor

 $action=$_REQUEST['action'];
//Recibe valor de variable encapsulada "action"

switch($action){
    case "add":
    
    $a=$_POST['descripcion']; //Recupera valor de descripción
    $b=$_POST['costo']; //Recupera valor de costo
    $c = $_POST['categoria']; //Recupera valor de categoría

    $sqlCategoria ="SELECT id_c FROM categoria WHERE categoria = '$c'";
    //Realiza una consulta en tabla categoria para recuperar el "id_c" cuando categoría sea valor de "$c" 

    $resultCategoria = $cx->query($sqlCategoria);
    //Conexion con consulta en BD

    $row = $resultCategoria->fetch_assoc();
    $id_c = $row['id_c']; //$id_C tomará valor de "id_c"

    $sql="INSERT INTO control VALUES (null,'$a','$b', '$id_c')"; //Hecho esto se puede insertar en tabla control
    if($cx->query($sql)){ //Si se establece conexión entonces
       $valido['success']=true;
       $valido['mensaje']="SE GUARDÓ CORRECTAMENTE"; //Mostrar mensaje de éxito
    }else{ //sino
        $valido['success']=false; //Mostrar mensaje de error
       $valido['mensaje']="ERROR AL GUARDAR EN BD"; 
    }
    

echo json_encode($valido);

break;

case "selectAll"://si valor de action es "selectAll"

    $sql = "SELECT co.id, co.descripcion, co.costo, c.categoria 
    FROM control co 
    INNER JOIN categoria c ON co.id_c = c.id_c"; //

$registros=array('data'=>array());
$res=$cx->query($sql);
if($res->num_rows>0){
    while($row=$res->fetch_array()){
        $registros['data'][]=array($row[0],$row[1],$row[2],$row[3]);
    }
}

echo json_encode($registros);


break;

case "delete":

    if($_POST){
    $id=$_POST['id'];

    $sql="DELETE FROM control WHERE id=$id";
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

case "update":

    if($_POST){

    $id=$_POST['id'];
    $a=$_POST['descripcion'];
    $b=$_POST['costo'];
    $c=$_POST['categoria'];


    $sql_categoria = "SELECT id_c FROM categoria WHERE categoria = '$c'";
    $result_categoria = $cx->query($sql_categoria);

    if ($result_categoria->num_rows > 0) {
        $row_categoria = $result_categoria->fetch_assoc();
        $id_c = $row_categoria['id_c'];

        $sql_update = "UPDATE control SET descripcion='$a', costo='$b', id_c='$id_c' WHERE id='$id'";

        if ($cx->query($sql_update)) {
            $valido['success'] = true;
            $valido['mensaje'] = "SE ACTUALIZÓ CORRECTAMENTE EL CONTACTO";
        } else {
            $valido['success'] = false;
            $valido['mensaje'] = "ERROR AL ACTUALIZAR EN BD";
        }
    } else {
        $valido['success'] = false;
        $valido['mensaje'] = "CATEGORÍA NO ENCONTRADA";
    }
} else {
    $valido['success'] = false;
    $valido['mensaje'] = "ERROR AL ACTUALIZAR";
}

echo json_encode($valido);
break;
}

}else{
 echo json_encode(["error" => "Método no permitido"]);
}

?>