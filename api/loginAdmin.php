<?php

include 'dbconnection.php';

// Set headers to handle JSON input and output
header('Content-Type: application/json');

// Read the JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if the input is valid
if (!isset(
    $input['staff_number'], 
    $input['password']
    )) {
    echo json_encode(['status' => 'Error', 'message' => 'Invalid input']);
    exit();
}

$staffNumber = $input['staff_number'];
$password = $input['password'];

$staffNumberCheck = "SELECT * FROM admin WHERE staff_number = ?";
$stmt = $db->prepare($staffNumberCheck);
$stmt->bind_param('s', $staffNumber);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Matric number exists, verify password
    $admin = $result->fetch_assoc();
    // Verify hashed password
    if (password_verify($password, $admin['password'])) {

        $adminData = [
            'id' => $admin['id'],
            'name' => $admin['name'],
            'ic_number' => $admin['ic_number'],
            'phone' => $admin['phone'],
            'staff_number' => $admin['staff_number']
        ];

        echo json_encode(['status' => 'Success', 'Admin' => $adminData]);
    } else {

        echo json_encode(['status' => 'Error', 'message' => 'Incorrect password']);
    }
} else {

    echo json_encode(['status' => 'Error', 'message' => 'Matric number not found']);
}

?>
