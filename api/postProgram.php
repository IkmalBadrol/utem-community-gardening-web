<?php

include 'dbconnection.php';

$input = json_decode(file_get_contents('php://input'),true);

if(!isset(
    $input['name'],
    $input['date_time'],
    $input['participant_limit'],
    $input['total_participant'],
    $input['location'],
    $input['status'],
    $input['program_details'],
    $input['admin_id']


)){
    echo json_encode(['status'=>'error', 'message'=>'invalid input']);
}

$name = $input['name'];
$dateTime = new DateTime($input['date_time']);
$participantLimit = $input['participant_limit'];
$totalParticipant = isset($input['total_participant']) ? $input['total_participant'] : 0;
$location = $input['location'];
$status = isset($input['status']) ? $input['status'] : 'Open';
$programDetails = $input['program_details'];
// Format the DateTime object as a string
$dateTimeFormatted = $dateTime->format('Y-m-d H:i:s');
$adminId = $input['admin_id'];

$registerProgram = "INSERT INTO program(name, date_time, participant_limit, total_participant, location, status, program_details, admin_id) VALUES (?,?,?,?,?,?,?,?)";

$stmt = $db->prepare($registerProgram);
$stmt->bind_param('ssiisssi', $name, $dateTimeFormatted, $participantLimit, $totalParticipant, $location, $status, $programDetails, $adminId);

$response =array(
    "name"=> $name,
    "date_time"=>$dateTimeFormatted,
    "participant_limit" => $participantLimit,
    "total_participant" => $totalParticipant,
    "location" => $location,
    "status" => $status,
    "program_details" => $programDetails,
    "admin_id" => $adminId,
);

if($stmt->execute()){
    echo json_encode(['status' => 'Success','message' => 'Login successful']);
}else{
    echo json_encode(['status'=>'error', 'message'=>'Failed to post program']);
}

?>