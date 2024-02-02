"use client";

import { read, utils, writeFile } from "xlsx";
import Excel from "exceljs";

export default function Home() {
  const workbook = new Excel.Workbook();

  const onFileUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const base64FileData = await convertFileToBase64(file);
      const workbook = read(base64FileData, { type: "base64" });
      const orders = utils.sheet_to_json(workbook.Sheets["Orders"]);

      const newSheet = utils.json_to_sheet(orders);

      // Make some amends to the new sheet

      workbook.Sheets["Orders"] = newSheet;

      writeFile(workbook, "Presidents.xlsx", { compression: true });

      console.log(newSheet);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-purple-950">
      <input type="file" onChange={onFileUpload} />
    </div>
  );
}

const convertFileToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
      if (reader.result) resolve(reader.result.toString().split(",")[1]);
    });
    reader.addEventListener("error", (error) => reject(error));
  });
};

export { convertFileToBase64 };
