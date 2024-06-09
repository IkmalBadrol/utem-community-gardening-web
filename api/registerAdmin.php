<?php

include 'dbconnection.php';

// Set headers to handle JSON input and output
header('Content-Type: application/json');

// Read the JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Check if the input is valid
if (!isset(
    $input['name'], 
    $input['ic_number'], 
    $input['phone'], 
    $input['staff_number'], 
    $input['password'], 
    )) 
    {
    echo json_encode(['status' => 'Error', 'message' => 'Invalid input']);
    exit();
}
    
// Retrieve form data from the input
$name = $input['name'];
$icNumber = $input['ic_number'];
$phoneNumber = $input['phone'];
$staffNumber = $input['staff_number'];
$password = $input['password'];


    $staffNumberCheck = "SELECT staff_number FROM admin WHERE staff_number = ?";
    $stmt = $db->prepare($staffNumberCheck);
    $stmt->bind_param('s', $staffNumber);
    $stmt->execute();
    $stmt->store_result();
    $staffNumberCheck = $stmt->num_rows;

    if ($staffNumberCheck > 0) {
        echo json_encode(['status' => 'Error', 'message' => 'Staff number already exists']);
    } else {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user into the database
        $registerSql = "INSERT INTO admin (name, ic_number, phone, staff_number, password)
                        VALUES (?, ?, ?, ?, ?)";
        $stmt = $db->prepare($registerSql);
        $stmt->bind_param('sssss', $name, $icNumber, $phoneNumber, $staffNumber, $hashedPassword);

        $response = array(
            "status" => "Success",
            "name" => $name,
            "ic_number" => $icNumber,
            "phone" => $phoneNumber,
            "staff_number"=>$staffNumber,
            "password"=>$password,
        );

        if ($stmt->execute()) {
            echo json_encode($response);
        } else {
            echo json_encode(['status' => 'Error', 'message' => 'Registration failed']);
        }
    }
?>
