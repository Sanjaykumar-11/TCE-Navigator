<?php   
 $connect = mysqli_connect("localhost", "root", "", "tce_navigator");  
 $sql = "SELECT * FROM event_details ORDER BY EventDate ASC";  
 $result = mysqli_query($connect, $sql);  
?> 

<!DOCTYPE html>

<style>
   h1{
      padding:20px;
   }
   .right {
      height: 100%;
      width: 70%;
      position: fixed;
      z-index: 1;
      top: 0;
      overflow-x: hidden;
      padding-top: 20px;
      right: 0;
   }

   .left {
      height: 100%;
      width: 30%;
      position: fixed;
      z-index: 1;
      top: 0;
      overflow-x: hidden;
      padding-top: 20px;
      right: 0;
      left: 0;
   }
 
   .centered {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
   }
</style>

<body>
<img src="header.png" width="100%">
<div class="left">
<br><br><br><br><br><br>
<center><h1 style="color:brown;"> Events </h1></center>
    <br>
    <marquee behavior="scroll" direction="up" onmouseover="this.stop();" onmouseout="this.start();">  
        <?php  
            if(mysqli_num_rows($result) > 0)  
            {  
                while($row = mysqli_fetch_array($result))  
                {  
                    echo '<center><p>'.$row['EventName']. '&emsp; date:' .$row['EventDate']. '</p></center>';
                }  
            }  
        ?>  
    </marquee>  
    <br>

</div>

<div class="right">
<br><br><br><br><br>
<iframe src="https://www.google.com/maps/d/u/1/embed?mid=1IPvk4fqZr-zjsa74DUgwMsTtHoWkYet9" width="920" height="500" ></iframe>
</div>
</body>
</html>