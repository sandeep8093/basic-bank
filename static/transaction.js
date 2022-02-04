fetch('https://basic-bank-heroku.herokuapp.com/transfer')
  .then((apidata) => {
    console.log(apidata);
    return apidata.json();
  })
  .then((actualdata) => {
    console.log(actualdata);
    l = actualdata.length;
    var table = document.getElementById('customers');
    var i = 0;
    for (let element of actualdata) {
      i = i + 1;
      let row = table.insertRow();
      for (k in element) {
        if (k == '_id') {
          var cell = row.insertCell();
          var text = document.createTextNode(i);
          cell.appendChild(text);
        }
        if (k == 'from' || k == 'name' || k == 'amount') {
          var cell = row.insertCell();
          var text = document.createTextNode(element[k]);
          cell.appendChild(text);
        }
        if (k == 'date') {
          var date = element.date.toString().replace('Z', '').replace('T', ' ');
          var cell = row.insertCell();
          var text = document.createTextNode(date);
          cell.appendChild(text);
        }
      }
    }
  })

  .catch((error) => {
    console.log(error);
  });
