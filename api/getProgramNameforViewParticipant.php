<?php

include 'dbconnection.php'; // Ensure this file includes your database connection

header('Content-Type: application/json');

// Check if program_id is provided in the GET request
if (!isset($_GET['program_id'])) {
    echo json_encode(['status' => 'Error', 'message' => 'Program ID not provided']);
    exit();
}

$programId = $_GET['program_id'];

// SQL query to fetch program name based on program_id
$query = "
    SELECT 
        name AS program_name
    FROM program
    WHERE id = ?
";

$stmt = $db->prepare($query);

// Check if the statement was prepared successfully
if ($stmt === false) {
    echo json_encode(['status' => 'Error', 'message' => 'Failed to prepare the SQL statement']);
    exit();
}

$stmt->bind_param('i', $programId);
$stmt->execute();
$result = $stmt->get_result();

// Check if a program with the given ID exists
if ($result->num_rows > 0) {
    $program = $result->fetch_assoc();
    echo json_encode(['status' => 'Success', 'program_name' => $program['program_name']]);
} else {
    echo json_encode(['status' => 'Error', 'message' => 'Program not found']);
}

// Close the statement and the database connection
$stmt->close();
$db->close();

?>
