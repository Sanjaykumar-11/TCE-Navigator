<?php
$link = mysqli_connect("localhost", "root", "", "tce_navigator");
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
		$EventID = $_POST['EventID'];
		$EventName = $_POST['EventName'];
		$EventDate = $_POST['EventDate'];
		$EventTime = $_POST['EventTime'];
		$EventCategory = $_POST['EventCategory'];
		$EventDescription = $_POST['EventDescription'];
		$EventTicketPrice = $_POST['EventTicketPrice'];
		$EventTicketTotal = $_POST['EventTicketTotal'];
		$EventTicketSold = $_POST['EventTicketSold'];
		$VenueID = $_POST['VenueID'];
		$UserID = $_POST['UserID'];
		$sql = "INSERT INTO events(EventID,EventName,EventDate,EventTime,EventCategory,EventDescription,EventTicketPrice,EventTicketTotal,EventTicketSold,VenueID,UserID) VALUES ('$EventID','$EventName','$EventDate','$EventTime','$EventCategory','$EventDescription','$EventTicketPrice','$EventTicketTotal','$EventTicketSold','$VenueID','$UserID')";
if(mysqli_query($link, $sql)){
    echo "Records inserted successfully.";
} 
else{
    echo "ERROR: Could not able to execute $sql. " . mysqli_error($link);
}
header("refresh:1; url=addtceevents.html"); 
// Close connection
mysqli_close($link);
?>


