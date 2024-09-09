<?php
require_once "config.php";
$valido['success']=array('success'=>false,'mensaje'=>"");

if($_SERVER['REQUEST_METHOD']==='POST'){

$action=$_POST['action'];


if($action==='add'){

    if($_POST){

    $a=$_POST['costo'];

    $sql="INSERT INTO control VALUES (null,null,'$a', null)";
    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="SE GUARDÓ CORRECTAMENTE";
    }else{
        $valido['success']=false;
       $valido['mensaje']="ERROR AL GUARDAR EN BD"; 
    }
    
}else{
$valido['success']=false;
$valido['mensaje']="ERROR AL GUARDAR";
}

echo json_encode($valido);

} elseif($action==='selectAll'){

    header('Content-Type: text/html; charset=utf-8');
    $sql="SELECT * FROM contacto";

$registros=array('data'=>array());
$res=$cx->query($sql);
if($res->num_rows>0){
    while($row=$res->fetch_array()){
        $registros['data'][]=array($row[0],$row[1],$row[2],$row[3],$row[4]);
    }
}

echo json_encode($registros);


}else if($action==='delete'){

    if($_POST){
    $id=$_POST['id'];

    $sql="DELETE FROM contacto WHERE id=$id";
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


}else if($action==='select'){
    header('Content-Type: text/html; charset=utf-8');
            $valido['success']=array('success'=>false,
            'mensaje'=>"",
            'id'=>"",
            'nombre'=>"",
            'ap'=>"",
            'am'=>"",
            'telefono'=>"");
            if ($_POST) {
                $id = $_POST['id'];
                $sql = "SELECT * FROM contacto WHERE id=$id";
            
                $res = $cx->query($sql);
                $row = $res->fetch_array();
            
                $valido['success'] = true;
                $valido['mensaje'] = "SE ENCONTRÓ CONTACTO";
            
                $valido['id'] = $row[0];
                $valido['nombre'] = $row[1];
                $valido['ap'] = $row[2];
                $valido['am'] = $row[3];
                $valido['telefono'] = $row[4];
            } else {
                $valido['success'] = false;
                $valido['mensaje'] = "ERROR AL ENCONTRAR CONTACTO";
            }
            

echo json_encode($valido);



}else if($action==='update'){

    if($_POST){

    $id=$_POST['id'];
    $a=$_POST['nombre'];
    $b=$_POST['ap'];
    $c=$_POST['am'];
    $d=$_POST['telefono'];

    $sql="UPDATE contacto SET nombre='$a',
    ap='$b',
    am='$c',
    telefono='$d'
    WHERE id=$id";

    if($cx->query($sql)){
       $valido['success']=true;
       $valido['mensaje']="SE ACTUALIZÓ CORRECTAMENTE EL CONTACTO";
    }else{
        $valido['success']=false;
       $valido['mensaje']="ERROR AL ACTUALIZAR EN BD"; 
    }
    
}else{
$valido['success']=false;
$valido['mensaje']="ERROR AL ACTUALIZAR";
}

echo json_encode($valido);
}

}else{
 echo json_encode(["error" => "Método no permitido"]);
}

?>