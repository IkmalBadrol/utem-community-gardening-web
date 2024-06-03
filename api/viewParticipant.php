<?php

include 'dbconnection.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

// Check the existence of program id
if (!isset($_GET['program_id'])) {
    echo json_encode(['status' => 'Error', 'message' => 'Program ID not provided']);
    exit();
}

$programId = $_GET['program_id'];

$data = "
    SELECT 
        u.id AS user_id,
        u.name AS studentName,
        u.email,
        u.matric_number,
        ua.register_date,
        ua.status
    FROM user u 
    JOIN user_activity ua ON u.id = ua.user_id
    WHERE ua.program_id = ?
";

$stmt = $db->prepare($data);
$stmt->bind_param('i', $programId);
$stmt->execute();
$result = $stmt->get_result();

// Check if there are any participants
if ($result->num_rows > 0) {
    $participants = [];
    while ($row = $result->fetch_assoc()) {
        $participants[] = $row;
    }
    echo json_encode(['status' => 'Success', 'participants' => $participants]);
} else {
    echo json_encode(['status' => 'Error', 'message' => 'No participants found for this program']);
}

?>
