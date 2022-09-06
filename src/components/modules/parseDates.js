function parseDates(inputTime, inputDate) {
    if(inputDate !== "") {
        let date = new Date(inputDate); 
        let time = inputTime;
        
        return new Date(Date.parse(date.toDateString() + ' ' + time));
    }
    return false;
}

export default parseDates;