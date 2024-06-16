<?php

include 'dbconnection.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'),true);

//$programId = $_GET['program_id'];

$data = "SELECT id, program_details,name, date_time, participant_limit, total_participant, location, status, program_details     FROM program";


$stmt = $db->prepare($data);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows>0){
    $programs = [];
    while($row = $result->fetch_assoc()){
        $programs[] = $row;
    }
    echo json_encode(['status' => 'Success', 'programs' => $programs]);
}else {
    echo json_encode(['status' => 'Error', 'message' => 'No programs found']);
}

?>