function getOTP(obj){
      $.ajax({
        type:'POST',
        url:'/requestOTP',
        data:obj,
        success:handleOTP,
        error:function(err){
          Materialize.toast('There was some error in generating OTP ! Please Retry',5000);
        }
      });  
    }
    function handleOTP(res){
      var d=document.getElementById('generateOTP');
      document.getElementById('otp').removeAttribute('disabled');
      document.getElementById('otp').focus();
      document.getElementById('otp').setAttribute('required','required');
      d.innerText='Submit';
      d.removeAttribute('id');
      d.setAttribute("id","showPatient");
      d.className='btn waves-effect waves-light showPatient';
      Materialize.toast('Enter the OTP you have received on Your Phone and Mail',8000); 
    }
    function checkOTP(obj){
      $.ajax({
        type:'POST',
        url:'/checkOTP',
        data:obj,
        success:verifiedOTP,
        error:wrongOTP
      });
    }
    function verifiedOTP(res){
      if(res)//if result is true
      {
        document.getElementById('otp').setAttribute("disabled","disabled");
        document.getElementById('yourPhoneNo').setAttribute("disabled","disabled");
        document.getElementById('yourName').setAttribute("disabled","disabled");
        document.getElementById('yourCity').setAttribute("disabled","disabled");
        document.getElementById('yourMail').setAttribute("disabled","disabled");
        Materialize.toast('OTP entered is Correct',4000);
        $('#load').hide();
        $('#ambulanceLogo').animate({'marginLeft' : "+=500px"},5000);
        $('#patientData').show('slow', function() {
          $( ".showPatient" ).hide();
        });
      }
      else
      {
        document.getElementById('otp').className=document.getElementById('otp').className+' invalid';
        Materialize.toast('OTP entered is wrong!',5000); 
      }
    }
    function wrongOTP(){
      Materialize.toast('OTP entered is wrong!',5000);
    }
    $(document).on('click', '#showPatient', function(ev){
        //alert('Yes');
        $(this).append("<center><img src='images/loader.gif' id='load' style='display:inline;'></center>");
        var data={};
        data.val=document.getElementById('otp').value;
        checkOTP(data);
        ev.preventDefault();
    });
    $("#generateOTP").click((e)=>{
      var obj={};
      obj.yourMail=document.getElementById('yourMail').value;
      obj.yourName=document.getElementById('yourName').value;
      obj.yourCity=document.getElementById('yourCity').value;
      obj.yourPhoneNo=document.getElementById('yourPhoneNo').value;
      document.getElementById('generateOTP').innerText='Generating OTP';
      getOTP(obj);
    });