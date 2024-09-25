const monthNames: string[] = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

let currentDate: Date = new Date();
let currentDay: number = currentDate.getDate()
let MonthNumber: number = currentDate.getMonth()
let currentYear: number = currentDate.getFullYear()

let dates = document.getElementById("dates") as HTMLDivElement
let month = document.getElementById("month") as HTMLDivElement
let year = document.getElementById("year") as HTMLDivElement

let prev_month = document.getElementById("prev-month") as HTMLDivElement
let next_month = document.getElementById("next-month") as HTMLDivElement

month.textContent = monthNames[MonthNumber]
year.textContent = currentYear.toString()


prev_month.addEventListener("click", () => lastMonth());
next_month.addEventListener("click", ()=> nextMonth());

writeDays(MonthNumber)

//Escribe los dias totales de el mes

function writeDays(month: number): void {
    for(let i = 1; i<= getTotalDays(month); i++){
        if(i === currentDay){
            dates.innerHTML += `<div class="calendar__date calendar__item calendar__today">${i}<div>`
        }else{
            dates.innerHTML += `<div class="calendar__date calendar__item">${i}<div>`
        }
        
    }
}

//obtiene el total de dias

function getTotalDays(month: number): number {
    if(month === -1) month = 11;

    if(month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11){
        return 31;
    }else if(month == 3 || month == 5 || month == 8 || month == 10){
        return 30
    } else {
        return isLeap() ? 29 : 28;
    }
}


//verifica si el año es bisiesto

function isLeap(): boolean {
    return ((currentYear % 100 !== 0) && (currentYear % 4 === 0) || (currentYear % 400 === 0));

}

//identifica en que dia comienza la semana

function startDay(): number {
    let start: Date = new Date(currentYear, MonthNumber, 1);

    return ((start.getDay() - 1) === -1 ) ? 6 : start.getDate() - 1;

}

//dibuja el mes anterior

function lastMonth(): void {
    if(MonthNumber !== 0){
        MonthNumber--;
    }else{
        MonthNumber = 11;
        currentYear--;
    }

    setNewDate()

}


// dibuja el mes siguiente

function nextMonth(): void {
    if(MonthNumber !== 11){
        MonthNumber++;
    }else{
        MonthNumber = 0;
        currentYear++;
    }

    setNewDate()
}

//establece la fecha al mover el calendario

function setNewDate(): void {
    currentDate.setFullYear(currentYear, MonthNumber, currentDay);
    year.textContent = currentYear.toString()
    month.textContent = monthNames[MonthNumber]
}