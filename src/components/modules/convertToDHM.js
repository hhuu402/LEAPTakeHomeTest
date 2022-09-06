function convertToDHM(mins){
    let minutes = mins % 60;
    let hours = Math.floor(mins/60);
    let days = Math.floor(hours/24);

    let convertedStr = "";

    if(days > 0) {
        convertedStr = convertedStr + days + " Day(s) "
        hours = hours % 24;
    }
    if(hours > 0) {
        convertedStr = convertedStr + hours + " Hour(s) "
    }
    if(minutes > 0) {
        convertedStr = convertedStr + minutes + " Minute(s)"
    }

    return convertedStr;
}
export default convertToDHM;