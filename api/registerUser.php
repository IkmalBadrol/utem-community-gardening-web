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
    $input['email'], 
    $input['phone_number'], 
    $input['matric_number'], 
    $input['password'], 
    $input['role_id']
    )) 
    {
    echo json_encode(['status' => 'Error', 'message' => 'Invalid input']);
    exit();
}
    
// Retrieve form data from the input
$name = $input['name'];
$icNumber = $input['ic_number'];
$email = $input['email'];
$phoneNumber = $input['phone_number'];
$matricNumber = $input['matric_number'];
$password = $input['password'];
$role_id = $input['role_id'];

// Check if the email address already exists
$emailCheck = "SELECT email FROM user WHERE email = ?";
$stmt = $db->prepare($emailCheck);
$stmt->bind_param('s', $email);
$stmt->execute();
$stmt->store_result();
$emailCount = $stmt->num_rows;

if ($emailCount > 0) {
    echo json_encode(['status' => 'Error', 'message' => 'Email already exists']);
} else {
    // Assign role_id based on userType
    switch ($role_id) {
        case 'Staff':
            $role_id = 1; // Set the role_id to 1 for staff
            break;
        case 'Student':
            $role_id = 2; // Set the role_id to 2 for student
            break;
        default:
            echo json_encode(['status' => 'Error', 'message' => 'Invalid role_id']);
            exit();
    }

    // Check if the matric number already exists
    $matricNumberCheck = "SELECT matric_number FROM user WHERE matric_number = ?";
    $stmt = $db->prepare($matricNumberCheck);
    $stmt->bind_param('s', $matricNumber);
    $stmt->execute();
    $stmt->store_result();
    $matricNumberCount = $stmt->num_rows;

    if ($matricNumberCount > 0) {
        echo json_encode(['status' => 'Error', 'message' => 'Matric number already exists']);
    } else {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Insert new user into the database
        $registerSql = "INSERT INTO user (name, ic_number, email, phone_number, matric_number, password, role_id)
                        VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $db->prepare($registerSql);
        $stmt->bind_param('ssssssi', $name, $icNumber, $email, $phoneNumber, $matricNumber, $hashedPassword, $role_id);

        $response = array(
            "status" => "Success",
            "name" => $name,
            "ic_number" => $icNumber,
            "phone_number" => $phoneNumber,
            "email" => $email,
            "matric_number"=>$matricNumber,
            "password"=>$password,
            "role_id" => $role_id
        );

        if ($stmt->execute()) {
            echo json_encode($response);
        } else {
            echo json_encode(['status' => 'Error', 'message' => 'Registration failed']);
        }
    }
}
?>
