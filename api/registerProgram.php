<?php

include 'dbconnection.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'),true);

if(!isset(
    $input['user_id'],
    $input['program_id'],
    $input['register_date'],
    $input['status'],
)){
    echo json_encode(['message'=>'invalid input']);
    exit();
}

$userId = $input['user_id'];
$programId = $input['program_id'];
$registerDate = new DateTime($input['register_date']);
$status =  $input['status'];

$registerDateFormated = $registerDate->format('Y-m-d');

$registerProgram = "INSERT INTO user_activity(user_id, program_id, register_date, status) VALUES (?,?,?,?)";

$stmt=$db->prepare($registerProgram);
$stmt->bind_param('iiss', $userId, $programId, $registerDateFormated, $status);

if($stmt->execute()){
    $data = "SELECT 
    u.name AS studentName,
    u.matric_number,
    p.name AS programName,
    p.location,
    p.date_time,
    p.participant_limit,
    p.status
    FROM user u JOIN user_activity ua ON u.id = ua.user_id
    JOIN program p ON p.id = ua.program_id
    WHERE user_id = ? AND program_id = ?";

$stmt = $db->prepare($data);
$stmt->bind_param('ii', $userId, $programId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $response = $result->fetch_assoc();
    echo json_encode(['status' => 'Success', 'data' => $response]);
} else {
    echo json_encode(['status' => 'Error', 'message' => 'Failed to retrieve user and program details']);
}
} else {
echo json_encode(['status' => 'Error', 'message' => 'Failed to register for the program']);
}

?>