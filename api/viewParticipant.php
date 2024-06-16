<?php

include 'dbconnection.php';

header('Content-Type: application/json');

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
		u.phone_number,
        u.matric_number,
		u.ic_number,
        ua.register_date,
        ua.status
    FROM 
        user u 
    JOIN 
        user_activity ua ON u.id = ua.user_id
    JOIN 
        program p ON ua.program_id = p.id
    WHERE 
        ua.program_id = ?
";

$stmt = $db->prepare($data);

// Check if the statement was prepared successfully
if ($stmt === false) {
    echo json_encode(['status' => 'Error', 'message' => 'Failed to prepare the SQL statement']);
    exit();
}

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

// Close the statement and the database connection
$stmt->close();
$db->close();

?>
