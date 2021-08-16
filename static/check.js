
function show(name,email,balance){
    document.getElementById("name").innerHTML=name
    document.getElementById("from").value=name
    document.getElementById("email").innerHTML=email
    document.getElementById("balance").innerHTML=balance
    localStorage.setItem("balance",balance)
    table1=document.getElementById("viewCustomers")
    table2=document.getElementById("showCustomer")
    form=document.getElementById("con")
    table1.style.display="none";
    table2.style.display="inline-table";
    form.style.display="block"; 
}
function success(){
    balance=document.getElementById("balance").innerHTML
    console.log(balance)
    var amount= document.getElementById("amount").value
    if(amount== 0 ){
        alert("Cannot transfer 0 amount");
        document.getElementById("success").innerHTML="Transaction failed"
        return false;
    }
    if(amount< 0 ){
        alert("Please enter a non-negative amount");
        document.getElementById("success").innerHTML="Transaction failed"
        return false;
    }
    if(amount > parseInt(balance)){
        alert("Insufficient balance amount");
        document.getElementById("success").innerHTML="Transaction failed"
        return false;
    }
    document.getElementById("success").innerHTML="Transaction Successful"
}


