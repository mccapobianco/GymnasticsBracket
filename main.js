teams = [['Michigan St.', 'Kentucky', 'Ohio St.', 'Penn St.'],
         ['LSU', 'Arkansas', 'Michigan', 'Maryland/West Virgina'],
         ['UCLA', 'Minnesota', 'Southern Utah', 'Boise St.'],
         ['Utah', 'Stanford', 'Denver', 'BYU/Utah St.'],
         ['Missouri', 'Georgia', 'Arizona', 'Arizona St.'],
         ['Oklahoma', 'Auburn', 'Nebraska', 'Illinois/UC Davis'],
         ['California', 'Alabama', 'North Carolina', 'Iowa'],
         ['Florida', 'Oregon St.', 'NC State', 'Clemson/Rutgers'],
        ]

function fillBracket(){
    for (var m=0; m<8; m++){
        for (var t=0; t<4; t++){
            document.getElementById(`M${m+1}T${t+1}`).innerHTML = teams[m][t];
        }
    }
}

function parseId(s){
    let match = s.match(/M(\d+)T(\d+)/);
    if (match) {
        let m = parseInt(match[1], 10);
        let t = parseInt(match[2], 10);
        return {m:m, t:t};
    } 
    return {m:null, t:null};
}


function getValueFromId(id){
    let elem = document.getElementById(id);
    let m = parseId(id).m;
    if (m > 8){
        if (elem.value===null)
            return null;
        return elem.value;
    }
    return elem.innerHTML;
}

function updateOptions(select){
    let v = select.value
    // Clear existing options
    while (select.options.length > 1) {
        select.remove(1);
    }

    let select_id = parseId(select.id);
    let m = select_id.m;
    let t = select_id.t;

    let options = [];

    if (m == 16){
        options = [
            getValueFromId('M15T1'),
            getValueFromId('M15T2'),
            getValueFromId('M15T3'),
            getValueFromId('M15T4'),
        ];
    } else if (t <= 2) {
        options = [
            getValueFromId(`M${2*(m-8)-1}T1`),
            getValueFromId(`M${2*(m-8)-1}T2`),
            getValueFromId(`M${2*(m-8)-1}T3`),
            getValueFromId(`M${2*(m-8)-1}T4`),
        ];
        options = options.filter(item => item != getValueFromId(`M${m}T${3-t}`));
    } else {
        options = [
            getValueFromId(`M${2*(m-8)}T1`),
            getValueFromId(`M${2*(m-8)}T2`),
            getValueFromId(`M${2*(m-8)}T3`),
            getValueFromId(`M${2*(m-8)}T4`),
        ];
        options = options.filter(item => item != getValueFromId(`M${m}T${7-t}`));
        
    }
    
    options = options.filter(item => item.trim());

    options.forEach(team => {
        let option = document.createElement("option");
        option.value = team;
        option.textContent = team;
        select.appendChild(option);
    });
    select.value = v;
}

function clearTeam(team_name, match_id=1){

    var elems = document.getElementsByTagName('select');

    for (var elem of elems){
        if ((elem.value == team_name) && (parseId(elem.id).m > match_id)){
            elem.selectedIndex = 0;
        }
    }
}

function handleChange(event) {
    var selectElement = event.target;
    var oldValue = event.oldValue || selectElement.getAttribute('data-current-value');
    var newValue = selectElement.value;
    console.log(selectElement.id, selectElement.value);
    selectElement.setAttribute('data-current-value', newValue);
    clearTeam(oldValue, parseId(selectElement.id).m);
    selectElement.value = newValue
  }

function submitOnclick(){
    var submit_button = document.getElementById("submit");
    if (submit_button.style.backgroundColor == 'black'){
        window.alert('This bracket has already been submitted. View the leaderboard to review your submission, or refresh the page to begin a new submission.')
        return;
    }
    var name = document.getElementById('submission_name').value;
    if (name.trim().length == 0){
        window.alert('Submission needs a name.');
        return;
    }

    var decisions = []

    for (var m=9; m<=15; m++){
        for (var t=1; t<=4; t++){
            try{
                decisions.push(document.getElementById(`M${m}T${t}`).selectedIndex)
            } catch {
                decisions.push(0)
            }
        }
    }
    decisions.push(document.getElementById(`M16T1`).selectedIndex)

    if (Object.values(decisions).includes(null) || Object.values(decisions).includes(0)){
        window.alert('All matchups must be decided before submitting.');
        return;
    }
    var encoded_sub = decisions.join('');
    var url = `https://docs.google.com/forms/d/e/1FAIpQLScYod8IzrDlrxAtEJzgRwUSkKTTF_MjUWKYwIxBul4n3Iac9w/formResponse?submit=Submit?usp=pp_url&entry.304351021=${name}&entry.393263061=${encoded_sub}`;
    url = encodeURI(url);
    $.post(url);
    submit_button.style.backgroundColor = 'black';
    window.alert('Done. View the leaderboard to ensure your bracket has been submitted properly. Refresh the page to begin a new submission.');
}


function onload(){
    fillBracket();
}