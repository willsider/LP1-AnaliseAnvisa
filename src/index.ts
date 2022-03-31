import { parse } from "csv-parse/sync";
import { readFileSync } from "fs";
import { join } from "path";

const path = join(__dirname, "data", "anvisa.csv");
const strContent = readFileSync(path, "latin1");
let parsedContent: any[] = parse(strContent, { delimiter: ";" });
parsedContent = parsedContent.slice(1);

const activity = "suprimentos administrativos";
const activitySpendingsByYearMap = new Map<number, number>();

parsedContent.forEach((row) => {
  let rowActivity: string = row[1];
  rowActivity = rowActivity.trim().toLowerCase();

  if (rowActivity == activity) {
    const year = parseInt(row[0]);
    let value = parseFloat(row[9]);
    const currentValue = activitySpendingsByYearMap.get(year);
    if (currentValue) {
      value += currentValue;
    }
    activitySpendingsByYearMap.set(year, value);
  }
})

//spread operator

const mapArray = [...activitySpendingsByYearMap.entries()]
mapArray.sort()
const responseMap = new Map(mapArray)


for (let [year, value] of responseMap) {
  const moneyFormatter = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  const moneyValue = moneyFormatter.format(value)
  console.log(`Em ${year} a Anvisa executou ${moneyValue} em ${activity}`)
}
