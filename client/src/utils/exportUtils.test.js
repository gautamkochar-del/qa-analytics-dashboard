import { describe, it, expect, vi } from "vitest";
import { exportToCSV, exportToExcel } from "./exportUtils";

// Mock dependencies
vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

vi.mock("xlsx", () => ({
  utils: {
    json_to_sheet: vi.fn(() => ({})),
    book_new: vi.fn(() => ({})),
    book_append_sheet: vi.fn(),
  },
  write: vi.fn(() => new ArrayBuffer(8)),
}));

import { saveAs } from "file-saver";

describe("Export Utilities Tests", () => {
  it("should trigger exportToCSV and invoke saveAs", () => {
    const data = [
      { id: 1, name: "Project Alpha", status: "Active" },
      { id: 2, name: "Project Beta", status: "Inactive" },
    ];

    exportToCSV(data, "test.csv");

    expect(saveAs).toHaveBeenCalled();
  });

  it("should trigger exportToExcel and invoke saveAs", () => {
    const data = [
      { id: 1, name: "Project Alpha", status: "Active" },
    ];

    exportToExcel(data, "Sheet1", "test.xlsx");

    expect(saveAs).toHaveBeenCalled();
  });
});
