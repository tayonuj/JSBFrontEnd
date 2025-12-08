import {utils, writeFile as writeFileXLSX} from "xlsx";

const ujWorkBook = (data,name)=> {
    // const data = [
    //     { name: "John", email: "john@example.com" },
    //     { name: "Jane", email: "jane@example.com" }
    // ];

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFileXLSX(workbook, name+".xlsx");
}
export default ujWorkBook;
