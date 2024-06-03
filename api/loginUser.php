<?php

include 'dbconnection.php';

// Set headers to handle JSON input and output
header('Content-Type: application/json');

// Read the JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if the input is valid
if (!isset(
    $input['matric_number'], 
    $input['password']
    )) {
    echo json_encode(['status' => 'Error', 'message' => 'Invalid input']);
    exit();
}

$matricNumber = $input['matric_number'];
$password = $input['password'];

$matricNumberCheck = "SELECT * FROM user WHERE matric_number = ?";
$stmt = $db->prepare($matricNumberCheck);
$stmt->bind_param('s', $matricNumber);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Matric number exists, verify password
    $user = $result->fetch_assoc();
    // Verify hashed password
    if (password_verify($password, $user['password'])) {

        echo json_encode(['status' => 'Success', 'message' => 'Login successful']);
    } else {

        echo json_encode(['status' => 'Error', 'message' => 'Incorrect password']);
    }
} else {

    echo json_encode(['status' => 'Error', 'message' => 'Matric number not found']);
}

?>
